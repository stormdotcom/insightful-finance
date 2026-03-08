import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { TopNav } from "./TopNav";
import { MobileBottomNav } from "./MobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <TopNav />
          <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 pb-20 md:pb-6">
            {children}
          </main>
        </div>
        <MobileBottomNav />
      </div>
    </SidebarProvider>
  );
}
