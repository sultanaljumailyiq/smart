import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Phone,
  Star,
  Clock,
  Navigation,
  Stethoscope,
  Shield,
  Award,
  Users,
  Calendar,
  X,
  ExternalLink,
  CheckCircle,
  Wifi,
  Car,
  CreditCard,
  Globe,
  ChevronRight,
  MessageCircle,
  ChevronLeft,
  Search,
  Filter,
  Target,
} from "lucide-react";

interface Clinic {
  id: string;
  clinicId: string;
  name: string;
  type: string;
  address: string;
  rating: number;
  reviews: number;
  distance: string;
  image: string;
  phone: string;
  status: "available" | "busy" | "closed";
  services: string[];
  openHours: string;
  certification: boolean;
  doctors: Array<{
    id: string;
    name: string;
    specialties: string[];
  }>;
  specialties: string[];
  amenities: string[];
  priceRange: string;
  website?: string;
  emergencyPhone?: string;
  description: string;
}

interface SimpleInteractiveMapProps {
  title?: string;
  description?: string;
  showOnHomePage?: boolean;
  maxResults?: number;
}

// بيانات تجريبية للعيادات
const mockClinics: Clinic[] = [
  {
    id: "1",
    clinicId: "CL-BAGHDAD-001",
    name: "عيادة الدكتور أحمد للأسنان",
    type: "عيادة أسنان",
    address: "شارع الكرادة، بغداد",
    rating: 4.9,
    reviews: 312,
    distance: "0.5 كم",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
    phone: "+964 770 123 4567",
    status: "available",
    services: ["زراعة الأسنان", "تبييض الأسنان", "تقويم الأسنان", "علاج العصب"],
    openHours: "8:00 ص - 8:00 م",
    certification: true,
    doctors: [
      {
        id: "doc1",
        name: "د. أحمد الرحمة",
        specialties: ["جراحة الفم والفكين", "زراعة الأسنان"]
      },
      {
        id: "doc2", 
        name: "د. فاطمة النور",
        specialties: ["تقويم الأسنان", "طب أسنان الأطفال"]
      }
    ],
    specialties: ["جراحة الفم والفكين", "زراعة الأسنان", "التجميل"],
    amenities: ["موقف سيارات", "واي فاي مجاني", "دفع إلكتروني", "مكيف هواء"],
    priceRange: "100 - 500 ألف دينار",
    website: "https://dr-ahmed-dental.com",
    emergencyPhone: "+964 770 111 2222",
    description: "عيادة متخصصة في طب الأسنان وزراعة الأسنان بأحدث التقنيات العالمية.",
  },
  {
    id: "2",
    clinicId: "CL-BAGHDAD-002",
    name: "مركز الابتسامة المشرقة",
    type: "مركز طبي",
    address: "شارع المنصور، بغداد",
    rating: 4.8,
    reviews: 245,
    distance: "1.2 كم",
    image: "https://images.unsplash.com/photo-1583912086123-6b9e4a0f8b99?w=400&h=300&fit=crop",
    phone: "+964 750 987 6543",
    status: "busy",
    services: ["تقويم الأسنان", "تنظيف الأسنان", "حشوات تجميلية"],
    openHours: "7:00 ص - 10:00 م",
    certification: true,
    doctors: [
      {
        id: "doc3",
        name: "د. سارة النور",
        specialties: ["تقويم الأسنان", "طب أسنان الأطفال"]
      }
    ],
    specialties: ["تقويم الأسنان", "طب أسنان الأطفال"],
    amenities: ["صالة انتظار", "واي فاي مجاني", "مواعيد مرنة"],
    priceRange: "80 - 400 ألف دينار",
    emergencyPhone: "+964 750 888 9999",
    description: "مركز متخصص في تقويم الأسنان وطب أسنان الأطفال مع فريق طبي محترف.",
  },
  {
    id: "3",
    clinicId: "CL-BAGHDAD-003", 
    name: "عيادة الدكتور محمد المتخصصة",
    type: "عيادة أسنان",
    address: "شارع الجادرية، بغداد",
    rating: 4.7,
    reviews: 189,
    distance: "2.1 كم",
    image: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&h=300&fit=crop",
    phone: "+964 771 456 7890",
    status: "available",
    services: ["زراعة الأسنان", "جراحة الفم", "علاج اللثة"],
    openHours: "9:00 ص - 7:00 م",
    certification: true,
    doctors: [
      {
        id: "doc4",
        name: "د. محمد العلي",
        specialties: ["جراحة الفم والفكين", "زراعة الأسنان"]
      }
    ],
    specialties: ["جراحة الفم والفكين", "زراعة الأسنان"],
    amenities: ["تقنيات حديثة", "تعقيم متقدم", "خدمة VIP"],
    priceRange: "150 - 800 ألف دينار",
    description: "عيادة متخصصة في الجراحات المتقدمة وزراعة الأسنان.",
  }
];

