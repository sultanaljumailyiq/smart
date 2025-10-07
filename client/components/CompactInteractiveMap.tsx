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
  ArrowRight,
} from "lucide-react";
import ImageWithFallback from "@/components/ImageWithFallback";

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

interface CompactInteractiveMapProps {
  title?: string;
  description?: string;
  showOnHomePage?: boolean;
  maxResults?: number;
  initialFilter?: "all" | "nearby" | "247" | "emergency";
  showFilters?: boolean;
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
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
    phone: "+964 770 123 4567",
    status: "available",
    services: ["زراعة الأسنان", "تبييض الأسنان", "تقويم الأسنان", "علاج العصب"],
    openHours: "8:00 ص - 8:00 م",
    certification: true,
    doctors: [
      {
        id: "doc1",
        name: "د. أحمد الرحمة",
        specialties: ["جراحة الفم والفكين", "زراعة الأسنان"],
      },
    ],
    specialties: ["جراحة الفم والفكين", "زراعة الأسنان", "التجميل"],
    amenities: ["موقف سيارات", "واي فاي مجاني", "دفع إلكتروني", "مكيف هواء"],
    priceRange: "100 - 500 ألف دينار",
    website: "https://dr-ahmed-dental.com",
    emergencyPhone: "+964 770 111 2222",
    description:
      "عيادة متخصصة في طب الأسنان وزراعة الأسنان بأحدث التقنيات العالمية.",
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
    image:
      "https://images.unsplash.com/photo-1583912086123-6b9e4a0f8b99?w=400&h=300&fit=crop",
    phone: "+964 750 987 6543",
    status: "busy",
    services: ["تقويم الأسنان", "تنظيف الأسنان", "حشوات تجميلية"],
    openHours: "7:00 ص - 10:00 م",
    certification: true,
    doctors: [
      {
        id: "doc3",
        name: "د. سارة النور",
        specialties: ["تقويم الأسنان", "طب أسنان الأطفال"],
      },
    ],
    specialties: ["تقويم الأسنان", "طب أسنان الأطفال"],
    amenities: ["صالة انتظار", "واي فاي مجاني", "مواعيد مرنة"],
    priceRange: "80 - 400 ألف دينار",
    emergencyPhone: "+964 750 888 9999",
    description:
      "مركز متخصص في تقويم الأسنان وطب أسنان الأطفال مع فريق طبي محترف.",
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
    image:
      "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&h=300&fit=crop",
    phone: "+964 771 456 7890",
    status: "available",
    services: ["زراعة الأسنان", "جراحة الفم", "علاج اللثة"],
    openHours: "9:00 ص - 7:00 م",
    certification: true,
    doctors: [
      {
        id: "doc4",
        name: "د. محمد العلي",
        specialties: ["جراحة الفم والفكين", "زراعة الأسنان"],
      },
    ],
    specialties: ["جراحة الفم والفكين", "زراعة الأسنان"],
    amenities: ["موقف سيارات", "مكيف هواء", "استقبال مريح"],
    priceRange: "120 - 600 ألف دينار",
    description:
      "عيادة متقدمة في جراح�� الفم والفكين مع خبرة تزيد عن 15 عاماً.",
  },
  {
    id: "4",
    clinicId: "CL-BAGHDAD-004",
    name: "مجمع العناية الطبية",
    type: "مجمع طبي",
    address: "شارع الحرية، بغداد",
    rating: 4.6,
    reviews: 156,
    distance: "2.8 كم",
    image:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop",
    phone: "+964 782 654 3210",
    status: "available",
    services: ["طب عام", "أسنان", "جلدية", "نساء وولادة"],
    openHours: "6:00 ص - 12:00 ص",
    certification: true,
    doctors: [
      {
        id: "doc5",
        name: "د. ليلى الصباح",
        specialties: ["طب عام", "الطب الباطني"],
      },
    ],
    specialties: ["طب عام", "تخصصات متعددة"],
    amenities: ["مختبر", "صيدلية", "أشعة", "موقف كبير"],
    priceRange: "50 - 300 ألف دينار",
    description: "مجمع طبي شامل يقدم خدمات متنوعة على مدار الساعة.",
  },
  {
    id: "5",
    clinicId: "CL-BAGHDAD-005",
    name: "عيادة الرعاية السريعة",
    type: "عيادة طوارئ",
    address: "شار�� الأمين، بغداد",
    rating: 4.4,
    reviews: 98,
    distance: "3.5 كم",
    image:
      "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=300&fit=crop",
    phone: "+964 790 555 1234",
    status: "available",
    services: ["طوارئ", "إسعافات أولية", "فحوصات سريعة"],
    openHours: "24 ساعة",
    certification: true,
    doctors: [
      {
        id: "doc6",
        name: "د. عمر الطبيب",
        specialties: ["طب الطوارئ", "الإسعافات الأولية"],
      },
    ],
    specialties: ["طب الطوارئ", "الرعاية السريعة"],
    amenities: ["خدمة 24/7", "سيارة إسعاف", "معدات طوارئ"],
    priceRange: "30 - 200 ألف دينار",
    emergencyPhone: "+964 790 555 0000",
    description: "عيادة طوارئ متخصصة في الرعاية السريعة والإسعافات الأولية.",
  },
  {
    id: "6",
    clinicId: "CL-BAGHDAD-006",
    name: "مركز الشفاء التخصصي",
    type: "مستشفى خاص",
    address: "شارع الخضراء، بغداد",
    rating: 4.9,
    reviews: 412,
    distance: "4.2 كم",
    image:
      "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=400&h=300&fit=crop",
    phone: "+964 760 321 9876",
    status: "available",
    services: ["جراحة", "باطنية", "قلبية", "عظام"],
    openHours: "24 ساعة",
    certification: true,
    doctors: [
      {
        id: "doc7",
        name: "د. فاطمة المختصة",
        specialties: ["جراحة عامة", "أمراض القلب"],
      },
    ],
    specialties: ["جراحة", "تخصصات دقيقة"],
    amenities: ["غرف عمليات", "عناية مركزة", "مختبرات متقدمة"],
    priceRange: "200 - 1000 ألف دينار",
    website: "https://shifa-hospital.com",
    description: "مستشفى تخصصي حديث بأعلى معايير الجودة والرعاية الطبية.",
  },
];

