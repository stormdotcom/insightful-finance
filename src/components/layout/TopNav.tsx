import { Search, Plus, Bot, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export function TopNav() {
  const navigate = useNavigate();

  return (
    <header className="h-14 border-b border-border/50 flex items-center justify-between px-4 gap-4 glass">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            className="pl-9 w-64 h-9 bg-secondary/50 border-border/50 text-sm"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          className="gradient-primary text-primary-foreground gap-1.5 shadow-lg shadow-primary/20"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Transaction</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-accent"
          onClick={() => navigate("/ai-advisor")}
        >
          <Bot className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <div className="h-7 w-7 rounded-full gradient-primary flex items-center justify-center">
            <User className="h-4 w-4 text-primary-foreground" />
          </div>
        </Button>
      </div>
    </header>
  );
}
