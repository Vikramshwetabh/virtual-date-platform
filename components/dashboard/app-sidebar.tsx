"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Heart,
  Home,
  MessageCircleHeart,
  Calendar,
  Settings,
  Sparkles,
  LogOut,
} from "lucide-react"

import { Logo } from "@/components/logo"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/store/auth-store"
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

const mainNav = [
  { title: "Discover", href: "/dashboard/discover", icon: Home },
  { title: "My Matches", href: "/dashboard/my-matches", icon: Heart },
  { title: "My Chats", href: "/dashboard/chats", icon: MessageCircleHeart },
  { title: "Active Rooms", href: "/dashboard/rooms", icon: Sparkles },
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
          <SidebarGroupLabel>Browse</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton render={<Link href={item.href} /> as any} nativeButton={false} isActive={pathname === item.href || pathname.startsWith(`${item.href}/`)}>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  {item.badge ? <SidebarMenuBadge>{item.badge}</SidebarMenuBadge> : null}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton render={<Link href={item.href} /> as any} nativeButton={false} isActive={pathname === item.href || pathname.startsWith(`${item.href}/`)}>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <div className="rounded-xl border border-border bg-gradient-to-br from-primary/15 to-accent/10 p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                <p className="text-sm font-semibold">Go Premium</p>
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                Unlimited virtual dates and priority matching.
              </p>
              <Badge className="mt-3" variant="secondary">
                50% off this week
              </Badge>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="h-auto py-2" render={<Link href="/dashboard/settings" /> as any} nativeButton={false}>
              <Avatar className="size-8">
                <AvatarImage src={user?.avatar || "/images/person-5.png"} alt={user?.name || "Your profile"} />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user?.name || "User"}</span>
                <span className="text-xs text-muted-foreground">View profile</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout} render={<Link href="/" /> as any} nativeButton={false}>
              <LogOut />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
