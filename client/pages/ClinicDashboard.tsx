import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  Users,
  Stethoscope,
  TrendingUp,
  Clock,
  Bell,
  MessageSquare,
  Plus,
  ChevronRight,
  Activity,
  Package,
  AlertTriangle,
  CheckCircle,
  Eye,
  Settings,
  Phone,
  Search,
  Filter,
  MoreHorizontal,
  Building2,
  ChevronDown,
  FlaskConical,
  Timer,
  RotateCcw,
  Send,
  FileText,
  User,
  UserPlus,
  Crown,
  ClipboardList,
  Target,
  ArrowRight,
  Star,
  Zap,
  CreditCard,
  Truck,
  BarChart3,
  Home,
  ShoppingCart,
  DollarSign,
  PieChart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import BookingNotifications from "@/components/BookingNotifications";

// Mock clinic data
const mockClinicData = {
  name: "عيادة النجمة لطب الأسنان",
  doctor: "د. أحمد محمد علي",
  address: "شارع الكندي، بغداد",
  phone: "+964 770 123 4567",
  email: "info@najma-dental.com",
  stats: {
    todayAppointments: 12,
    totalPatients: 345,
    monthlyRevenue: 15750000, // IQD
    pendingTreatments: 8,
    completedToday: 5,
    staff: 6,
    inventory: 89,
    reports: 23,
  },
};

const mockAppointments = [
  {
    id: "1",
    patientName: "سارة أحمد",
    time: "09:00",
    treatment: "فحص دوري",
    status: "confirmed",
    phone: "07701234567",
  },
  {
    id: "2",
    patientName: "محمد علي",
    time: "10:30",
    treatment: "حشو أسنان",
    status: "in_progress",
    phone: "07709876543",
  },
  {
    id: "3",
    patientName: "فاطمة حسن",
    time: "14:00",
    treatment: "تنظيف أسنان",
    status: "pending",
    phone: "07701111222",
  },
];

