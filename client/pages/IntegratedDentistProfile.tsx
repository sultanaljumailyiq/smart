// Import other dependencies
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabaseEnabled } from "@/config/supabase";
import AdvancedClinicManagement from "./AdvancedClinicManagement";
import {
  Stethoscope,
  Users,
  Calendar,
  BarChart3,
  FileText,
  Settings,
  MessageCircle,
  BookOpen,
  Award,
  Brain,
  Building2,
  TrendingUp,
  Clock,
  Phone,
  ArrowRight,
  Package,
  CreditCard,
  Shield,
  Briefcase,
  Bell,
  Star,
  Activity,
  UserCheck,
  Database,
  PieChart,
  Search,
  Plus,
  User,
  GraduationCap,
  Video,
  FileVideo,
  BookmarkPlus,
  Users2,
  Target,
  Lightbulb,
  Heart,
  MapPin,
  Mail,
  Edit,
  Menu,
  X,
  Home,
  Bookmark,
  Filter,
  Grid3x3,
  List,
  ChevronDown,
  ChevronRight,
  Zap,
  Globe,
  ChevronLeft,
  AlertCircle,
  CheckCircle2,
  Info,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Camera,
  Upload,
  HelpCircle,
  Crown,
  ShoppingCart,
  Palette,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useBookmarks } from "@/contexts/BookmarksContext";
import { UserRole, rolePermissions } from "@shared/permissions";
import { NewUnifiedHeader } from "@/components/NewUnifiedHeader";
import FinalUnifiedBottomNav from "@/components/FinalUnifiedBottomNav";
import {
  NotificationPopover,
  ProfilePopover,
} from "@/components/UnifiedPopover";
import AdminThemeControl from "@/components/AdminThemeControl";

// أنواع البيانات
interface UserProfile {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  clinicName?: string;
  specialization?: string;
  location: string;
  joinDate: string;
  verification: "verified" | "pending" | "unverified";
  stats: {
    [key: string]: any;
  };
}

interface DashboardSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  path: string;
  color: string;
  gradient: string;
  category:
    | "overview"
    | "profile"
    | "notifications"
    | "favorites"
    | "clinic"
    | "settings";
  requiredPermissions?: string[];
  data?: any;
  isActive?: boolean;
}

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path: string;
  badge?: number;
  children?: SidebarItem[];
}

// بيانات وهمية للإشعارات - مطابقة لصفحة الإشعارات الأصلية
const mockNotifications = [
  {
    id: "1",
    type: "urgent",
    category: "appointment",
    title: "موعد عاجل خلال 5 دقائق!",
    message: "لديك موعد مع د. أحمد ا��عراقي - جراحة زراعة أسنان",
    timestamp: "منذ 2 د��ائق",
    read: false,
    starred: true,
    priority: "urgent",
    actionUrl: "/appointments/123",
    actionText: "��نضم الآن",
    avatar:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=40&h=40&fit=crop&crop=face",
    reactions: 3,
    tags: ["��اجل", "زراعة"],
  },
  {
    id: "2",
    type: "celebration",
    category: "achievement",
    title: "🎉 تهانينا! وصلت لـ 1000 متابع",
    message: "حسابك في مجتمع أطباء الأسنان حقق إنجازاً رائعاً",
    timestamp: "منذ 15 دقيقة",
    read: false,
    starred: false,
    priority: "medium",
    actionUrl: "/profile",
    actionText: "عرض الملف",
    reactions: 25,
    tags: ["إنجاز", "مجتمع"],
  },
  {
    id: "3",
    type: "error",
    category: "inventory",
    title: "نفاد المخزون - تحذير حرج",
    message: "انتهت كمية مادة التخدير الموضعي (Lidocaine) تماماً",
    timestamp: "منذ 30 دقيقة",
    read: false,
    starred: true,
    priority: "high",
    actionUrl: "/inventory/reorder",
    actionText: "اطلب الآن",
    tags: ["��خزون", "��رج"],
  },
  {
    id: "4",
    type: "info",
    category: "patient",
    title: "مريض ج��يد - تحد��ث ا��ملف",
    message: "ا��ضم مريض جديد: فاطمة علي - مطلوب فحص أولي شامل",
    timestamp: "منذ ساعة",
    read: false,
    starred: false,
    priority: "medium",
    actionUrl: "/patients/new/456",
    actionText: "عرض ا��ملف",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face",
    tags: ["مريض جديد", "فحص أولي"],
  },
  {
    id: "5",
    type: "success",
    category: "financial",
    title: "💰 دفعة مستلمة",
    message: "تم استلام دفعة ب��يمة 850,000 د.ع من المريض محمد الأحمد",
    timestamp: "منذ 2 ساعة",
    read: true,
    starred: false,
    priority: "low",
    actionUrl: "/payments/789",
    actionText: "عرض التفاصيل",
    tags: ["دفعة", "مالي"],
  },
  {
    id: "6",
    type: "warning",
    category: "system",
    title: "⚠️ صيانة النظام المجدولة",
    message: "صيانة مجدولة للنظام ��داً من 2:00 - 4:00 صباحاً",
    timestamp: "منذ 3 ساعات",
    read: true,
    starred: false,
    priority: "medium",
    actionUrl: "/system/maintenance",
    actionText: "الم��يد من التفاصيل",
    tags: ["صيانة", "نظام"],
  },
  {
    id: "7",
    type: "info",
    category: "message",
    title: "رسال�� جديدة من ��. سارة",
    message:
      "د. سارة أحمد أرسلت لك تقرير حالات ا��يوم - 8 حالات تجميل و 12 حالة علاج",
    timestamp: "منذ 4 ساعات",
    read: false,
    starred: false,
    priority: "medium",
    actionUrl: "/messages/staff/sara",
    actionText: "قراءة الرسالة",
    avatar:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=40&h=40&fit=crop&crop=face",
    tags: ["رسائل", "طاقم"],
  },
  {
    id: "8",
    type: "info",
    category: "community",
    title: "مقال جديد في المجتمع",
    message: "د. علي حسن نشر مقالاً عن 'أحدث تقنيات زراعة الأسنان 2024'",
    timestamp: "منذ 5 ساعات",
    read: true,
    starred: true,
    priority: "low",
    actionUrl: "/community/articles/latest",
    actionText: "قراءة المقال",
    avatar:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=40&h=40&fit=crop&crop=face",
    tags: ["مجتمع", "مقال��ت"],
  },
];

// ��يانات وهمية للعيادات
interface Clinic {
  id: string;
  name: string;
  description: string;
  address: string;
  coordinates: { lat: number; lng: number };
  phone: string;
  email: string;
  workingHours: {
    [key: string]: { start: string; end: string; closed?: boolean };
  };
  services: string[];
  specializations: string[];
  bookingSettings: {
    allowOnlineBooking: boolean;
    bookingLink: string;
    advanceBookingDays: number;
    slotDuration: number;
    bufferTime: number;
  };
  images: string[];
  rating: number;
  reviewsCount: number;
  verified: boolean;
  status: "active" | "inactive" | "maintenance";
  created: string;
  lastUpdated: string;
}

