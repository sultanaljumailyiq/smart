import React, { useState } from "react";
import {
  X,
  ArrowLeft,
  ArrowRight,
  Calendar,
  User,
  FileText,
  CheckCircle,
  Brain,
  Stethoscope,
  Activity,
  Heart,
  Thermometer,
  Eye,
  ClipboardCheck,
  Save,
  Plus,
  Minus,
  AlertTriangle,
  Info,
  Camera,
  Upload,
  Clock,
  Star,
  Zap,
  Shield,
  Phone,
  Mail,
  MapPin,
  Pill,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ModernMedicalCheckupModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient?: {
    name: string;
    id: string;
    avatar: string;
    age: number;
    phone: string;
    email: string;
  };
}

const steps = [
  {
    id: 1,
    title: "البيانات ا��طبية",
    subtitle: "المعلومات الصحية الأساسية",
    icon: FileText,
    color: "from-blue-500 to-indigo-500",
    description: "سجل البيانات الطبية والتاريخ المرضي",
  },
  {
    id: 2,
    title: "الخطة العلاجية",
    subtitle: "تخطيط وإجراءات العلاج",
    icon: Stethoscope,
    color: "from-green-500 to-emerald-500",
    description: "و��ع خطة علاجية مفصلة",
  },
  {
    id: 3,
    title: "الفحص الفموي",
    subtitle: "فحص شامل للفم والأسنان",
    icon: Eye,
    color: "from-purple-500 to-pink-500",
    description: "تسجيل نتائج الفحص السريري",
  },
  {
    id: 4,
    title: "اعتماد الخطة",
    subtitle: "مراجعة وموافقة العلاج",
    icon: ClipboardCheck,
    color: "from-orange-500 to-red-500",
    description: "اعتماد الخطة العلاجية النهائية",
  },
];