const SimpleInteractiveMap: React.FC<SimpleInteractiveMapProps> = ({
  title = "عيادات الأسنان القريبة منك", 
  description = "اعثر على أفضل عيادات الأسنان واحجز موعدك بسهولة",
  showOnHomePage = false,
  maxResults = 10,
}) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // فلترة العيادات حسب البحث
  const filteredClinics = mockClinics.filter(clinic =>
    clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    clinic.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    clinic.doctors.some(doctor => 
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  ).slice(0, maxResults);

  const currentClinic = filteredClinics[currentIndex];

  // التنقل بين العيادات
  const nextClinic = () => {
    setCurrentIndex((prev) => 
      prev >= filteredClinics.length - 1 ? 0 : prev + 1
    );
  };

  const prevClinic = () => {
    setCurrentIndex((prev) => 
      prev <= 0 ? filteredClinics.length - 1 : prev - 1
    );
  };

  // فتح تفاصيل العيادة
  const openClinicDetails = (clinic: Clinic) => {
    setSelectedClinic(clinic);
  };

  // حجز موعد - التوجه لصفحة الحجز المحسنة
  const bookAppointment = (clinic: Clinic) => {
    navigate(`/mobile-booking/${clinic.clinicId}`);
  };

  if (filteredClinics.length === 0) {
    return (
      <div className="w-full bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد نتائج</h3>
          <p className="text-gray-600">جرب تغيير مصطلح البحث</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 rounded-3xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200/50 bg-white/70 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <MapPin className="w-7 h-7 text-blue-600" />
              {title}
            </h3>
            <p className="text-gray-600 mt-1">{description}</p>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
            <Target className="w-4 h-4" />
            نسخة تجريبية
          </div>
        </div>

        {/* أدوات البحث */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث عن عيادة أو طبيب..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* محتوى الخريطة */}
      <div className="relative">
        {/* التنقل */}
        <div className="flex items-center justify-between p-4 bg-white/50 backdrop-blur-sm">
          <button
            onClick={prevClinic}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white/80 rounded-xl transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <span className="text-sm text-gray-600">
              {currentIndex + 1} من {filteredClinics.length}
            </span>
          </div>
          
          <button
            onClick={nextClinic}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white/80 rounded-xl transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* بطاقة العيادة الحالية */}
        {currentClinic && (
          <div className="p-6">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all hover:scale-[1.02]">
              {/* صورة العيادة */}
              <div className="relative h-48 bg-gradient-to-r from-blue-500 to-green-500">
                <img
                  src={currentClinic.image}
                  alt={currentClinic.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  {currentClinic.certification && (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      معتمدة
                    </span>
                  )}
                  <span className={`text-white text-xs px-2 py-1 rounded-full ${
                    currentClinic.status === "available" ? "bg-green-500" :
                    currentClinic.status === "busy" ? "bg-yellow-500" : "bg-red-500"
                  }`}>
                    {currentClinic.status === "available" ? "متاحة" :
                     currentClinic.status === "busy" ? "مشغولة" : "مغلقة"}
                  </span>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">
                    {currentClinic.distance}
                  </span>
                </div>
              </div>

              {/* معلومات العيادة */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-900 mb-1">
                      {currentClinic.name}
                    </h4>
                    <p className="text-gray-600 text-sm mb-2">{currentClinic.type}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{currentClinic.rating}</span>
                        <span className="text-gray-500">({currentClinic.reviews} مراجعة)</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{currentClinic.openHours}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* عنوان العيادة */}
                <div className="flex items-start gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{currentClinic.address}</span>
                </div>

                {/* الأطباء */}
                {currentClinic.doctors && currentClinic.doctors.length > 0 && (
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      الأطباء
                    </h5>
                    <div className="space-y-1">
                      {currentClinic.doctors.slice(0, 2).map((doctor, index) => (
                        <div key={doctor.id || index} className="text-sm text-gray-600">
                          <span className="font-medium">{doctor.name}</span>
                          {doctor.specialties && doctor.specialties.length > 0 && (
                            <span className="text-gray-500"> - {doctor.specialties.join(", ")}</span>
                          )}
                        </div>
                      ))}
                      {currentClinic.doctors.length > 2 && (
                        <span className="text-sm text-blue-600">
                          +{currentClinic.doctors.length - 2} أطباء آخرين
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* الخدمات */}
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-900 mb-2">الخدمات الرئيسية</h5>
                  <div className="flex flex-wrap gap-2">
                    {currentClinic.services.slice(0, 3).map((service, index) => (
                      <span
                        key={index}
                        className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full"
                      >
                        {service}
                      </span>
                    ))}
                    {currentClinic.services.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{currentClinic.services.length - 3} خدمات أخرى
                      </span>
                    )}
                  </div>
                </div>

                {/* الأسعار */}
                <div className="mb-6">
                  <span className="text-sm text-gray-600">نطاق الأسعار: </span>
                  <span className="text-sm font-medium text-green-600">
                    {currentClinic.priceRange}
                  </span>
                </div>

                {/* أزرار العمل */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => bookAppointment(currentClinic)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    احجز موعد
                  </button>
                  
                  <button
                    onClick={() => openClinicDetails(currentClinic)}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    التفاصيل
                  </button>
                  
                  <a
                    href={`tel:${currentClinic.phone}`}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    اتصل الآن
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* نافذة تفاصيل العيادة */}
      {selectedClinic && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedClinic.name}
                </h3>
                <button
                  onClick={() => setSelectedClinic(null)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* محتوى مفصل للعيادة */}
              <div className="space-y-6">
                {/* المعلومات الأساسية */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">معلومات العيادة</h4>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-700">{selectedClinic.address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-500" />
                      <a href={`tel:${selectedClinic.phone}`} className="text-blue-600 hover:underline">
                        {selectedClinic.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-700">{selectedClinic.openHours}</span>
                    </div>
                    {selectedClinic.website && (
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-gray-500" />
                        <a 
                          href={selectedClinic.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          زيارة الموقع
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* الأطباء */}
                {selectedClinic.doctors && selectedClinic.doctors.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">الأطباء المتاحون</h4>
                    <div className="space-y-3">
                      {selectedClinic.doctors.map((doctor, index) => (
                        <div key={doctor.id || index} className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium text-gray-900">{doctor.name}</h5>
                              {doctor.specialties && doctor.specialties.length > 0 && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {doctor.specialties.join(", ")}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => bookAppointment(selectedClinic)}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                            >
                              احجز مع هذا الطبيب
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* الوصف */}
                {selectedClinic.description && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">حول العيادة</h4>
                    <p className="text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-4">
                      {selectedClinic.description}
                    </p>
                  </div>
                )}
              </div>

              {/* أزرار الإجراءات */}
              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => bookAppointment(selectedClinic)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  احجز موعد الآن
                </button>
                <a
                  href={`tel:${selectedClinic.phone}`}
                  className="flex-1 bg-green-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  اتصل بالعيادة
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleInteractiveMap;
