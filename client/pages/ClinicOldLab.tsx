import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Package,
  Plus,
  Search,
  Filter,
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertTriangle,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  User,
  FileText,
  Eye,
  Edit,
  Star,
  Building2,
  Truck,
  CreditCard,
  Timer,
  Target,
  Activity,
  TrendingUp,
  Award,
  Settings,
  Download,
  Printer,
  Mail,
  MoreHorizontal,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  sharedClinicData,
  Laboratory,
  LabOrder,
  TreatmentPlan,
} from "@/services/sharedClinicData";
import { LabOrdersSection, LaboratoriesSection, LabStatsSection } from "@/components/LabSections";
import EnhancedAIAssistantIntegration from "@/components/EnhancedAIAssistantIntegration";

const ClinicOldLab: React.FC = () => {
  const navigate = useNavigate();
  const [labOrders, setLabOrders] = useState<LabOrder[]>([]);
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedLab, setSelectedLab] = useState<string>("all");
  const [tab, setTab] = useState<"orders" | "labs" | "stats">("orders");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [orders, labs, plans] = await Promise.all([
        sharedClinicData.getLabOrders(),
        sharedClinicData.getLaboratories(),
        sharedClinicData.getTreatmentPlans(),
      ]);
      setLabOrders(orders);
      setLaboratories(labs);
      setTreatmentPlans(plans);
    } catch (error) {
      console.error("Failed to load lab data:", error);
    }
  };

  // Filter orders based on search, status, and lab
  const filteredOrders = labOrders.filter((order) => {
    const matchesSearch =
      order.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.laboratoryName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;
    const matchesLab =
      selectedLab === "all" || order.laboratoryId === selectedLab;

    return matchesSearch && matchesStatus && matchesLab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ordered":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-orange-100 text-orange-800";
      case "ready":
        return "bg-green-100 text-green-800";
      case "delivered":
        return "bg-purple-100 text-purple-800";
      case "installed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ordered":
        return "مطلوب";
      case "in_progress":
        return "قيد التحضير";
      case "ready":
        return "جاهز";
      case "delivered":
        return "مستلم";
      case "installed":
        return "مركب";
      case "cancelled":
        return "ملغي";
      default:
        return "غير محدد";
    }
  };

  const getOrderTypeText = (type: string) => {
    switch (type) {
      case "prosthetics":
        return "أطقم أسنان";
      case "crown":
        return "تيجان";
      case "bridge":
        return "جسور";
      case "implant":
        return "زراعة";
      case "orthodontics":
        return "تقويم";
      default:
        return "أخرى";
    }
  };

  const isOverdue = (order: LabOrder) => {
    const expectedDate = new Date(order.expectedDeliveryDate);
    const today = new Date();
    return (
      expectedDate < today &&
      (order.status === "ordered" || order.status === "in_progress")
    );
  };

  // Statistics
  const stats = {
    total: labOrders.length,
    pending: labOrders.filter(
      (o) => o.status === "ordered" || o.status === "in_progress",
    ).length,
    ready: labOrders.filter((o) => o.status === "ready").length,
    overdue: labOrders.filter((o) => isOverdue(o)).length,
    thisMonth: labOrders.filter(
      (o) => new Date(o.orderDate).getMonth() === new Date().getMonth(),
    ).length,
    totalCost: labOrders.reduce((sum, o) => sum + o.cost, 0),
    unpaid: labOrders.filter((o) => !o.isPaid).length,
  };

  const tabs = [
    { id: "orders" as const, label: "الطلبات", icon: Package },
    { id: "labs" as const, label: "المختبرات", icon: Building2 },
    { id: "stats" as const, label: "الإحصائيات", icon: BarChart3 },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            to="/clinic_old"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">إدارة المختبر</h1>
            <p className="text-gray-600">إدارة شاملة لطلبات المختبر والتركيبات</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            تصدير
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="w-4 h-4 mr-2" />
            طباعة
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            طلب جديد
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border rounded-xl p-2">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap",
                  active
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-50 hover:bg-gray-100 text-gray-700 border",
                )}
              >
                <Icon className="w-4 h-4" /> {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        {tab === "orders" && <LabOrdersSection 
          labOrders={filteredOrders} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          selectedLab={selectedLab}
          setSelectedLab={setSelectedLab}
          laboratories={laboratories}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
          getOrderTypeText={getOrderTypeText}
          isOverdue={isOverdue}
        />}
        {tab === "labs" && <LaboratoriesSection laboratories={laboratories} />}
        {tab === "stats" && <LabStatsSection stats={stats} />}
      </div>
      
      {/* AI Assistant Integration for Old Clinic System */}
      <EnhancedAIAssistantIntegration systemType="old" currentPage="lab" />
    </div>
  );
};

export default ClinicOldLab;