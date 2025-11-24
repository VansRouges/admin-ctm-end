"use client"

import * as React from "react"
import {
  IconDashboard,
  IconCreditCard,
  IconChartPie,
  IconSettings,
  IconMail,
  IconDatabase,
  IconUserCheck,
  IconHelp,
  IconShoppingCart,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "admin",
    email: "admin@ctm.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Transactions",
      url: "/dashboard/transactions",
      icon: IconCreditCard,
    },
    {
      title: "Portfolio",
      url: "/dashboard/portfolio",
      icon: IconChartPie,
    },
    {
      title: "Copytrade Purchases",
      url: "/dashboard/copytrade-purchases",
      icon: IconShoppingCart,
    },
    {
      title: "Manage",
      url: "/dashboard/manage",
      icon: IconSettings,
    },
    {
      title: "Mails",
      url: "/dashboard/mails",
      icon: IconMail,
    },
    {
      title: "KYC",
      url: "/dashboard/kyc",
      icon: IconUserCheck,
    },
    {
      title: "Support Requests",
      url: "/dashboard/support",
      icon: IconHelp,
    },
  ],
 
  documents: [
    {
      name: "Admin Audits",
      url: "/dashboard/audits",
      icon: IconDatabase,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <div className="bg-app-gold-100 text-black flex size-5 items-center justify-center rounded-md">
                  <span className="text-xs font-bold">₵</span>
                </div>
                <span className="text-base font-semibold uppercase text-app-gold-100">CopyTradingMarkets</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
