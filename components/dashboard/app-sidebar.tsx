"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  HeartIcon,
  HomeIcon,
  MessageCircleHeartIcon,
  CalendarIcon,
  SettingsIcon,
  SparklesIcon,
  LogOutIcon,
} from "lucide-react"

import { Logo } from "@/components/logo"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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
  { title: "Discover", href: "/dashboard", icon: HomeIcon },
  { title: "Matches", href: "/dashboard/matches", icon: HeartIcon, badge: "3" },
  { title: "Messages", href: "/dashboard/messages", icon: MessageCircleHeartIcon },
  { title: "Upcoming Dates", href: "/dashboard/dates", icon: CalendarIcon },
]

const secondaryNav = [
  { title: "Settings", href: "/dashboard/settings", icon: SettingsIcon },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/dashboard">
          <Logo />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Browse</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
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
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
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
                <SparklesIcon className="size-4 text-primary" />
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
            <SidebarMenuButton className="h-auto py-2" asChild>
              <Link href="/dashboard/settings">
                <Avatar className="size-8">
                  <AvatarImage src="/images/person-5.png" alt="Your profile" />
                  <AvatarFallback>AR</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Ava Reyes</span>
                  <span className="text-xs text-muted-foreground">View profile</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <LogOutIcon />
                <span>Log out</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
