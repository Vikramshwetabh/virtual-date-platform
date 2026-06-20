import type React from "react"

import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AuthGuard } from "@/components/auth/auth-guard"
import { GlobalSocketListener } from "@/app/signup/global-socket-listener"
import { NotificationCenter } from "@/components/dashboard/notification-center"
import { ActiveRoomBanner } from "@/components/dashboard/active-room-banner"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <GlobalSocketListener />
        <AppSidebar />
        <SidebarInset className="flex flex-col min-h-screen">
          <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <span className="text-sm text-muted-foreground">Find your next connection</span>
            </div>
            <div className="flex items-center gap-2">
              <NotificationCenter />
            </div>
          </header>
          <ActiveRoomBanner />
          <div className="flex-1 p-4 md:p-6 bg-background/50">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  )
}
