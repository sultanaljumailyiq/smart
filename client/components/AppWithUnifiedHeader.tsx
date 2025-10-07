import React from "react";
import { useLocation } from "react-router-dom";
import OptimizedUnifiedHeader from "./OptimizedUnifiedHeader";
import FinalUnifiedBottomNav from "./FinalUnifiedBottomNav";
import { useCurrentSection } from "@/contexts/NavigationContext";

// صفحات لا تحتاج الهيدر الموحد (تستخدم Layout الخاص بها)
const PAGES_WITHOUT_UNIFIED_HEADER = [
  "/super-admin",
  "/system-admin",
  "/clinic/admin",
  "/dentist-hub/admin",
];

// صفحات تحتاج لهيدر مبسط
const MINIMAL_HEADER_PAGES = [
  "/auth",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

// مكون للتحقق من نوع الصفحة وعر�� الهيدر المناسب
function HeaderWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { section, config, isTransitioning } = useCurrentSection();

  // تحقق شامل للصفحات التي لا تحتاج الهيدر الموحد
  const isExcludedPage = PAGES_WITHOUT_UNIFIED_HEADER.some(
    (path) =>
      location.pathname === path || location.pathname.startsWith(path + "/"),
  );

  // تحقق للصفحات التي تحتاج هيدر مبسط
  const isMinimalPage = MINIMAL_HEADER_PAGES.some(
    (path) =>
      location.pathname === path || location.pathname.startsWith(path + "/"),
  );

  // إ��ا كانت صفحة مستثناة، لا تعرض الهيدر الموحد
  if (isExcludedPage) {
    return <>{children}</>;
  }

  // ت��ديد نوع الهيدر
  const headerVariant = isMinimalPage ? "minimal" : "default";

  // تحديد إظهار الشريط السفلي
  const showBottomNav = !isExcludedPage && !isMinimalPage;

  // تحديد نوع المستخدم (في التطبيق الحقيقي سيأتي من context المصادقة)
  const getUserRole = () => {
    // يمكن تحسين هذا ليأتي من context المصادقة
    if (location.pathname.startsWith("/admin")) return "admin";
    if (location.pathname.startsWith("/supplier")) return "supplier";
    return "dentist"; // افتراضي
  };

  try {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* الهيدر الموحد الثابت */}
        <OptimizedUnifiedHeader
          variant={headerVariant}
          showSidebar={!isMinimalPage}
        />

        {/* المحتوى الرئيسي مع padding مناسب */}
        <main
          className={`
            pt-16
            ${isTransitioning ? "opacity-90 transition-opacity duration-300" : ""}
            ${showBottomNav ? "pb-20" : ""}
          `}
        >
          {children}
        </main>

        {/* الشريط السفلي الموحد للموبايل */}
        {showBottomNav && <FinalUnifiedBottomNav userRole={getUserRole()} />}
      </div>
    );
  } catch (error) {
    console.error("Error in HeaderWrapper:", error);
    return <>{children}</>;
  }
}

interface AppWithUnifiedHeaderProps {
  children: React.ReactNode;
}

export default function AppWithUnifiedHeader({
  children,
}: AppWithUnifiedHeaderProps) {
  return <HeaderWrapper>{children}</HeaderWrapper>;
}

// مكون مساعد لع��ض حالة التحميل أثناء الانتقال
export function TransitionLoader() {
  const { isTransitioning } = useCurrentSection();

  if (!isTransitioning) return null;

  return (
    <div className="fixed top-16 left-0 right-0 z-30">
      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-pulse" />
    </div>
  );
}

// مكون لعرض معلومات القسم الحالي (للتطوير)
export function SectionDebugInfo() {
  const { section, config } = useCurrentSection();
  const location = useLocation();

  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div className="fixed bottom-4 left-4 bg-black/80 text-white p-2 rounded text-xs z-50">
      <div>Section: {section}</div>
      <div>Config: {config?.nameAr}</div>
      <div>Path: {location.pathname}</div>
    </div>
  );
}