const mockClinics: Clinic[] = [
  {
    id: "clinic-001",
    name: "عيادة النجمة المتطورة لطب الأسنان",
    description:
      "عيادة متخصصة في طب الأسنان التجميلي والترميمي مع أحدث التقنيات",
    address: "شارع الكرادة، بناية الأطباء، الطابق الثالث، بغداد، العراق",
    coordinates: { lat: 33.3152, lng: 44.3661 },
    phone: "+964 770 123 4567",
    email: "info@najma-dental.com",
    workingHours: {
      sunday: { start: "09:00", end: "17:00" },
      monday: { start: "09:00", end: "17:00" },
      tuesday: { start: "09:00", end: "17:00" },
      wednesday: { start: "09:00", end: "17:00" },
      thursday: { start: "09:00", end: "17:00" },
      friday: { closed: true, start: "", end: "" },
      saturday: { start: "10:00", end: "14:00" },
    },
    services: [
      "حشوات تجميلية",
      "تبييض الأسنان",
      "تقويم الأسنان",
      "زراعة الأسنان",
      "علاج العصب",
      "جراحة الفم والأسنان",
    ],
    specializations: [
      "طب الأسنان التجميلي",
      "طب الأسنان الترميمي",
      "جراحة الفم",
    ],
    bookingSettings: {
      allowOnlineBooking: true,
      bookingLink: "https://booking.najma-dental.com/clinic-001",
      advanceBookingDays: 30,
      slotDuration: 30,
      bufferTime: 15,
    },
    images: [
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=800&h=600&fit=crop",
    ],
    rating: 4.8,
    reviewsCount: 156,
    verified: true,
    status: "active",
    created: "2023-03-15",
    lastUpdated: "2024-01-15",
  },
  {
    id: "clinic-002",
    name: "��يادة الابتسامة الذهبية",
    description: "مركز ��تخصص في تجميل الأ��نان وتقويمها",
    address: "حي الجادرية، مجمع العيادات الطبية، بغداد، العراق",
    coordinates: { lat: 33.2778, lng: 44.3797 },
    phone: "+964 771 234 5678",
    email: "contact@golden-smile.com",
    workingHours: {
      sunday: { start: "08:00", end: "16:00" },
      monday: { start: "08:00", end: "16:00" },
      tuesday: { start: "08:00", end: "16:00" },
      wednesday: { start: "08:00", end: "16:00" },
      thursday: { start: "08:00", end: "16:00" },
      friday: { closed: true, start: "", end: "" },
      saturday: { start: "09:00", end: "13:00" },
    },
    services: [
      "ابتسامة هوليود",
      "فينير الأسنان",
      "تقويم شفاف",
      "تبييض متقدم",
      "زراعة فورية",
    ],
    specializations: ["طب الأسنان التجميلي", "تقويم الأسنان"],
    bookingSettings: {
      allowOnlineBooking: true,
      bookingLink: "https://booking.golden-smile.com/clinic-002",
      advanceBookingDays: 45,
      slotDuration: 45,
      bufferTime: 10,
    },
    images: [
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&h=600&fit=crop",
    ],
    rating: 4.9,
    reviewsCount: 203,
    verified: true,
    status: "active",
    created: "2023-06-20",
    lastUpdated: "2024-01-10",
  },
];

// ��يان��ت وهمية للمستخدم الحالي مع حماية من الأخطاء
const getCurrentUser = (): UserProfile => ({
  id: "1",
  role: "clinic_owner",
  name: "د. أحمد محمد الطبيب",
  email: "dr.ahmed@dentistry.com",
  phone: "+964 770 123 4567",
  avatar:
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop",
  clinicName: "عيادة النجمة المتطورة لطب الأسنان",
  specialization: "طب الأسنان التجميلي والت��ميمي",
  location: "بغداد، العراق",
  joinDate: "2023-03-15",
  verification: "verified",
  stats: {
    patientsServed: 1247,
    appointmentsToday: 8,
    monthlyRevenue: "IQD 12,450,000",
    totalOrders: 145,
    favoriteProducts: 23,
    unreadNotifications: 17,
    favoriteJobs: 5,
    recentActivities: 12,
  },
});

// بناء الأقسام حسب الصلاحيات مع ح��اية من ال��خطاء
const buildDashboardSections = (
  userRole: UserRole,
  userStats: any = {},
): DashboardSection[] => {
  try {
    const permissions = rolePermissions[userRole] || {};
    const sections: DashboardSection[] = [];

    // قسم ال��ظرة العامة (متاح دائماً)
    sections.push({
      id: "overview",
      title: "النظر�� العامة",
      description: "ملخص شامل لجميع الأنشطة والإحصائيات",
      icon: BarChart3,
      path: "/dentist-hub",
      color: "blue",
      gradient: "from-blue-600 to-indigo-600",
      category: "overview",
      data: {
        totalActivities: userStats.recentActivities || 0,
        dailyProgress: "85%",
        weeklyTrend: "+12%",
      },
      isActive: true,
    });

    // الملف الشخصي (متاح دائماً)
    sections.push({
      id: "profile",
      title: "الملف الشخصي",
      description: "إدارة معلوماتك الشخصية والمهنية",
      icon: User,
      path: "/dentist-hub?section=profile",
      color: "purple",
      gradient: "from-purple-600 to-indigo-600",
      category: "profile",
      data: {
        completionRate: "92%",
        lastUpdate: "2 أيام",
        documentsCount: 8,
      },
    });

    // الإشعارات (متاح دا����ماً)
    sections.push({
      id: "notifications",
      title: "الإشعارات",
      description: "تنبيهات ورسائ�� مهم��",
      icon: Bell,
      path: "/dentist-hub?section=notifications",
      color: "red",
      gradient: "from-red-600 to-pink-600",
      category: "notifications",
      data: {
        unread: userStats.unreadNotifications || 0,
        urgent: 3,
        today: 8,
      },
    });

    // المف��������لة (متاح دائماً)
    sections.push({
      id: "favorites",
      title: "المفضلة",
      description: "الوظائف و��لمنتجات المح��وظة",
      icon: Heart,
      path: "/dentist-hub?section=favorites",
      color: "rose",
      gradient: "from-rose-600 to-pink-600",
      category: "favorites",
      data: {
        jobs: userStats.favoriteJobs || 0,
        products: userStats.favoriteProducts || 0,
        total:
          (userStats.favoriteJobs || 0) + (userStats.favoriteProducts || 0),
      },
    });

    // إدارة العيادة (حسب الصلاحيات)
    if ((permissions as any)?.canManageClinic || userRole.includes("admin") || userRole.includes("dentist")) {
      sections.push({
        id: "clinic-management",
        title: "إدارة العيادة",
        description: "نظام شامل لإدار�� ��يادتك والمواعيد",
        icon: Building2,
        path: "/dentist-hub/clinics",
        color: "teal",
        gradient: "from-teal-600 to-cyan-600",
        category: "clinic",
        requiredPermissions: ["canManageClinic"],
        data: {
          patients: userStats.patientsServed || 0,
          appointmentsToday: userStats.appointmentsToday || 0,
          revenue: userStats.monthlyRevenue || "0",
          efficiency: "94%",
        },
      });
    }

    // الإعدادات (مت��ح دائماً)
    sections.push({
      id: "settings",
      title: "الإعدادات",
      description: "إعدادات الحساب والأمان والخصوصية",
      icon: Settings,
      path: "/dentist-hub?section=settings",
      color: "gray",
      gradient: "from-gray-600 to-slate-600",
      category: "settings",
      data: {
        security: "قوي",
        privacy: "محمي",
        preferences: 12,
      },
    });

    // إدارة النظام للمديرين فقط
    if (userRole.includes("admin")) {
      sections.push({
        id: "system-admin",
        title: "إدارة النظام",
        description: "إدارة المنصة والإعدادات المتقدمة",
        icon: Crown,
        path: "/dentist-hub?section=system-admin",
        color: "red",
        gradient: "from-red-600 to-rose-600",
        category: "settings",
        data: {
          platforms: 5,
          support_tickets: 12,
          system_health: "ممتاز",
          active_admins: 3,
        },
      });
    }

    return sections.filter((s) => s.id !== "overview" && s.id !== "favorites" && s.id !== "clinic-management" && s.id !== "notifications");
  } catch (error) {
    console.error("Error building dashboard sections:", error);
    return [];
  }
};

