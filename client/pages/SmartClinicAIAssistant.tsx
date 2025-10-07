import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SmartClinicSubNav from "@/components/SmartClinicSubNav";
import { useAIDentalAssistant } from "@/hooks/useAIDentalAssistant";
import { clinicDataIntegration } from "@/services/clinicDataIntegration";
import {
  Bot,
  MessageCircle,
  Send,
  Mic,
  MicOff,
  ArrowLeft,
  Settings,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Volume2,
  VolumeX,
  Sparkles,
  Brain,
  Stethoscope,
  Calendar,
  FileText,
  Users,
  Package,
  CreditCard,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  Phone,
  MapPin,
  Heart,
  Download,
  Share,
  Bookmark,
  Star,
  Filter,
  Search,
  PlusCircle,
  Activity,
  Building2,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Message {
  id: string;
  type: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  suggestions?: string[];
  actions?: Array<{
    label: string;
    action: () => void;
    icon?: React.ComponentType;
    variant?: "default" | "outline" | "destructive";
  }>;
  attachments?: Array<{
    type: "image" | "file" | "link";
    url: string;
    name: string;
  }>;
  rating?: "up" | "down" | null;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType;
  color: string;
  action: () => void;
  category: string;
}

const SmartClinicAIAssistant: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedClinic, setSelectedClinic] = useState("clinic-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [clinicData, setClinicData] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { sendMessage, isLoading: aiLoading } = useAIDentalAssistant({
    clinicData,
    agentType: 'clinic',
    preferredModel: 'gemini-2.5-flash'
  });

  // Mock clinic data
  const clinics = [
    { id: "clinic-1", name: "عيادة الدكتور أحمد الطبية" },
    { id: "clinic-2", name: "مركز الأسنان المتقدم" },
    { id: "clinic-3", name: "عيادة النور لطب الأسنان" },
  ];

  const quickActions: QuickAction[] = [
    {
      id: "appointments-today",
      title: "مواعيد اليوم",
      description: "عرض وإدارة مواعيد اليوم للعيادة المختارة",
      icon: Calendar,
      color: "blue",
      action: () => navigate("/clinic/reservations"),
      category: "appointments",
    },
    {
      id: "add-patient",
      title: "إضافة مريض جديد",
      description: "تسجيل مريض جديد في النظام",
      icon: Users,
      color: "green",
      action: () => navigate("/clinic/patients"),
      category: "patients",
    },
    {
      id: "lab-orders",
      title: "طلبات المختبر",
      description: "متابعة طلبات المختبر والتركيبات",
      icon: Package,
      color: "purple",
      action: () => navigate("/clinic/lab"),
      category: "lab",
    },
    {
      id: "financial-report",
      title: "التقرير المالي",
      description: "عرض الإيرادات والمصروفات",
      icon: BarChart3,
      color: "emerald",
      action: () => navigate("/clinic/accounts"),
      category: "finance",
    },
    {
      id: "patient-search",
      title: "البحث عن مريض",
      description: "البحث في قاعدة بيانات المرضى",
      icon: Search,
      color: "cyan",
      action: () => setCurrentMessage("ابحث عن مريض باسم"),
      category: "patients",
    },
    {
      id: "emergency-contacts",
      title: "جهات الاتصال الطارئة",
      description: "عرض أرقام الطوارئ والمختبرات",
      icon: Phone,
      color: "red",
      action: () => setCurrentMessage("عرض جهات الاتصال الطارئة"),
      category: "emergency",
    },
    {
      id: "clinic-stats",
      title: "إحصائيات العيادة",
      description: "عرض إحصائيات شاملة عن أداء العيادة",
      icon: Activity,
      color: "indigo",
      action: () => setCurrentMessage("عرض إحصائيات العيادة"),
      category: "reports",
    },
    {
      id: "treatment-plans",
      title: "خطط العلاج",
      description: "إدارة ومتابعة خطط العلاج",
      icon: Stethoscope,
      color: "orange",
      action: () => navigate("/clinic/treatments"),
      category: "treatments",
    },
  ];

  const categories = [
    { id: "all", name: "الكل" },
    { id: "appointments", name: "المواعيد" },
    { id: "patients", name: "المرضى" },
    { id: "lab", name: "المختبر" },
    { id: "finance", name: "المالية" },
    { id: "treatments", name: "العلاج" },
    { id: "reports", name: "التقارير" },
    { id: "emergency", name: "الطوارئ" },
  ];

  const commonResponses = {
    مرحبا: {
      content:
        "مرحباً بك في المساعد الذكي المتطور لنظام العيادة الذكية! أنا هنا لمساعدتك في إدارة عيادتك بأكثر الطرق كفاءة. كيف يمكنني مساعدتك اليوم؟",
      suggestions: [
        "عرض مواعيد اليوم",
        "إحصائيات العيادة",
        "طلبات المختبر المعلقة",
        "التقرير المالي",
      ],
    },
    المواعيد: {
      content:
        "يمكنني مساعدتك في إدارة المواعيد بطرق متعددة وذكية. هل تريد عرض مواعيد اليوم، إضافة موعد جديد، أم البحث عن موعد محدد؟",
      suggestions: [
        "مواعيد اليوم",
        "إضافة موعد جديد",
        "مواعيد الأسبوع",
        "مواعيد ملغية",
      ],
    },
    المرضى: {
      content:
        "أستطيع مساعدتك في إدارة ملفات المرضى بشكل شامل ومتطور. يمكنني البحث عن مريض، إضافة مريض جديد، أو عرض تاريخ طبي مفصل مع التحليلات.",
      suggestions: [
        "بحث عن مريض",
        "إضافة مريض جديد",
        "المرضى الجدد هذا الشهر",
        "المرضى بحاجة لمتابعة",
      ],
    },
    إحصائيات: {
      content: `إليك إحصائيات شاملة للعيادة المختارة:
      
📊 **إحصائيات عامة:**
• مواعيد اليوم: 12 موعد
• مرضى جدد هذا الشهر: 45 مريض
• إيرادات الشهر: 15,750,000 دينار
• طلبات مختبر معلقة: 8 طلبات

💰 **الإحصائيات المالية:**
• متوسط إيرادات يومية: 525,000 دينار
• نسبة النمو الشهري: +12%
• المدفوعات المعلقة: 2,300,000 دينار

🔬 **إحصائيات المختبر:**
• تركيبات قيد التحضير: 5
• متوسط وقت التسليم: 4 أيام
• معدل رضا المرضى: 95%`,
      suggestions: ["تفاصيل أكثر", "تقرير شامل", "مقارنة بالشهر الماضي"],
    },
  };

  useEffect(() => {
    // Load clinic data
    const loadClinicData = async () => {
      try {
        const data = await clinicDataIntegration.getIntegratedData();
        setClinicData(data);
      } catch (error) {
        console.error('Failed to load clinic data:', error);
      }
    };
    loadClinicData();

    // Welcome message
    setMessages([
      {
        id: "welcome",
        type: "system",
        content: "مرحباً بك في العيادة الذكية! 🏥✨",
        timestamp: new Date(),
      },
      {
        id: "intro",
        type: "assistant",
        content:
          "أنا المساعد الذكي المتخصص في إدارة العيادات الذكية مدعوم بتقنية Google Gemini 🤖. يمكنني مساعدتك في جميع جوانب إدارة عيادتك من المواعيد إلى التقارير المالية ومتابعة المختبر. \n\nاختر العيادة من القائمة أعلاه وابدأ المحادثة!",
        timestamp: new Date(),
        suggestions: [
          "عرض لوحة القيادة",
          "مواعيد اليوم",
          "إحصائيات العيادة",
          "تقرير مالي شامل",
        ],
        actions: [
          {
            label: "عرض الإجراءات السريعة",
            action: () => {},
            icon: Sparkles,
            variant: "default",
          },
        ],
      },
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: currentMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageToProcess = currentMessage;
    setCurrentMessage("");
    setIsTyping(true);

    try {
      // Use real AI with Gemini
      const response = await sendMessage(messageToProcess);
      
      if (response?.response) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: response.response,
          timestamp: new Date(),
          suggestions: ["مواعيد اليوم", "التقرير المالي", "طلبات المختبر"],
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('AI Error:', error);
      // Fallback to generated response
      const response = generateResponse(messageToProcess);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions,
        actions: response.actions,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateResponse = (message: string) => {
    const lowerMessage = message.toLowerCase();

    // Check for common patterns
    for (const [key, response] of Object.entries(commonResponses)) {
      if (lowerMessage.includes(key)) {
        return {
          content: response.content,
          suggestions: response.suggestions,
          actions: getActionsForTopic(key),
        };
      }
    }

    // Specific responses for detailed queries
    if (lowerMessage.includes("طلبات مختبر") || lowerMessage.includes("المختبر")) {
      return {
        content:
          "لديك حالياً 8 طلبات مختبر معلقة في العيادة المختارة:\n• 3 تركيبات أسنان (متوقع الانتهاء: غداً)\n• 2 أطقم أسنان (متوقع: بعد 3 أيام)\n• 3 تيجان سيراميك (قيد التحضير)\n\nيمكنني تتبع كل طلب بالتفصيل وإرسال تنبيهات تلقائية.",
        suggestions: ["تفاصيل كل طلب", "إضافة طلب جديد", "اتصال بالمختبر"],
        actions: [
          {
            label: "إدارة المختبر",
            action: () => navigate("/clinic/lab"),
            icon: Package,
          },
        ],
      };
    }

    // Default response
    return {
      content:
        "شكراً لسؤالك. يمكنني مساعدتك في العديد من المهام لإدارة العيادة الذكية. هل تحتاج مساعدة في إدارة المواعيد، متابعة المرضى، أم شيء آخر؟",
      suggestions: ["مواعيد اليوم", "بحث عن مريض", "تقرير مالي", "طلبات مختبر"],
      actions: [],
    };
  };

  const getActionsForTopic = (topic: string) => {
    switch (topic) {
      case "المواعيد":
        return [
          {
            label: "عرض مواعيد اليوم",
            action: () => navigate("/clinic/reservations"),
            icon: Calendar,
          },
        ];
      case "المرضى":
        return [
          {
            label: "قائمة المرضى",
            action: () => navigate("/clinic/patients"),
            icon: Users,
          },
        ];
      case "إحصائيات":
        return [
          {
            label: "عرض التقرير الكامل",
            action: () => navigate("/clinic/reports"),
            icon: BarChart3,
          },
        ];
      default:
        return [];
    }
  };

  const handleRateMessage = (messageId: string, rating: "up" | "down") => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, rating } : msg)),
    );
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate voice recognition
      setTimeout(() => {
        setCurrentMessage("عرض إحصائيات العيادة");
        setIsListening(false);
      }, 2000);
    }
  };

  const filteredActions = quickActions.filter(
    (action) =>
      selectedCategory === "all" || action.category === selectedCategory,
  );

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-500 text-white",
      green: "bg-green-500 text-white",
      purple: "bg-purple-500 text-white",
      emerald: "bg-emerald-500 text-white",
      cyan: "bg-cyan-500 text-white",
      red: "bg-red-500 text-white",
      indigo: "bg-indigo-500 text-white",
      orange: "bg-orange-500 text-white",
    };
    return colorMap[color] || "bg-gray-500 text-white";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50" dir="rtl">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Sub Navigation */}
        <SmartClinicSubNav />

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  المساعد الذكي
                </h1>
                <p className="text-sm text-gray-600">
                  متاح للمساعدة على مدار الساعة
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Clinic Selector */}
              <Select value={selectedClinic} onValueChange={setSelectedClinic}>
                <SelectTrigger className="w-48 max-sm:w-32">
                  <SelectValue placeholder="اختر العيادة" />
                </SelectTrigger>
                <SelectContent>
                  {clinics.map((clinic) => (
                    <SelectItem key={clinic.id} value={clinic.id}>
                      {clinic.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Actions Panel */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                الإجراءات السريعة
              </h2>

              {/* Category Filter */}
              <div className="mb-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر القسم" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-1 gap-3 max-sm:grid-cols-2 max-sm:gap-2">
                {filteredActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={action.action}
                    className="p-3 max-sm:p-2 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300 text-right group"
                  >
                    <div className="flex items-center gap-3 max-sm:gap-2">
                      <div
                        className={cn(
                          "w-8 h-8 max-sm:w-6 max-sm:h-6 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform",
                          getColorClasses(action.color),
                        )}
                      >
                        <div className="w-4 h-4 max-sm:w-3 max-sm:h-3 flex items-center justify-center">
                          {action.icon && React.createElement(action.icon)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 text-sm max-sm:text-xs">
                          {action.title}
                        </h3>
                        <p className="text-xs max-sm:text-[10px] text-gray-600 truncate">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Stats & Records Access */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <h3 className="font-bold text-sm text-gray-900 mb-2">الوصول السريع</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    <BarChart3 className="w-3 h-3 mr-1" />
                    الإحصائيات
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    <FileText className="w-3 h-3 mr-1" />
                    السجلات
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Panel */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-[600px] max-sm:h-[500px]">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <Brain className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">المساعد الذكي</h3>
                      <p className="text-blue-100 text-xs">
                        {clinics.find(c => c.id === selectedClinic)?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex",
                        message.type === "user" ? "justify-start" : "justify-end",
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[85%] p-3 rounded-2xl text-sm",
                          message.type === "user"
                            ? "bg-blue-500 text-white rounded-br-md"
                            : message.type === "system"
                            ? "bg-green-100 text-green-800 rounded-lg mx-auto"
                            : "bg-gray-100 text-gray-900 rounded-bl-md",
                        )}
                      >
                        <p className="whitespace-pre-line">{message.content}</p>

                        {/* Suggestions */}
                        {message.suggestions && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {message.suggestions.slice(0, 4).map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentMessage(suggestion)}
                                className="px-3 py-1 bg-white/20 rounded-lg text-xs hover:bg-white/30 transition-colors"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Actions */}
                        {message.actions && message.actions.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {message.actions.map((action, index) => (
                              <button
                                key={index}
                                onClick={action.action}
                                className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition-colors flex items-center gap-2"
                              >
                                {action.icon ? <action.icon /> : null}
                                {action.label}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Rating */}
                        {message.type === "assistant" && (
                          <div className="mt-2 flex items-center gap-2">
                            <button
                              onClick={() => handleRateMessage(message.id, "up")}
                              className={cn(
                                "p-1 rounded transition-colors",
                                message.rating === "up"
                                  ? "bg-green-100 text-green-600"
                                  : "hover:bg-gray-200 text-gray-500"
                              )}
                            >
                              <ThumbsUp className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleRateMessage(message.id, "down")}
                              className={cn(
                                "p-1 rounded transition-colors",
                                message.rating === "down"
                                  ? "bg-red-100 text-red-600"
                                  : "hover:bg-gray-200 text-gray-500"
                              )}
                            >
                              <ThumbsDown className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-end">
                      <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-md">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder="اكتب رسالتك هنا..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                  <button
                    onClick={handleVoiceInput}
                    className={cn(
                      "p-3 rounded-xl transition-colors",
                      isListening
                        ? "bg-red-500 text-white animate-pulse"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                    )}
                  >
                    {isListening ? (
                      <MicOff className="w-5 h-5" />
                    ) : (
                      <Mic className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={handleSendMessage}
                    disabled={!currentMessage.trim()}
                    className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartClinicAIAssistant;