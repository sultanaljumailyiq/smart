import React, { useState, useEffect } from "react";
import { ArrowLeft, Bell, Search, Settings, Plus, CheckCircle, AlertTriangle, Info, AlertCircle, Calendar, Package, Users, Clock, MessageSquare, X, Star, Eye, EyeOff, Trash2, Zap, CheckCircle2, Sparkles, Flame, DollarSign, User, Send, Mail, MailOpen, MessageCircle, Phone, Briefcase, Building, UserCheck, HeadphonesIcon, Truck, ClipboardList, Wifi, Reply, Forward, Paperclip, Smile, Image as ImageIcon, Video, Mic, MapPin, Stethoscope, Crown, Heart, ThumbsUp, Bookmark, Share2, Download, Filter, MoreHorizontal, ChevronDown, ChevronUp, CircleDot, Archive, FileText, Upload } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useNavigation } from "@/contexts/NavigationContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
interface Notification {
  id: string;
  type: "success" | "warning" | "info" | "error" | "urgent" | "celebration";
  category: "appointment" | "inventory" | "patient" | "financial" | "system" | "message" | "community" | "marketplace" | "achievement" | "reminder";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  starred: boolean;
  priority: "low" | "medium" | "high" | "urgent";
  actionUrl?: string;
  actionText?: string;
  avatar?: string;
  reactions?: number;
  attachments?: string[];
  tags?: string[];
  sourceSection?: string;
}
interface Message {
  id: string;
  type: "suppliers" | "support" | "staff" | "community" | "jobs";
  senderName: string;
  senderRole?: string;
  senderAvatar?: string;
  subject: string;
  message: string;
  timestamp: Date;
  read: boolean;
  starred: boolean;
  priority: "low" | "medium" | "high" | "urgent";
  attachments?: string[];
  isOnline?: boolean;
  unreadCount?: number;
  lastMessage?: string;
  sourceSection?: string;
}
interface Reminder {
  id: string;
  title: string;
  description: string;
  assigneeId: string; // 'owner' | 'me' | user id
  assigneeName: string;
  priority: "low" | "medium" | "high" | "urgent";
  dueAt: string; // ISO datetime
  createdAt: Date;
  completed: boolean;
}
interface ActivitySummary {
  section: string;
  label: string;
  icon: React.ComponentType<any>;
  count: number;
  color: string;
  items: (Notification | Message)[];
}

