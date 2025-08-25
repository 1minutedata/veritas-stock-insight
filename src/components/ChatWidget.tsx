import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Send, Bot, Mail, MessageSquare, FileText, X } from "lucide-react";

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

interface ChatWidgetProps {
  connectedIntegrations?: string[];
}

const ChatWidget = ({ connectedIntegrations = ['gmail', 'slack', 'quickbooks'] }: ChatWidgetProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm Jarvis, your AI assistant. I can help you with emails, Slack messages, and QuickBooks entries. Just give me natural language instructions and I'll execute the appropriate tools for you.\n\nStart by entering your email below (used as your user ID)." }
  ]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const email = data?.user?.email || '';
      if (email) setUserEmail(email);
    });
  }, []);

  const append = (msg: Message) => setMessages(prev => [...prev, msg]);

  const onSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    if (!userEmail) {
      toast({ 
        title: "Missing email", 
        description: "Enter your email above first.", 
        variant: "destructive" 
      });
      return;
    }

    append({ role: "user", content: trimmed });
    setInput("");
    setSending(true);

    try {
      // Call the Jarvis agent
      const { data, error } = await supabase.functions.invoke('jarvis-agent', {
        body: {
          userId: userEmail,
          message: trimmed,
          connectedIntegrations
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.success) {
        append({ 
          role: "assistant", 
          content: data.message || "Task completed successfully!" 
        });
        
        if (data.toolsExecuted > 0) {
          toast({ 
            title: "Success", 
            description: `Executed ${data.toolsExecuted} tool(s) successfully.` 
          });
        }
      } else {
        throw new Error(data?.error || "Unknown error");
      }
    } catch (e: any) {
      console.error('[ChatWidget] Error:', e);
      append({ 
        role: "assistant", 
        content: `I encountered an error: ${e?.message?.slice(0, 300) || 'Unknown error'}` 
      });
      toast({ 
        title: "Error", 
        description: e?.message?.slice(0, 300) || "Failed to process request", 
        variant: "destructive" 
      });
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="relative">
          <Button
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            size="icon"
          >
            <Bot className="h-6 w-6" />
          </Button>
          <div className="absolute -top-2 right-0 translate-y-[-100%] mb-2">
            <div className="relative bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-lg max-w-[220px] text-sm text-gray-700">
              Give me instructions
              <div className="absolute -bottom-2 right-4 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white"></div>
              <div className="absolute -bottom-[9px] right-4 w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-t-[9px] border-t-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[500px] max-h-[80vh] shadow-xl z-50 flex flex-col resize overflow-hidden">
      <div className="flex items-center justify-between p-2 border-b cursor-move">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-primary" />
          <h3 className="font-semibold font-mono text-sm">Jarvis</h3>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => {
              const card = document.querySelector('.fixed.bottom-6.right-6');
              if (card) {
                card.classList.toggle('w-96');
                card.classList.toggle('w-[600px]');
                card.classList.toggle('h-[500px]');
                card.classList.toggle('h-[700px]');
              }
            }}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </Button>
          {connectedIntegrations.includes('gmail') && (
            <Badge variant="secondary" className="gap-1 text-xs">
              <Mail className="h-3 w-3" /> Gmail
            </Badge>
          )}
          {connectedIntegrations.includes('slack') && (
            <Badge variant="secondary" className="gap-1 text-xs">
              <MessageSquare className="h-3 w-3" /> Slack
            </Badge>
          )}
          {connectedIntegrations.includes('quickbooks') && (
            <Badge variant="secondary" className="gap-1 text-xs">
              <FileText className="h-3 w-3" /> QB
            </Badge>
          )}
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

        <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-[400px]">
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
          {sending && (
            <div className="flex justify-start">
              <div className="bg-secondary text-secondary-foreground rounded-2xl px-3 py-2 text-xs border rounded-tl-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-3 border-t">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Tell Jarvis what you need: "Send an email to...", "Post to Slack...", "Create QuickBooks entry..."'
              className="resize-none text-sm"
              rows={2}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onSend();
                }
              }}
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