// ��ناء عن��صر القائمة الجانبية مع حماية من ا��أخط��ء
const buildSidebarItems = (userRole: UserRole): SidebarItem[] => {
  try {
    const permissions = rolePermissions[userRole] || {};
    const items: SidebarItem[] = [
      {
        id: "overview",
        label: "النظرة العامة",
        icon: BarChart3,
        path: "/dentist-hub",
      },
      {
        id: "profile",
        label: "الملف الشخصي",
        icon: User,
        path: "/dentist-hub?section=profile",
        children: [
          {
            id: "personal-info",
            label: "ال��علومات الشخصية",
            icon: User,
            path: "/dentist-hub?section=profile&sub=personal",
          },
          {
            id: "professional",
            label: "المعلومات المهن��ة",
            icon: Award,
            path: "/dentist-hub?section=profile&sub=professional",
          },
          {
            id: "documents",
            label: "الوثائق والشهادات",
            icon: FileText,
            path: "/dentist-hub?section=profile&sub=documents",
          },
        ],
      },
      {
        id: "notifications",
        label: "الإشعارات",
        icon: Bell,
        path: "/dentist-hub?section=notifications",
        badge: 17,
        children: [
          {
            id: "appointments",
            label: "��شعارات المواعيد",
            icon: Calendar,
            path: "/dentist-hub?section=notifications&sub=appointments",
            badge: 5,
          },
          {
            id: "system",
            label: "إشعارات النظام",
            icon: Activity,
            path: "/dentist-hub?section=notifications&sub=system",
            badge: 12,
          },
          {
            id: "messages",
            label: "الرسائل",
            icon: MessageCircle,
            path: "/dentist-hub?section=notifications&sub=messages",
          },
        ],
      },
      {
        id: "favorites",
        label: "ال��فضلة",
        icon: Heart,
        path: "/dentist-hub?section=favorites",
        children: [
          {
            id: "jobs",
            label: "الوظائف المفضلة",
            icon: Briefcase,
            path: "/dentist-hub?section=favorites&sub=jobs",
          },
          {
            id: "products",
            label: "المنتجات المفضلة",
            icon: Package,
            path: "/dentist-hub?section=favorites&sub=products",
          },
          {
            id: "articles",
            label: "المقالات المحفوظة",
            icon: BookOpen,
            path: "/dentist-hub?section=favorites&sub=articles",
          },
        ],
      },
    ];

    // إضافة إدارة العيادة حسب الصلاحيات
    if ((permissions as any)?.canManageClinic || userRole.includes("admin") || userRole.includes("dentist")) {
      items.push({
        id: "clinic",
        label: "إدارة العيادة",
        icon: Building2,
        path: "/dentist-hub/clinics",
        children: [
          {
            id: "appointments",
            label: "إدارة المواعيد",
            icon: Calendar,
            path: "/dentist-hub/clinics&sub=appointments",
          },
          {
            id: "patients",
            label: "ملفات المرضى",
            icon: Users,
            path: "/dentist-hub/clinics&sub=patients",
          },
          {
            id: "staff",
            label: "إدارة الطاقم",
            icon: UserCheck,
            path: "/dentist-hub/clinics&sub=staff",
          },
          {
            id: "reports",
            label: "التقارير والإحصائيات",
            icon: BarChart3,
            path: "/dentist-hub/clinics&sub=reports",
          },
        ],
      });
    }

    // الإعدادات
    items.push({
      id: "settings",
      label: "الإعدادات",
      icon: Settings,
      path: "/dentist-hub?section=settings",
      children: [
        {
          id: "account",
          label: "إعدادات الحساب",
          icon: User,
          path: "/dentist-hub?section=settings&sub=account",
        },
        {
          id: "security",
          label: "الأمان والخصوصية",
          icon: Shield,
          path: "/dentist-hub?section=settings&sub=security",
        },
        {
          id: "notifications-settings",
          label: "إعدادات الإشعارات",
          icon: Bell,
          path: "/dentist-hub?section=settings&sub=notifications",
        },
        {
          id: "preferences",
          label: "التفضيلات العامة",
          icon: Settings,
          path: "/dentist-hub?section=settings&sub=preferences",
        },
      ],
    });

    // إدارة البيانات
    items.push({
      id: "database",
      label: "إدارة البيانات",
      icon: Database,
      path: "/dentist-hub?section=database",
      children: [
        {
          id: "db-backups",
          label: "النسخ الاحتياطي",
          icon: FileText,
          path: "/dentist-hub?section=database&sub=backups",
        },
        {
          id: "db-explorer",
          label: "مستكشف البيانات",
          icon: Search,
          path: "/dentist-hub?section=database&sub=explorer",
        },
        {
          id: "db-schema",
          label: "بنية الجداول",
          icon: Grid3x3,
          path: "/dentist-hub?section=database&sub=schema",
        },
        {
          id: "db-access",
          label: "صلاحيات الوصول",
          icon: Shield,
          path: "/dentist-hub?section=database&sub=access",
        },
      ],
    });

    // إدارة النظام للمديرين فقط
    if (userRole.includes("admin")) {
      items.push({
        id: "system-admin",
        label: "إدارة النظام",
        icon: Crown,
        path: "/dentist-hub?section=system-admin",
        children: [
          {
            id: "technical-support",
            label: "الدعم الفني",
            icon: HelpCircle,
            path: "/admin/support",
          },
          {
            id: "platform-management",
            label: "إدارة المنصة",
            icon: BarChart3,
            path: "/admin/platform-admin",
          },
          {
            id: "marketplace-management",
            label: "إدارة السوق",
            icon: ShoppingCart,
            path: "/admin/marketplace-admin",
          },
          {
            id: "payment-methods",
            label: "طرق الدفع",
            icon: CreditCard,
            path: "/admin/payment-methods",
          },
          {
            id: "super-admin-settings",
            label: "إعدادات المدير العام",
            icon: Crown,
            path: "/admin/super-admin-settings",
          },
          {
            id: "system-reports",
            label: "تقارير النظام",
            icon: BarChart3,
            path: "/admin/reports",
          },
        ],
      });
    }

    return items.filter((i) => i.id !== "overview" && i.id !== "favorites" && i.id !== "clinic" && i.id !== "notifications");
  } catch (error) {
    console.error("Error building sidebar items:", error);
    return [];
  }
};