// بيانات شاملة للإشعارات من ج��يع الأقسام
const mockNotifications: Notification[] = [{
  id: "notif1",
  type: "urgent",
  category: "appointment",
  title: "موعد عاجل خلال 5 دقائق!",
  message: "لديك موعد مع د. أحمد العراقي - جراحة زراعة أسنان",
  timestamp: new Date(Date.now() - 2 * 60 * 1000),
  read: false,
  starred: true,
  priority: "urgent",
  actionUrl: "/appointments/123",
  actionText: "انضم الآن",
  avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=40&h=40&fit=crop&crop=face",
  reactions: 3,
  tags: ["عاجل", "زراعة"],
  sourceSection: "clinic"
}, {
  id: "notif2",
  type: "celebration",
  category: "achievement",
  title: "🎉 تهانينا! وصلت لـ 1000 متابع",
  message: "حسابك في مجتمع أطباء الأسنان حقق إنجازاً رائعاً",
  timestamp: new Date(Date.now() - 15 * 60 * 1000),
  read: false,
  starred: false,
  priority: "medium",
  actionUrl: "/profile",
  actionText: "عرض الملف",
  reactions: 25,
  tags: ["إنجاز", "مجتمع"],
  sourceSection: "community"
}, {
  id: "notif3",
  type: "error",
  category: "inventory",
  title: "نفاد المخزون - تحذير حرج",
  message: "انتهت كمية مادة التخدير الموضعي (Lidocaine) تماماً",
  timestamp: new Date(Date.now() - 30 * 60 * 1000),
  read: false,
  starred: true,
  priority: "high",
  actionUrl: "/inventory/reorder",
  actionText: "اطلب الآن",
  tags: ["مخزون", "حرج"],
  sourceSection: "marketplace"
}, {
  id: "notif4",
  type: "success",
  category: "financial",
  title: "تم استلام دفعة جديدة",
  message: "تم استلام دفعة بمبلغ 15,000 ريال من التأمين الطبي",
  timestamp: new Date(Date.now() - 60 * 60 * 1000),
  read: true,
  starred: false,
  priority: "medium",
  actionUrl: "/financial/transactions",
  actionText: "عرض التفاصيل",
  tags: ["دفعة", "تأمين"],
  sourceSection: "clinic"
}, {
  id: "notif5",
  type: "info",
  category: "community",
  title: "دورة تدريبية جديدة",
  message: "تم إضافة دورة 'تقنيات زراعة الأسنان المتقدمة' للمجتمع",
  timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  read: false,
  starred: false,
  priority: "low",
  actionUrl: "/community/courses/123",
  actionText: "التسجيل",
  tags: ["دورة", "تدريب"],
  sourceSection: "community"
}, {
  id: "notif6",
  type: "warning",
  category: "system",
  title: "تحديث النظام المطلوب",
  message: "يرجى تحديث النظام للإصدار الأحدث لضمان الأمان والاستقرار",
  timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
  read: true,
  starred: false,
  priority: "medium",
  actionUrl: "/settings/updates",
  actionText: "تحديث الآن",
  tags: ["تحديث", "نظام"],
  sourceSection: "system"
}];
const mockMessages: Message[] = [{
  id: "msg1",
  type: "suppliers",
  senderName: "شركة المعدات الطبية المتقدمة",
  senderRole: "مدير المبيعات",
  senderAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
  subject: "عرض خاص على أجهزة التعقيم",
  message: "لدينا عرض حصري على أجهزة التعقيم الألمانية بخصم 25% لمدة ��حدودة",
  timestamp: new Date(Date.now() - 30 * 60 * 1000),
  read: false,
  starred: false,
  priority: "medium",
  attachments: ["catalog.pdf", "price-list.xlsx"],
  isOnline: true,
  unreadCount: 3,
  lastMessage: "شكراً لاهتمامكم، يمكننا ترتيب موعد للعرض التوضيحي",
  sourceSection: "marketplace"
}, {
  id: "msg2",
  type: "support",
  senderName: "فريق الدعم الفني",
  senderRole: "أخصائي دعم أول",
  senderAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face",
  subject: "حل مشكلة الاتصال بقاعدة البيانات",
  message: "تم حل مشكلة انقطاع الاتصال بقاعدة البيانات، النظام يعمل بكامل كفاءته الآن",
  timestamp: new Date(Date.now() - 60 * 60 * 1000),
  read: true,
  starred: true,
  priority: "high",
  isOnline: true,
  unreadCount: 0,
  lastMessage: "إذا واجهت أي مشاكل أخرى، لا تتردد في الاتصال بنا",
  sourceSection: "system"
}, {
  id: "msg3",
  type: "staff",
  senderName: "د. سارة أحمد",
  senderRole: "طبيبة أسنان - قسم التجميل",
  senderAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=40&h=40&fit=crop&crop=face",
  subject: "تقرير حالات اليوم",
  message: "تم الانتهاء من جميع حالات اليوم بنجاح، 8 حالات تجميل و 12 حالة علاج",
  timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  read: false,
  starred: false,
  priority: "medium",
  isOnline: false,
  unreadCount: 2,
  lastMessage: "أحتاج لمناقشة حالة المريض أحمد محمد غداً",
  sourceSection: "clinic"
}, {
  id: "msg4",
  type: "community",
  senderName: "د. محمد العراقي",
  senderRole: "أخصائي جراحة الفم والفكين",
  senderAvatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=40&h=40&fit=crop&crop=face",
  subject: "استشارة في حالة معقدة",
  message: "أحتاج رأيكم في حالة زراعة أسنان معقدة، هل يمكن ترتيب مكالمة فيديو؟",
  timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
  read: false,
  starred: true,
  priority: "high",
  isOnline: true,
  unreadCount: 5,
  lastMessage: "شاركت صور الأشعة في المجموعة الخاصة",
  sourceSection: "community"
}, {
  id: "msg5",
  type: "jobs",
  senderName: "مركز الأسنان الذهبي",
  senderRole: "مدير الموارد البشرية",
  senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
  subject: "دعوة لمقابلة عمل",
  message: "نود دعوتك لمقابلة عمل لوظيفة طبيب أسنان عام، يوم الأحد القادم الساعة 10 صباحاً",
  timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
  read: true,
  starred: false,
  priority: "high",
  isOnline: false,
  unreadCount: 0,
  lastMessage: "يرجى تأكيد الحضور والاطلاع على الوثائق المطلوبة",
  sourceSection: "jobs"
}];

