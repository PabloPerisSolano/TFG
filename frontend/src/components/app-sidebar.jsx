"use client";

import {
  FaHome,
  FaSignInAlt,
  FaUserPlus,
  FaListAlt,
  FaPlusCircle,
  FaMagic,
} from "react-icons/fa";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const guestItems = [
  { title: "Inicio", url: "/", icon: FaHome },
  { title: "Iniciar Sesión", url: "/login", icon: FaSignInAlt },
  { title: "Registrarse", url: "/register", icon: FaUserPlus },
];

const userItems = [
  { title: "Mis Cuestionarios", url: "/quizzes", icon: FaListAlt },
  { title: "Crear Cuestionario", url: "/creator", icon: FaPlusCircle },
  { title: "Generar Cuestionario", url: "/generator", icon: FaMagic },
];

export function AppSidebar() {
  const { isLoggedIn } = useAuth();
  const { setOpenMobile } = useSidebar();

  const items = isLoggedIn ? userItems : guestItems;

  const handleItemClick = () => {
    setOpenMobile(false);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Quiz Generate</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} onClick={handleItemClick}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
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
