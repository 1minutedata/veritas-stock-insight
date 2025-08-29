import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider collapsedWidth={56}>
      <header className="h-12 flex items-center border-b px-3">
        <SidebarTrigger className="mr-2" />
        <div className="font-semibold">Veritasier</div>
      </header>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </SidebarProvider>
  );
}