// المستخدمون المتاحون
const mockUsers = [{
  id: "1",
  name: "د. أحمد العراقي",
  role: "طبيب أسنان",
  avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=40&h=40&fit=crop&crop=face",
  online: true,
  department: "جراحة الفم",
  specialization: "زراعة الأسنان"
}, {
  id: "2",
  name: "د. سارة محمد",
  role: "أخصائية تجميل",
  avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=40&h=40&fit=crop&crop=face",
  online: false,
  department: "طب الأسنان التجميلي",
  specialization: "تجميل وتبييض"
}, {
  id: "3",
  name: "م. علي حسن",
  role: "فني أشعة",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
  online: true,
  department: "الأشعة والتصوير",
  specialization: "تصوير طبي"
}, {
  id: "4",
  name: "أ. فاطمة أحمد",
  role: "مديرة العيادة",
  avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face",
  online: true,
  department: "الإدارة",
  specialization: "إدارة العيادة"
}, {
  id: "5",
  name: "شركة المعدات الطبية",
  role: "مورد",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
  online: false,
  department: "الموردين",
  specialization: "معدات طبية"
}];
export default function UnifiedNotifications() {
  const {
    state: navState,
    goBack
  } = useNavigation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [reminders, setReminders] = useState<Reminder[]>([{
    id: "rem1",
    title: "متابعة طلب مختبر",
    description: "التأكد من استلام النتائج من مختبر الأسنان",
    assigneeId: "owner",
    assigneeName: "مالك العيادة",
    priority: "high",
    dueAt: new Date().toISOString().slice(0, 16),
    createdAt: new Date(),
    completed: false
  }]);
  const [newReminder, setNewReminder] = useState<{
    title: string;
    description: string;
    assigneeId: string;
    priority: "low" | "medium" | "high" | "urgent";
    dueAt: string;
  }>({
    title: "",
    description: "",
    assigneeId: "owner",
    priority: "medium",
    dueAt: new Date().toISOString().slice(0, 16)
  });
  const [activeTab, setActiveTab] = useState<"reminders" | "notifications" | "messages">("reminders");
  const [filter, setFilter] = useState<"all" | "unread" | "starred" | "urgent">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"card" | "compact">("compact");

  // إعدادات الرسالة الجديدة
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [newMessageData, setNewMessageData] = useState({
    recipients: [] as typeof mockUsers,
    subject: "",
    message: "",
    attachments: [] as File[],
    type: "staff" as Message["type"],
    priority: "medium" as Message["priority"]
  });
  const [searchUsers, setSearchUsers] = useState("");
  const [messageStep, setMessageStep] = useState<"recipients" | "compose">("recipients");

  // حسابات الإحصائيات
  const unreadNotifications = notifications.filter(n => !n.read).length;
  const unreadMessages = messages.filter(m => !m.read).length;
  const totalUnread = unreadNotifications + unreadMessages;
  const starredNotifications = notifications.filter(n => n.starred).length;
  const starredMessages = messages.filter(m => m.starred).length;
  const urgentNotifications = notifications.filter(n => n.priority === "urgent" && !n.read).length;
  const urgentMessages = messages.filter(m => m.priority === "urgent" && !m.read).length;

  // ملخص النشاط حسب ��لقسم
  const activitySummary: ActivitySummary[] = [{
    section: "clinic",
    label: "العيادة",
    icon: Stethoscope,
    count: [...notifications, ...messages].filter(item => item.sourceSection === "clinic").length,
    color: "blue",
    items: [...notifications, ...messages].filter(item => item.sourceSection === "clinic")
  }, {
    section: "community",
    label: "المجتمع",
    icon: Users,
    count: [...notifications, ...messages].filter(item => item.sourceSection === "community").length,
    color: "purple",
    items: [...notifications, ...messages].filter(item => item.sourceSection === "community")
  }, {
    section: "marketplace",
    label: "السوق",
    icon: Package,
    count: [...notifications, ...messages].filter(item => item.sourceSection === "marketplace").length,
    color: "green",
    items: [...notifications, ...messages].filter(item => item.sourceSection === "marketplace")
  }, {
    section: "jobs",
    label: "الوظائف",
    icon: Briefcase,
    count: [...notifications, ...messages].filter(item => item.sourceSection === "jobs").length,
    color: "orange",
    items: [...notifications, ...messages].filter(item => item.sourceSection === "jobs")
  }, {
    section: "system",
    label: "النظام",
    icon: Settings,
    count: [...notifications, ...messages].filter(item => item.sourceSection === "system").length,
    color: "gray",
    items: [...notifications, ...messages].filter(item => item.sourceSection === "system")
  }];

  // تطبيق الفلاتر
  const filteredNotifications = notifications.filter(notification => {
    if (filter === "unread" && notification.read) return false;
    if (filter === "starred" && !notification.starred) return false;
    if (filter === "urgent" && notification.priority !== "urgent") return false;
    if (selectedCategory !== "all" && notification.category !== selectedCategory) return false;
    if (searchQuery && !notification.title.toLowerCase().includes(searchQuery.toLowerCase()) && !notification.message.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });
  const filteredMessages = messages.filter(message => {
    if (filter === "unread" && message.read) return false;
    if (filter === "starred" && !message.starred) return false;
    if (filter === "urgent" && message.priority !== "urgent") return false;
    if (searchQuery && !message.subject.toLowerCase().includes(searchQuery.toLowerCase()) && !message.message.toLowerCase().includes(searchQuery.toLowerCase()) && !message.senderName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });
  const filteredUsers = mockUsers.filter(user => user.name.toLowerCase().includes(searchUsers.toLowerCase()) || user.role.toLowerCase().includes(searchUsers.toLowerCase()) || user.department?.toLowerCase().includes(searchUsers.toLowerCase()));

  // وظائف التذكيرات
  const addReminder = () => {
    if (!newReminder.title.trim()) return;
    const assigneeName = newReminder.assigneeId === "owner" ? "مالك العيادة" : newReminder.assigneeId === "me" ? "أنت" : mockUsers.find(u => u.id === newReminder.assigneeId)?.name || "موظف";
    const created: Reminder = {
      id: `rem_${Date.now()}`,
      title: newReminder.title.trim(),
      description: newReminder.description.trim(),
      assigneeId: newReminder.assigneeId,
      assigneeName,
      priority: newReminder.priority,
      dueAt: newReminder.dueAt,
      createdAt: new Date(),
      completed: false
    };
    setReminders(prev => [created, ...prev]);
    setNewReminder({
      title: "",
      description: "",
      assigneeId: "owner",
      priority: "medium",
      dueAt: new Date().toISOString().slice(0, 16)
    });
  };
  const toggleReminderComplete = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? {
      ...r,
      completed: !r.completed
    } : r));
  };
  const removeReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  // وظائف التفاعل
  const markAsRead = (id: string, type: "notification" | "message") => {
    if (type === "notification") {
      setNotifications(prev => prev.map(n => n.id === id ? {
        ...n,
        read: true
      } : n));
    } else {
      setMessages(prev => prev.map(m => m.id === id ? {
        ...m,
        read: true
      } : m));
    }
  };
  const toggleStar = (id: string, type: "notification" | "message") => {
    if (type === "notification") {
      setNotifications(prev => prev.map(n => n.id === id ? {
        ...n,
        starred: !n.starred
      } : n));
    } else {
      setMessages(prev => prev.map(m => m.id === id ? {
        ...m,
        starred: !m.starred
      } : m));
    }
  };
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({
      ...n,
      read: true
    })));
    setMessages(prev => prev.map(m => ({
      ...m,
      read: true
    })));
  };
  const removeItem = (id: string, type: "notification" | "message") => {
    if (type === "notification") {
      setNotifications(prev => prev.filter(n => n.id !== id));
    } else {
      setMessages(prev => prev.filter(m => m.id !== id));
    }
  };

  // إضافة/إزالة مستلمين
  const toggleRecipient = (user: (typeof mockUsers)[0]) => {
    setNewMessageData(prev => ({
      ...prev,
      recipients: prev.recipients.find(r => r.id === user.id) ? prev.recipients.filter(r => r.id !== user.id) : [...prev.recipients, user]
    }));
  };

  // إرسال الرسالة
  const sendMessage = () => {
    if (!newMessageData.subject.trim() || !newMessageData.message.trim() || newMessageData.recipients.length === 0) {
      return;
    }
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      type: newMessageData.type,
      senderName: "أنت",
      subject: newMessageData.subject,
      message: newMessageData.message,
      timestamp: new Date(),
      read: true,
      starred: false,
      priority: newMessageData.priority,
      attachments: newMessageData.attachments.map(file => file.name),
      isOnline: true,
      unreadCount: 0,
      lastMessage: newMessageData.message,
      sourceSection: "system"
    };
    setMessages(prev => [newMessage, ...prev]);

    // إعادة تعيين البيانات
    setNewMessageData({
      recipients: [],
      subject: "",
      message: "",
      attachments: [],
      type: "staff",
      priority: "medium"
    });
    setMessageStep("recipients");
    setShowNewMessage(false);
    setSearchUsers("");
  };

  // رفع الملفات
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setNewMessageData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };
  const removeAttachment = (index: number) => {
    setNewMessageData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  // دوال المساعدة
  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (minutes < 1) return "الآن";
    if (minutes < 60) return `منذ ${minutes} د`;
    if (hours < 24) return `منذ ${hours} س`;
    return `منذ ${days} يوم`;
  };
  const getIcon = (category: Notification["category"]) => {
    const icons = {
      appointment: Calendar,
      inventory: Package,
      patient: User,
      financial: DollarSign,
      message: MessageSquare,
      community: Users,
      marketplace: Package,
      achievement: Crown,
      reminder: Clock,
      system: Settings
    };
    return icons[category] || Info;
  };
  const getTypeIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "urgent":
        return <Zap className="w-4 h-4 text-orange-500 animate-pulse" />;
      case "celebration":
        return <Sparkles className="w-4 h-4 text-purple-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };
  const getPriorityColor = (priority: "low" | "medium" | "high" | "urgent") => {
    switch (priority) {
      case "urgent":
        return "border-l-red-500 bg-red-50";
      case "high":
        return "border-l-orange-500 bg-orange-50";
      case "medium":
        return "border-l-blue-500 bg-blue-50";
      default:
        return "border-l-gray-300 bg-white";
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50" dir="rtl">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              

              <div className="flex items-center gap-3">
                <div className="relative">
                  
                  {totalUnread > 0}
                </div>

                
              </div>

              {/* Tabs */}
              <div className="flex bg-gray-100 rounded-xl p-1 ml-6">
                <button onClick={() => setActiveTab("reminders")} className={cn("flex items-center gap-1 md:gap-2 py-1.5 md:py-2 px-2 md:px-4 rounded-lg transition-all duration-200", activeTab === "reminders" ? "bg-white shadow-sm text-blue-600 font-medium" : "text-gray-600 hover:text-gray-900")}>
                  <Clock className="w-3 md:w-4 h-3 md:h-4" />
                  <span className="text-xs md:text-sm">قسم التذكيرات</span>
                </button>
                <button onClick={() => setActiveTab("notifications")} className={cn("flex items-center gap-1 md:gap-2 py-1.5 md:py-2 px-2 md:px-4 rounded-lg transition-all duration-200", activeTab === "notifications" ? "bg-white shadow-sm text-blue-600 font-medium" : "text-gray-600 hover:text-gray-900")}>
                  <Bell className="w-3 md:w-4 h-3 md:h-4" />
                  <span className="text-xs md:text-sm">الإشعارات</span>
                  {unreadNotifications > 0 && <span className="bg-red-500 text-white text-xs rounded-full px-1.5 md:px-2 py-0.5 min-w-[16px] md:min-w-[20px] h-4 md:h-5 flex items-center justify-center">
                      {unreadNotifications}
                    </span>}
                </button>
                <button onClick={() => setActiveTab("messages")} className={cn("flex items-center gap-1 md:gap-2 py-1.5 md:py-2 px-2 md:px-4 rounded-lg transition-all duration-200", activeTab === "messages" ? "bg-white shadow-sm text-blue-600 font-medium" : "text-gray-600 hover:text-gray-900")}>
                  <Mail className="w-3 md:w-4 h-3 md:h-4" />
                  <span className="text-xs md:text-sm">الرسائل</span>
                  {unreadMessages > 0 && <span className="bg-red-500 text-white text-xs rounded-full px-1.5 md:px-2 py-0.5 min-w-[16px] md:min-w-[20px] h-4 md:h-5 flex items-center justify-center">
                      {unreadMessages}
                    </span>}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* زر الرسالة الجديدة */}
              <Dialog open={showNewMessage} onOpenChange={setShowNewMessage}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                    <Plus className="w-4 h-4 mr-2" />
                    رسالة جديدة
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <MessageCircle className="w-6 h-6 text-blue-600" />
                      إنشاء رسالة جديدة
                    </DialogTitle>
                  </DialogHeader>

                  {messageStep === "recipients" ?
                // خطوة اختيار المستلمين
                <div className="space-y-6">
                      {/* البحث عن المستخدمين */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900">
                          اختر المستلمين
                        </h3>
                        <div className="relative">
                          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input placeholder="ابحث عن المستخدمين..." value={searchUsers} onChange={e => setSearchUsers(e.target.value)} className="pr-10" />
                        </div>
                      </div>

                      {/* المستلمون المخ��ارون */}
                      {newMessageData.recipients.length > 0 && <div className="space-y-2">
                          <h4 className="font-medium text-gray-700">
                            المستلمون المختارون (
                            {newMessageData.recipients.length})
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {newMessageData.recipients.map(user => <div key={user.id} className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-lg">
                                <Avatar className="w-6 h-6">
                                  <AvatarImage src={user.avatar} />
                                  <AvatarFallback>
                                    {user.name[2]}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium">
                                  {user.name}
                                </span>
                                <button onClick={() => toggleRecipient(user)} className="text-blue-600 hover:text-blue-800">
                                  <X className="w-4 h-4" />
                                </button>
                              </div>)}
                          </div>
                        </div>}

                      {/* قائمة المستخدمين */}
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        <h4 className="font-medium text-gray-700">
                          المستخدمون المتاحون
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                          {filteredUsers.map(user => {
                        const isSelected = newMessageData.recipients.find(r => r.id === user.id);
                        return <div key={user.id} onClick={() => toggleRecipient(user)} className={cn("flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all", isSelected ? "bg-blue-100 border border-blue-300" : "hover:bg-gray-50 border border-gray-200")}>
                                <Avatar className="w-10 h-10">
                                  <AvatarImage src={user.avatar} />
                                  <AvatarFallback>
                                    {user.name[2]}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <h5 className="font-medium text-gray-900">
                                      {user.name}
                                    </h5>
                                    {user.online && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                                  </div>
                                  <p className="text-sm text-gray-600">
                                    {user.role}
                                  </p>
                                  {user.department && <p className="text-xs text-gray-500">
                                      {user.department}
                                    </p>}
                                </div>
                                {isSelected && <CheckCircle className="w-5 h-5 text-blue-600" />}
                              </div>;
                      })}
                        </div>
                      </div>

                      {/* أزرار التحكم */}
                      <div className="flex justify-between pt-4 border-t">
                        <Button variant="outline" onClick={() => setShowNewMessage(false)}>
                          إلغاء
                        </Button>
                        <Button onClick={() => setMessageStep("compose")} disabled={newMessageData.recipients.length === 0} className="bg-blue-600 hover:bg-blue-700">
                          التالي: كتابة الرسالة
                          <ArrowLeft className="w-4 h-4 mr-2" />
                        </Button>
                      </div>
                    </div> :
                // خطوة كتابة الرسالة
                <div className="space-y-6">
                      {/* المستلمون المختارون */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-700 mb-2">
                          المستلمون ({newMessageData.recipients.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {newMessageData.recipients.map(user => <div key={user.id} className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-lg">
                              <Avatar className="w-5 h-5">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>{user.name[2]}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{user.name}</span>
                            </div>)}
                        </div>
                      </div>

                      {/* نوع الرسالة والأولوية */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            نوع الرسالة
                          </label>
                          <select value={newMessageData.type} onChange={e => setNewMessageData(prev => ({
                        ...prev,
                        type: e.target.value as Message["type"]
                      }))} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="staff">موظفي العيادة</option>
                            <option value="suppliers">موردين</option>
                            <option value="support">دعم فني</option>
                            <option value="community">مجتمع</option>
                            <option value="jobs">وظائف</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            الأولوية
                          </label>
                          <select value={newMessageData.priority} onChange={e => setNewMessageData(prev => ({
                        ...prev,
                        priority: e.target.value as Message["priority"]
                      }))} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="low">منخفضة</option>
                            <option value="medium">متوسطة</option>
                            <option value="high">عالية</option>
                            <option value="urgent">عاجلة</option>
                          </select>
                        </div>
                      </div>

                      {/* موضوع الرسالة */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          موضوع الرسالة
                        </label>
                        <Input placeholder="أدخل موضوع الرسالة..." value={newMessageData.subject} onChange={e => setNewMessageData(prev => ({
                      ...prev,
                      subject: e.target.value
                    }))} />
                      </div>

                      {/* محتوى الرسالة */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          محتوى الرسالة
                        </label>
                        <Textarea placeholder="اكتب رسالتك هنا..." value={newMessageData.message} onChange={e => setNewMessageData(prev => ({
                      ...prev,
                      message: e.target.value
                    }))} className="min-h-[120px]" />
                      </div>

                      {/* المر��قات */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          المرفقات
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                          <input type="file" multiple onChange={handleFileUpload} className="hidden" id="file-upload" />
                          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center text-gray-600 hover:text-gray-800">
                            <Upload className="w-8 h-8 mb-2" />
                            <span className="text-sm">
                              اضغط لاختيار الملفات
                            </span>
                          </label>
                        </div>

                        {/* المرفقات المختارة */}
                        {newMessageData.attachments.length > 0 && <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700">
                              الملفات المختارة:
                            </p>
                            {newMessageData.attachments.map((file, index) => <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm text-gray-700">
                                    {file.name}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    ({(file.size / 1024).toFixed(1)} KB)
                                  </span>
                                </div>
                                <button onClick={() => removeAttachment(index)} className="text-red-500 hover:text-red-700">
                                  <X className="w-4 h-4" />
                                </button>
                              </div>)}
                          </div>}
                      </div>

                      {/* أزرار التحكم */}
                      <div className="flex justify-between pt-4 border-t">
                        <Button variant="outline" onClick={() => setMessageStep("recipients")}>
                          <ArrowLeft className="w-4 h-4 ml-2" />
                          السابق
                        </Button>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => setShowNewMessage(false)}>
                            إلغاء
                          </Button>
                          <Button onClick={sendMessage} disabled={!newMessageData.subject.trim() || !newMessageData.message.trim()} className="bg-blue-600 hover:bg-blue-700">
                            <Send className="w-4 h-4 mr-2" />
                            إرسال الرسالة
                          </Button>
                        </div>
                      </div>
                    </div>}
                </DialogContent>
              </Dialog>

              

              
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-6">
        {activeTab === "reminders" ?
      // قسم التذكيرات
      <div className="space-y-6">
            {/* إحصائيات سريعة للتذكيرات */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8" />
                  <div>
                    <p className="text-blue-100 text-sm">إجمالي التذكيرات</p>
                    <p className="text-2xl font-bold">{reminders.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3">
                  <Calendar className="w-8 h-8" />
                  <div>
                    <p className="text-green-100 text-sm">مستحقة اليوم</p>
                    <p className="text-2xl font-bold">
                      {reminders.filter(r => new Date(r.dueAt).toDateString() === new Date().toDateString()).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-8 h-8" />
                  <div>
                    <p className="text-orange-100 text-sm">أولوية عالية</p>
                    <p className="text-2xl font-bold">
                      {reminders.filter(r => r.priority === "high" || r.priority === "urgent").length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3">
                  <User className="w-8 h-8" />
                  <div>
                    <p className="text-purple-100 text-sm">مكلفة لك</p>
                    <p className="text-2xl font-bold">
                      {reminders.filter(r => r.assigneeId === "me").length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* إنشاء تذكير جديد */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                إنشاء تذكير
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    عنوان التذكير
                  </label>
                  <Input value={newReminder.title} onChange={e => setNewReminder(prev => ({
                ...prev,
                title: e.target.value
              }))} placeholder="مثال: متابعة حالة المريض أحمد" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    الأولوية
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg" value={newReminder.priority} onChange={e => setNewReminder(prev => ({
                ...prev,
                priority: e.target.value as any
              }))}>
                    <option value="low">منخفضة</option>
                    <option value="medium">متوسطة</option>
                    <option value="high">عالية</option>
                    <option value="urgent">عاجلة</option>
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  
                  <Textarea value={newReminder.description} onChange={e => setNewReminder(prev => ({
                ...prev,
                description: e.target.value
              }))} placeholder="تفاصيل التذكير..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    المُستلم
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg" value={newReminder.assigneeId} onChange={e => setNewReminder(prev => ({
                ...prev,
                assigneeId: e.target.value
              }))}>
                    <option value="owner">مالك العيادة</option>
                    <option value="me">أنا</option>
                    {mockUsers.map(u => <option key={u.id} value={u.id}>
                        {u.name} • {u.role}
                      </option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  
                  <input type="datetime-local" className="w-full p-2 border border-gray-300 rounded-lg" value={newReminder.dueAt} onChange={e => setNewReminder(prev => ({
                ...prev,
                dueAt: e.target.value
              }))} />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button onClick={addReminder} disabled={!newReminder.title.trim()} className="bg-blue-600 hover:bg-blue-700">
                  إضافة التذكير
                </Button>
              </div>
            </div>

            {/* قائمة التذكيرات */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  قائمة التذكيرات
                </h2>
                <p className="text-gray-600">
                  تذكيرات بين الموظفين، لموظف معين أو لمالك العيادة
                </p>
              </div>
              <div className="divide-y">
                {reminders.length === 0 ? <div className="p-8 text-center text-gray-500">
                    لا توجد تذكيرات بعد
                  </div> : reminders.map(r => <div key={r.id} className="p-4 flex items-start gap-4">
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", r.priority === "urgent" ? "bg-orange-100 text-orange-600" : r.priority === "high" ? "bg-red-100 text-red-600" : r.priority === "medium" ? "bg-yellow-100 text-yellow-600" : "bg-blue-100 text-blue-600")}>
                        <Clock className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">
                            {r.title}
                          </h3>
                          <span className={cn("text-xs px-2 py-0.5 rounded-full", r.priority === "urgent" ? "bg-orange-100 text-orange-700" : r.priority === "high" ? "bg-red-100 text-red-700" : r.priority === "medium" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700")}>
                            {r.priority === "urgent" ? "عاجلة" : r.priority === "high" ? "عالية" : r.priority === "medium" ? "متوسطة" : "منخفضة"}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">
                          {r.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-2">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" /> {r.assigneeName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />{" "}
                            {new Date(r.dueAt).toLocaleString("ar-IQ")}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => toggleReminderComplete(r.id)}>
                          {r.completed ? "إلغاء الإكمال" : "تم"}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => removeReminder(r.id)} className="text-red-600 border-red-300">
                          حذف
                        </Button>
                      </div>
                    </div>)}
              </div>
            </div>
          </div> :
      // عرض الإشعارات أو الرسائل
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            {/* شريط البحث والفلاتر */}
            <div className="w-full md:w-80 space-y-4">
              {/* البحث */}
              

              {/* الفلاتر السريعة */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 md:p-4">
                <h3 className="font-semibold text-gray-900 mb-3 md:mb-4 text-sm md:text-base">
                  فلاتر سريعة
                </h3>
                <div className="space-y-2">
                  {[{
                id: "all",
                label: "الكل",
                count: activeTab === "notifications" ? notifications.length : messages.length
              }, {
                id: "unread",
                label: "غير مقروءة",
                count: activeTab === "notifications" ? unreadNotifications : unreadMessages
              }, {
                id: "starred",
                label: "مميزة",
                count: activeTab === "notifications" ? starredNotifications : starredMessages
              }, {
                id: "urgent",
                label: "عاجلة",
                count: activeTab === "notifications" ? urgentNotifications : urgentMessages
              }].map(filterOption => <button key={filterOption.id} onClick={() => setFilter(filterOption.id as any)} className={cn("w-full flex items-center justify-between p-2 md:p-3 rounded-xl transition-all duration-200", filter === filterOption.id ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" : "hover:bg-gray-50 text-gray-700")}>
                      <span className="font-medium text-sm md:text-base">{filterOption.label}</span>
                      <span className={cn("px-1.5 md:px-2 py-0.5 md:py-1 rounded-full text-xs font-bold", filter === filterOption.id ? "bg-white/20" : "bg-gray-100 text-gray-600")}>
                        {filterOption.count}
                      </span>
                    </button>)}
                </div>
              </div>
            </div>

            {/* المحتوى الرئيسي */}
            <div className="flex-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                {activeTab === "notifications" ?
            // قائمة الإشعارات
            filteredNotifications.length === 0 ? <div className="p-12 text-center">
                      <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        لا توجد إشعارات
                      </h3>
                      <p className="text-gray-500">
                        لم يتم العثور على إشعارات تطابق الفلاتر المحددة
                      </p>
                    </div> : <div className="divide-y divide-gray-100">
                      {filteredNotifications.map(notification => {
                const Icon = getIcon(notification.category);
                return <div key={notification.id} className={cn("p-2 md:p-3 transition-all duration-200 hover:bg-gray-50 cursor-pointer border-r-4", getPriorityColor(notification.priority), !notification.read && "bg-blue-50/50")} onClick={() => markAsRead(notification.id, "notification")}>
                            <div className="flex items-start gap-2 md:gap-4">
                              {notification.avatar ? <img src={notification.avatar} alt="" className="w-7 md:w-9 h-7 md:h-9 rounded-full object-cover ring-2 ring-white shadow" /> : <div className={cn("w-7 md:w-9 h-7 md:h-9 rounded-full flex items-center justify-center", notification.type === "success" && "bg-green-100 text-green-600", notification.type === "warning" && "bg-yellow-100 text-yellow-600", notification.type === "error" && "bg-red-100 text-red-600", notification.type === "urgent" && "bg-orange-100 text-orange-600", notification.type === "celebration" && "bg-purple-100 text-purple-600", notification.type === "info" && "bg-blue-100 text-blue-600")}>
                                  <Icon className="w-3 md:w-5 h-3 md:h-5" />
                                </div>}

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                                  <h3 className={cn("text-xs md:text-sm font-semibold", notification.read ? "text-gray-700" : "text-gray-900")}>
                                    {notification.title}
                                  </h3>
                                  {getTypeIcon(notification.type)}
                                  {notification.priority === "urgent" && <div className="flex items-center gap-1 bg-red-100 text-red-700 px-1.5 md:px-2 py-0.5 md:py-1 rounded-full text-xs font-bold">
                                      <Flame className="w-2 md:w-3 h-2 md:h-3 animate-pulse" />
                                      <span className="hidden md:inline">عاجل</span>
                                    </div>}
                                  {!notification.read && <div className="w-2 md:w-3 h-2 md:h-3 bg-blue-500 rounded-full animate-pulse" />}
                                </div>

                                <p className={cn("text-xs md:text-sm mb-1 md:mb-2", notification.read ? "text-gray-600" : "text-gray-700")}>
                                  {notification.message}
                                </p>

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 md:gap-3 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 md:w-4 h-3 md:h-4" />
                                      <span className="hidden md:inline">{formatTime(notification.timestamp)}</span>
                                      <span className="md:hidden">{formatTime(notification.timestamp).split(' ')[0]}</span>
                                    </span>
                                    {notification.sourceSection && <span className="bg-gray-100 text-gray-600 px-1.5 md:px-2 py-0.5 md:py-1 rounded-full text-xs">
                                        {notification.sourceSection === "clinic" ? "العيادة" : notification.sourceSection === "community" ? "المجتمع" : notification.sourceSection === "marketplace" ? "السوق" : notification.sourceSection === "jobs" ? "الوظائف" : "النظام"}
                                      </span>}
                                  </div>

                                  <div className="flex items-center gap-1 md:gap-2">
                                    {notification.actionUrl && <Link to={notification.actionUrl} className="px-2 md:px-4 py-1 md:py-2 bg-blue-600 text-white rounded-lg text-xs md:text-sm font-medium hover:bg-blue-700 transition-colors" onClick={e => e.stopPropagation()}>
                                        <span className="hidden md:inline">{notification.actionText}</span>
                                        <span className="md:hidden">عرض</span>
                                      </Link>}
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col gap-1 md:gap-2">
                                <button onClick={e => {
                        e.stopPropagation();
                        toggleStar(notification.id, "notification");
                      }} className={cn("p-1.5 md:p-2 rounded-lg transition-colors", notification.starred ? "text-yellow-500 hover:text-yellow-600 bg-yellow-50" : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50")}>
                                  <Star className={cn("w-4 md:w-5 h-4 md:h-5", notification.starred && "fill-current")} />
                                </button>

                                <button onClick={e => {
                        e.stopPropagation();
                        removeItem(notification.id, "notification");
                      }} className="p-1.5 md:p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                  <Trash2 className="w-4 md:w-5 h-4 md:h-5" />
                                </button>
                              </div>
                            </div>
                          </div>;
              })}
                    </div> :
            // قائمة الرسائل
            filteredMessages.length === 0 ? <div className="p-12 text-center">
                    <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      لا توجد رسائل
                    </h3>
                    <p className="text-gray-500">
                      لم يتم العثور على رسائل تطابق الفلاتر المحددة
                    </p>
                  </div> : <div className="divide-y divide-gray-100">
                    {filteredMessages.map(message => <div key={message.id} className={cn("p-3 md:p-6 transition-all duration-200 hover:bg-gray-50 cursor-pointer border-r-4", getPriorityColor(message.priority), !message.read && "bg-blue-50/50")} onClick={() => markAsRead(message.id, "message")}>
                        <div className="flex items-start gap-2 md:gap-4">
                          <div className="relative">
                            {message.senderAvatar ? <img src={message.senderAvatar} alt="" className="w-8 md:w-12 h-8 md:h-12 rounded-full object-cover ring-2 ring-white shadow-lg" /> : <div className={cn("w-8 md:w-12 h-8 md:h-12 rounded-full flex items-center justify-center", message.type === "suppliers" && "bg-green-100 text-green-600", message.type === "support" && "bg-purple-100 text-purple-600", message.type === "staff" && "bg-orange-100 text-orange-600", message.type === "community" && "bg-indigo-100 text-indigo-600", message.type === "jobs" && "bg-teal-100 text-teal-600")}>
                                <Mail className="w-4 md:w-6 h-4 md:h-6" />
                              </div>}
                            {message.isOnline && <div className="absolute -bottom-1 -right-1 w-3 md:w-4 h-3 md:h-4 bg-green-500 rounded-full border-2 border-white" />}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1 md:gap-2 mb-1">
                              <h3 className={cn("font-semibold text-sm md:text-base", message.read ? "text-gray-700" : "text-gray-900")}>
                                {message.senderName}
                              </h3>
                              {message.senderRole && <span className="text-xs text-gray-500 bg-gray-100 px-1.5 md:px-2 py-0.5 md:py-1 rounded-full">
                                  {message.senderRole}
                                </span>}
                              {!message.read && <div className="w-2 md:w-3 h-2 md:h-3 bg-blue-500 rounded-full animate-pulse" />}
                            </div>

                            <h4 className={cn("text-sm md:text-lg font-medium mb-1 md:mb-2", message.read ? "text-gray-700" : "text-gray-900")}>
                              {message.subject}
                            </h4>

                            <p className={cn("text-xs md:text-base mb-2 md:mb-3", message.read ? "text-gray-600" : "text-gray-700")}>
                              {message.message}
                            </p>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 md:w-4 h-3 md:h-4" />
                                  <span className="hidden md:inline">{formatTime(message.timestamp)}</span>
                                  <span className="md:hidden">{formatTime(message.timestamp).split(' ')[0]}</span>
                                </span>
                                {message.attachments && message.attachments.length > 0 && <span className="flex items-center gap-1">
                                      <Paperclip className="w-3 md:w-4 h-3 md:h-4" />
                                      <span className="hidden md:inline">{message.attachments.length} مرفق</span>
                                      <span className="md:hidden">{message.attachments.length}</span>
                                    </span>}
                                {message.sourceSection && <span className="bg-gray-100 text-gray-600 px-1.5 md:px-2 py-0.5 md:py-1 rounded-full text-xs">
                                    {message.sourceSection === "clinic" ? "العيادة" : message.sourceSection === "community" ? "المجتمع" : message.sourceSection === "marketplace" ? "السوق" : message.sourceSection === "jobs" ? "الوظائف" : "النظام"}
                                  </span>}
                              </div>

                              <div className="flex items-center gap-1 md:gap-2">
                                <Button variant="outline" size="sm" className="text-xs md:text-sm px-2 md:px-3 py-1 md:py-2">
                                  <Reply className="w-3 md:w-4 h-3 md:h-4 mr-1" />
                                  <span className="hidden md:inline">رد</span>
                                </Button>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-1 md:gap-2">
                            <button onClick={e => {
                      e.stopPropagation();
                      toggleStar(message.id, "message");
                    }} className={cn("p-1.5 md:p-2 rounded-lg transition-colors", message.starred ? "text-yellow-500 hover:text-yellow-600 bg-yellow-50" : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50")}>
                              <Star className={cn("w-4 md:w-5 h-4 md:h-5", message.starred && "fill-current")} />
                            </button>

                            <button onClick={e => {
                      e.stopPropagation();
                      removeItem(message.id, "message");
                    }} className="p-1.5 md:p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="w-4 md:w-5 h-4 md:h-5" />
                            </button>
                          </div>
                        </div>
                      </div>)}
                  </div>}
              </div>
            </div>
          </div>}
      </div>
    </div>;
}