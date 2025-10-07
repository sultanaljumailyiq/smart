import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  Loader2,
  AlertCircle,
  RefreshCw,
  Filter,
  Search,
  MapPinIcon,
  Target,
} from "lucide-react";
import { ClinicService } from "@/services/clinicService";

interface Clinic {
  id: string;
  clinicId: string;
  name: string;
  type: string;
  address: string;
  rating: number;
  reviews: number;
  distance?: number;
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
    schedule?: any;
  }>;
  specialties: string[];
  amenities: string[];
  priceRange: string;
  website?: string;
  emergencyPhone?: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
  };
  ownerId: string;
}

interface EnhancedInteractiveMapProps {
  title?: string;
  description?: string;
  showOnHomePage?: boolean;
  maxResults?: number;
}

const EnhancedInteractiveMap: React.FC<EnhancedInteractiveMapProps> = ({
  title = "عيادات الأسنان القريبة منك",
  description = "اعثر على أفضل عيادات الأسنان واحجز موعدك بسهولة",
  showOnHomePage = false,
  maxResults = 10,
}) => {
  const navigate = useNavigate();
  
  // حالات البيانات
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  
  // حالات الواجهة
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [sortBy, setSortBy] = useState<"distance" | "rating" | "reviews">("distance");
  const [locationPermission, setLocationPermission] = useState<
    "granted" | "denied" | "prompt" | "unknown"
  >("unknown");

  // الحصول على موقع المستخدم
  const getUserLocation = useCallback(async () => {
    try {
      setLocationPermission("prompt");
      const location = await ClinicService.getUserLocation();
      setUserLocation(location);
      setLocationPermission("granted");
      return location;
    } catch (error) {
      console.warn("Failed to get GPS location, trying IP location:", error);
      setLocationPermission("denied");
      
      try {
        const ipLocation = await ClinicService.getLocationFromIP();
        setUserLocation(ipLocation);
        return ipLocation;
      } catch (ipError) {
        console.error("Failed to get location from IP:", ipError);
        setError("لا يمكن تحديد موقعك. يرجى تفعيل خدمات الموقع أو ��لسماح بالوصول للموقع.");
        throw ipError;
      }
    }
  }, []);

  // تحميل العيادات القريبة
  const loadNearByClinics = useCallback(async (location: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const nearByClinics = await ClinicService.getNearByClinics(
        location.latitude,
        location.longitude,
        20 // نطاق 20 كم
      );
      
      setClinics(nearByClinics.slice(0, maxResults));
    } catch (error) {
      console.error("Error loading clinics:", error);
      setError("فشل في تحميل العيادات القريبة. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }, [maxResults]);

  // تأثير التحميل الأولي
  useEffect(() => {
    const initializeMap = async () => {
      try {
        const location = await getUserLocation();
        if (location) {
          await loadNearByClinics(location);
        }
      } catch (error) {
        setLoading(false);
      }
    };

    initializeMap();
  }, [getUserLocation, loadNearByClinics]);

  // فلترة وترتيب العيادات
  const filteredAndSortedClinics = useMemo(() => {
    let filtered = clinics;

    // فلترة البحث
    if (searchQuery) {
      filtered = filtered.filter(
        (clinic) =>
          clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          clinic.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          clinic.doctors.some((doctor) =>
            doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // فلترة التخصص
    if (selectedSpecialty !== "all") {
      filtered = filtered.filter((clinic) =>
        clinic.specialties.includes(selectedSpecialty)
      );
    }

    // ترتيب
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "reviews":
          return b.reviews - a.reviews;
        case "distance":
        default:
          return (a.distance || 0) - (b.distance || 0);
      }
    });

    return filtered;
  }, [clinics, searchQuery, selectedSpecialty, sortBy]);

  // التنقل بين العيادات
  const nextClinic = () => {
    setCurrentIndex((prev) => 
      prev >= filteredAndSortedClinics.length - 1 ? 0 : prev + 1
    );
  };

  const prevClinic = () => {
    setCurrentIndex((prev) => 
      prev <= 0 ? filteredAndSortedClinics.length - 1 : prev - 1
    );
  };

  // فتح تفاصيل ا��عيادة
  const openClinicDetails = (clinic: Clinic) => {
    setSelectedClinic(clinic);
  };

  // حجز موعد
  const bookAppointment = (clinic: Clinic) => {
    const bookingUrl = `/booking/${clinic.clinicId}?clinic=${clinic.name}&doctors=${clinic.doctors.map(d => d.name).join(',')}`;
    navigate(bookingUrl);
  };

  // إعادة المحاولة
  const retry = () => {
    setError(null);
    setLoading(true);
    getUserLocation().then(location => {
      if (location) {
        loadNearByClinics(location);
      }
    });
  };

  // حالة التحميل
  if (loading) {
    return (
      <div className="w-full bg-gradient-to-br from-blue-50 to-green-50 rounded-3xl p-8">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">جاري تحميل العيادات القريبة</h3>
          <p className="text-gray-600">يرجى الانتظار بينما نحدد موقعك ونجلب أفضل العيادات...</p>
        </div>
      </div>
    );
  }

  // حالة الخطأ
  if (error) {
    return (
      <div className="w-full bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-8">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">خطأ في تحميل العيادات</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={retry}
            className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            المحاولة مرة أخرى
          </button>
        </div>
      </div>
    );
  }

  // لا توجد عيادات
  if (filteredAndSortedClinics.length === 0) {
    return (
      <div className="w-full bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8">
        <div className="text-center">
          <MapPinIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد عيادات قريبة</h3>
          <p className="text-gray-600 mb-4">
            لم نتمكن من العثور على عيادات في منطقتك. جرب توسيع نطاق البحث.
          </p>
          <button
            onClick={() => setSelectedSpecialty("all")}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            إعادة البحث
          </button>
        </div>
      </div>
    );
  }

  const currentClinic = filteredAndSortedClinics[currentIndex];

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
          
          {locationPermission === "granted" && userLocation && (
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
              <Target className="w-4 h-4" />
              تم تحديد موقعك
            </div>
          )}
        </div>

        {/* أدوات البحث والفلترة */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* البحث */}
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

          {/* فلتر التخصص */}
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">جميع التخصصات</option>
            <option value="جراحة الفم والفكين">جراحة الفم والفكين</option>
            <option value="زراعة الأسنان">زراعة الأسنان</option>
            <option value="تقويم الأسنان">تقويم الأسنان</option>
            <option value="طب أسنان الأطفال">طب أسنان الأطفال</option>
          </select>

          {/* ترتيب */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="distance">الأقرب</option>
            <option value="rating">الأعلى تقييماً</option>
            <option value="reviews">الأكثر مراجعة</option>
          </select>
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
              {currentIndex + 1} من {filteredAndSortedClinics.length}
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
                    {currentClinic.distance ? `${currentClinic.distance.toFixed(1)} كم` : ""}
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

                {/* الخدمات الكاملة */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">جميع الخدمات</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedClinic.services.map((service, index) => (
                      <span
                        key={index}
                        className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                {/* المرافق */}
                {selectedClinic.amenities && selectedClinic.amenities.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">المرافق المتاحة</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedClinic.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-gray-700">{amenity}</span>
                        </div>
                      ))}
                    </div>
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

export default EnhancedInteractiveMap;