// المكون الرئيسي م�� error handling محسن
export default function IntegratedDentistProfile() {
  // استخ��ام Context مع error handling
  const i18n = useI18n();
  const favoritesContext = useFavorites();
  const bookmarksContext = useBookmarks();
  const location = useLocation();
  const navigate = useNavigate();

  // التحقق من وجود البيانات
  const language = i18n?.language || "ar";
  const favorites = favoritesContext?.favorites || [];
  const bookmarks = bookmarksContext?.bookmarks || [];

  const [currentUser] = useState<UserProfile>(getCurrentUser());
  const [selectedSection, setSelectedSection] = useState<string>("overview");
  const [selectedSubSection, setSelectedSubSection] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [navMode, setNavMode] = useState<"side" | "top" | "bottom" | "fab">(
    "top",
  );
  const [fabOpen, setFabOpen] = useState(false);
  const [expandedSidebarItems, setExpandedSidebarItems] = useState<string[]>([
    "overview",
  ]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState<
    "all" | "unread" | "urgent" | "messages"
  >("all");
  const [selectedNotification, setSelectedNotification] = useState<
    string | null
  >(null);
  const [clinicView, setClinicView] = useState<
    "overview" | "list" | "add" | "edit"
  >("overview");
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);

  // بناء البيانات الذكية حسب الصلاحيات مع error handling
  const dashboardSections = buildDashboardSections(
    currentUser.role,
    currentUser.stats,
  );
  const sidebarItems = buildSidebarItems(currentUser.role);
  const permissions = rolePermissions[currentUser.role] || {};

  // تحديث القسم المختار من URL
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(location.search);
      let section =
        urlParams.get("section") ||
        (location.pathname.startsWith("/dentist-hub/profile")
          ? "profile"
          : "overview");
      const subSection = urlParams.get("sub") || "";
      setSelectedSection(section);
      setSelectedSubSection(subSection);
      setNavMode("top");
    } catch (error) {
      console.error("Error parsing URL params:", error);
      setSelectedSection("overview");
      setSelectedSubSection("");
    }
  }, [location.search]);

  // تبديل توسيع عناصر القائمة الجانبية
  const toggleSidebarItem = (itemId: string) => {
    setExpandedSidebarItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  // التنقل بي�� الأقسام
  const navigateToSection = (section: string, subSection?: string) => {
    try {
      if (section === "clinic" || section === "clinic-management") {
        navigate("/dentist-hub/clinics");
        setIsSidebarOpen(false);
        return;
      }
      const params = new URLSearchParams(location.search);
      params.set("section", section);
      if (subSection) params.set("sub", subSection);
      else params.delete("sub");
      params.set("nav", navMode);
      navigate(`/dentist-hub/profile?${params.toString()}`);
      setIsSidebarOpen(false);
    } catch (error) {
      console.error("Error navigating to section:", error);
    }
  };

  // عرض محتوى القسم ا��مختار
  const renderSectionContent = () => {
    try {
      switch (selectedSection) {
        case "overview":
          return renderNotificationsContent();
        case "profile":
          return renderProfileContent();
        case "notifications":
          return renderNotificationsContent();
        case "favorites":
          return renderProfileContent();
        case "clinic":
          return renderClinicMultiContent();
        case "database":
          return renderDatabaseContent();
        case "settings":
          return selectedSubSection === "security"
            ? renderSettingsSecurityContent()
            : renderSettingsContent();
        case "system-admin":
          return renderSystemAdminContent();
        default:
          return renderProfileContent();
      }
    } catch (error) {
      console.error("Error rendering section content:", error);
      return (
        <div className="text-center py-16">
          <AlertCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">حدث ��طأ</h3>
          <p className="text-gray-600">عذراً، حدث خطأ في تحميل المحتوى</p>
        </div>
      );
    }
  };

  // محتوى النظرة العامة
  const renderOverviewContent = () => (
    <div className="space-y-8">
      {/* بطاقات الملخص التفاعلية */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-6">
        {dashboardSections.map((section) => {
          const Icon = section.icon;
          const hasData = section.data && Object.keys(section.data).length > 0;

          return (
            <div
              key={section.id}
              onClick={() => navigateToSection(section.id)}
              className="group bg-white rounded-xl p-3 md:p-5 border border-gray-200 shadow-sm hover:shadow-lg hover:shadow-gray-200/40 transition-all duration-200 hover:-translate-y-[2px] active:scale-95 cursor-pointer"
            >
              {/* رأس البطاقة */}
              <div className="flex items-start justify-between mb-2 md:mb-3">
                <div
                  className={cn(
                    "w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-white",
                    `bg-gradient-to-br ${section.gradient}`,
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {section.category === "notifications" &&
                  section.data?.unread > 0 && (
                    <span className="px-2 py-1 text-xs font-medium text-white bg-red-500 rounded-full">
                      {section.data.unread}
                    </span>
                  )}
              </div>

              {/* محتوى البطاقة */}
              <div>
                <h3 className="text-sm md:text-lg font-bold text-gray-900 mb-1 md:mb-2 group-hover:text-blue-600 transition-colors">
                  {section.title}
                </h3>
                <p className="text-[11px] md:text-sm text-gray-600 mb-2 md:mb-4">
                  {section.description}
                </p>

                {/* إحصائيات سريعة */}
                {hasData && (
                  <div className="grid grid-cols-2 gap-1 md:gap-2 mb-2 md:mb-4">
                    {Object.entries(section.data)
                      .slice(0, 4)
                      .map(([key, value]) => (
                        <div key={key} className="text-center">
                          <p className="text-sm md:text-lg font-bold text-gray-900">
                            {String(value)}
                          </p>
                          <p className="text-[11px] md:text-xs text-gray-500 capitalize">
                            {key}
                          </p>
                        </div>
                      ))}
                  </div>
                )}

                {/* زر العمل */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] md:text-sm text-gray-500">
                    انقر للعرض التفصيلي
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* الخدمات السريعة */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          الخدمات السريعة
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            {
              icon: Calendar,
              label: "حجز موعد",
              path: "/appointments",
              color: "bg-blue-100 text-blue-600",
            },
            {
              icon: Users,
              label: "ملفات المرضى",
              path: "/patients",
              color: "bg-green-100 text-green-600",
            },
            {
              icon: Package,
              label: "المستلزمات",
              path: "/dental-supply",
              color: "bg-purple-100 text-purple-600",
            },
            {
              icon: BookOpen,
              label: "المقالات",
              path: "/articles",
              color: "bg-amber-100 text-amber-600",
            },
            {
              icon: MessageCircle,
              label: "المجت��ع",
              path: "/community",
              color: "bg-pink-100 text-pink-600",
            },
            {
              icon: Briefcase,
              label: "الوظائف",
              path: "/jobs",
              color: "bg-indigo-100 text-indigo-600",
            },
          ].map((service, index) => {
            const Icon = service.icon;
            return (
              <Link
                key={index}
                to={service.path}
                className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    service.color,
                  )}
                >
                  <Icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <span className="text-xs md:text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {service.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );

  // محتوى الملف الش��صي
  const renderProfileContent = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">الملف الشخصي</h2>

        {/* صورة المستخدم ومعلومات أساس��ة */}
        <div className="flex items-start gap-6 mb-8">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-24 h-24 rounded-2xl object-cover ring-4 ring-blue-500/20"
            />
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-2xl font-bold text-gray-900">
                {currentUser.name}
              </h3>
              {currentUser.verification === "verified" && (
                <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>موثق</span>
                </div>
              )}
            </div>
            <p className="text-gray-600 mb-1">{currentUser.specialization}</p>
            <p className="text-gray-600 mb-3">{currentUser.clinicName}</p>
            <div className="flex gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {currentUser.location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                عضو منذ {currentUser.joinDate}
              </span>
            </div>
          </div>
        </div>

        {/* معلومات إضافية حسب القسم الفر��ي */}
        {selectedSubSection === "personal" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">معلومات الاتصال</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span>{currentUser.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span>{currentUser.phone}</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">الإحصائيات</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">
                    {currentUser.stats.patientsServed}
                  </p>
                  <p className="text-sm text-gray-600">مريض</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-lg font-bold text-green-600">
                    {currentUser.stats.monthlyRevenue}
                  </p>
                  <p className="text-sm text-gray-600">إ��ر��د شهري</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // محتوى ��لإشعارات - محسن ومدم�� مع صفحة الإشعارات الأصلية
  const renderNotificationsContent = () => {
    // تصفية الإشعارات
    const filteredNotifications = mockNotifications.filter((notification) => {
      switch (notificationFilter) {
        case "unread":
          return !notification.read;
        case "urgent":
          return (
            notification.priority === "urgent" ||
            notification.priority === "high"
          );
        case "messages":
          return notification.category === "message";
        default:
          return true;
      }
    });

    const unreadCount = mockNotifications.filter((n) => !n.read).length;
    const urgentCount = mockNotifications.filter(
      (n) => n.priority === "urgent" || n.priority === "high",
    ).length;
    const messagesCount = mockNotifications.filter(
      (n) => n.category === "message",
    ).length;

    const getNotificationIcon = (category: string, type: string) => {
      switch (category) {
        case "appointment":
          return <Calendar className="w-5 h-5" />;
        case "message":
          return <MessageCircle className="w-5 h-5" />;
        case "inventory":
          return <Package className="w-5 h-5" />;
        case "financial":
          return <CreditCard className="w-5 h-5" />;
        case "achievement":
          return <Award className="w-5 h-5" />;
        case "system":
          return <Activity className="w-5 h-5" />;
        case "patient":
          return <Users className="w-5 h-5" />;
        case "community":
          return <BookOpen className="w-5 h-5" />;
        default:
          return <Bell className="w-5 h-5" />;
      }
    };

    const getNotificationColor = (type: string, priority: string) => {
      if (priority === "urgent")
        return "bg-red-100 text-red-600 border-red-200";
      if (priority === "high")
        return "bg-orange-100 text-orange-600 border-orange-200";

      switch (type) {
        case "success":
          return "bg-green-100 text-green-600 border-green-200";
        case "warning":
          return "bg-yellow-100 text-yellow-600 border-yellow-200";
        case "error":
          return "bg-red-100 text-red-600 border-red-200";
        case "info":
          return "bg-blue-100 text-blue-600 border-blue-200";
        case "celebration":
          return "bg-purple-100 text-purple-600 border-purple-200";
        default:
          return "bg-gray-100 text-gray-600 border-gray-200";
      }
    };

    return (
      <div className="space-y-6">
        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {mockNotifications.length}
                </p>
                <p className="text-sm text-gray-600">إجمالي الإشعارات</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{unreadCount}</p>
                <p className="text-sm text-gray-600">غير مقروءة</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">
                  {urgentCount}
                </p>
                <p className="text-sm text-gray-600">عاجلة</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {messagesCount}
                </p>
                <p className="text-sm text-gray-600">رسائل</p>
              </div>
            </div>
          </div>
        </div>

        {/* المرشحات والإجراءات */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-gray-900">الإشعارات</h2>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                تحديد الكل كمقروء
              </button>
              <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                حذف المقروءة
              </button>
            </div>
          </div>

          {/* مرشحات */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { id: "all", label: "الكل", count: mockNotifications.length },
              { id: "unread", label: "غير مقروءة", count: unreadCount },
              { id: "urgent", label: "عاجلة", count: urgentCount },
              { id: "messages", label: "الرسائل", count: messagesCount },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setNotificationFilter(filter.id as any)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                  notificationFilter === filter.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                )}
              >
                {filter.label}
                {filter.count > 0 && (
                  <span
                    className={cn(
                      "ml-2 px-2 py-0.5 text-xs rounded-full",
                      notificationFilter === filter.id
                        ? "bg-white/20 text-white"
                        : "bg-gray-200 text-gray-600",
                    )}
                  >
                    {filter.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* قائمة الإشعارات */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                  <Bell className="w-8 h-8 text-gray-400" />
                </div>
                <p>لا توجد إشعارات في هذه الفئة</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "relative p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md",
                    notification.read
                      ? "bg-gray-50 border-gray-200"
                      : getNotificationColor(
                          notification.type,
                          notification.priority,
                        ),
                    selectedNotification === notification.id &&
                      "ring-2 ring-blue-500",
                  )}
                  onClick={() =>
                    setSelectedNotification(
                      selectedNotification === notification.id
                        ? null
                        : notification.id,
                    )
                  }
                >
                  <div className="flex items-start gap-4">
                    {/* الأيقونة */}
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                        notification.read ? "bg-gray-200 text-gray-500" : "",
                      )}
                    >
                      {getNotificationIcon(
                        notification.category,
                        notification.type,
                      )}
                    </div>

                    {/* المحتوى */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {notification.title}
                        </h4>
                        {notification.priority === "urgent" && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                            عاجل
                          </span>
                        )}
                        {notification.starred && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                      </div>

                      <p className="text-sm text-gray-600 mb-2">
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                          {notification.timestamp}
                        </p>

                        {notification.actionText && (
                          <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                            {notification.actionText}
                          </button>
                        )}
                      </div>

                      {/* التفاصيل الإضافية عند التوسيع */}
                      {selectedNotification === notification.id && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          {notification.tags && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {notification.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            <button className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700">
                              تحديد ك��قروء
                            </button>
                            <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-md hover:bg-gray-200">
                              إضافة للمفضلة
                            </button>
                            <button className="px-3 py-1.5 bg-red-100 text-red-700 text-xs rounded-md hover:bg-red-200">
                              حذف
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* مؤشر عدم القر��ءة */}
                    {!notification.read && (
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  // مح���وى المفضلة
  const renderFavoritesContent = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">المفضل��</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-rose-50 rounded-xl">
            <Heart className="w-12 h-12 text-rose-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">
              الوظائف المفضلة
            </h3>
            <p className="text-2xl font-bold text-rose-600">
              {currentUser.stats.favoriteJobs}
            </p>
            <Link
              to="/favorites/jobs"
              className="text-sm text-rose-600 hover:underline"
            >
              عرض الكل
            </Link>
          </div>

          <div className="text-center p-6 bg-blue-50 rounded-xl">
            <Package className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">
              المنتجات ��لمفضلة
            </h3>
            <p className="text-2xl font-bold text-blue-600">
              {currentUser.stats.favoriteProducts}
            </p>
            <Link
              to="/favorites/products"
              className="text-sm text-blue-600 hover:underline"
            >
              عرض الكل
            </Link>
          </div>

          <div className="text-center p-6 bg-amber-50 rounded-xl">
            <BookOpen className="w-12 h-12 text-amber-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">
              المقالات المحفوظة
            </h3>
            <p className="text-2xl font-bold text-amber-600">8</p>
            <Link
              to="/favorites/articles"
              className="text-sm text-amber-600 hover:underline"
            >
              عرض الكل
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  const renderClinicMultiContent = () => <AdvancedClinicManagement />;

  // مركز الأمان داخل الإعدادات
  const renderSettingsSecurityContent = () => {
    const current =
      localStorage.getItem("clinic_permissions") || '{"*": ["clinic:read"]}';
    const save = () => {
      try {
        const el = document.getElementById(
          "perm-editor",
        ) as HTMLTextAreaElement | null;
        if (!el) return;
        const parsed = JSON.parse(el.value);
        localStorage.setItem("clinic_permissions", JSON.stringify(parsed));
        alert("تم حفظ صلاحيات الأمان بنجاح");
      } catch (e) {
        alert("صيغة غير صالحة لبيانات الصلاحيات");
      }
    };
    const reset = () => {
      const def = { "*": ["clinic:read"] };
      localStorage.setItem("clinic_permissions", JSON.stringify(def));
      const el = document.getElementById(
        "perm-editor",
      ) as HTMLTextAreaElement | null;
      if (el) el.value = JSON.stringify(def, null, 2);
      alert("تمت استعادة الإعدادات الافتراضية");
    };
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">مركز الأمان</h2>
            <span
              className={
                "text-sm px-2 py-1 rounded-lg " +
                (supabaseEnabled
                  ? "bg-green-50 text-green-700"
                  : "bg-yellow-50 text-yellow-700")
              }
            >
              {supabaseEnabled
                ? "موصل بـ Supabase"
                : "لم يتم توصيل قاعدة البيانات"}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            تحكم في صلاحيات طاقم العيادة. الصيغة: "resource:action" مثل
            clinic:read, clinic:write, clinic:*.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                تحرير الصلاحيات JSON
              </h3>
              <textarea
                id="perm-editor"
                defaultValue={(() => {
                  try {
                    return JSON.stringify(JSON.parse(current), null, 2);
                  } catch {
                    return current;
                  }
                })()}
                className="w-full h-64 p-3 border rounded-xl font-mono text-xs"
                dir="ltr"
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={save}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  حفظ
                </button>
                <button
                  onClick={reset}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg"
                >
                  إفتراضي
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-700 space-y-2">
              <h4 className="font-semibold text-gray-900">موارد مقترحة</h4>
              <ul className="list-disc ms-5">
                <li>clinic:read/write/*</li>
                <li>favorites:read/write</li>
                <li>offers:read/write</li>
                <li>rewards:read/write</li>
                <li>reports:read</li>
                <li>notifications:read</li>
              </ul>
              <p className="text-gray-600">
                لإعطاء جميع الصلاحيات لمستخدم: ["*"]
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // إدارة البيانات والنسخ الاحتياطي
  const renderDatabaseContent = () => {
    const exportBackup = () => {
      const backup = {
        clinics: mockClinics,
        createdAt: new Date().toISOString(),
        version: 1,
      };
      const blob = new Blob([JSON.stringify(backup, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `clinic-backup-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    };
    const importBackup = (file?: File) => {
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(String(reader.result || "{}"));
          localStorage.setItem("clinic_data_backup", JSON.stringify(data));
          alert("تم استيراد النسخة الاحتياطية وحفظها محلياً");
        } catch {
          alert("فشل استيراد الملف، تأكد من الصيغة");
        }
      };
      reader.readAsText(file);
    };
    const schema = {
      Clinic: {
        id: "string",
        name: "string",
        description: "string",
        address: "string",
        coordinates: { lat: "number", lng: "number" },
        phone: "string",
        email: "string",
        workingHours: "Record<day,{start,end,closed?}>",
        services: "string[]",
        specializations: "string[]",
        bookingSettings: {
          allowOnlineBooking: "boolean",
          bookingLink: "string",
          advanceBookingDays: "number",
          slotDuration: "number",
          bufferTime: "number",
        },
        images: "string[]",
        rating: "number",
        reviewsCount: "number",
        verified: "boolean",
        status: "'active'|'inactive'|'maintenance'",
        created: "ISODate",
        lastUpdated: "ISODate",
      },
    };
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Link
              to="/dentist-hub?section=database&sub=backups"
              className="px-3 py-1.5 text-sm rounded-lg border hover:bg-gray-50"
            >
              النسخ الاحتياط��
            </Link>
            <Link
              to="/dentist-hub?section=database&sub=explorer"
              className="px-3 py-1.5 text-sm rounded-lg border hover:bg-gray-50"
            >
              مستكشف البيانات
            </Link>
            <Link
              to="/dentist-hub?section=database&sub=schema"
              className="px-3 py-1.5 text-sm rounded-lg border hover:bg-gray-50"
            >
              بنية الجداول
            </Link>
            <Link
              to="/dentist-hub?section=database&sub=access"
              className="px-3 py-1.5 text-sm rounded-lg border hover:bg-gray-50"
            >
              صلاحيات الوصول
            </Link>
          </div>

          {selectedSubSection === "explorer" && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                مستكشف البيانات
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-right text-gray-600">
                      <th className="p-2">المعرف</th>
                      <th className="p-2">الاسم</th>
                      <th className="p-2">الحالة</th>
                      <th className="p-2">الهاتف</th>
                      <th className="p-2">آخر تحديث</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockClinics.map((c) => (
                      <tr key={c.id} className="border-t">
                        <td className="p-2 font-mono text-xs" dir="ltr">
                          {c.id}
                        </td>
                        <td className="p-2">{c.name}</td>
                        <td className="p-2">{c.status}</td>
                        <td className="p-2" dir="ltr">
                          {c.phone}
                        </td>
                        <td className="p-2">{c.lastUpdated}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {(!selectedSubSection || selectedSubSection === "backups") && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                النسخ الاحتياطي
              </h2>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <button
                  onClick={exportBackup}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                  تصدير نسخة JSON
                </button>
                <label className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer">
                  استيراد نسخة
                  <input
                    type="file"
                    accept="application/json"
                    className="hidden"
                    onChange={(e) =>
                      importBackup(e.target.files?.[0] || undefined)
                    }
                  />
                </label>
                <span className="text-sm text-gray-600">
                  يتم حفظ النسخة المستوردة محلياً فقط
                </span>
              </div>
            </div>
          )}

          {selectedSubSection === "schema" && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                بنية الجداول
              </h2>
              <pre
                className="p-4 bg-gray-50 border rounded-xl text-xs overflow-auto"
                dir="ltr"
              >
                {JSON.stringify(schema, null, 2)}
              </pre>
            </div>
          )}

          {selectedSubSection === "access" && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                صلاحيات الوصول
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                هذه الطبقة لإدارة من يمكنه قراءة/كتا��ة بيانات العيادة. ننصح
                بربط قاعدة بيانات خارجية لمزيد من التحكم.
              </p>
              <div className="text-sm text-gray-700">
                <p>
                  حالة الربط بقاعدة البيانات:{" "}
                  <span
                    className={
                      supabaseEnabled ? "text-green-600" : "text-amber-600"
                    }
                  >
                    {supabaseEnabled ? "مفعل (Supabase)" : "غير مفعل"}
                  </span>
                </p>
                <ul className="list-disc ms-5 mt-2">
                  <li>
                    للإدارة المتقدمة، اربط Supabase/Neon وأدر RLS وسياسات
                    الجداول.
                  </li>
                  <li>التحكم المحلي متاح عبر مركز الأمان ضمن الإعدادات.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // محتوى إدارة العيادة
  const renderClinicContent = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">إدارة العياد��</h2>

        {/* إحصائيات العيادة */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">
              {currentUser.stats.patientsServed}
            </p>
            <p className="text-sm text-gray-600">��جمالي المرضى</p>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-xl">
            <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">
              {currentUser.stats.appointmentsToday}
            </p>
            <p className="text-sm text-gray-600">مواعيد اليوم</p>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-lg font-bold text-purple-600">
              {currentUser.stats.monthlyRevenue}
            </p>
            <p className="text-sm text-gray-600">إيراد الشهر</p>
          </div>

          <div className="text-center p-4 bg-amber-50 rounded-xl">
            <Activity className="w-8 h-8 text-amber-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-amber-600">94%</p>
            <p className="text-sm text-gray-600">كفاء������ العيادة</p>
          </div>
        </div>

        {/* أدوات ��دار�� سريعة */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              icon: Calendar,
              label: "جدولة موعد",
              path: "/appointments/new",
              color: "bg-blue-600",
            },
            {
              icon: Users,
              label: "إضافة مريض",
              path: "/patients/new",
              color: "bg-green-600",
            },
            {
              icon: FileText,
              label: "تقرير جديد",
              path: "/reports/new",
              color: "bg-purple-600",
            },
            {
              icon: Settings,
              label: "إعدادات العيادة",
              path: "/clinic/settings",
              color: "bg-gray-600",
            },
          ].map((tool, index) => {
            const Icon = tool.icon;
            return (
              <Link
                key={index}
                to={tool.path}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-xl text-white hover:opacity-90 transition-opacity",
                  tool.color,
                )}
              >
                <Icon className="w-6 h-6" />
                <span className="text-sm font-medium text-center">
                  {tool.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );

  // محتوى إدارة النظام
  const renderSystemAdminContent = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">إدارة النظام</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {/* الدعم الفني */}
          <Link
            to="/admin/support"
            className="group bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 border border-blue-200/50"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">الدعم الفني</h3>
                <p className="text-sm text-gray-600">إدارة طلبات الدعم</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-600">12</div>
            <div className="text-sm text-gray-600">طلب دعم جديد</div>
          </Link>

          {/* إدارة المنصة */}
          <Link
            to="/admin/platform-admin"
            className="group bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl hover:from-green-100 hover:to-green-200 transition-all duration-300 border border-green-200/50"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">إدارة المنصة</h3>
                <p className="text-sm text-gray-600">إعدادات النظام العامة</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-green-600">98%</div>
            <div className="text-sm text-gray-600">صحة النظام</div>
          </Link>

          {/* إدارة السوق */}
          <Link
            to="/admin/marketplace-admin"
            className="group bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300 border border-purple-200/50"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">إدارة السوق</h3>
                <p className="text-sm text-gray-600">المنتجات والموردين</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-purple-600">1,248</div>
            <div className="text-sm text-gray-600">منتج نشط</div>
          </Link>

          {/* طرق الدفع */}
          <Link
            to="/admin/payment-methods"
            className="group bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl hover:from-orange-100 hover:to-orange-200 transition-all duration-300 border border-orange-200/50"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">طرق الدفع</h3>
                <p className="text-sm text-gray-600">إعدادات المدفوعات</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-orange-600">8</div>
            <div className="text-sm text-gray-600">طريقة دفع</div>
          </Link>

          {/* إعدادات المدير العام */}
          <Link
            to="/admin/super-admin-settings"
            className="group bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl hover:from-red-100 hover:to-red-200 transition-all duration-300 border border-red-200/50"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">
                  إعدادات المد��ر العام
                </h3>
                <p className="text-sm text-gray-600">إعدادات متقدمة</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-red-600">3</div>
            <div className="text-sm text-gray-600">مدير نشط</div>
          </Link>

          {/* تقارير النظام */}
          <Link
            to="/admin/reports"
            className="group bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-2xl hover:from-indigo-100 hover:to-indigo-200 transition-all duration-300 border border-indigo-200/50"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">تقارير النظام</h3>
                <p className="text-sm text-gray-600">تحليلات شاملة</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-indigo-600">45</div>
            <div className="text-sm text-gray-600">تقر��ر متاح</div>
          </Link>
        </div>
      </div>

      {/* قسم إدارة المظهر */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">إدارة المظهر</h2>
            <p className="text-sm text-gray-600">تخصيص ألوان وخطوط النظام</p>
          </div>
        </div>

        <AdminThemeControl userRole={currentUser.role} />
      </div>
    </div>
  );

  // محتوى الإعدادات
  const renderSettingsContent = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">الإعداد��ت</h2>

        <div className="space-y-6">
          {/* إعدادات ال��ساب */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              إع���ادات الحساب
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">كلمة ��لمرور</h4>
                  <p className="text-sm text-gray-600">
                    تغيير كلمة المرور الخاصة بك
                  </p>
                </div>
                <button className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  تغيير
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">التحقق بخطوتين</h4>
                  <p className="text-sm text-gray-600">حماية إضافية لحسابك</p>
                </div>
                <button className="px-4 py-2 text-sm text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  مفعل
                </button>
              </div>
            </div>
          </div>

          {/* إعدادات الإشعارات */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              إعدادات الإشعارات
            </h3>
            <div className="space-y-4">
              {[
                {
                  label: "إشعا��ات المواعيد",
                  description: "تلقي تنبيهات حول المواعيد القادمة",
                  enabled: true,
                },
                {
                  label: "إشعارات النظام",
                  description: "تحديث��ت النظام والأخبار المهم��",
                  enabled: true,
                },
                {
                  label: "إشعارات التسويق",
                  description: "عروض خا��ة ونشرات إخبارية",
                  enabled: false,
                },
              ].map((setting, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {setting.label}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {setting.description}
                    </p>
                  </div>
                  <button
                    className={cn(
                      "w-12 h-6 rounded-full transition-colors relative",
                      setting.enabled ? "bg-blue-600" : "bg-gray-300",
                    )}
                  >
                    <div
                      className={cn(
                        "w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform",
                        setting.enabled ? "translate-x-6" : "translate-x-0.5",
                      )}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* تفضيلات عامة */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              التفضيلات العامة
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">اللغة</h4>
                  <p className="text-sm text-gray-600">اختر لغة الواجهة</p>
                </div>
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="ar">العربية</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">الوضع المظلم</h4>
                  <p className="text-sm text-gray-600">
                    تفعيل الوضع المظلم للواجهة
                  </p>
                </div>
                <button className="w-12 h-6 bg-gray-300 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5" />
                </button>
              </div>
            </div>
          </div>

          {/* إدارة النظام للمديرين */}
          {currentUser.role.includes("admin") && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                إ��ارة النظام
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <Link
                  to="/admin/support"
                  className="flex flex-col items-center gap-3 p-4 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-colors"
                >
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <HelpCircle className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    ا��دعم الفني
                  </span>
                </Link>

                <Link
                  to="/admin/platform-admin"
                  className="flex flex-col items-center gap-3 p-4 bg-green-50 rounded-2xl hover:bg-green-100 transition-colors"
                >
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    إدارة المنصة
                  </span>
                </Link>

                <Link
                  to="/admin/marketplace-admin"
                  className="flex flex-col items-center gap-3 p-4 bg-purple-50 rounded-2xl hover:bg-purple-100 transition-colors"
                >
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    إدارة ��ل��وق
                  </span>
                </Link>

                <Link
                  to="/admin/payment-methods"
                  className="flex flex-col items-center gap-3 p-4 bg-orange-50 rounded-2xl hover:bg-orange-100 transition-colors"
                >
                  <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    طرق الد��ع
                  </span>
                </Link>

                <Link
                  to="/admin/super-admin-settings"
                  className="flex flex-col items-center gap-3 p-4 bg-red-50 rounded-2xl hover:bg-red-100 transition-colors"
                >
                  <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    إعدادات المدير العام
                  </span>
                </Link>

                <Link
                  to="/admin/reports"
                  className="flex flex-col items-center gap-3 p-4 bg-indigo-50 rounded-2xl hover:bg-indigo-100 transition-colors"
                >
                  <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    التقارير
                  </span>
                </Link>
              </div>

              <AdminThemeControl userRole={currentUser.role} />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* هيدر مبسط وفق التعديل */}
      <div className="bg-white border-b border-gray-200 shadow-sm" />

      <div className="flex">
        {/* القائمة الجانبية */}
        {navMode === "side" && (
          <div
            className={cn(
              "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
              isSidebarOpen ? "translate-x-0" : "-translate-x-full",
            )}
          >
            <div className="h-full overflow-y-auto py-6">
              <div className="px-4 mb-6">
                <h2 className="text-lg font-bold text-gray-900">
                  مركز الأطباء
                </h2>
                <p className="text-sm text-gray-600">النظام المتك��مل</p>
              </div>

              <nav className="px-4 space-y-2">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = selectedSection === item.id;
                  const isExpanded = expandedSidebarItems.includes(item.id);
                  const hasChildren = item.children && item.children.length > 0;

                  return (
                    <div key={item.id}>
                      <button
                        onClick={() => {
                          if (hasChildren) {
                            toggleSidebarItem(item.id);
                          } else {
                            navigateToSection(item.id);
                          }
                        }}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                          isActive
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5" />
                          <span>{item.label}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {item.badge && item.badge > 0 && (
                            <span
                              className={cn(
                                "px-2 py-0.5 text-xs rounded-full",
                                isActive
                                  ? "bg-white/20 text-white"
                                  : "bg-red-500 text-white",
                              )}
                            >
                              {item.badge}
                            </span>
                          )}
                          {hasChildren && (
                            <ChevronRight
                              className={cn(
                                "w-4 h-4 transition-transform",
                                isExpanded ? "rotate-90" : "rotate-0",
                              )}
                            />
                          )}
                        </div>
                      </button>

                      {/* عناصر فرعية */}
                      {hasChildren && isExpanded && (
                        <div className="mt-2 ml-6 space-y-1">
                          {item.children!.map((child) => {
                            const ChildIcon = child.icon;
                            const isChildActive =
                              selectedSubSection === child.id.split("-").pop();

                            return (
                              <button
                                key={child.id}
                                onClick={() =>
                                  navigateToSection(
                                    item.id,
                                    child.id.split("-").pop(),
                                  )
                                }
                                className={cn(
                                  "w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors",
                                  isChildActive
                                    ? "bg-blue-100 text-blue-600"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                                )}
                              >
                                <div className="flex items-center gap-3">
                                  <ChildIcon className="w-4 h-4" />
                                  <span>{child.label}</span>
                                </div>
                                {child.badge && child.badge > 0 && (
                                  <span className="px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                                    {child.badge}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* overlay للجوال */}
        {isSidebarOpen && navMode === "side" && (
          <div
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* المحتوى الرئ��سي */}
        <div className="flex-1 min-w-0">
          {navMode === "top" && (
            <div className="sticky top-16 z-20 bg-white/90 backdrop-blur border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 py-2 overflow-x-auto">
                <div className="flex gap-2 w-max">
                  {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = selectedSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => navigateToSection(item.id)}
                        className={cn(
                          "inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap border",
                          isActive
                            ? "bg-blue-50 border-blue-200 text-blue-700"
                            : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100",
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          <main className="p-3 md:p-6">{renderSectionContent()}</main>
        </div>
      </div>

      {navMode === "fab" && (
        <>
          <button
            onClick={() => setFabOpen((v) => !v)}
            className="fixed bottom-24 right-4 z-50 w-14 h-14 rounded-full bg-blue-600 text-white shadow-xl flex items-center justify-center hover:bg-blue-700"
            aria-label="فتح القائمة"
          >
            <Menu className="w-6 h-6" />
          </button>
          {fabOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/40"
              onClick={() => setFabOpen(false)}
            />
          )}
          {fabOpen && (
            <div className="fixed bottom-40 right-4 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 w-72 max-h-[60vh] overflow-y-auto p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-900">
                  القائمة
                </span>
                <button
                  onClick={() => setFabOpen(false)}
                  className="px-2 py-1 text-xs bg-gray-100 rounded-md"
                >
                  إغلاق
                </button>
              </div>
              <div className="space-y-1">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        navigateToSection(item.id);
                        setFabOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-2 text-gray-800">
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{item.label}</span>
                      </div>
                      {item.badge && item.badge > 0 && (
                        <span className="px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
      {(navMode === "bottom" || navMode === "fab") && (
        <FinalUnifiedBottomNav userRole="patient" />
      )}
    </div>
  );
}
