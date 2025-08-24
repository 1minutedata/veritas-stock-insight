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
    { role: "assistant", content: "Hi! I'm Jarvis, your AI assistant. I can help you with emails, Slack messages, and QuickBooks entries. Just give me natural language instructions and I'll execute the appropriate tools for you.\n\nStart by entering your email below (used as your user ID)." }
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
    if (!trimmed || !userEmail) return;

    append({ role: "user", content: trimmed });
    setInput("");
    setSending(true);

    try {
      const { data, error } = await supabase.functions.invoke('jarvis-agent', {
        body: {
          message: trimmed,
          userId: userEmail
        }
      });

      if (error) {
        throw error;
      }

      append({ role: "assistant", content: data.response });
      toast({ title: "Success", description: "Task completed successfully" });
    } catch (e: any) {
      append({ role: "assistant", content: `I encountered an error: ${e?.message || 'Unknown error'}` });
      toast({ title: "Error", description: e?.message || "Failed to process request", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        {/* Speech bubble */}
        <div className="mb-2 relative">
          <div className="bg-primary text-primary-foreground px-3 py-2 rounded-lg text-sm font-mono shadow-lg">
            Give me instructions
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-primary"></div>
        </div>
        
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          size="icon"
        >
          <Bot className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-xl z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <h3 className="font-semibold font-mono">Jarvis</h3>
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
          {messages.map((m, idx) => {
            const isUser = m.role === "user";
            return (
              <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs shadow-card border ${
                  isUser
                    ? 'bg-primary text-primary-foreground rounded-tr-sm'
                    : 'bg-secondary text-secondary-foreground rounded-tl-sm font-mono'
                }`}>
                  {m.content}
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-3 border-t">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Tell Jarvis what you need: "Send an email to...", "Post to Slack...", "Create QuickBooks entry..."'
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