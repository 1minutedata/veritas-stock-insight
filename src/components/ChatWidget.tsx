import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Send, Bot, User2, Mail, MessageSquare, FileText, X, Minimize2 } from "lucide-react";
import { parseCommand, ParsedCommand } from "@/utils/commandParsers";

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

const ChatWidget = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I can send emails via Gmail, post to Slack, or create QuickBooks entries. Try:\n- Email: \"Email to bob@example.com subject: Update body: Here's the latest analysis\"\n- Slack: \"Slack #general message: Big news!\"\n- QuickBooks: \"QuickBooks amount: 199.99 memo: Advisory fee for ACME\"\nStart by entering your email (used as user id for tools)." }
  ]);
  const [sending, setSending] = useState(false);

  const append = (msg: Message) => setMessages(prev => [...prev, msg]);

  const executeParsedCommand = async (cmd: ParsedCommand) => {
    if (!userEmail) {
      toast({ title: "Missing email", description: "Enter your email above first.", variant: "destructive" });
      return;
    }
    setSending(true);

    try {
      let actionData: any = null;
      let integrationLabel = "";

      if (cmd?.kind === "gmail") {
        actionData = {
          action: "GMAIL_SEND_EMAIL",
          parameters: { to_email: cmd.to, subject: cmd.subject, body: cmd.body }
        };
        integrationLabel = "Gmail";
      } else if (cmd?.kind === "slack") {
        actionData = {
          action: "SLACK_SEND_MESSAGE",
          parameters: { channel: cmd.channel, text: cmd.text }
        };
        integrationLabel = "Slack";
      } else if (cmd?.kind === "quickbooks") {
        actionData = {
          action: "QUICKBOOKS_CREATE_ITEM",
          parameters: { name: "Investment", description: cmd.memo, unit_price: cmd.amount }
        };
        integrationLabel = "QuickBooks";
      }

      if (!actionData) {
        throw new Error("Unsupported command format");
      }

      const { data, error } = await supabase.functions.invoke('composio-auth', {
        body: {
          action: 'executeAction',
          userId: userEmail,
          actionData
        }
      });

      if (error) {
        const details = (data as any)?.attempts || (data as any)?.error || error.message;
        throw new Error(typeof details === 'string' ? details : JSON.stringify(details));
      }

      append({ role: "assistant", content: `${integrationLabel} action succeeded.` });
      toast({ title: "Success", description: `${integrationLabel} action executed.` });
    } catch (e: any) {
      append({ role: "assistant", content: `Action failed: ${e?.message?.slice(0, 300) || 'Unknown error'}` });
      toast({ title: "Error", description: e?.message?.slice(0, 300) || "Failed to execute", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const onSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    append({ role: "user", content: trimmed });
    setInput("");

    const cmd = parseCommand(trimmed);

    if (!cmd) {
      append({
        role: "assistant",
        content:
          "I couldn't parse that. Try one of these formats:\n" +
          "- Email to jane@example.com subject: Hello body: Here is the update\n" +
          "- Slack #general message: Heads up team...\n" +
          "- QuickBooks amount: 250.00 memo: Research expense"
      });
      return;
    }

    await executeParsedCommand(cmd);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50"
        size="icon"
      >
        <Bot className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-xl z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Assistant</h3>
        </div>
        <div className="flex items-center gap-1">
          <Badge variant="secondary" className="gap-1 text-xs">
            <Mail className="h-3 w-3" /> Gmail
          </Badge>
          <Badge variant="secondary" className="gap-1 text-xs">
            <MessageSquare className="h-3 w-3" /> Slack
          </Badge>
          <Badge variant="secondary" className="gap-1 text-xs">
            <FileText className="h-3 w-3" /> QB
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 ml-2"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-3 border-b">
          <Input
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="Your email (userId)"
            className="text-sm"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {messages.map((m, idx) => (
            <div key={idx} className="flex gap-2">
              {m.role === "user" ? (
                <User2 className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
              ) : (
                <Bot className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
              )}
              <pre className="whitespace-pre-wrap text-xs flex-1">{m.content}</pre>
            </div>
          ))}
        </div>

        <div className="p-3 border-t">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Try: "Email to jane@example.com subject: Hi body: Update"'
              className="resize-none text-sm"
              rows={2}
            />
            <Button 
              onClick={onSend} 
              disabled={sending || !userEmail.trim()} 
              size="icon"
              className="self-end"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ChatWidget;