'use client';

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Heart,
  Home,
  MessageCircleHeart,
  Calendar,
  Settings,
  Video,
  LogOut,
} from "lucide-react"

import { Logo } from "@/components/logo"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/store/auth-store"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

type NavItem = { title: string; href: string; icon: React.ElementType; badge?: string | number };

const mainNav: NavItem[] = [
  { title: "Discover", href: "/dashboard/discover", icon: Home },
  { title: "My Matches", href: "/dashboard/my-matches", icon: Heart },
  { title: "My Chats", href: "/dashboard/chats", icon: MessageCircleHeart },
  { title: "Active Rooms", href: "/dashboard/rooms", icon: Video },
  { title: "Invitation History", href: "/dashboard/invitations", icon: Calendar },
]

const secondaryNav = [
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/dashboard/discover">
          <Logo />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 px-3 pb-2">Browse</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={<Link href={item.href} /> as any}
                      isActive={isActive}
                      className={cn(
                        "h-10 transition-all duration-300 rounded-xl px-3",
                        isActive
                          ? "bg-gradient-to-r from-primary/10 to-transparent text-primary font-bold border-l-2 border-primary pl-2.5"
                          : "hover:bg-foreground/5 hover:text-foreground"
                      )}
                    >
                      <item.icon className={cn("size-4.5", isActive ? "text-primary fill-primary/10" : "text-muted-foreground group-hover:text-foreground")} />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                    {item.badge ? <SidebarMenuBadge>{item.badge}</SidebarMenuBadge> : null}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 px-3 pb-2">Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNav.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} /> as any}
                      isActive={isActive}
                      className={cn(
                        "h-10 transition-all duration-300 rounded-xl px-3",
                        isActive
                          ? "bg-gradient-to-r from-primary/10 to-transparent text-primary font-bold border-l-2 border-primary pl-2.5"
                          : "hover:bg-foreground/5 hover:text-foreground"
                      )}
                    >
                      <item.icon className={cn("size-4.5", isActive ? "text-primary fill-primary/10" : "text-muted-foreground group-hover:text-foreground")} />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-auto p-4">
          <SidebarGroupContent>
            <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent p-4 shadow-md">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-foreground">Go Premium</p>
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground/80 leading-relaxed">
                Unlimited virtual dates and priority matching.
              </p>
              <Badge className="mt-3 bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold border-0" variant="secondary">
                50% off this week
              </Badge>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-border p-3">
        <SidebarMenu>
          <SidebarMenuItem className="mb-1.5">
            <SidebarMenuButton className="h-auto py-2 px-3 rounded-xl hover:bg-foreground/5" render={<Link href="/dashboard/settings" /> as any}>
              <Avatar className="size-9 rounded-xl border border-border shadow-sm">
                <AvatarImage src={user?.avatar || "/images/person-5.png"} alt={user?.name || "Your profile"} className="object-cover" />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold text-foreground">{user?.name || "User"}</span>
                <span className="text-xs text-muted-foreground/75">View profile</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="flex items-center gap-2 px-1">
            <SidebarMenuButton onClick={logout} className="flex-1 h-10 px-3 rounded-xl hover:bg-destructive/10 hover:text-destructive text-muted-foreground" render={<Link href="/" /> as any}>
              <LogOut className="size-4.5" />
              <span>Log out</span>
            </SidebarMenuButton>
            <ThemeToggle />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
