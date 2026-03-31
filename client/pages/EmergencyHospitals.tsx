import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Hospital } from "lucide-react";
import UnifiedPlaceCard from "@/components/UnifiedPlaceCard";

const hospitals = [
  {
    name: "مستشفى بغداد التخصصي",
    distance: "2.5 كم",
    address: "شارع فلسطين، بغداد",
    phone: "0790-111-2222",
    hasEmergency: true,
  },
  {
    name: "مستشفى النهرين",
    distance: "3.2 كم",
    address: "شارع السعدون، بغداد",
    phone: "0790-111-3333",
    hasEmergency: true,
  },
  {
    name: "مستشفى الكندي",
    distance: "4.1 كم",
    address: "شارع الجادرية، بغداد",
    phone: "0790-111-4444",
    hasEmergency: true,
  },
  {
    name: "مستشفى اليرموك",
    distance: "5.5 كم",
    address: "اليرموك، بغداد",
    phone: "0790-222-3333",
    hasEmergency: true,
  },
];

import { useState } from "react";
import UnifiedInteractiveMap from "@/components/UnifiedInteractiveMap";

export default function EmergencyHospitals() {
  const [city, setCity] = useState<string>("بغداد");
  const [onlyEmergency, setOnlyEmergency] = useState<boolean>(true);

  const cities = ["بغداد", "البصرة", "نينوى", "أربيل", "النجف", "بابل", "صلاح الدين"];

  const filtered = hospitals.filter((h) => {
    const matchCity = !city || h.address.includes(city) || h.name.includes(city);
    const matchEmergency = !onlyEmergency || h.hasEmergency;
    return matchCity && matchEmergency;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="bg-white border-b py-4">
        <div className="max-w-6xl mx-auto px-4">
          <Link to="/emergency" className="inline-flex items-center gap-2 text-gray-700 hover:text-blue-600">
            <ArrowRight className="w-5 h-5" />
            <span>العودة إلى الطوارئ</span>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
            <Hospital className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">المستشفيات القريبة للطوارئ</h1>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6">
          <select value={city} onChange={(e) => setCity(e.target.value)} className="px-4 py-2 border rounded-xl bg-white">
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={onlyEmergency} onChange={(e) => setOnlyEmergency(e.target.checked)} />
            عرض المستشفيات التي تقدم خدمات الطوارئ فقط
          </label>
        </div>

        {/* Interactive map filtered by city and emergency */}
        <div className="mb-6">
          <UnifiedInteractiveMap title="خريطة المستشفيات الطارئة" description={`عرض المستشفيات في ${city}`} city={city} onlyEmergency={onlyEmergency} />
        </div>

        {/* Hospital list with applied filters */}
        <div className="grid gap-4 md:grid-cols-3">
          {filtered.map((h, i) => (
            <UnifiedPlaceCard
              key={i}
              name={h.name}
              distance={h.distance}
              address={h.address}
              phone={h.phone}
              badge={h.hasEmergency ? "طوارئ" : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
