import React, { useState, useRef, useEffect } from "react";
import {
  MapPin,
  Clock,
  Star,
  Phone,
  Navigation,
  Filter,
  Search,
  Shield,
  Calendar,
  Users,
  X,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// تعريف نوع الخدمة الطبية
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
  specialties: string[];
  amenities: string[];
  priceRange: string;
  description: string;
  website?: string;
  emergencyPhone?: string;
}

const medicalServices: MedicalService[] = [
  {
    id: 1,
    name: "مركز الرحمة للأشعة",
    type: "مركز أشعة",
    address: "شارع الكرادة، بغداد",
    rating: 4.8,
    reviews: 312,
    distance: "0.5 كم",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
    phone: "+964 770 123 4567",
    status: "available",
    services: ["أشعة سينية", "أشعة بانوراما", "أشعة ثلاثية الأبعاد"],
    openHours: "8:00 ص - 8:00 م",
    certification: true,
    specialties: ["أشعة الأسنان", "التصوير ثلاثي الأبعاد"],
    amenities: ["موقف سيارات", "واي فاي مجاني"],
    priceRange: "متوسط",
    description: "مركز متخصص في خدمات الأشعة التشخيصية للأسنان",
  },
  {
    id: 2,
    name: "مختبر النور الطبي",
    type: "مختبر تحاليل",
    address: "شارع المنصور، بغداد",
    rating: 4.7,
    reviews: 245,
    distance: "1.2 كم",
    image:
      "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=300&fit=crop",
    phone: "+964 771 234 5678",
    status: "busy",
    services: ["تحاليل الدم", "فحص البكتيريا", "تحليل الحساسية"],
    openHours: "6:00 ص - 10:00 م",
    certification: true,
    specialties: ["فحوصات الفم", "تحاليل ما قبل العلاج"],
    amenities: ["تحاليل سريعة", "نتائج إلكترونية"],
    priceRange: "اقتصادي",
    description: "مختبر طبي شامل للتحاليل والفحوصات",
  },
  {
    id: 3,
    name: "عيادة الياسمين للطوارئ",
    type: "عيادة طوارئ",
    address: "شارع الجادرية، بغداد",
    rating: 4.9,
    reviews: 189,
    distance: "2.0 كم",
    image:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop",
    phone: "+964 772 345 6789",
    status: "available",
    services: ["طوارئ الأسنان", "تسكين الألم", "خلع طارئ"],
    openHours: "24 ساعة",
    certification: true,
    specialties: ["طوارئ الأسنان", "علاج الألم"],
    amenities: ["خدمة 24 ساعة", "طاقم طوارئ"],
    priceRange: "متوسط إلى مرتفع",
    description: "عيادة متخصصة في طوارئ الأسنان والعلاج الفوري",
  },
  {
    id: 4,
    name: "مركز بغداد للتخدير",
    type: "مركز تخدير",
    address: "شارع الكرخ، بغداد",
    rating: 4.6,
    reviews: 156,
    distance: "3.5 كم",
    image:
      "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=400&h=300&fit=crop",
    phone: "+964 773 456 7890",
    status: "available",
    services: ["التخدير العام", "التخدير الموضعي", "مراقبة التخدير"],
    openHours: "7:00 ص - 6:00 م",
    certification: true,
    specialties: ["تخدير جراحات الأسنان", "التخدير الآمن"],
    amenities: ["غرف إنعاش", "مراقبة متقدمة"],
    priceRange: "مرتفع",
    description: "مركز متخصص في خدمات التخدير الآمن",
  },
];

