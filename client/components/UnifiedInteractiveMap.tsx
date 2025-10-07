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
} from "lucide-react";

interface MedicalService {
  id: number;
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
  doctor: string;
  specialties: string[];
  amenities: string[];
  priceRange: string;
  website?: string;
  emergencyPhone?: string;
  description: string;
}

const medicalServices: MedicalService[] = [
  {
    id: 1,
    name: "عيادة الدكتور أحمد للأسنان",
    type: "عيادة أسنان",
    address: "شارع الكرادة، بغداد",
    rating: 4.9,
    reviews: 312,
    distance: "0.5 كم",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
    phone: "+964 770 123 4567",
    status: "available",
    services: ["زراعة الأسنان", "تبييض الأسنان", "تقويم الأسنان", "علاج العصب"],
    openHours: "8:00 ص - 8:00 م",
    certification: true,
    doctor: "د. أحمد الرحمة",
    specialties: ["جراحة الفم والفكين", "زراعة الأسنان", "التجميل"],
    amenities: ["موقف سيارات", "واي فاي مجاني", "دفع إلكتروني", "مكيف هواء"],
    priceRange: "100 - 500 ألف دينار",
    website: "https://dr-ahmed-dental.com",
    emergencyPhone: "+964 770 111 2222",
    description:
      "عيادة متخصصة في طب الأسنان وزراعة الأسنان بأحدث التقنيات العالمية.",
  },
  {
    id: 2,
    name: "مركز الابتسامة المشرقة",
    type: "مركز طبي",
    address: "شارع المنصور، بغ��اد",
    rating: 4.8,
    reviews: 245,
    distance: "1.2 كم",
    image:
      "https://images.unsplash.com/photo-1583912086123-6b9e4a0f8b99?w=400&h=300&fit=crop",
    phone: "+964 750 987 6543",
    status: "busy",
    services: ["تقويم الأسنان", "تنظيف الأسنان", "حشوات تجميلية"],
    openHours: "7:00 ص - 10:00 م",
    certification: true,
    doctor: "د. سارة النور",
    specialties: ["تقويم الأسنان", "طب أسنان الأطفال"],
    amenities: ["صالة انتظار", "واي فاي مجاني", "مواعيد مرنة"],
    priceRange: "80 - 400 ألف دينار",
    emergencyPhone: "+964 750 888 9999",
    description:
      "مركز متخصص في تقويم الأسنان وطب أسنان الأطفال مع فريق طبي محترف.",
  },
  {
    id: 3,
    name: "عيادة الدكتور محمد المتخصصة",
    type: "عيادة أسنان",
    address: "شارع الأعظمية، بغداد",
    rating: 4.7,
    reviews: 189,
    distance: "2.1 كم",
    image:
      "https://images.unsplash.com/photo-1606811951730-e8c2c1b7efc4?w=400&h=300&fit=crop",
    phone: "+964 780 456 7890",
    status: "available",
    services: ["جراحة الفم", "علاج اللثة", "تركيبات الأسنان"],
    openHours: "9:00 ص - 7:00 م",
    certification: true,
    doctor: "د. محمد الخالدي",
    specialties: ["جراحة الفم والفكين", "علاج اللثة"],
    amenities: ["أحدث المعدات", "تعقيم متقدم", "مواعيد طارئة"],
    priceRange: "120 - 600 ألف دينار",
    emergencyPhone: "+964 780 333 4444",
    description:
      "عيادة متخصصة في جراحة ��لفم والفكين مع خبرة أكثر من 15 عاماً.",
  },
];

interface UnifiedInteractiveMapProps {
  title?: string;
  description?: string;
}

