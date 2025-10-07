import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Plus,
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Users,
  TrendingUp,
  Activity,
  Star,
  Badge,
  Clock,
  Heart,
  FileText,
  Download,
  Upload,
  Settings,
  MoreHorizontal,
  CheckCircle,
  AlertTriangle,
  Timer,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { sharedClinicData, Patient } from "@/services/sharedClinicData";
import { adaptPatientsToLegacy, LegacyPatient } from "@/services/clinicDataAdapter";

const patients = [
  {
    id: 1,
    name: "وليد جني",
    phone: "07801234567",
    email: "willie.jennie@gmail.com",
    address: "بغداد - الكرادة",
    registered: "12 آذار 2021",
    lastVisit: "05 حزيران 2021",
    treatment: "تنظيف وتبييض الأسنان",
    avatar: "و.ج",
    color: "bg-purple-100 text-purple-700",
    age: 28,
    gender: "ذكر",
    status: "نشط",
    visits: 12,
    nextAppointment: "غدا 10:00 ص",
    medicalHistory: ["حساسية البنسلين", "ضغط الدم"],
    priority: "عادي",
  },
  {
    id: 2,
    name: "ميشيل ريفرز",
    phone: "07807654321",
    email: "michelle.rivers@gmail.com",
    address: "البصرة - العشار",
    registered: "12 آذار 2021",
    lastVisit: "03 أيار 2021",
    treatment: "تنظيف وقشرة الأسنان",
    avatar: "م.ر",
    color: "bg-blue-100 text-blue-700",
    age: 35,
    gender: "أنثى",
    status: "نشط",
    visits: 8,
    nextAppointment: "الأسبوع القادم",
    medicalHistory: ["داء السكري"],
    priority: "عاجل",
  },
  {
    id: 3,
    name: "تيم جينينغز",
    phone: "07809876543",
    email: "tim.jennings@gmail.com",
    address: "أربيل - عنكاوة",
    registered: "10 آذار 2021",
    lastVisit: "17 تشرين الأول 2021",
    treatment: "تنظيف الأسنان",
    avatar: "ت.ج",
    color: "bg-green-100 text-green-700",
    age: 42,
    gender: "ذكر",
    status: "غير نشط",
    visits: 5,
    nextAppointment: "غير محدد",
    medicalHistory: [],
    priority: "عادي",
  },
  {
    id: 4,
    name: "سارة أحمد",
    phone: "07801112223",
    email: "sara.ahmed@gmail.com",
    address: "النجف - المركز",
    registered: "20 نيسان 2021",
    lastVisit: "15 كانون الأول 2021",
    treatment: "زراعة الأسنان",
    avatar: "س.أ",
    color: "bg-pink-100 text-pink-700",
    age: 29,
    gender: "أنثى",
    status: "نشط",
    visits: 15,
    nextAppointment: "بعد أسبوعين",
    medicalHistory: ["حساسية اللاتكس"],
    priority: "عاجل",
  },
  {
    id: 5,
    name: "أحمد علي",
    phone: "07805556667",
    email: "ahmed.ali@gmail.com",
    address: "كربلاء - الحر",
    registered: "05 أيار 2021",
    lastVisit: "22 تشرين الثاني 2021",
    treatment: "تقويم الأسنان",
    avatar: "أ.ع",
    color: "bg-indigo-100 text-indigo-700",
    age: 22,
    gender: "ذكر",
    status: "نشط",
    visits: 20,
    nextAppointment: "الأسبوع القادم",
    medicalHistory: [],
    priority: "عادي",
  },
  {
    id: 6,
    name: "فاطمة حسن",
    phone: "07803334445",
    email: "fatima.hassan@gmail.com",
    address: "الموصل - الحدباء",
    registered: "18 حزيران 2021",
    lastVisit: "30 كانون الأول 2021",
    treatment: "حشو تجميلي",
    avatar: "ف.ح",
    color: "bg-yellow-100 text-yellow-700",
    age: 31,
    gender: "أنثى",
    status: "نشط",
    visits: 7,
    nextAppointment: "غدا 2:00 م",
    medicalHistory: ["ارتفاع ضغط الدم"],
    priority: "عادي",
  },
];

