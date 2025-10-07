import React, { useEffect, useState } from "react";
import { MapPin, Star, Phone, Navigation, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Clinic {
  id: number;
  name: string;
  arabicName: string;
  specialty?: string;
  governorate: string;
  city: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  rating?: number;
  reviewCount?: number;
  latitude: number;
  longitude: number;
  subscriptionTier?: string;
  priorityLevel: number;
  isPromoted: boolean;
  isActive: boolean;
  openingHours?: string;
  distance?: number;
}

interface NearbyClinicCarouselProps {
  userLat?: number;
  userLng?: number;
  governorate?: string;
  mode?: 'distance' | 'promoted';
  limit?: number;
  className?: string;
}

export function NearbyClinicCarousel({
  userLat,
  userLng,
  governorate,
  mode = 'distance',
  limit = 10,
  className
}: NearbyClinicCarouselProps) {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClinics();
  }, [userLat, userLng, governorate, mode, limit]);

  const fetchClinics = async () => {
    try {
      setLoading(true);
      setError(null);

      let url = '/api/clinics?';
      const params = new URLSearchParams();
      
      if (userLat && userLng) {
        params.append('userLat', userLat.toString());
        params.append('userLng', userLng.toString());
        params.append('radiusKm', '50');
      }
      
      if (governorate) {
        params.append('governorate', governorate);
      }
      
      params.append('mode', mode);
      params.append('limit', limit.toString());
      
      url += params.toString();

      const response = await fetch(url);
      if (!response.ok) throw new Error('فشل تحميل العيادات');
      
      const data = await response.json();
      setClinics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ');
      console.error('Error fetching clinics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetDirections = (clinic: Clinic) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${clinic.latitude},${clinic.longitude}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className={cn("py-8", className)}>
        <h3 className="text-xl font-bold mb-4 text-right">العيادات القريبة</h3>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-shrink-0 w-80 h-48 bg-gray-100 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("py-8", className)}>
        <h3 className="text-xl font-bold mb-4 text-right">العيادات القريبة</h3>
        <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (clinics.length === 0) {
    return (
      <div className={cn("py-8", className)}>
        <h3 className="text-xl font-bold mb-4 text-right">العيادات القريبة</h3>
        <div className="text-gray-500 text-center p-8 bg-gray-50 rounded-lg">
          لا توجد عيادات قريبة في الوقت الحالي
        </div>
      </div>
    );
  }

  return (
    <div className={cn("py-8", className)}>
      <div className="flex items-center justify-between mb-4">
        <button className="text-primary hover:underline text-sm">
          عرض الكل
        </button>
        <h3 className="text-xl font-bold text-right">
          {mode === 'promoted' ? 'العيادات المميزة' : 'العيادات القريبة'}
        </h3>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth" dir="rtl">
        {clinics.map((clinic) => (
          <div
            key={clinic.id}
            className={cn(
              "flex-shrink-0 w-80 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border",
              clinic.isPromoted ? "border-primary/30 bg-gradient-to-br from-primary/5 to-transparent" : "border-gray-200"
            )}
          >
            {clinic.isPromoted && (
              <div className="bg-gradient-to-r from-primary to-primary/80 text-white text-xs px-3 py-1 rounded-t-xl font-medium text-center">
                عيادة مميزة
              </div>
            )}
            
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 text-right">
                  <h4 className="font-bold text-lg mb-1 line-clamp-1">
                    {clinic.arabicName || clinic.name}
                  </h4>
                  {clinic.specialty && (
                    <p className="text-sm text-gray-600">{clinic.specialty}</p>
                  )}
                </div>
                {clinic.rating && (
                  <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-lg">
                    <span className="text-sm font-medium">{clinic.rating}</span>
                    <Star className="h-4 w-4 fill-primary text-primary" />
                  </div>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="line-clamp-1">
                    {clinic.city}, {clinic.governorate}
                    {clinic.distance && ` - ${clinic.distance.toFixed(1)} كم`}
                  </span>
                </div>

                {clinic.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                    <a href={`tel:${clinic.phone}`} className="hover:text-primary" dir="ltr">
                      {clinic.phone}
                    </a>
                  </div>
                )}

                {clinic.openingHours && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="line-clamp-1">{clinic.openingHours}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleGetDirections(clinic)}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                >
                  <Navigation className="h-4 w-4" />
                  الاتجاهات
                </button>
                <a
                  href={`/clinics/${clinic.id}`}
                  className="flex-1 flex items-center justify-center gap-2 border border-primary text-primary py-2 px-4 rounded-lg hover:bg-primary/5 transition-colors text-sm font-medium"
                >
                  التفاصيل
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
