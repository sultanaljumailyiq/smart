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
    amenities: ["موقف سيارات", "واي فاي مجاني", "دفع إلكترو��ي", "مكيف هواء"],
    priceRange: "100 - 500 ألف دينار",
    website: "https://dr-ahmed-dental.com",
    emergencyPhone: "+964 770 111 2222",
    description:
      "عيادة متخصصة في طب الأسنان وزراعة الأسنان بأحدث التقنيات العالمية. نقدم خدمات شاملة للعناية بالأسنان في بيئة مريحة ومعقمة.",
  },
  {
    id: 2,
    name: "مركز الابتسامة المشرقة",
    type: "مركز طبي",
    address: "شارع المنصور، بغداد",
    rating: 4.8,
    reviews: 245,
    distance: "1.2 كم",
    image:
      "https://images.unsplash.com/photo-1583912086123-6b9e4a0f8b99?w=400&h=300&fit=crop",
    phone: "+964 750 987 6543",
    status: "busy",
    services: ["��قويم الأسنان", "تنظيف الأسنان", "حشوات تجميلية"],
    openHours: "7:00 ص - 10:00 م",
    certification: true,
    doctor: "د. سارة النور",
    specialties: ["تقو��م الأسنان", "طب أسنان الأطفال"],
    amenities: ["صالة انتظار", "واي فاي مجاني", "مواعيد مرنة"],
    priceRange: "80 - 400 أ��ف دينار",
    emergencyPhone: "+964 750 888 9999",
    description:
      "مركز متخصص في تقويم الأسنان و��ب أسنان الأطفال مع فريق طبي محترف.",
  },
  {
    id: 3,
    name: "عيادة الدكتور محمد المتخصصة",
    type: "عيادة أسنان",
    address: "شارع الأعظمية، بغداد",
    rating: 4.7,
    reviews: 189,
    distance: "0.8 كم",
    image:
      "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=400&h=300&fit=crop",
    phone: "+964 780 456 7890",
    status: "available",
    services: ["علاج اللثة", "قلع الأسنان", "تركيبات الأسنان"],
    openHours: "9:00 ص - 6:00 م",
    certification: true,
    doctor: "د. محمد العراقي",
    specialties: ["���لاج اللثة", "جراحة ��لفم"],
    amenities: ["موقف سيارات", "تعقيم متقدم", "دفع نقدي وإلكتروني"],
    priceRange: "50 - 300 ألف دينار",
    website: "https://dr-mohammed-dental.com",
    emergencyPhone: "+964 780 333 4444",
    description:
      "عيادة متخصصة في علاج أمراض اللثة وج��احة الفم مع خبرة تزيد عن 15 عاماً.",
  },
];

export default function EnhancedMedicalServicesMap() {
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
    setSelectedService(null); // Hide bottom card
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
    <section className="bg-white rounded-2xl shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Stethoscope className="w-6 h-6 text-blue-600" />
          عيادات الأسنان القريبة منك
        </h2>
        <p className="text-gray-600">
          اعثر على أفضل عيادات الأسنان واحجز موعدك بسهولة
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="ابحث عن عيادة أو خدمة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
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
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Services List */}
        <div className="lg:col-span-1 space-y-3 max-h-[406px] overflow-y-auto w-[310.9px] ml-auto max-md:flex max-md:flex-row max-md:w-[566px] max-md:gap-2 max-md:overflow-auto max-md:mx-auto max-md:-mb-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              onClick={() => setSelectedService(service)}
              className={`p-3 border border-gray-200 rounded-xl cursor-pointer hover:shadow-md transition-all ${
                selectedService?.id === service.id
                  ? "border-blue-500 bg-blue-50"
                  : "hover:border-gray-300"
              }`}
            >
              <div className="flex items-start gap-4">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-normal text-gray-900 truncate mb-1">
                    {service.name}
                  </div>
                  <p className="text-sm text-blue-600 mb-1">{service.doctor}</p>
                  <p className="text-xs text-gray-600 mb-2 truncate">
                    {service.address}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 max-md:justify-center max-md:items-center">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-700">
                        {service.rating}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 max-md:justify-center max-md:items-center max-md:gap-3">
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

        {/* Interactive Map */}
        <div className="lg:col-span-2">
          <div className="relative h-96 bg-gray-100 rounded-xl overflow-hidden">
            {/* Map Background */}
            <div
              className="w-full h-full bg-cover bg-center max-md:mt-2.5"
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

              {/* Detailed Service Card */}
              {showDetailedCard && centeredService && (
                <div className="absolute inset-4 bg-white rounded-2xl shadow-2xl z-[60] overflow-hidden">
                  <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="relative">
                      <img
                        src={centeredService.image}
                        alt={centeredService.name}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <button
                          onClick={resetMap}
                          className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                        >
                          <X className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                      {centeredService.certification && (
                        <div className="absolute bottom-4 left-4 bg-green-600 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          معتمد
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4 overflow-y-auto">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {centeredService.name}
                          </h3>
                          <p className="text-blue-600 font-medium">
                            {centeredService.doctor}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-bold">
                            {centeredService.rating}
                          </span>
                          <span className="text-sm text-gray-500">
                            ({centeredService.reviews})
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-4">
                        {centeredService.description}
                      </p>

                      {/* Status and Info */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 ${getStatusColor(centeredService.status)} rounded-full`}
                          />
                          <span className="text-sm">
                            {getStatusText(centeredService.status)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {centeredService.distance}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {centeredService.openHours}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-3 h-3 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {centeredService.priceRange}
                          </span>
                        </div>
                      </div>

                      {/* Services */}
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">
                          الخدمات المتاحة
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {centeredService.services
                            .slice(0, 3)
                            .map((service, index) => (
                              <span
                                key={index}
                                className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs"
                              >
                                {service}
                              </span>
                            ))}
                          {centeredService.services.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{centeredService.services.length - 3} أخرى
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Amenities */}
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">
                          المرافق
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {centeredService.amenities.map((amenity, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 text-xs text-gray-600"
                            >
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              {amenity}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-4 border-t border-gray-200">
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() =>
                            handleBookAppointment(centeredService.id)
                          }
                          className="col-span-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                        >
                          احجز موعداً
                        </button>
                        <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                          <Phone className="w-4 h-4 mx-auto" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Service Info Card */}
              {selectedService && !showDetailedCard && (
                <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl shadow-xl p-4">
                  <div className="flex items-start gap-3">
                    <img
                      src={selectedService.image}
                      alt={selectedService.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {selectedService.name}
                      </h4>
                      <p className="text-sm text-blue-600">
                        {selectedService.doctor}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        {selectedService.address}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleBookAppointment(selectedService.id)
                          }
                          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          احجز موعداً
                        </button>
                        <button className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50">
                          <Phone className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
