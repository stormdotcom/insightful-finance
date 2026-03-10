import {
  LayoutDashboard,
  Receipt,
  Wallet,
  CreditCard,
  TrendingUp,
  PiggyBank,
  Bot,
  BarChart3,
  Settings,
  ShieldAlert,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Expenses", url: "/expenses", icon: Receipt },
  { title: "Income", url: "/income", icon: Wallet },
  { title: "Debt Manager", url: "/debt", icon: CreditCard },
  { title: "Investments", url: "/investments", icon: TrendingUp },
  { title: "Budget Planner", url: "/budget", icon: PiggyBank },
  { title: "AI Advisor", url: "/ai-advisor", icon: Bot },
  { title: "Crisis Planner", url: "/crisis", icon: ShieldAlert },
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state, setOpenMobile } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const isMobile = useIsMobile();

  const handleNavClick = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar collapsible={isMobile ? "offcanvas" : "icon"} className="border-r border-border/50">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <img
            src="/favicon.svg"
            alt="FinanceAI logo"
            className="h-8 w-8 rounded-lg shrink-0"
          />
          {(!collapsed || isMobile) && (
            <span className="text-lg font-bold tracking-tight gradient-text">
              FinanceAI
            </span>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-200"
                      activeClassName="bg-primary/10 text-primary font-medium"
                      onClick={handleNavClick}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {(!collapsed || isMobile) && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        {(!collapsed || isMobile) && (
          <div className="glass rounded-lg p-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">My Finances</p>
            <p className="mt-1">Last synced: Today, 10:30 AM</p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
