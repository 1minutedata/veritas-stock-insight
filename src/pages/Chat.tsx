
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Send, Bot, User2, Mail, MessageSquare, FileText } from "lucide-react";
import { parseCommand, ParsedCommand } from "@/utils/commandParsers";

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

const Chat = () => {
  const { toast } = useToast();
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

      console.log('[Chat] Executing via composio-auth', { userId: userEmail, actionData });

      const { data, error } = await supabase.functions.invoke('composio-auth', {
        body: {
          action: 'executeAction',
          userId: userEmail,
          actionData
        }
      });

      console.log('[Chat] Execute response', { data, error });

      if (error) {
        const details = (data as any)?.attempts || (data as any)?.error || error.message;
        throw new Error(typeof details === 'string' ? details : JSON.stringify(details));
      }

      append({ role: "assistant", content: `${integrationLabel} action succeeded.` });
      toast({ title: "Success", description: `${integrationLabel} action executed.` });
    } catch (e: any) {
      console.error('[Chat] Error executing command:', e);
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

  return (
    <div className="mx-auto max-w-4xl p-4 md:p-6 space-y-6">
      <Card className="p-4 md:p-6">
        <div className="flex items-center gap-2 mb-3">
          <Bot className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-semibold">Composio Chat</h1>
          <Badge variant="secondary" className="ml-auto gap-1">
            <Mail className="h-3 w-3" /> Gmail
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <MessageSquare className="h-3 w-3" /> Slack
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <FileText className="h-3 w-3" /> QuickBooks
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4">
          <div className="space-y-3">
            <label className="text-sm font-medium">Your Email (used as userId for tools)</label>
            <Input
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="you@example.com"
            />
            <div className="text-xs text-muted-foreground">
              Make sure you have connected your accounts in the Integrations page using the same email.
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Message</label>
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='Try: "Email to jane@example.com subject: Hi body: Here is the update"'
                className="resize-none"
                rows={3}
              />
              <Button onClick={onSend} disabled={sending || !userEmail.trim()} className="self-start">
                <Send className="h-4 w-4 mr-1" />
                Send
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4 md:p-6">
        <div className="space-y-4">
          {messages.map((m, idx) => (
            <div key={idx} className="flex gap-2">
              {m.role === "user" ? (
                <User2 className="h-5 w-5 text-muted-foreground mt-1" />
              ) : (
                <Bot className="h-5 w-5 text-primary mt-1" />
              )}
              <pre className="whitespace-pre-wrap text-sm">{m.content}</pre>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Chat;
