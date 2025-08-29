import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Send, Bot, Loader2 } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const LangflowChat = () => {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm your AI assistant powered by Langflow. How can I help you today?" }
  ]);
  const [sending, setSending] = useState(false);
  const [sessionId] = useState(`user_${Date.now()}`);

  const append = (msg: Message) => setMessages(prev => [...prev, msg]);

  const onSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    append({ role: "user", content: trimmed });
    setInput("");
    setSending(true);

    try {
      const { data, error } = await supabase.functions.invoke('langflow-chat', {
        body: {
          message: trimmed,
          sessionId
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.success) {
        const assistantMessage = data.message || "I received your message but couldn't generate a response.";
        append({ 
          role: "assistant", 
          content: assistantMessage
        });
      } else {
        throw new Error(data?.error || "Unknown error");
      }
    } catch (e: any) {
      console.error('[LangflowChat] Error:', e);
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

  return (
    <Card className="flex flex-col h-[600px] w-full">
      <div className="flex items-center gap-2 p-4 border-b">
        <Bot className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">AI Assistant</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, idx) => {
          const isUser = m.role === "user";
          return (
            <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg p-3 ${
                isUser
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {m.content}
              </div>
            </div>
          );
        })}
        {sending && (
          <div className="flex justify-start">
            <div className="bg-muted text-muted-foreground rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="resize-none"
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
            disabled={sending || !input.trim()} 
            size="icon"
            className="self-end"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default LangflowChat;