import React, { useState } from "react";
import { MapPin, Phone, Star, Navigation, Clock, Shield } from "lucide-react";

interface Clinic {
  id: number;
  name: string;
  address: string;
  rating: number;
  reviews: number;
  distance: string;
  image: string;
  phone: string;
  status: "online" | "offline" | "busy";
  specialties: string[];
  openHours: string;
}

const clinics: Clinic[] = [
  {
    id: 1,
    name: "د. سارة أحمد",
    address: "شارع الكرادة، بغداد",
    rating: 4.9,
    reviews: 245,
    distance: "0.8 كم",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
    phone: "+964 770 123 4567",
    status: "online",
    specialties: ["طب الأسنان العام", "تقويم"],
    openHours: "8:00 ص - 6:00 م",
  },
  {
    id: 2,
    name: "د. محمد علي",
    address: "شارع المنصور، بغداد",
    rating: 4.7,
    reviews: 189,
    distance: "1.2 كم",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face",
    phone: "+964 750 987 6543",
    status: "busy",
    specialties: ["جراحة الفم", "زراعة"],
    openHours: "9:00 ص - 7:00 م",
  },
  {
    id: 3,
    name: "د. فاطمة حسن",
    address: "شارع الأعظمية، بغداد",
    rating: 4.8,
    reviews: 156,
    distance: "2.1 كم",
    image:
      "https://images.unsplash.com/photo-1594824804732-ca8db3449d14?w=100&h=100&fit=crop&crop=face",
    phone: "+964 780 456 7890",
    status: "online",
    specialties: ["طب أسنان الأطفال"],
    openHours: "10:00 ص - 5:00 م",
  },
  {
    id: 4,
    name: "د. أحمد رشيد",
    address: "شارع العربي، بغداد",
    rating: 4.6,
    reviews: 203,
    distance: "3.4 كم",
    image:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=face",
    phone: "+964 760 234 5678",
    status: "offline",
    specialties: ["تجميل الأسنان"],
    openHours: "مغلق اليوم",
  },
];

export default function ClinicFinderCard() {
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClinics = clinics.filter(
    (clinic) =>
      clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clinic.specialties.some((spec) =>
        spec.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-400";
      case "busy":
        return "bg-yellow-400";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "online":
        return "متاح الآن";
      case "busy":
        return "مشغول";
      case "offline":
        return "غير متاح";
      default:
        return "غير معروف";
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl shadow-lg overflow-hidden h-[450px]">
      <div className="flex h-full">
        {/* Clinics List */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              العيادات القريبة منك
            </h3>
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث عن عيادة أو تخصص..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Clinics List */}
          <div className="flex-1 overflow-y-auto">
            {filteredClinics.map((clinic) => (
              <div
                key={clinic.id}
                onClick={() => setSelectedClinic(clinic)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedClinic?.id === clinic.id
                    ? "bg-blue-50 border-blue-200"
                    : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <img
                      src={clinic.image}
                      alt={clinic.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(
                        clinic.status,
                      )} rounded-full border-2 border-white`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">
                        {clinic.name}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {clinic.distance}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 mb-1 truncate">
                      {clinic.address}
                    </p>

                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-700">
                          {clinic.rating}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({clinic.reviews})
                        </span>
                      </div>
                      <span className="text-xs text-gray-600">
                        {getStatusText(clinic.status)}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {clinic.specialties
                        .slice(0, 2)
                        .map((specialty, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs"
                          >
                            {specialty}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Map */}
        <div className="flex-1 relative">
          {/* Map Image */}
          <div
            className="w-full h-full bg-cover bg-center relative"
            style={{
              backgroundImage: `url(${"https://cdn.builder.io/api/v1/image/assets%2F38bc499df3b84d0eb31a6baa33de2495%2F0c6f79cdd86c4c8aab90efb7a1ce3db8?format=webp&width=800"})`,
            }}
          >
            {/* Map Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />

            {/* Clinic Markers */}
            {filteredClinics.map((clinic, index) => (
              <button
                key={clinic.id}
                onClick={() => setSelectedClinic(clinic)}
                className={`absolute w-10 h-10 rounded-full border-2 border-white shadow-lg transition-all hover:scale-110 ${
                  selectedClinic?.id === clinic.id
                    ? "bg-blue-600 z-20 scale-110"
                    : "bg-red-500 z-10"
                }`}
                style={{
                  left: `${20 + index * 15}%`,
                  top: `${30 + index * 10}%`,
                }}
              >
                <MapPin className="w-5 h-5 text-white mx-auto" />
              </button>
            ))}

            {/* Map Controls */}
            <div className="absolute top-4 right-4 space-y-2">
              <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50">
                <Navigation className="w-5 h-5 text-gray-700" />
              </button>
              <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50">
                <MapPin className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Selected Clinic Info Card - Square Shape */}
            {selectedClinic && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-white rounded-xl shadow-xl p-6">
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={selectedClinic.image}
                      alt={selectedClinic.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">
                        {selectedClinic.name}
                      </h4>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-medium text-gray-900">
                          {selectedClinic.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-3 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {selectedClinic.address}
                  </p>

                  <p className="text-blue-600 text-sm font-medium mb-4">
                    {selectedClinic.distance}
                  </p>

                  <div className="flex flex-col gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      {selectedClinic.openHours}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div
                        className={`w-3 h-3 ${getStatusColor(selectedClinic.status)} rounded-full`}
                      />
                      <span className="font-medium">
                        {getStatusText(selectedClinic.status)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto space-y-2">
                    <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                      احجز موعداً
                    </button>
                    <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                      <Phone className="w-4 h-4" />
                      اتصل الآن
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
