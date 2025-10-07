import React, { useEffect, useMemo, useState } from "react";
import DentistHubSubHeader from "@/components/DentistHubSubHeader";
import UnifiedNotifications from "./UnifiedNotifications";
import IntegratedDentistProfile from "./IntegratedDentistProfile";
import SmartClinic from "./SmartClinic";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Bell, User, Settings, Package, TrendingUp, ShoppingCart, Heart, Clock, Star, Users, BarChart3, Calendar, MapPin, Phone, Mail, Edit, Camera, Award, Shield, Plus, Filter, Download, Eye, Menu, Home, LogOut, ArrowRight, MessageCircle, Briefcase, Stethoscope, FileText, Store, Building, Brain, UserPlus, Activity, CreditCard, Truck, GitBranch, PieChart, Target, Zap, Crown, ClipboardList, AlertTriangle, CheckCircle, Repeat, Tag, Gift } from "lucide-react";
import { cn } from "@/lib/utils";
import { sharedClinicData, type Patient, type Appointment, type TreatmentPlan, type InventoryItem, type Staff as StaffType } from "@/services/sharedClinicData";
import { useSystemSettings } from "@/contexts/SystemSettingsContext";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import type { UserRole as SystemUserRole } from "@/types/system";
import ClinicsManager from "./ClinicsManager";
import AdvancedClinicManagement from "./AdvancedClinicManagement";
import Favorites from "./Favorites";
import ClinicsAppointmentManager from "@/components/ClinicsAppointmentManager";

// User roles for hub view
export type UserRole = "dentist" | "supplier" | "admin";