const Patients = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [patientsData, setPatientsData] = useState<LegacyPatient[]>(patients);

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const sharedPatients = await sharedClinicData.getPatients();
        if (sharedPatients && sharedPatients.length > 0) {
          const legacyFormat = adaptPatientsToLegacy(sharedPatients);
          setPatientsData(legacyFormat);
        }
      } catch (error) {
        console.error("Failed to load shared patients:", error);
      }
    };
    loadPatients();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "نشط":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3" />
            نشط
          </span>
        );
      case "غير نشط":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            <Timer className="w-3 h-3" />
            غير نشط
          </span>
        );
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "عاجل":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-red-100 text-red-700">
            <AlertTriangle className="w-3 h-3" />
            عاجل
          </span>
        );
      case "عادي":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-700">
            <Badge className="w-3 h-3" />
            عادي
          </span>
        );
      default:
        return null;
    }
  };

  const filteredPatients = patientsData.filter((patient) => {
    const matchesSearch =
      patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone?.includes(searchTerm);
    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "active" && patient.status === "نشط") ||
      (selectedFilter === "inactive" && patient.status === "غير نشط") ||
      (selectedFilter === "urgent" && patient.priority === "عاجل");
    return matchesSearch && matchesFilter;
  });

  const patientsStats = {
    total: patientsData.length,
    active: patientsData.filter((p) => p.status === "نشط").length,
    inactive: patientsData.filter((p) => p.status === "غير نشط").length,
    urgent: patientsData.filter((p) => p.priority === "عاجل").length,
    newThisMonth: 3,
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">إدارة المرضى</h1>
              <p className="text-emerald-100 text-lg mb-4">
                مجموعة شاملة لإدارة معلومات المرضى والملفات الطبية
              </p>
              <p className="text-emerald-100">
                لديك {patientsStats.total} مريض، {patientsStats.active} نشط و{" "}
                {patientsStats.urgent} عاجل
              </p>
            </div>
            <div className="flex gap-3">
              <button className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl text-white font-medium hover:bg-white/30 transition-all flex items-center gap-2">
                <Download className="w-5 h-5" />
                تصدير البيانات
              </button>
              <button className="bg-white text-emerald-600 px-6 py-3 rounded-xl font-medium hover:bg-emerald-50 transition-all flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                مريض جديد
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid - Bento Style */}
      <div className="grid grid-cols-12 gap-6">
        {/* Main Stats */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">إحصائيات المرضى</h3>
            <Users className="w-6 h-6 text-gray-400" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-3xl border border-blue-100">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-600 mb-2">
                {patientsStats.total}
              </p>
              <p className="text-sm font-medium text-blue-700">إجمالي المرضى</p>
            </div>

            <div className="text-center p-6 bg-green-50 rounded-3xl border border-green-100">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600 mb-2">
                {patientsStats.active}
              </p>
              <p className="text-sm font-medium text-green-700">مرضى نشطين</p>
            </div>

            <div className="text-center p-6 bg-red-50 rounded-3xl border border-red-100">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-3xl font-bold text-red-600 mb-2">
                {patientsStats.urgent}
              </p>
              <p className="text-sm font-medium text-red-700">حالات عاجلة</p>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-3xl border border-purple-100">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-purple-600 mb-2">
                {patientsStats.newThisMonth}
              </p>
              <p className="text-sm font-medium text-purple-700">
                جدد هذا الشهر
              </p>
            </div>
          </div>

          {/* Mini Chart */}
          <div className="mt-8">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              نمو المرضى الشهري
            </h4>
            <div className="h-32 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl flex items-end justify-center p-4">
              <div className="flex items-end gap-2 h-full w-full">
                {[60, 75, 45, 90, 70, 85, 95, 100, 80, 90, 75, 85].map(
                  (height, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-t from-blue-600 to-purple-600 rounded-t-lg flex-1 transition-all duration-300 hover:from-blue-700 hover:to-purple-700"
                      style={{ height: `${height}%` }}
                    ></div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            إجراءات سريعة
          </h3>
          <div className="space-y-4">
            <button className="w-full flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl hover:bg-emerald-100 transition-all group">
              <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="font-medium text-emerald-800">مريض جديد</p>
                <p className="text-sm text-emerald-600">تسجيل مريض جديد</p>
              </div>
            </button>

            <button className="w-full flex items-center gap-4 p-4 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-all group">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="font-medium text-blue-800">استيراد بيانات</p>
                <p className="text-sm text-blue-600">استيراد قائمة المرضى</p>
              </div>
            </button>

            <button className="w-full flex items-center gap-4 p-4 bg-purple-50 rounded-2xl hover:bg-purple-100 transition-all group">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="font-medium text-purple-800">التقارير الطبية</p>
                <p className="text-sm text-purple-600">إنشاء تقارير شاملة</p>
              </div>
            </button>

            <button className="w-full flex items-center gap-4 p-4 bg-orange-50 rounded-2xl hover:bg-orange-100 transition-all group">
              <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="font-medium text-orange-800">إعدادات المرضى</p>
                <p className="text-sm text-orange-600">تخصيص الإعدادات</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="البحث عن مريض..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-full sm:w-64"
              />
            </div>

            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">جميع المرضى</option>
              <option value="active">مرضى نشطين</option>
              <option value="inactive">مرضى غير نشطين</option>
              <option value="urgent">حالات عاجلة</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-3 rounded-2xl transition-all",
                viewMode === "grid"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200",
              )}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-3 rounded-2xl transition-all",
                viewMode === "list"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200",
              )}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Patients Grid */}
      <div
        className={cn(
          "grid gap-6",
          viewMode === "grid"
            ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
            : "grid-cols-1",
        )}
      >
        {filteredPatients.map((patient) => (
          <div
            key={patient.id}
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center font-semibold text-lg",
                    patient.color,
                  )}
                >
                  {patient.avatar}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors text-lg">
                    {patient.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {patient.age} سنة - {patient.gender}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusBadge(patient.status)}
                    {getPriorityBadge(patient.priority)}
                  </div>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{patient.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{patient.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{patient.address}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>آخر زيارة: {patient.lastVisit}</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">آخر علاج</h4>
              <p className="text-sm text-gray-600 mb-3">{patient.treatment}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">عدد الزيارات</span>
                <span className="font-semibold text-emerald-600">
                  {patient.visits}
                </span>
              </div>
            </div>

            {patient.nextAppointment !== "غير محدد" && (
              <div className="bg-blue-50 rounded-2xl p-3 mb-4 border border-blue-100">
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <Clock className="w-4 h-4" />
                  <span>الموعد القادم: {patient.nextAppointment}</span>
                </div>
              </div>
            )}

            {patient.medicalHistory.length > 0 && (
              <div className="bg-yellow-50 rounded-2xl p-3 mb-4 border border-yellow-100">
                <h5 className="font-medium text-yellow-800 mb-2 text-sm">
                  التاريخ الطبي
                </h5>
                <div className="flex flex-wrap gap-1">
                  {patient.medicalHistory.map((condition, index) => (
                    <span
                      key={index}
                      className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-lg"
                    >
                      {condition}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex gap-2">
                <Link
                  to={`/admin/patients/${patient.id}`}
                  className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-xl transition-all"
                >
                  <Eye className="w-4 h-4" />
                </Link>
                <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-xl transition-all">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-100 rounded-xl transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Heart className="w-4 h-4 text-red-500" />
                <span>{patient.visits} زيارة</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Patients;
