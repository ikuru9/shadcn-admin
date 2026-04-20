import type { ReactNode } from "react";

import { Link, useLocation } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/layout/sidebar";
import { useSidebar } from "@/components/layout/sidebar-context";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { NavCollapsible, NavGroup as NavGroupProps, NavItem, NavLink } from "./types";

export function NavGroup({ title, items }: NavGroupProps) {
  const { state, isMobile } = useSidebar();
  const href = useLocation({ select: (location) => location.href });
  const isCollapsed = state === "collapsed" && !isMobile;
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          return <NavTreeItem key={getNavItemKey(item)} item={item} href={href} isCollapsed={isCollapsed} />;
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function NavBadge({ children }: { children: ReactNode }) {
  return <Badge className="rounded-full px-1 py-0 text-xs">{children}</Badge>;
}

function NavTreeItem({ item, href, isCollapsed }: { item: NavItem; href: string; isCollapsed: boolean }) {
  if (!item.items) return <SidebarMenuLink item={item} href={href} />;

  if (isCollapsed) return <SidebarMenuCollapsedDropdown item={item} href={href} />;

  return <SidebarMenuCollapsible item={item} href={href} />;
}

function getNavItemKey(item: NavItem) {
  return `${item.title}-${isNavLink(item) ? item.url : item.items.map((sub) => sub.title).join("-")}`;
}

function getNavLeafItems(items: NavItem[]): NavLink[] {
  const leaves: NavLink[] = [];

  for (const item of items) {
    if (isNavLink(item)) {
      leaves.push(item);
      continue;
    }

    leaves.push(...getNavLeafItems(item.items));
  }

  return leaves;
}

function SidebarMenuLink({ item, href }: { item: NavLink; href: string }) {
  const { setOpenMobile } = useSidebar();
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        render={<Link to={item.url} onClick={() => setOpenMobile(false)} />}
        isActive={isNavItemActive(href, item)}
        tooltip={item.title}
      >
        {item.icon && <item.icon />}
        <span>{item.title}</span>
        {item.badge && <NavBadge>{item.badge}</NavBadge>}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function SidebarMenuCollapsible({ item, href }: { item: NavCollapsible; href: string }) {
  const { setOpenMobile } = useSidebar();
  return (
    <Collapsible
      render={<SidebarMenuItem />}
      defaultOpen={isNavItemActive(href, item)}
      className="group/collapsible"
    >
      <CollapsibleTrigger render={<SidebarMenuButton tooltip={item.title} />}>
        {item.icon && <item.icon />}
        <span>{item.title}</span>
        {item.badge && <NavBadge>{item.badge}</NavBadge>}
        <ChevronRight className="ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 rtl:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="CollapsibleContent">
        <SidebarMenuSub>
          {item.items.map((subItem) => (
            <NavSubTreeItem key={getNavItemKey(subItem)} item={subItem} href={href} setOpenMobile={setOpenMobile} />
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  );
}

function NavSubTreeItem({
  item,
  href,
  setOpenMobile,
}: {
  item: NavItem;
  href: string;
  setOpenMobile: (open: boolean) => void;
}) {
  if (!item.items)
    return (
      <SidebarMenuSubItem>
        <SidebarMenuSubButton
          render={<Link to={item.url} onClick={() => setOpenMobile(false)} />}
          isActive={isNavItemActive(href, item)}
        >
          {item.icon && <item.icon />}
          <span>{item.title}</span>
          {item.badge && <NavBadge>{item.badge}</NavBadge>}
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    );

  return (
    <Collapsible render={<SidebarMenuSubItem />} defaultOpen={isNavItemActive(href, item)} className="group/collapsible">
      <CollapsibleTrigger render={<SidebarMenuSubButton isActive={isNavItemActive(href, item)} />}>
        {item.icon && <item.icon />}
        <span>{item.title}</span>
        {item.badge && <NavBadge>{item.badge}</NavBadge>}
        <ChevronRight className="ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 rtl:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="CollapsibleContent">
        <SidebarMenuSub>
          {item.items.map((subItem) => (
            <NavSubTreeItem key={getNavItemKey(subItem)} item={subItem} href={href} setOpenMobile={setOpenMobile} />
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  );
}

function SidebarMenuCollapsedDropdown({ item, href }: { item: NavCollapsible; href: string }) {
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger render={<SidebarMenuButton tooltip={item.title} isActive={isNavItemActive(href, item)} />}>
          {item.icon && <item.icon />}
          <span>{item.title}</span>
          {item.badge && <NavBadge>{item.badge}</NavBadge>}
          <ChevronRight className="ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" sideOffset={4}>
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              {item.title} {item.badge ? `(${item.badge})` : ""}
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          {getNavLeafItems(item.items).map((sub) => (
            <DropdownMenuItem
              key={`${sub.title}-${sub.url}`}
              render={<Link to={sub.url} className={`${isNavItemActive(href, sub) ? "bg-secondary" : ""}`} />}
            >
              {sub.icon && <sub.icon />}
              <span className="max-w-52 text-wrap">{sub.title}</span>
              {sub.badge && <span className="ms-auto text-xs">{sub.badge}</span>}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}

function isNavItemActive(href: string, item: NavItem): boolean {
  const pathname = href.split("?")[0];

  if (isNavLink(item)) {
    const itemUrl = (item.url ?? "").split("?")[0];

    return (
      pathname === itemUrl ||
      (itemUrl !== "/" && pathname.startsWith(`${itemUrl}/`))
    );
  }

  return item.items.some((child) => isNavItemActive(href, child));
}

function isNavLink(item: NavItem): item is NavLink {
  return !("items" in item);
}