// Mock user data for different types
const mockUsers = {
  dentist: {
    id: "1",
    type: "dentist",
    name: "د. أحمد محمد",
    email: "ahmed.mohammed@email.com",
    phone: "+964 770 123 4567",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop",
    clinicName: "عيادة النجمة لطب الأسنان",
    specialization: "طب الأسنان التجميلي",
    location: "بغداد، العراق",
    joinDate: "2023-03-15",
    verification: "verified",
    stats: {
      totalOrders: 145,
      totalSpent: "IQD 2,450,000",
      savedAmount: "IQD 485,000",
      favoriteProducts: 23
    }
  },
  supplier: {
    id: "2",
    type: "supplier",
    name: "شركة الرائد للمستلزمات الطبية",
    email: "info@alraed-medical.com",
    phone: "+964 780 987 6543",
    avatar: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop",
    companyName: "شركة الرائد للمستلزمات الطبية",
    businessType: "تجارة الجملة",
    location: "الكرخ، بغداد",
    joinDate: "2022-08-10",
    verification: "verified",
    stats: {
      totalProducts: 234,
      totalSales: "IQD 15,670,000",
      activeOrders: 12,
      customerRating: 4.8
    }
  }
};
export default function DentistHub() {
  const location = useLocation();
  const {
    user
  } = useAuth();
  const {
    favorites,
    favoritesCount
  } = useFavorites();
  const derivedType: UserRole = useMemo(() => {
    if (!user) return "dentist";
    const role = user.role as SystemUserRole;
    return role === "supplier" ? "supplier" : "dentist";
  }, [user]);
  const [userType, setUserType] = useState<UserRole>(derivedType);
  useEffect(() => setUserType(derivedType), [derivedType]);
  const [activeTab, setActiveTab] = useState("overview");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [plans, setPlans] = useState<TreatmentPlan[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [staff, setStaff] = useState<StaffType[]>([]);
  const [clinicsCount, setClinicsCount] = useState<number | null>(null);
  const [clinicSystem, setClinicSystem] = useState<"new" | "old">("new");
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [pts, appts, tps, inv, st, cfg] = await Promise.all([sharedClinicData.getPatients(), sharedClinicData.getAppointments(), sharedClinicData.getTreatmentPlans(), sharedClinicData.getInventory(), sharedClinicData.getStaff(), sharedClinicData.getSystemConfig()]);
        if (!mounted) return;
        setPatients(pts);
        setAppointments(appts);
        setPlans(tps);
        setInventory(inv);
        setStaff(st);
        setClinicSystem(cfg.defaultClinicSystem);
      } catch {}
      try {
        const userData = localStorage.getItem("user_data");
        if (userData) {
          const u = JSON.parse(userData);
          if (u?.id) {
            const {
              ClinicService
            } = await import("@/services/clinicService");
            const clinics = await ClinicService.getDoctorClinics(u.id).catch(() => null);
            if (mounted) setClinicsCount(Array.isArray(clinics) ? clinics.length : null);
          }
        }
      } catch {
        if (mounted) setClinicsCount(null);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);
  const upcomingAppointments = appointments.filter(a => {
    const dt = new Date(`${a.date}T${(a as any).time || "00:00"}`);
    return dt >= new Date() && (a.status === "scheduled" || a.status === "confirmed");
  }).sort((a, b) => new Date(`${a.date}T${(a as any).time || "00:00"}`).getTime() - new Date(`${b.date}T${(b as any).time || "00:00"}`).getTime()).slice(0, 5);
  const recallPatients = patients.filter(p => {
    const last = new Date(p.lastVisit);
    const days = (Date.now() - last.getTime()) / (1000 * 60 * 60 * 24);
    return days > 180;
  }).slice(0, 5);
  const lowStockItems = inventory.filter(i => i.status === "low_stock" || i.status === "out_of_stock").slice(0, 5);
  const navigate = useNavigate();
  const { isFeatureEnabled, settings } = useSystemSettings();
  const currentUser = mockUsers[userType];

  // Mobile-first interactive stat widget
  const gradientFor = (color: string) => {
    switch (color) {
      case "blue":
        return "from-blue-500/60 to-blue-300/60";
      case "green":
        return "from-emerald-500/60 to-emerald-300/60";
      case "purple":
        return "from-purple-500/60 to-violet-300/60";
      case "red":
        return "from-rose-500/60 to-pink-300/60";
      case "orange":
        return "from-orange-500/60 to-amber-300/60";
      case "teal":
        return "from-teal-500/60 to-cyan-300/60";
      case "indigo":
        return "from-indigo-500/60 to-sky-300/60";
      case "cyan":
        return "from-cyan-500/60 to-sky-300/60";
      default:
        return "from-gray-300 to-gray-200";
    }
  };
  const bgFor = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-500";
      case "green":
        return "bg-emerald-500";
      case "purple":
        return "bg-purple-500";
      case "red":
        return "bg-rose-500";
      case "orange":
        return "bg-orange-500";
      case "teal":
        return "bg-teal-500";
      case "indigo":
        return "bg-indigo-500";
      case "cyan":
        return "bg-cyan-500";
      default:
        return "bg-gray-400";
    }
  };
  function StatWidget({
    title,
    value,
    icon: Icon,
    color,
    subtitle,
    trend,
    spark = [4, 7, 5, 9, 6, 8, 10, 7, 6, 8, 7, 11]
  }: {
    title: string;
    value: React.ReactNode;
    icon: React.ComponentType<any>;
    color: "blue" | "green" | "purple" | "red" | "orange" | "teal" | "indigo" | "cyan";
    subtitle?: string;
    trend?: string;
    spark?: number[];
  }) {
    return <div className="group active:scale-[0.98] transition-all">
        <div className={cn("rounded-2xl p-[1px] bg-gradient-to-br", gradientFor(color))}>
          <div className="rounded-[14px] bg-white p-3 md:p-4 shadow-sm hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className={cn("w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-white", bgFor(color))}>
                <Icon className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] md:text-xs text-gray-500">
                  {title}
                </div>
                <div className="text-base md:text-xl font-bold text-gray-900 leading-snug">
                  {value}
                </div>
              </div>
            </div>
            {subtitle && <div className="mt-2 text-[10px] md:text-xs text-gray-500">
                {subtitle}
              </div>}
            {spark && <div className="mt-2 flex items-end gap-[2px] h-6" aria-hidden>
                {spark.map((v, i) => <span key={i} className="w-1.5 rounded-t bg-gray-200" style={{
              height: `${Math.max(3, v)}px`
            }} />)}
              </div>}
            {trend && <div className="mt-2 text-[10px] md:text-xs font-medium text-emerald-600">
                {trend}
              </div>}
          </div>
        </div>
      </div>;
  }

  // Quick shortcuts for different user types
  const getQuickShortcuts = () => {
    const shortcuts = {
      dentist: [{
        icon: Package,
        label: "المتجر",
        description: "المنتجات الطبية",
        href: "/dental-supply",
        color: "purple"
      }, {
        icon: MessageCircle,
        label: "المجتمع",
        description: "التواصل المهني",
        href: "/community",
        color: "blue"
      }, {
        icon: Briefcase,
        label: "التوظيف",
        description: "الفرص المهنية",
        href: "/jobs",
        color: "green"
      }, {
        icon: Brain,
        label: "العيادة الذكية",
        description: "تحليلات وتنبيهات وذكاء اصطناعي",
        href: "/dentist-hub/smart-clinic/overview",
        color: "cyan"
      }, {
        icon: FileText,
        label: "الخدمات الطبية",
        description: "الاستشارات وال��دمات",
        href: "/medical-services",
        color: "indigo"
      }, {
        icon: Heart,
        label: "ال��فضلة",
        description: "منتجاتي المفضلة",
        href: "/dentist-hub/favorites",
        color: "red"
      }, {
        icon: Building,
        label: "إدارة ��لعيادات",
        description: "إعدادات العيادات",
        href: "/dentist-hub/clinics",
        color: "orange"
      }, {
        icon: BarChart3,
        label: "التقارير",
        description: "إحصائ��ات شاملة",
        href: "/dentist-hub/reports",
        color: "teal"
      }],
      supplier: [{
        icon: Store,
        label: "متجري",
        description: "إدارة المتجر",
        href: "/supplier/store",
        color: "green"
      }, {
        icon: ShoppingCart,
        label: "الطلبات",
        description: "طلبات العملاء",
        href: "/supplier/orders",
        color: "blue"
      }, {
        icon: Users,
        label: "العملاء",
        description: "إدارة العملاء",
        href: "/supplier/customers",
        color: "cyan"
      }, {
        icon: BarChart3,
        label: "المبيعا��",
        description: "تقارير المبيعات",
        href: "/supplier/analytics",
        color: "orange"
      }, {
        icon: MessageCircle,
        label: "المجتم��",
        description: "التواصل التجاري",
        href: "/community",
        color: "indigo"
      }, {
        icon: Truck,
        label: "الشحن",
        description: "إدارة الشحنات",
        href: "/supplier/shipping",
        color: "yellow"
      }, {
        icon: CreditCard,
        label: "الم��فوعات",
        description: "المعاملات المالية",
        href: "/supplier/payments",
        color: "emerald"
      }, {
        icon: Package,
        label: "المنتجات",
        description: "إدارة منتجاتي",
        href: "/supplier/products",
        color: "purple"
      }]
    };
    
    // Filter shortcuts based on settings
    const allShortcuts = shortcuts[userType] || [];
    return allShortcuts.filter(shortcut => {
      if (shortcut.href.includes('/dental-supply')) return settings.dentalSupply || settings.marketplace;
      if (shortcut.href.includes('/community')) return settings.community;
      if (shortcut.href.includes('/jobs')) return settings.jobs;
      if (shortcut.href.includes('/medical-services')) return settings.medicalServices;
      if (shortcut.href.includes('/favorites')) return settings.favorites;
      return true; // Keep all other shortcuts
    });
  };

  // Permissions from clinic owner (stored in localStorage under 'clinic_permissions')
  const hasClinicPermission = (resource: string, action: string = "read") => {
    try {
      const raw = localStorage.getItem("clinic_permissions");
      const currentUserId = user && user.id || "anonymous";
      if (!raw) return true; // default allow if not configured
      const perms = JSON.parse(raw);
      const entries: string[] = perms[currentUserId] || perms["*"] || [];
      if (entries.includes("*")) return true;
      return entries.includes(`${resource}:${action}`) || entries.includes(`${resource}:*`);
    } catch {
      return true;
    }
  };
  const ClinicSystemSwitcher = () => <div className="bg-white rounded-2xl border border-gray-100 p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
          <button onClick={async () => {
          setClinicSystem("new");
          await sharedClinicData.setSystemConfig({
            defaultClinicSystem: "new"
          });
        }} className={cn("px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm border whitespace-nowrap flex-shrink-0", clinicSystem === "new" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-700 hover:bg-gray-50")}>
            الواجهة الحديثة
          </button>
          <button onClick={async () => {
          setClinicSystem("old");
          await sharedClinicData.setSystemConfig({
            defaultClinicSystem: "old"
          });
        }} className={cn("px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm border whitespace-nowrap flex-shrink-0", clinicSystem === "old" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-700 hover:bg-gray-50")}>
            الواجهة القديمة
          </button>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link to={clinicSystem === "new" ? "/clinic" : "/clinic_old"} className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm text-center whitespace-nowrap">
            فتح نظام الإدارة
          </Link>
        </div>
      </div>
    </div>;
  const QuickShortcuts = () => {
    const shortcuts = getQuickShortcuts();
    const getColorClasses = (color: string) => {
      const colorMap = {
        purple: "bg-purple-50 hover:bg-purple-100 text-purple-600 border-purple-200",
        blue: "bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200",
        green: "bg-green-50 hover:bg-green-100 text-green-600 border-green-200",
        cyan: "bg-cyan-50 hover:bg-cyan-100 text-cyan-600 border-cyan-200",
        indigo: "bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border-indigo-200",
        orange: "bg-orange-50 hover:bg-orange-100 text-orange-600 border-orange-200",
        red: "bg-red-50 hover:bg-red-100 text-red-600 border-red-200",
        teal: "bg-teal-50 hover:bg-teal-100 text-teal-600 border-teal-200",
        yellow: "bg-yellow-50 hover:bg-yellow-100 text-yellow-600 border-yellow-200",
        emerald: "bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-emerald-200"
      };
      return colorMap[color as keyof typeof colorMap] || colorMap.purple;
    };
    return <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6">
        

        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-2 sm:gap-2">
          {shortcuts.map((shortcut, index) => {
          const Icon = shortcut.icon;
          const allowed = shortcut.href.startsWith("/admin") ? hasClinicPermission("clinic", "read") : true;
          if (!allowed) return null;
          return <div key={index} className={cn("rounded-xl p-[1px] bg-gradient-to-br", gradientFor(shortcut.color))}>
                <Link to={shortcut.href} className="group flex flex-col items-center gap-1 p-2 sm:p-2 rounded-[10px] border bg-white transition-all duration-200 hover:bg-gray-50 active:scale-95" title={shortcut.description}>
                  <div className={cn("w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-white", bgFor(shortcut.color))}>
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] sm:text-xs font-medium leading-tight text-gray-900">
                      {shortcut.label}
                    </div>
                    <div className="text-[10px] opacity-70 mt-0.5 hidden lg:block">
                      {shortcut.description}
                    </div>
                  </div>
                </Link>
              </div>;
        })}
        </div>
      </div>;
  };
  const FavoritesSection = () => {
    return null;
  };
  const OffersAndSubscriptions = () => <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-indigo-600" /> الاشتراكات والعروض
        </h3>
        <Link to="/offers" className="text-indigo-600 text-sm">
          إدارة العروض
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatWidget title="الباقة الحالية" value={"مجانية"} icon={Shield} color="teal" />
        <StatWidget title="عروض فعالة" value={3} icon={Tag} color="purple" />
        <StatWidget title="العملاء المتأثرون" value={128} icon={Users} color="indigo" />
        <StatWidget title="إيرادات من العروض" value={"IQD 450,000"} icon={TrendingUp} color="green" />
      </div>
      <div className="mt-3 flex items-center gap-2">
        <Link to="/admin/settings" className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm">
          ترقية الباقة
        </Link>
        <Link to="/offers" className="px-4 py-2 rounded-xl border text-sm">
          إنشاء عرض جديد
        </Link>
      </div>
    </div>;
  const RewardsSection = () => {
    return null;
  };

  // اختصارات العيادة السريعة
  const ClinicShortcuts = () => {
    const getClinicPath = (segment: string) => clinicSystem === "new" ? segment === "dashboard" ? "/clinic" : `/clinic/${segment}` : segment === "dashboard" ? "/clinic_old" : `/clinic_old/${segment}`;
    const clinicShortcuts = [{
      icon: Home,
      label: "لوحة التحكم",
      description: "النظرة العامة",
      href: getClinicPath("dashboard"),
      color: "blue"
    }, {
      icon: Calendar,
      label: "الحجوزات",
      description: "إدارة المواعيد",
      href: getClinicPath("reservations"),
      color: "green"
    }, {
      icon: Users,
      label: "المرضى",
      description: "ملفات المرضى",
      href: getClinicPath("patients"),
      color: "purple"
    }, {
      icon: Stethoscope,
      label: "العلاجات",
      description: "إدارة العلاجات",
      href: getClinicPath("treatments"),
      color: "pink"
    }, {
      icon: UserPlus,
      label: "الطاقم",
      description: "إدارة الموظفين",
      href: getClinicPath("staff"),
      color: "orange"
    }, {
      icon: CreditCard,
      label: "الحسابات",
      description: "المالية والحسابات",
      href: getClinicPath("accounts"),
      color: "cyan"
    }, {
      icon: TrendingUp,
      label: "المبيعات",
      description: "تقارير المبيعات",
      href: getClinicPath("sales"),
      color: "emerald"
    }, {
      icon: Package,
      label: "المخزون",
      description: "إدارة المواد",
      href: getClinicPath("stocks"),
      color: "teal"
    }];
    const getColorClasses = (color: string) => {
      const colorMap = {
        blue: "bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200",
        green: "bg-green-50 hover:bg-green-100 text-green-600 border-green-200",
        purple: "bg-purple-50 hover:bg-purple-100 text-purple-600 border-purple-200",
        pink: "bg-pink-50 hover:bg-pink-100 text-pink-600 border-pink-200",
        orange: "bg-orange-50 hover:bg-orange-100 text-orange-600 border-orange-200",
        cyan: "bg-cyan-50 hover:bg-cyan-100 text-cyan-600 border-cyan-200",
        emerald: "bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-emerald-200",
        teal: "bg-teal-50 hover:bg-teal-100 text-teal-600 border-teal-200"
      };
      return colorMap[color as keyof typeof colorMap] || colorMap.blue;
    };
    return <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Building className="w-5 h-5 text-purple-500" />
              اختصارات العيادة
            </h3>
            
          </div>
          <Link to="/admin" className="bg-purple-50 hover:bg-purple-100 text-purple-600 px-4 py-2 rounded-xl font-medium text-sm transition-colors">
            فتح لوحة التحكم
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-2 sm:gap-2">
          {clinicShortcuts.map((shortcut, index) => {
          const Icon = shortcut.icon;
          return <div key={index} className={cn("rounded-xl p-[1px] bg-gradient-to-br", gradientFor(shortcut.color))}>
                <Link to={shortcut.href} className="group flex flex-col items-center gap-1 p-2 sm:p-2 rounded-[10px] border bg-white transition-all duration-200 hover:bg-gray-50 active:scale-95" title={shortcut.description}>
                  <div className={cn("w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-white", bgFor(shortcut.color))}>
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] sm:text-xs font-medium leading-tight text-gray-900">
                      {shortcut.label}
                    </div>
                  </div>
                </Link>
              </div>;
        })}
        </div>
      </div>;
  };
  const DentistDashboard = () => <div className="space-y-6">
      <QuickShortcuts />
      {hasClinicPermission("clinic", "read") && <ClinicSystemSwitcher />}
      {hasClinicPermission("clinic", "read") && <ClinicShortcuts />}
      {/* Widgets: Mobile-first interactive summary */}
      

      {/* Multi-Clinics & Staff Overview */}
      {hasClinicPermission("clinic", "read") && <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-500" /> ملخص العيادات
              </h3>
              <Link to="/clinic" className="text-blue-600 text-sm">
                إدار��
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <StatWidget title="عدد العيادات" value={clinicsCount ?? "—"} icon={Building} color="blue" />
              <StatWidget title="الطاقم" value={staff.length} icon={Users} color="teal" />
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-emerald-600" /> مهام
                وتذكيرات الطاقم
              </h3>
              <Link to="/dentist-hub?section=staff" className="text-emerald-600 text-sm">
                عرض
              </Link>
            </div>
            <div className="space-y-2">
              {recallPatients.slice(0, 3).map(p => <div key={p.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <div className="text-sm text-gray-800">
                      اتصال تذكير: {p.name}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    آخر زيارة: {p.lastVisit}
                  </div>
                </div>)}
              {recallPatients.length === 0 && <div className="text-sm text-gray-500">
                  لا توجد تذكيرات ح��لياً
                </div>}
            </div>
          </div>
        </div>}

      {hasClinicPermission("favorites", "read") && <FavoritesSection />}
      {hasClinicPermission("offers", "read") && <OffersAndSubscriptions />}
      {hasClinicPermission("rewards", "read") && <RewardsSection />}

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">النشاطات الأخيرة</h3>
          <Link to="/clinic/reports" className="text-blue-600 hover:text-blue-700 font-medium">
            عرض الكل
          </Link>
        </div>
        <div className="space-y-4">
          {[{
          type: "order",
          action: "طلب جديد من المتجر",
          details: "3 منتجات • IQD 125,000",
          time: "منذ ساعتين",
          icon: ShoppingCart,
          color: "blue"
        }, {
          type: "clinic",
          action: "موعد جديد في العيادة",
          details: "مريض جديد • فحص ر��تيني",
          time: "منذ 4 ساعات",
          icon: Calendar,
          color: "green"
        }, {
          type: "community",
          action: "مشارك�� في المجتمع",
          details: "رد على سؤال طبي",
          time: "أمس",
          icon: MessageCircle,
          color: "purple"
        }].map((activity, index) => {
          const Icon = activity.icon;
          return <div key={index} className="flex items-center gap-3 p-3 md:p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 active:scale-95 transition-all">
                <div className={`w-10 h-10 bg-${activity.color}-100 rounded-2xl flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 text-${activity.color}-600`} />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {activity.action}
                  </div>
                  <div className="text-[11px] md:text-sm text-gray-600">
                    {activity.details}
                  </div>
                </div>
                <div className="text-[11px] md:text-sm text-gray-500">
                  {activity.time}
                </div>
              </div>;
        })}
        </div>
      </div>

      {/* Upcoming Treatments & Plans */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" /> المواعيد والعلاجات
              القادمة
            </h3>
            <Link to="/clinic/reservations" className="text-green-600 text-sm">
              عرض ��لكل
            </Link>
          </div>
          <div className="space-y-2">
            {upcomingAppointments.map(a => <div key={a.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-xl">
                <div className="text-sm text-gray-800">
                  {a.patientName} • {a.treatment}
                </div>
                <div className="text-xs text-gray-500">
                  {a.date} {(a as any).time || ""}
                </div>
              </div>)}
            {upcomingAppointments.length === 0 && <div className="text-sm text-gray-500">لا توجد م��اعيد قادمة</div>}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-purple-600" /> خطط العلاج
            </h3>
            <Link to="/clinic/treatments" className="text-purple-600 text-sm">
              الإدارة
            </Link>
          </div>
          <div className="space-y-2">
            {plans.slice(0, 5).map(p => <div key={p.id} className="p-2 bg-gray-50 rounded-xl">
                <div className="text-sm font-medium text-gray-800">
                  {p.patientName} • {p.title}
                </div>
                <div className="text-xs text-gray-500">الحالة: {p.status}</div>
              </div>)}
            {plans.length === 0 && <div className="text-sm text-gray-500">لا توجد خطط علاج</div>}
          </div>
        </div>
      </div>

      {/* Notifications & Messages */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-rose-600" /> الإشعارات الحديثة
            </h3>
            <Link to="/dentist-hub/notifications" className="text-rose-600 text-sm">
              الكل
            </Link>
          </div>
          <div className="space-y-2">
            {["دفعة مستلمة", "موعد جديد", "��نبيه مخزون"].map((n, idx) => <div key={idx} className="p-2 bg-gray-50 rounded-xl text-sm text-gray-800">
                {n}
              </div>)}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue-600" /> الرسائل
            </h3>
            <Link to="/messages" className="text-blue-600 text-sm">
              فتح
            </Link>
          </div>
          <div className="space-y-2">
            {["رد من المورد", "استفسار مريض"].map((m, idx) => <div key={idx} className="p-2 bg-gray-50 rounded-xl text-sm text-gray-800">
                {m}
              </div>)}
          </div>
        </div>
      </div>

      {/* Reports & Supply Suggestions */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-teal-600" /> التقارير
            </h3>
            <Link to="/clinic/reports" className="text-teal-600 text-sm">
              التفاصيل
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <StatWidget title="الحجوزا��" value={appointments.length} icon={Calendar} color="cyan" />
            <StatWidget title="المرضى" value={patients.length} icon={Users} color="indigo" />
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-600" /> اقتراحات الشراء
              والاستدعاء
            </h3>
            <Link to="/dental-supply" className="text-amber-600 text-sm">
              المتجر
            </Link>
          </div>
          <div className="space-y-2">
            {lowStockItems.map(i => <div key={i.id} className="flex items-center justify-between p-2 bg-amber-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <div className="text-sm text-gray-800">{i.name}</div>
                </div>
                <div className="text-xs text-gray-600">
                  المخزون: {i.currentStock}
                </div>
              </div>)}
            {lowStockItems.length === 0 && <div className="text-sm text-gray-500">المخزون مستقر حالياً</div>}
          </div>
        </div>
      </div>
    </div>;
  const SupplierDashboard = () => <div className="space-y-6">
      <QuickShortcuts />
      {/* Widgets: Mobile-first interactive summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        <StatWidget title="إجمالي المنتجات" value={currentUser.stats.totalProducts} icon={Package} color="blue" trend="+5 منتجات جديدة" />
        <StatWidget title="إجمالي المبيعات" value={currentUser.stats.totalSales} icon={TrendingUp} color="green" trend="+9% هذا الأسبوع" />
        <StatWidget title="الطلبا�� النشطة" value={currentUser.stats.activeOrders} icon={ShoppingCart} color="purple" trend="-2 تم تسليمها" />
        <StatWidget title="تقييم العملاء" value={currentUser.stats.customerRating} icon={Star} color="red" trend="↑ تحسن ��فيف" />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">الطلبات الجديدة</h3>
          <Link to="/supplier/orders" className="text-purple-600 hover:text-purple-700 font-medium">
            عرض ��لكل
          </Link>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(order => <div key={order} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 md:w-12 md:h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 md:w-6 md:h-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    طلب #{2000 + order}
                  </div>
                  <div className="text-[11px] md:text-sm text-gray-600">
                    د. محمد أحمد • 5 منتجات
                  </div>
                </div>
              </div>
              <div className="text-left">
                <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
                  قيد المعالجة
                </div>
                <div className="text-[11px] md:text-sm text-gray-600 mt-1">
                  IQD 85,000
                </div>
              </div>
            </div>)}
        </div>
      </div>
    </div>;
  return <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 with-floating-nav" dir="rtl">
      {/* Sub Header below global header */}
      <DentistHubSubHeader />

      {/* Main Content */}
      <div className="pt-2">
        <main className="p-3 sm:p-6 lg:p-8">
          {location.pathname.startsWith("/dentist-hub/clinics") ? <ClinicsAppointmentManager /> : location.pathname.startsWith("/dentist-hub/notifications") ? <UnifiedNotifications /> : location.pathname.startsWith("/dentist-hub/profile") ? <IntegratedDentistProfile /> : location.pathname.startsWith("/dentist-hub/favorites") ? <Favorites /> : location.pathname.startsWith("/dentist-hub/smart-clinic") ? <SmartClinic /> : <>
              {userType === "dentist" && <DentistDashboard />}
              {userType === "supplier" && <SupplierDashboard />}
            </>}
        </main>
      </div>

      {/* Bottom Navigation */}
      {/* يستخدم ال��ريط السفلي الموحد من الغلاف */}
    </div>;
}