// مكون بطاقة الخدمة الطبية
const ServiceCard: React.FC<{
  service: MedicalService;
  onSelect: (service: MedicalService) => void;
  isSelected: boolean;
}> = ({ service, onSelect, isSelected }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "busy":
        return "bg-yellow-100 text-yellow-800";
      case "closed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isSelected ? "ring-2 ring-blue-500" : ""
      }`}
      onClick={() => onSelect(service)}
    >
      <CardContent className="p-4">
        <div className="flex gap-3">
          <img
            src={service.image}
            alt={service.name}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm truncate">
                  {service.name}
                </h3>
                <p className="text-xs text-gray-500">{service.type}</p>
              </div>
              <Badge
                variant="secondary"
                className={`text-xs ${getStatusColor(service.status)}`}
              >
                {getStatusText(service.status)}
              </Badge>
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-current text-yellow-500" />
                <span>{service.rating}</span>
                <span>({service.reviews})</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{service.distance}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
              <Clock className="w-3 h-3" />
              <span>{service.openHours}</span>
            </div>

            <div className="flex flex-wrap gap-1">
              {service.services.slice(0, 2).map((service, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {service}
                </Badge>
              ))}
              {service.services.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{service.services.length - 2}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// مكون تفاصيل الخدمة المحددة
const ServiceDetails: React.FC<{
  service: MedicalService;
  onClose: () => void;
}> = ({ service, onClose }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-lg font-bold text-gray-900">{service.name}</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-32 rounded-lg object-cover mb-3"
          />
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>{service.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <a href={`tel:${service.phone}`} className="text-blue-600">
                {service.phone}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span>{service.openHours}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">الخدمات</h3>
            <div className="flex flex-wrap gap-1">
              {service.services.map((s, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {s}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">التخصصات</h3>
            <div className="flex flex-wrap gap-1">
              {service.specialties.map((specialty, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">المرافق</h3>
            <div className="flex flex-wrap gap-1">
              {service.amenities.map((amenity, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button size="sm" className="flex-1">
              <Calendar className="w-4 h-4 mr-2" />
              احجز موعد
            </Button>
            <Button variant="outline" size="sm">
              <Navigation className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// المكون الرئيسي للخريطة
export default function MedicalServicesMap() {
  const [selectedService, setSelectedService] = useState<MedicalService | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"distance" | "rating">("distance");

  // تصفية الخدمات
  const filteredServices = medicalServices
    .filter((service) => {
      const matchesSearch = service.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        service.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === "all" || service.type === selectedType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === "distance") {
        return parseFloat(a.distance) - parseFloat(b.distance);
      } else {
        return b.rating - a.rating;
      }
    });

  // أنواع الخدمات الفريدة
  const serviceTypes = [...new Set(medicalServices.map(s => s.type))];

  return (
    <div className="space-y-4">
      {/* أدوات التحكم */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="ابحث عن خدمة طبية..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-sm"
            />
          </div>
          <Button variant="outline" size="sm">
            <Search className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedType === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType("all")}
            className="text-xs whitespace-nowrap"
          >
            الكل
          </Button>
          {serviceTypes.map((type) => (
            <Button
              key={type}
              variant={selectedType === type ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType(type)}
              className="text-xs whitespace-nowrap"
            >
              {type}
            </Button>
          ))}
        </div>

        <div className="flex gap-2 text-xs">
          <Button
            variant={sortBy === "distance" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("distance")}
            className="text-xs"
          >
            الأقرب
          </Button>
          <Button
            variant={sortBy === "rating" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("rating")}
            className="text-xs"
          >
            الأعلى تقييماً
          </Button>
        </div>
      </div>

      {/* تفاصيل الخدمة المحددة */}
      {selectedService && (
        <ServiceDetails
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}

      {/* قائمة الخدمات */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            الخدمات الطبية القريبة
          </h2>
          <Badge variant="secondary" className="text-xs">
            {filteredServices.length} خدمة
          </Badge>
        </div>

        <div className="space-y-2">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onSelect={setSelectedService}
              isSelected={selectedService?.id === service.id}
            />
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Info className="w-8 h-8 mx-auto mb-2" />
            <p>لم يتم العثور على خدمات طبية</p>
          </div>
        )}
      </div>
    </div>
  );
}