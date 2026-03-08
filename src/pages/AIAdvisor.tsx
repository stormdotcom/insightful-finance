import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, Sparkles, TrendingDown, PiggyBank, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  "Where am I overspending?",
  "How can I reduce my monthly expenses?",
  "How much should I invest based on my income?",
  "Should I prioritize paying debt or investing?",
];

const mockResponses: Record<string, string> = {
  "Where am I overspending?":
    "Based on your spending data, **Rent** ($1,200) and **Food** ($850) are your largest categories, accounting for 60% of monthly expenses. Your food spending is 12% above the recommended budget. Consider meal prepping to cut food costs by ~$200/month.",
  "How can I reduce my monthly expenses?":
    "Here are 3 actionable steps:\n\n1. **Cancel unused subscriptions** — You have $180/mo in subscriptions. Review and cut at least 2.\n2. **Optimize transport** — At $320/mo, consider carpooling or public transit to save ~$150.\n3. **Negotiate utilities** — Your $280 utility bill could drop 15% by switching providers.",
  "How much should I invest based on my income?":
    "With a monthly income of **$7,650** and expenses of **$3,600**, you have **$4,050** available. Following the 50/30/20 rule:\n\n- **Needs (50%)**: $3,825 ✅ You're under\n- **Wants (30%)**: $2,295\n- **Savings/Invest (20%)**: $1,530\n\nI recommend investing at least **$1,500/mo** given your current debt load.",
  "Should I prioritize paying debt or investing?":
    "Your **Capital One credit card** has an **18.9% APR** — this should be your #1 priority. The interest exceeds typical investment returns.\n\n**Recommended strategy:**\n1. Pay off the $2,100 credit card debt ASAP\n2. Continue minimum payments on lower-rate debts\n3. Then increase investment contributions\n\nThis could save you ~$400 in interest over the next year.",
};

export default function AIAdvisor() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = (text: string) => {
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = mockResponses[text] || "I'd need to analyze your financial data more carefully to give you a personalized answer. Could you be more specific about what aspect of your finances you'd like help with?";
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Financial Advisor</h1>
        <p className="text-sm text-muted-foreground mt-1">Get personalized financial insights powered by AI.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Insights Panel */}
        <div className="space-y-4">
          <Card className="glass border-border/50">
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Sparkles className="h-4 w-4 text-accent" />Quick Insights</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                <TrendingDown className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                <div><p className="text-sm font-medium">Spending Alert</p><p className="text-xs text-muted-foreground">Food expenses up 12% vs last month</p></div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                <PiggyBank className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div><p className="text-sm font-medium">Savings Opportunity</p><p className="text-xs text-muted-foreground">You could save $200/mo by meal prepping</p></div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                <CreditCard className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                <div><p className="text-sm font-medium">Debt Priority</p><p className="text-xs text-muted-foreground">Pay off 18.9% APR card first</p></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        <Card className="glass border-border/50 lg:col-span-2 flex flex-col" style={{ minHeight: 500 }}>
          <CardHeader className="pb-2 border-b border-border/50">
            <CardTitle className="text-base flex items-center gap-2">
              <Bot className="h-4 w-4 text-primary" />Chat with AI Advisor
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-4">
            <div className="flex-1 overflow-auto space-y-4 mb-4">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                  <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center mb-4 glow-primary">
                    <Bot className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <p className="text-lg font-semibold mb-1">How can I help?</p>
                  <p className="text-sm text-muted-foreground mb-6">Ask me anything about your finances.</p>
                  <div className="flex flex-wrap gap-2 justify-center max-w-md">
                    {suggestions.map((s) => (
                      <Button key={s} variant="outline" size="sm" className="text-xs h-auto py-1.5 px-3" onClick={() => sendMessage(s)}>
                        {s}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              <AnimatePresence>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
                  >
                    <div className={cn(
                      "max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary/50 text-foreground"
                    )}>
                      {msg.content.split("\n").map((line, li) => (
                        <p key={li} className={li > 0 ? "mt-2" : ""}>
                          {line.split(/(\*\*.*?\*\*)/).map((part, pi) =>
                            part.startsWith("**") && part.endsWith("**")
                              ? <strong key={pi}>{part.slice(2, -2)}</strong>
                              : part
                          )}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isTyping && (
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse_glow" />
                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse_glow" style={{ animationDelay: "0.3s" }} />
                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse_glow" style={{ animationDelay: "0.6s" }} />
                  </div>
                  AI is thinking...
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && input.trim() && sendMessage(input.trim())}
                placeholder="Ask about your finances..."
                className="bg-secondary/50"
              />
              <Button
                onClick={() => input.trim() && sendMessage(input.trim())}
                className="gradient-primary text-primary-foreground shrink-0"
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
