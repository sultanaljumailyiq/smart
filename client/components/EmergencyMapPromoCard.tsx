import { Link } from "react-router-dom";
import { Map as MapIcon, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmergencyMapPromoCardProps {
  className?: string;
}

export default function EmergencyMapPromoCard({ className }: EmergencyMapPromoCardProps) {
  return (
    <div className={cn("bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden", className)}>
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <MapIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">الخريطة التفاعلية للعيادات القريبة</h3>
              <p className="text-xs text-white/80">اعثر بسرعة على أقرب العيادات واحجز فوراً</p>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4">
        <Link
          to="/medical-services?section=emergency#medical-map"
          className="inline-flex items-center justify-center gap-2 w-full py-2 rounded-lg font-semibold text-white transition-all text-sm shadow-md bg-gradient-to-r from-blue-600 to-cyan-600 hover:shadow-lg"
        >
          افتح الخريطة
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