const CompactInteractiveMap: React.FC<CompactInteractiveMapProps> = ({
  title = "العيادات والمستشفيات القريبة",
  description = "اعثر على أقرب العيادات واحجز موعدك بسهولة",
  showOnHomePage = false,
  maxResults = 6,
  initialFilter = "all",
  showFilters = true,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [filter, setFilter] = useState<"all" | "nearby" | "247" | "emergency">(
    initialFilter,
  );

  // Filter clinics based on search and selected filter
  let filteredClinics = mockClinics.filter(
    (clinic) =>
      clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clinic.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clinic.services.some((service) =>
        service.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  if (filter === "emergency") {
    filteredClinics = filteredClinics.filter(
      (c) =>
        c.type.includes("طوارئ") || c.services.some((s) => s.includes("طوارئ")),
    );
  } else if (filter === "247") {
    filteredClinics = filteredClinics.filter(
      (c) =>
        (c.openHours && c.openHours.includes("24")) ||
        (c.amenities && c.amenities.some((a) => a.includes("24/7"))),
    );
  } else if (filter === "nearby") {
    filteredClinics = [...filteredClinics].sort((a, b) => {
      const da = parseFloat(a.distance);
      const db = parseFloat(b.distance);
      return isNaN(da) || isNaN(db) ? 0 : da - db;
    });
  }

  filteredClinics = filteredClinics.slice(0, maxResults);

  const handleBooking = (clinic: Clinic) => {
    navigate(`/simplified-booking/1`);
  };

  return (
    <div className="bg-gray-50 rounded-2xl p-4 md:p-6">
      {/* Compact Clinics Grid */}
      <div className="flex flex-row gap-3 md:gap-4 overflow-x-auto snap-x snap-mandatory">
        {filteredClinics.map((clinic) => (
          <div
            key={clinic.id}
            className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer transform hover:-translate-y-1 min-w-[220px] max-w-[220px] snap-start"
            onClick={() =>
              navigate(`/medical-services?section=directory#directory-map`)
            }
          >
            {/* Compact Clinic Image */}
            <div className="relative h-20 md:h-24 bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center overflow-hidden">
              <ImageWithFallback
                src={clinic.image}
                alt={clinic.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                type="clinic"
                clinicName={clinic.name}
              />
              <div className="absolute top-1 right-1 md:top-2 md:right-2">
                <div
                  className={`px-1 py-0.5 md:px-2 md:py-1 rounded-full text-xs font-medium ${
                    clinic.status === "available"
                      ? "bg-green-500 text-white"
                      : clinic.status === "busy"
                        ? "bg-yellow-500 text-white"
                        : "bg-red-500 text-white"
                  }`}
                >
                  {clinic.status === "available"
                    ? "متاح"
                    : clinic.status === "busy"
                      ? "مشغول"
                      : "مغلق"}
                </div>
              </div>
              <div className="absolute bottom-1 left-1 md:bottom-2 md:left-2">
                <div className="bg-white/90 backdrop-blur-sm px-1 py-0.5 md:px-2 md:py-1 rounded-full text-xs font-medium text-gray-700 flex items-center gap-1">
                  <MapPin className="w-2 h-2 md:w-3 md:h-3" />
                  {clinic.distance}
                </div>
              </div>
            </div>

            {/* Compact Clinic Info */}
            <div className="p-2 md:p-3">
              <div className="mb-2">
                <h3 className="text-xs md:text-sm font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {clinic.name}
                </h3>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded bg-gray-900" aria-hidden />
                    <span className="sr-only">شعار</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="font-semibold text-gray-900">
                      {clinic.rating}
                    </span>
                  </div>
                </div>
              </div>

              {/* Services Preview - Mobile optimized */}
              <div className="mb-2">
                <div className="flex flex-wrap gap-1">
                  <span className="bg-blue-50 text-blue-700 px-1 py-0.5 md:px-2 md:py-1 rounded-full text-xs font-medium line-clamp-1">
                    {clinic.services[0]}
                  </span>
                  {clinic.services.length > 1 && (
                    <span className="bg-gray-100 text-gray-600 px-1 py-0.5 md:px-2 md:py-1 rounded-full text-xs font-medium">
                      +{clinic.services.length - 1}
                    </span>
                  )}
                </div>
              </div>

              {/* Compact Actions */}
              <div className="flex">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBooking(clinic);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded-lg transition-colors flex items-center justify-center"
                  aria-label="حجز"
                >
                  <Calendar className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More Button */}
      {filteredClinics.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <Search className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-500">لم يتم العثور على نتائج مطابقة</p>
        </div>
      ) : (
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/medical-services")}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            عرض جميع العيادات
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CompactInteractiveMap;
