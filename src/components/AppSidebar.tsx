import { NavLink, useLocation } from "react-router-dom";
import { Bot, TrendingUp, Settings, CreditCard, Link as LinkIcon, Store, Home, BarChart3, LineChart, FileText } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { LyticalPilotLogo } from "@/components/LyticalPilotLogo";

const items = [
  { title: "Your Assistant", url: "/assistant", icon: Bot },
  { title: "Live Market Insights", url: "/", icon: TrendingUp },
  { title: "Stock Simulator", url: "/stock-simulator", icon: LineChart },
  { title: "Lytical Analyzer", url: "/lytical-analyzer", icon: BarChart3 },
  { title: "Financial Statements", url: "/financial-statements", icon: FileText },
  { title: "Economy", url: "/economy", icon: TrendingUp },
  { title: "Manage Integrations", url: "/integrations", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary/10 text-primary border-r-2 border-primary font-medium" 
      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground";

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50">
      <SidebarContent className="bg-card/50 backdrop-blur-sm">
        {/* Logo Section */}
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center justify-center">
            {!collapsed ? (
              <div className="bg-gradient-primary rounded-lg p-3">
                <LyticalPilotLogo size="sm" />
              </div>
            ) : (
              <div className="bg-gradient-primary rounded-lg p-2 w-8 h-8 flex items-center justify-center">
                <Home className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
        </div>

        <SidebarGroup className="px-2">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10">
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && (
                        <span className="truncate text-sm font-medium">
                          {item.title}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

