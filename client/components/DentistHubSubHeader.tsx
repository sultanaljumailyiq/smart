import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, User, Bell, Heart, Building, Brain } from "lucide-react";

interface TabItem {
  key: string;
  label: string;
  path: string;
  icon: React.ComponentType<any>;
  match: (pathname: string) => boolean;
}

const tabs: TabItem[] = [
  {
    key: "overview",
    label: "النظرة العامة",
    path: "/dentist-hub",
    icon: Home,
    match: (p) =>
      p === "/dentist-hub" ||
      (p.startsWith("/dentist-hub/") === false && p.startsWith("/dentist-hub")),
  },
  {
    key: "smart-clinic",
    label: "العيادة الذكية",
    path: "/dentist-hub/smart-clinic/main",
    icon: Brain,
    match: (p) => p.startsWith("/dentist-hub/smart-clinic"),
  },
  {
    key: "clinics",
    label: "ادارة العيادات",
    path: "/dentist-hub/clinics",
    icon: Building,
    match: (p) => p.startsWith("/dentist-hub/clinics"),
  },
  {
    key: "profile",
    label: "الملف الشخصي",
    path: "/dentist-hub/profile",
    icon: User,
    match: (p) =>
      p === "/dentist-hub/profile" || p.startsWith("/dentist-hub/profile"),
  },
  {
    key: "notifications",
    label: "الإشعارات",
    path: "/dentist-hub/notifications",
    icon: Bell,
    match: (p) =>
      p === "/notifications" || p.startsWith("/dentist-hub/notifications"),
  },
  {
    key: "favorites",
    label: "المفضلة",
    path: "/dentist-hub/favorites",
    icon: Heart,
    match: (p) =>
      p === "/dentist-hub/favorites" || p.startsWith("/dentist-hub/favorites"),
  },
];

export default function DentistHubSubHeader() {
  const location = useLocation();
  const pathname = location.pathname;

  const isActive = (item: TabItem) => item.match(pathname);

  return (
    <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="px-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto h-14 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {(pathname.startsWith("/dentist-hub/profile")
            ? tabs.filter((t) => t.key !== "clinic")
            : tabs
          ).map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.key}
                to={item.path}
                className={cn(
                  "flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 rounded-xl text-xs sm:text-sm whitespace-nowrap transition-colors flex-shrink-0",
                  active
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                )}
              >
                <Icon
                  className={cn(
                    "w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0",
                    active ? "text-blue-600" : "text-gray-500",
                  )}
                />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