export default function ClinicDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  const navigationItems = [
    {
      id: "overview",
      label: "لوحة التحكم",
      icon: Home,
      path: "/clinic",
      description: "نظرة عامة",
    },
    {
      id: "reservations",
      label: "الحجوزات",
      icon: Calendar,
      path: "/clinic/reservations",
      description: "إدارة المواعيد",
    },
    {
      id: "patients",
      label: "المرضى",
      icon: Users,
      path: "/clinic/patients",
      description: "ملفات المرضى",
    },
    {
      id: "treatments",
      label: "العلاجات",
      icon: Stethoscope,
      path: "/clinic/treatments",
      description: "خطط العلاج",
    },
    {
      id: "staff",
      label: "الطاقم",
      icon: User,
      path: "/clinic/staff",
      description: "إدارة الموظفين",
    },
    {
      id: "accounts",
      label: "الحسابات",
      icon: DollarSign,
      path: "/clinic/accounts",
      description: "الشؤون المالية",
    },
    {
      id: "sales",
      label: "المبيعات",
      icon: TrendingUp,
      path: "/clinic/sales",
      description: "تقارير المبيعات",
    },
    {
      id: "purchases",
      label: "المشتريات",
      icon: ShoppingCart,
      path: "/clinic/purchases",
      description: "طلبات الشراء",
    },
    {
      id: "inventory",
      label: "المخزون",
      icon: Package,
      path: "/clinic/inventory",
      description: "إدارة المخزون",
    },
    {
      id: "equipment",
      label: "الأجهزة",
      icon: Settings,
      path: "/clinic/equipment",
      description: "المعدات الطبية",
    },
    {
      id: "reports",
      label: "التقارير",
      icon: BarChart3,
      path: "/clinic/reports",
      description: "تقارير شاملة",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "مؤكد";
      case "in_progress":
        return "جاري";
      case "pending":
        return "معلق";
      case "cancelled":
        return "ملغ��";
      default:
        return "غير محدد";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ar-IQ", {
      style: "currency",
      currency: "IQD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {mockClinicData.name}
                </h1>
                <p className="text-gray-600">{mockClinicData.doctor}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button size="sm" variant="outline">
                <Settings className="w-4 h-4 ml-1" />
                الإعدادات
              </Button>
              <Button size="sm">
                <Plus className="w-4 h-4 ml-1" />
                جديد
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex overflow-x-auto scrollbar-none">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                    isActive
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">مواعيد اليوم</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockClinicData.stats.todayAppointments}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي المرضى</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockClinicData.stats.totalPatients}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">الإيرادات الشهرية</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(mockClinicData.stats.monthlyRevenue)}
                </p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">العلاجات المعلقة</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockClinicData.stats.pendingTreatments}
                </p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Booking Requests - Compact and Centered */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
          <h3 className="text-base font-semibold text-gray-900 mb-3 text-center">طلبات الحجز</h3>
          <div className="max-w-3xl mx-auto">
            <BookingNotifications />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            إجراءات سريعة
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 place-items-center">
            {[
              {
                icon: Calendar,
                label: "حجز موعد",
                href: "/clinic/reservations",
                color: "blue",
              },
              {
                icon: UserPlus,
                label: "مريض جديد",
                href: "/clinic/patients",
                color: "green",
              },
              {
                icon: Stethoscope,
                label: "بدء علاج",
                href: "/clinic/treatments",
                color: "purple",
              },
              {
                icon: FileText,
                label: "تقرير جديد",
                href: "/clinic/reports",
                color: "orange",
              },
              {
                icon: Package,
                label: "طلب مخزون",
                href: "/clinic/inventory",
                color: "cyan",
              },
              {
                icon: CreditCard,
                label: "دفعة جديدة",
                href: "/clinic/accounts",
                color: "indigo",
              },
            ].map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={index}
                  to={action.href}
                  className={cn(
                    "flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all hover:shadow-md w-full max-w-[140px]",
                    `border-${action.color}-200 hover:border-${action.color}-300 bg-${action.color}-50 hover:bg-${action.color}-100`,
                  )}
                >
                  <Icon className={`w-6 h-6 text-${action.color}-600`} />
                  <span
                    className={`text-sm font-medium text-${action.color}-700`}
                  >
                    {action.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-8">
          {/* Today's Appointments */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                مواعيد اليوم
              </h3>
              <Link
                to="/clinic/reservations"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                عرض الكل
              </Link>
            </div>
            <div className="space-y-4">
              {mockAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">
                        {appointment.time}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {appointment.patientName}
                      </div>
                      <div className="text-sm text-gray-600">
                        {appointment.treatment}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={cn(
                        "text-xs",
                        getStatusColor(appointment.status),
                      )}
                    >
                      {getStatusText(appointment.status)}
                    </Badge>
                    <Button size="sm" variant="ghost">
                      <Phone className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                النشاطات الأخيرة
              </h3>
              <Link
                to="/clinic/reports"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                عرض التقارير
              </Link>
            </div>
            <div className="space-y-4">
              {[
                {
                  action: "تم إكمال علاج",
                  details: "تنظيف أسنان - سارة أحمد",
                  time: "منذ 30 دقيقة",
                  icon: CheckCircle,
                  color: "green",
                },
                {
                  action: "حجز موعد جديد",
                  details: "فحص دوري - محمد علي",
                  time: "منذ ساعة",
                  icon: Calendar,
                  color: "blue",
                },
                {
                  action: "دفعة مستلمة",
                  details: "IQD 150,000 - فاطمة حسن",
                  time: "منذ ساعتين",
                  icon: CreditCard,
                  color: "purple",
                },
                {
                  action: "طلب مخزون",
                  details: "مواد حشو - كمية 10",
                  time: "أمس",
                  icon: Package,
                  color: "orange",
                },
              ].map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-center gap-4">
                    <div
                      className={`w-8 h-8 bg-${activity.color}-100 rounded-lg flex items-center justify-center`}
                    >
                      <Icon className={`w-4 h-4 text-${activity.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {activity.action}
                      </div>
                      <div className="text-sm text-gray-600">
                        {activity.details}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">{activity.time}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