const ModernMedicalCheckupModal = ({
  isOpen,
  onClose,
  patient,
}: ModernMedicalCheckupModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [medicalData, setMedicalData] = useState({
    bloodPressure: { systolic: "120", diastolic: "80" },
    heartRate: "72",
    temperature: "36.5",
    conditions: {
      heartDisease: false,
      covid19: false,
      hemophilia: false,
      hepatitis: false,
      osteoporosis: false,
      diabetes: false,
      otherDisease: false,
    },
    allergies: "",
    medications: "",
    notes: "",
  });

  const dentalChart = {
    upperTeeth: Array.from({ length: 16 }, (_, i) => ({
      number: i + 11,
      status: "healthy",
      notes: "",
    })),
    lowerTeeth: Array.from({ length: 16 }, (_, i) => ({
      number: i + 31,
      status: "healthy", 
      notes: "",
    })),
  };

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep - 1];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            {/* Patient Info Card - Bento Style */}
            {patient && (
              <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>

                <div className="relative z-10">
                  <div className="grid grid-cols-12 gap-6">
                    {/* Avatar and Main Info */}
                    <div className="col-span-12 lg:col-span-6">
                      <div className="flex items-center gap-6">
                        <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center text-white font-bold text-2xl border-4 border-white/30">
                          {patient.avatar}
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold mb-2">{patient.name}</h3>
                          <div className="flex items-center gap-2 text-white/80">
                            <User className="w-5 h-5" />
                            <span className="text-lg">{patient.age} سنة</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact Info - Bento Grid */}
                    <div className="col-span-12 lg:col-span-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center">
                              <Phone className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-white/80 text-sm">الهاتف</p>
                              <p className="font-semibold">{patient.phone}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center">
                              <Mail className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-white/80 text-sm">البريد</p>
                              <p className="font-semibold text-sm">{patient.email}</p>
                            </div>
                          </div>
                        </div>

                        <div className="col-span-2 bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="text-white/80 text-sm">تاريخ الزيارة</p>
                                <p className="font-semibold">{new Date().toLocaleDateString('ar-IQ')}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-white/80 text-sm">رقم الملف</p>
                              <p className="font-bold text-lg">#{patient.id}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Vital Signs - Bento Grid */}
            <div className="grid grid-cols-12 gap-6">
              {/* Blood Pressure - Large Card */}
              <div className="col-span-12 lg:col-span-6">
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all group">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Heart className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">ضغط الدم</h4>
                      <p className="text-gray-600">Systolic / Diastolic</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <input
                        type="number"
                        value={medicalData.bloodPressure.systolic}
                        onChange={(e) =>
                          setMedicalData({
                            ...medicalData,
                            bloodPressure: {
                              ...medicalData.bloodPressure,
                              systolic: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl text-center text-2xl font-bold focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                        placeholder="120"
                      />
                      <p className="text-sm text-gray-500 mt-2">Systolic</p>
                    </div>

                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></div>
                    </div>

                    <div className="text-center">
                      <input
                        type="number"
                        value={medicalData.bloodPressure.diastolic}
                        onChange={(e) =>
                          setMedicalData({
                            ...medicalData,
                            bloodPressure: {
                              ...medicalData.bloodPressure,
                              diastolic: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl text-center text-2xl font-bold focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                        placeholder="80"
                      />
                      <p className="text-sm text-gray-500 mt-2">Diastolic</p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-red-50 rounded-2xl border border-red-100">
                    <p className="text-sm text-red-700 text-center">القيم الطبيعية: 120/80 mmHg</p>
                  </div>
                </div>
              </div>

              {/* Heart Rate */}
              <div className="col-span-12 lg:col-span-3">
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all group h-full">
                  <div className="flex flex-col h-full justify-between">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Activity className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">النبض</h4>
                        <p className="text-sm text-gray-600">BPM</p>
                      </div>
                    </div>

                    <input
                      type="number"
                      value={medicalData.heartRate}
                      onChange={(e) =>
                        setMedicalData({
                          ...medicalData,
                          heartRate: e.target.value,
                        })
                      }
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl text-center text-3xl font-bold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="72"
                    />

                    <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
                      <p className="text-xs text-blue-700 text-center">60-100 طبيعي</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Temperature */}
              <div className="col-span-12 lg:col-span-3">
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all group h-full">
                  <div className="flex flex-col h-full justify-between">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Thermometer className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">الحرارة</h4>
                        <p className="text-sm text-gray-600">°C</p>
                      </div>
                    </div>

                    <input
                      type="number"
                      step="0.1"
                      value={medicalData.temperature}
                      onChange={(e) =>
                        setMedicalData({
                          ...medicalData,
                          temperature: e.target.value,
                        })
                      }
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl text-center text-3xl font-bold focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                      placeholder="36.5"
                    />

                    <div className="mt-4 p-3 bg-orange-50 rounded-xl border border-orange-100">
                      <p className="text-xs text-orange-700 text-center">36-37.5°C طبيعي</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Conditions - Bento Grid */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">الحالات المرضية الخاصة</h4>
                  <p className="text-gray-600">تاريخ الأمراض والحالات الصحية</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { key: "heartDisease", label: "أمراض القلب", icon: Heart, color: "from-red-500 to-pink-500", bgColor: "bg-red-50", textColor: "text-red-700" },
                  { key: "diabetes", label: "السكري", icon: Pill, color: "from-blue-500 to-indigo-500", bgColor: "bg-blue-50", textColor: "text-blue-700" },
                  { key: "covid19", label: "كوفيد-19", icon: Shield, color: "from-purple-500 to-indigo-500", bgColor: "bg-purple-50", textColor: "text-purple-700" },
                  { key: "hemophilia", label: "الهيموفيليا", icon: Activity, color: "from-green-500 to-emerald-500", bgColor: "bg-green-50", textColor: "text-green-700" },
                  { key: "hepatitis", label: "الالتهاب الكبدي", icon: AlertTriangle, color: "from-yellow-500 to-orange-500", bgColor: "bg-yellow-50", textColor: "text-yellow-700" },
                  { key: "osteoporosis", label: "هشاشة العظام", icon: User, color: "from-gray-500 to-gray-600", bgColor: "bg-gray-50", textColor: "text-gray-700" },
                ].map((condition) => {
                  const IconComponent = condition.icon;
                  const isChecked = medicalData.conditions[condition.key as keyof typeof medicalData.conditions];

                  return (
                    <label key={condition.key} className={cn(
                      "flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all hover:scale-105",
                      isChecked
                        ? `${condition.bgColor} border-current ${condition.textColor}`
                        : "border-gray-200 hover:border-gray-300"
                    )}>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) =>
                            setMedicalData({
                              ...medicalData,
                              conditions: {
                                ...medicalData.conditions,
                                [condition.key]: e.target.checked,
                              },
                            })
                          }
                          className="sr-only"
                        />
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                          isChecked
                            ? `bg-gradient-to-r ${condition.color} text-white shadow-lg`
                            : "bg-gray-100 text-gray-400"
                        )}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                      </div>
                      <div className="mr-4">
                        <span className={cn(
                          "font-semibold",
                          isChecked ? condition.textColor : "text-gray-900"
                        )}>
                          {condition.label}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Allergies and Medications - Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center">
                    <AlertTriangle className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">الحساسيات</h4>
                    <p className="text-sm text-gray-600">الحساسيات المعروفة</p>
                  </div>
                </div>
                <textarea
                  value={medicalData.allergies}
                  onChange={(e) =>
                    setMedicalData({
                      ...medicalData,
                      allergies: e.target.value,
                    })
                  }
                  rows={5}
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none transition-all"
                  placeholder="اكتب أي حساسيات معروفة..."
                />
              </div>

              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                    <Pill className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">الأدوية الحالية</h4>
                    <p className="text-sm text-gray-600">الأدوية الموصوفة</p>
                  </div>
                </div>
                <textarea
                  value={medicalData.medications}
                  onChange={(e) =>
                    setMedicalData({
                      ...medicalData,
                      medications: e.target.value,
                    })
                  }
                  rows={5}
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all"
                  placeholder="اذكر الأدوية التي يتناولها المريض..."
                />
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={cn(
                  "flex items-center gap-3 px-8 py-4 text-sm font-semibold rounded-2xl transition-all",
                  currentStep === 1
                    ? "text-gray-400 cursor-not-allowed bg-gray-100"
                    : "text-gray-700 hover:bg-gray-200 bg-gray-100 hover:scale-105",
                )}
              >
                <ArrowRight className="w-5 h-5" />
                السابق
              </button>

              <div className="flex items-center gap-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-3 h-3 rounded-full transition-all",
                      index + 1 === currentStep
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 w-8"
                        : index + 1 < currentStep
                          ? "bg-green-500"
                          : "bg-gray-300"
                    )}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:scale-105"
              >
                التالي
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            {/* Treatment Planning Header */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">الخدمة الطبية</h3>
              <p className="text-gray-600">اختر السن المشكل ��وضع خطة العلاج</p>
            </div>

            {/* Dental Chart */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <div className="flex justify-center">
                <svg
                  width="500"
                  height="400"
                  viewBox="0 0 500 400"
                  className="border-2 border-gray-100 rounded-2xl bg-gradient-to-b from-blue-50 to-indigo-50"
                >
                  {/* Upper Arch */}
                  <g>
                    {dentalChart.upperTeeth.slice(0, 8).map((tooth, index) => {
                      const angle = index * 22.5 - 90;
                      const radius = 100;
                      const x = 250 + radius * Math.cos((angle * Math.PI) / 180);
                      const y = 140 + radius * Math.sin((angle * Math.PI) / 180);

                      return (
                        <g key={tooth.number}>
                          <circle
                            cx={x}
                            cy={y}
                            r="16"
                            className={cn(
                              "cursor-pointer transition-all duration-300",
                              selectedTooth === tooth.number
                                ? "fill-gradient-to-r from-blue-500 to-purple-500 stroke-blue-600 stroke-3"
                                : "fill-white stroke-gray-300 stroke-2 hover:fill-blue-50 hover:stroke-blue-400",
                            )}
                            onClick={() =>
                              setSelectedTooth(
                                selectedTooth === tooth.number
                                  ? null
                                  : tooth.number,
                              )
                            }
                          />
                          <text
                            x={x}
                            y={y + 4}
                            textAnchor="middle"
                            className="text-sm font-bold fill-gray-700 pointer-events-none"
                          >
                            {tooth.number}
                          </text>
                        </g>
                      );
                    })}
                  </g>

                  {/* Lower Arch */}
                  <g>
                    {dentalChart.lowerTeeth.slice(0, 8).map((tooth, index) => {
                      const angle = index * 22.5 + 90;
                      const radius = 100;
                      const x = 250 + radius * Math.cos((angle * Math.PI) / 180);
                      const y = 260 + radius * Math.sin((angle * Math.PI) / 180);

                      return (
                        <g key={tooth.number}>
                          <circle
                            cx={x}
                            cy={y}
                            r="16"
                            className={cn(
                              "cursor-pointer transition-all duration-300",
                              selectedTooth === tooth.number
                                ? "fill-blue-200 stroke-blue-600 stroke-3"
                                : "fill-white stroke-gray-300 stroke-2 hover:fill-blue-50 hover:stroke-blue-400",
                            )}
                            onClick={() =>
                              setSelectedTooth(
                                selectedTooth === tooth.number
                                  ? null
                                  : tooth.number,
                              )
                            }
                          />
                          <text
                            x={x}
                            y={y + 4}
                            textAnchor="middle"
                            className="text-sm font-bold fill-gray-700 pointer-events-none"
                          >
                            {tooth.number}
                          </text>
                        </g>
                      );
                    })}
                  </g>

                  {/* Center Logo */}
                  <circle cx="250" cy="200" r="30" className="fill-indigo-100 stroke-indigo-300 stroke-2" />
                  <text x="250" y="205" textAnchor="middle" className="text-sm font-bold fill-indigo-600">
                    {patient?.avatar || "👨‍⚕️"}
                  </text>
                </svg>
              </div>
            </div>

            {/* Selected Tooth Details */}
            {selectedTooth && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                    {selectedTooth}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">Premolar الثاني</h4>
                    <p className="text-gray-600">السن رقم #{selectedTooth}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        المشكلة:
                      </label>
                      <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>تسوس</option>
                        <option>التهاب عصب</option>
                        <option>كسر</option>
                        <option>حساسية</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        العلاج المقترح:
                      </label>
                      <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>حشو عادي</option>
                        <option>حشو قناة الجذر</option>
                        <option>تاج</option>
                        <option>قلع</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      ملاحظات التشخيص:
                    </label>
                    <textarea
                      placeholder="سن مصاب بالتسوس، يحتاج إلى حشو لإصلاح الضرر..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={4}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-6">
                  <button className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-all">
                    <span className="w-3 h-3 bg-red-600 rounded-full"></span>
                    تسجيل النتائج
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-all">
                    <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
                    التالي
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-all">
                    <Camera className="w-4 h-4" />
                    التقاط صورة
                  </button>
                </div>

                <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold">
                  <Save className="w-5 h-5 inline-block mr-2" />
                  حفظ البيانات
                </button>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            {/* Oral Examination Header */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <Eye className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">نتائج الفحص الفموي</h3>
              <p className="text-gray-600">النتائج السريرية والتقييمات</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-indigo-600" />
                    الإطباق
                  </h4>
                  <div className="space-y-3">
                    {["الإطباق الطبيعي", "الإطباق المتقاطع", "العضة العميقة", "العضة المفتوحة"].map((option) => (
                      <label key={option} className="flex items-center p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-all">
                        <input
                          type="radio"
                          name="occlusal"
                          className="h-5 w-5 text-indigo-600 border-2 border-gray-300 focus:ring-indigo-500 focus:ring-2"
                        />
                        <span className="mr-3 text-sm font-medium text-gray-900">
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-green-600" />
                    Torus Palatinus
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {["لا", "صغير", "متوسط", "كبير"].map((option) => (
                      <label key={option} className="flex items-center p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-all text-center">
                        <input
                          type="radio"
                          name="torus"
                          className="h-4 w-4 text-green-600 border-2 border-gray-300 focus:ring-green-500"
                        />
                        <span className="mr-2 text-sm font-medium text-gray-900">
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-purple-600" />
                    Torus Mandibularis
                  </h4>
                  <div className="space-y-3">
                    {["لا", "الجانب الأيسر", "الجانب الأيمن", "كلا الجانبين"].map(
                      (option) => (
                        <label key={option} className="flex items-center p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-all">
                          <input
                            type="radio"
                            name="mandibularis"
                            className="h-5 w-5 text-purple-600 border-2 border-gray-300 focus:ring-purple-500 focus:ring-2"
                          />
                          <span className="mr-3 text-sm font-medium text-gray-900">
                            {option}
                          </span>
                        </label>
                      ),
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-orange-600" />
                    Palatum
                  </h4>
                  <div className="space-y-3">
                    {["طبيعي", "الجانب الأيسر", "الجانب الأيمن", "كلا الجانبين"].map(
                      (option) => (
                        <label key={option} className="flex items-center p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-all">
                          <input
                            type="radio"
                            name="palatum"
                            className="h-5 w-5 text-orange-600 border-2 border-gray-300 focus:ring-orange-500 focus:ring-2"
                          />
                          <span className="mr-3 text-sm font-medium text-gray-900">
                            {option}
                          </span>
                        </label>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Diastema Section */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-600" />
                Diastema (الفراغ بين الأسنان)
              </h4>
              <div className="space-y-4">
                <label className="flex items-center p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-all">
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-yellow-600 border-2 border-gray-300 rounded-lg focus:ring-yellow-500 focus:ring-2"
                  />
                  <span className="mr-3 text-sm font-medium text-gray-900">نعم، يوجد فراغ</span>
                </label>
                <textarea
                  placeholder="اشرح ما هو الفراغ وكم عرضه..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>
            </div>

            {/* Additional Notes */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                ملاحظات إضافية
              </h4>
              <textarea
                placeholder="أي ملاحظات أو اكتشافات إضافية..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none bg-white"
                rows={4}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            {/* Success Header */}
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">الخدم�� الطبية</h3>
              <p className="text-gray-600 text-lg">نتائج فحص جميع الأسنان</p>
            </div>

            {/* Treatment Summary */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-green-100">
                <h4 className="text-xl font-bold text-gray-900 mb-2">ملخص العلاج</h4>
                <p className="text-gray-600">خطة العلاج المقترحة بناءً على الفحص</p>
              </div>

              <div className="p-6 space-y-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-xl font-bold text-gray-900 mb-1">
                        السن #{selectedTooth || "21"}
                      </h5>
                      <p className="text-gray-600 mb-2">
                        المشكلة: تسوس بسيط في الطبقة الخارجية
                      </p>
                      <p className="text-green-700 font-semibold">
                        العلاج المقترح: حشو تجميلي
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">95%</div>
                      <div className="text-sm text-gray-600">نسبة النجاح</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-2xl border border-blue-100">
                    <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="font-bold text-blue-900">45 دقيقة</div>
                    <div className="text-sm text-blue-600">مدة العلاج</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-2xl border border-green-100">
                    <Star className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="font-bold text-green-900">$150</div>
                    <div className="text-sm text-green-600">التكلفة</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-2xl border border-purple-100">
                    <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="font-bold text-purple-900">أسبوعين</div>
                    <div className="text-sm text-purple-600">الزيارة التالية</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-2xl border border-orange-100">
                    <Shield className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <div className="font-bold text-orange-900">مطلوبة</div>
                    <div className="text-sm text-orange-600">المتابعة</div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-blue-900">توصيات الذكاء الاصطناعي</h4>
                  <p className="text-sm text-blue-600">تحليل متقدم للحالة</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-blue-800">العلاج الوقائي بالفلوريد مُوصى به</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-blue-800">جدولة المتابعة خلال 6 أشهر</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl">
                  <Shield className="w-5 h-5 text-purple-600" />
                  <span className="text-sm text-blue-800">النظر في استخدام واقي الأسنان الليلي</span>
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
                <div>
                  <h4 className="font-semibold text-yellow-800">تنبيه مهم</h4>
                  <p className="text-sm text-yellow-700">
                    يرجى إضافة الفحص الطبي والسجل الطبي لإنهاء العلاج
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className={cn("bg-gradient-to-r p-6 text-white relative overflow-hidden", currentStepData.color)}>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <currentStepData.icon className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{currentStepData.title}</h2>
                <p className="text-white/90">{currentStepData.subtitle}</p>
              </div>
            </div>

            {patient && (
              <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl p-3">
                <div className="w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center text-white font-bold">
                  {patient.avatar}
                </div>
                <div className="text-right">
                  <div className="font-semibold">{patient.name}</div>
                  <div className="text-sm text-white/80">ID: {patient.id}</div>
                </div>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-3 hover:bg-white/20 rounded-2xl transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300",
                    currentStep >= step.id
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                      : currentStep + 1 === step.id
                        ? "bg-blue-100 text-blue-600 border-2 border-blue-200"
                        : "bg-gray-100 text-gray-400",
                  )}
                >
                  {currentStep > step.id ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <step.icon className="w-6 h-6" />
                  )}
                </div>
                <div className="mr-4 hidden lg:block">
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      currentStep >= step.id
                        ? "text-gray-900"
                        : "text-gray-500",
                    )}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-16 h-1 ml-6 rounded-full transition-all duration-300",
                      currentStep > step.id 
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600" 
                        : "bg-gray-200",
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[500px]">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-100 bg-gray-50">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={cn(
              "flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-2xl transition-all",
              currentStep === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-200 bg-gray-100",
            )}
          >
            <ArrowRight className="w-5 h-5" />
            السابق
          </button>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 bg-white px-4 py-2 rounded-xl border">
              {currentStep} من {steps.length}
            </span>
          </div>

          {currentStep === steps.length ? (
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-semibold rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
            >
              <CheckCircle className="w-5 h-5" />
              إنهاء
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
            >
              التالي
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernMedicalCheckupModal;