export default function UnifiedInteractiveMap({
  title = "عيادات الأسنان القريبة منك",
  description = "اعثر على أفضل عيادات الأسنان واحجز موعدك بسهولة",
}: UnifiedInteractiveMapProps) {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<MedicalService | null>(
    null,
  );
  const [centeredService, setCenteredService] = useState<MedicalService | null>(
    null,
  );
  const [showDetailedCard, setShowDetailedCard] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredServices = medicalServices.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.services.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    const matchesType = filterType === "all" || service.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleMarkerClick = (service: MedicalService) => {
    setCenteredService(service);
    setShowDetailedCard(true);
    setSelectedService(null);
  };

  const handleBookAppointment = (serviceId: number) => {
    navigate(`/simplified-booking/1`);
  };

  const resetMap = () => {
    setCenteredService(null);
    setShowDetailedCard(false);
    setSelectedService(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-400";
      case "busy":
        return "bg-yellow-400";
      case "closed":
        return "bg-red-400";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "متاح";
      case "busy":
        return "مشغول";
      case "closed":
        return "مغلق";
      default:
        return "غير معروف";
    }
  };

  const serviceTypes = [
    { value: "all", label: "جميع الخدمات" },
    { value: "عيادة أسنان", label: "عيادات الأسنان" },
    { value: "مركز طبي", label: "المراكز الطبية" },
    { value: "طوارئ", label: "الطوارئ" },
  ];

  return (
    <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      {/* Search and Filter */}
      <div className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {serviceTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="ابحث عن عيادة أو خدمة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Interactive Map */}
      <div className="mb-6">
        <div className="relative h-96 bg-gray-100 rounded-xl overflow-hidden">
          {/* Map Background */}
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url("https://cdn.builder.io/api/v1/image/assets%2F38bc499df3b84d0eb31a6baa33de2495%2F0c6f79cdd86c4c8aab90efb7a1ce3db8?format=webp&width=800")`,
            }}
          >
            {/* Service Markers */}
            {filteredServices.map((service, index) => {
              const isCentered = centeredService?.id === service.id;
              return (
                <button
                  key={service.id}
                  onClick={() => handleMarkerClick(service)}
                  className={`absolute w-10 h-10 rounded-full border-2 border-white shadow-lg transition-all duration-700 hover:scale-110 ${
                    isCentered
                      ? "bg-red-600 z-50 scale-150 animate-pulse"
                      : "bg-blue-600 z-10"
                  }`}
                  style={{
                    left: isCentered ? "50%" : `${25 + index * 25}%`,
                    top: isCentered ? "50%" : `${30 + (index % 3) * 20}%`,
                    transform: isCentered ? "translate(-50%, -50%)" : "none",
                  }}
                >
                  <Stethoscope
                    className={`${isCentered ? "w-6 h-6" : "w-4 h-4"} text-white mx-auto transition-all duration-500`}
                  />
                </button>
              );
            })}

            {/* Map Controls */}
            <div className="absolute top-4 right-4 space-y-2">
              <button
                onClick={resetMap}
                className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
                title="إعادة تعيين الخريطة"
              >
                <Navigation className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Compact Detailed Service Card */}
            {showDetailedCard && centeredService && (
              <div
                className="absolute top-[55%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl z-[60] overflow-hidden"
                style={{ width: "202px" }}
              >
                <div className="relative">
                  {/* Compact Header with Image */}
                  <div className="relative h-20">
                    <img
                      src={centeredService.image}
                      alt={centeredService.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <button
                      onClick={resetMap}
                      className="absolute top-2 right-2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <X className="w-3 h-3 text-gray-600" />
                    </button>
                    {centeredService.certification && (
                      <div className="absolute bottom-2 left-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        معتمد
                      </div>
                    )}
                  </div>

                  {/* Compact Content */}
                  <div className="p-2.5" style={{ width: "100%" }}>
                    <div className="mb-3">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {centeredService.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-bold text-sm">
                            {centeredService.rating}
                          </span>
                          <span className="text-gray-500 text-xs">
                            ({centeredService.reviews})
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div
                            className={`w-2 h-2 ${getStatusColor(centeredService.status)} rounded-full`}
                          />
                          <span className="text-xs text-gray-600">
                            {getStatusText(centeredService.status)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Info */}
                    <div className="flex flex-col mb-1 text-xs">
                      <div>
                        <div className="flex flex-row">
                          <div className="flex items-center gap-0.5 text-gray-600 justify-start w-[68.5px] max-w-[54px]">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">
                              {centeredService.distance}
                            </span>
                          </div>
                          <div className="flex text-gray-600 justify-center flex-row gap-1">
                            <Clock className="w-3.5 h-3.5 flex flex-col justify-center items-center ml-auto" />
                            <span className="truncate">
                              {centeredService.openHours}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Services Pills */}
                    <div className="mb-0.75 flex flex-row justify-center items-center text-[10px]">
                      <div className="flex flex-row justify-center max-w-[150px] items-start mr-auto gap-0.75">
                        {centeredService.services
                          .slice(0, 3)
                          .map((service, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-700 text-[11px] leading-3 rounded-[5px] overflow-hidden"
                              style={{ padding: "3px 0 3px 9px" }}
                            >
                              {service}
                            </span>
                          ))}
                        {centeredService.services.length > 3 && (
                          <span
                            className="bg-gray-100 text-gray-600 text-[11px] leading-3 rounded-[5px] overflow-hidden"
                            style={{ padding: "3px 0 3px 6px" }}
                          >
                            +{centeredService.services.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-auto pt-0.75">
                      <button
                        onClick={() =>
                          handleBookAppointment(centeredService.id)
                        }
                        className="flex-1 bg-blue-600 text-white py-1.25 px-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                      >
                        احجز موعد
                      </button>
                      <a
                        href={`tel:${centeredService.phone}`}
                        className="bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        style={{ padding: "5px" }}
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Horizontal Scrollable Services List */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          العيادات القريبة
        </h3>
        <div className="relative">
          <div className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 w-full min-h-[117px] items-stretch">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                onClick={() => setSelectedService(service)}
                className={`flex-shrink-0 w-72 border border-gray-200 rounded-xl cursor-pointer hover:shadow-md transition-all ${
                  selectedService?.id === service.id
                    ? "border-blue-500 bg-blue-50"
                    : "hover:border-gray-300"
                } ${service.id === 3 ? "flex-grow-0" : ""}`}
                style={
                  service.id === 3
                    ? { padding: "16px 18px 22px 16px" }
                    : { padding: "16px" }
                }
              >
                <div
                  className={`flex items-start ${service.id === 3 ? "gap-1.25" : "gap-3"}`}
                >
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div
                    className={`flex-1 min-w-0 ${service.id === 3 ? "margin-0--18px-0-auto" : ""}`}
                  >
                    <h4
                      className={`font-semibold text-gray-900 truncate mb-1 ${service.id === 3 ? "pr-3" : ""}`}
                    >
                      {service.name}
                    </h4>
                    <p className="text-xs text-gray-600 mb-2 truncate">
                      {service.address}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-700">
                          {service.rating}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div
                          className={`w-2 h-2 ${getStatusColor(service.status)} rounded-full`}
                        />
                        <span className="text-xs text-gray-600">
                          {getStatusText(service.status)}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {service.distance}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Service Details */}
      {selectedService && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {selectedService.name}
              </h3>
              <p className="text-gray-600 text-sm">{selectedService.address}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end mb-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-bold">{selectedService.rating}</span>
                <span className="text-gray-500 text-sm">
                  ({selectedService.reviews})
                </span>
              </div>
              <div className="flex items-center gap-1 justify-end">
                <div
                  className={`w-2 h-2 ${getStatusColor(selectedService.status)} rounded-full`}
                />
                <span className="text-sm text-gray-600">
                  {getStatusText(selectedService.status)}
                </span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                الخدمات المتاحة
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedService.services.map((service, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                معلومات التواصل
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{selectedService.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{selectedService.openHours}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedService.distance}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => handleBookAppointment(selectedService.id)}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              احجز موعد
            </button>
            <a
              href={`tel:${selectedService.phone}`}
              className="bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              اتصل الآن
            </a>
            {selectedService.website && (
              <a
                href={selectedService.website}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                الموقع
              </a>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
