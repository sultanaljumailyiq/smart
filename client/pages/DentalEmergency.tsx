import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Stethoscope,
  Activity,
  Bandage,
  AlertTriangle,
  Phone,
  BookOpenCheck,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { useFloatingModal } from "@/components/FloatingModals";

export default function DentalEmergency() {
  const { openModal } = useFloatingModal();

  const topics = [
    { id: "pain", title: "ألم الأسنان الحاد", path: "/emergency/pain-management", icon: Activity, color: "red" as const },
    { id: "broken", title: "كسر أو تصدع السن", path: "/emergency/first-aid#fractures", icon: Bandage, color: "orange" as const },
    { id: "avulsed", title: "س��وط السن بالكامل", path: "/emergency/first-aid#tooth-avulsion", icon: AlertTriangle, color: "amber" as const },
    { id: "abscess", title: "خراج والتهاب شديد", path: "/emergency/first-aid#infection", icon: AlertTriangle, color: "rose" as const },
  ];

  const steps: Record<string, { title: string; items: string[]; caution?: string; tel?: string; more?: string }[]> = {
    pain: [
      {
        title: "خطوات فورية",
        items: [
          "اشطف الفم بالماء الدافئ.",
          "استخدم خيط الأسنان لإزالة أي بقايا طعام عالقة.",
          "ضع كمادة باردة على الخد لمدة 10 دقائق لتخفيف التورم.",
          "يمكن تناول م��كن مناسب مثل الإيبوبروفين إذا لم تكن لديك موانع طبية.",
        ],
        caution: "تجنب وضع الأسبرين مباشرة على اللثة أو السن.",
        tel: "0790-123-4567",
        more: "/emergency/pain-management",
      },
    ],
    broken: [
      {
        title: "عند كسر أو تصدع السن",
        items: [
          "اشطف الفم بلطف بماء فاتر لتنظيف المنطقة.",
          "احتفظ بأ�� جزء مكسور في حليب أو محلول ملحي.",
          "غطِّ الحواف الحادة بشمع الأسنان المؤقت إن توفر لتجنب جرح اللسان.",
          "ابتعد عن المضغ على جهة السن المصاب حتى تراجع طبيب الأسنان.",
        ],
        tel: "0790-123-4568",
        more: "/emergency/first-aid#fractures",
      },
    ],
    avulsed: [
      {
        title: "سقوط السن بالكامل (للبالغين)",
        items: [
          "أمسك السن من الجزء الظاهر (التاج) وليس الجذر.",
          "إذا اتسخ، اشطفه سريعًا بمحلول ملحي دون فرك الجذر.",
          "حاول إعادته إلى مكانه بر��ق واثبته بعضة خفيفة على شاش نظيف.",
          "إذا تعذر، احفظه في حليب أو داخل الفم بين الخد واللثة (إن لم يكن هناك خطر ابتلاع).",
          "اتجه للطبيب فورًا خلال 30 دقيقة.",
        ],
        caution: "لا تُعيد أسنان الأطفال اللبنية مكانها.",
        tel: "0790-123-4569",
        more: "/emergency/first-aid#tooth-avulsion",
      },
    ],
    abscess: [
      {
        title: "خراج أو التهاب شديد",
        items: [
          "الغرغرة بماء دافئ مع ملح عدة مرات يوميًا.",
          "تجنّب الضغط أو محاولة تفريغ الخراج بنفسك.",
          "استخدم مسكن ألم مناسب وكمادات باردة لتخفيف التورم.",
          "راجع الطبيب عاجلًا للتقييم وقد تحتاج لمضاد حيوي بإشراف طبي.",
        ],
        tel: "0790-123-4570",
        more: "/emergency/first-aid#infection",
      },
    ],
  };

  const colorClasses = (c: "red" | "orange" | "amber" | "rose") => {
    switch (c) {
      case "red":
        return { bg: "bg-red-100", text: "text-red-700", ring: "ring-red-500", pill: "bg-red-600 hover:bg-red-700" };
      case "orange":
        return { bg: "bg-orange-100", text: "text-orange-700", ring: "ring-orange-500", pill: "bg-orange-600 hover:bg-orange-700" };
      case "amber":
        return { bg: "bg-amber-100", text: "text-amber-700", ring: "ring-amber-500", pill: "bg-amber-600 hover:bg-amber-700" };
      case "rose":
        return { bg: "bg-rose-100", text: "text-rose-700", ring: "ring-rose-500", pill: "bg-rose-600 hover:bg-rose-700" };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="bg-white border-b py-4">
        <div className="max-w-6xl mx-auto px-4">
          <Link to="/emergency" className="inline-flex items-center gap-2 text-gray-700 hover:text-red-600">
            <ArrowRight className="w-5 h-5" />
            <span>العودة إلى الطوارئ</span>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">طوارئ الأسنان</h1>
        </div>
        <p className="text-gray-600 mb-6">اضغط على أي بطاقة لعرض الخطوات العملية الفورية، ويمكنك الانتقال للدليل التفصيلي عند الحاجة.</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {topics.map((t) => {
            const Icon = t.icon;
            const cls = colorClasses(t.color);
            const isOpen = openId === t.id;
            return (
              <div key={t.id} className={`bg-white rounded-xl shadow-sm border transition-all hover:shadow-md`}>
                <button
                  type="button"
                  onClick={() => {
                    const groups = steps[t.id] || [];
                    openModal({
                      type: "info",
                      title: t.title,
                      content: (
                        <div className="space-y-4">
                          {groups.map((group, gIdx) => (
                            <div key={gIdx}>
                              <div className="text-sm font-semibold mb-2">{group.title}</div>
                              <ol className="list-decimal list-inside space-y-2 text-gray-800">
                                {group.items.map((it, i) => (
                                  <li key={i} className="text-[14px]">{it}</li>
                                ))}
                              </ol>
                              {group.caution && (
                                <div className="mt-2 text-red-700 text-sm">تنبيه: {group.caution}</div>
                              )}
                              <div className="mt-3 flex flex-wrap gap-2">
                                {group.tel && (
                                  <a href={`tel:${group.tel}`} className={`px-3 py-1.5 rounded-full text-white text-xs font-semibold ${cls.pill}`}>اتصال فوري</a>
                                )}
                                {group.more && (
                                  <Link to={group.more} className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-800 text-xs font-semibold hover:bg-gray-200">قراءة الدليل</Link>
                                )}
                              </div>
                            </div>
                          ))}
                          <div className="mt-4 text-sm text-gray-600">
                            لمزيد من التفاصيل يمكن الاطلاع على الدليل الكامل أو التواصل مع مراكز الطوارئ المحلية.
                          </div>
                        </div>
                      ),
                      size: "md",
                    });
                  }}
                  className="w-full text-start p-3"
                >
                  <div className={`w-8 h-8 rounded-lg ${cls.bg} ${cls.text} flex items-center justify-center mb-2`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-semibold text-gray-900">{t.title}</div>
                    <ChevronDown className={`w-4 h-4 text-gray-500`} />
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><BookOpenCheck className="w-5 h-5 text-orange-600" /> مصادر سريعة</h2>
          <div className="flex gap-2 flex-wrap">
            <Link to="/emergency/first-aid" className="px-3 py-1.5 rounded-full bg-orange-100 text-orange-700 text-sm">دليل الإسعافات الأولية</Link>
            <Link to="/emergency/hospitals" className="px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm">المراكز القريبة</Link>
            <a href="tel:911" className="px-3 py-1.5 rounded-full bg-red-600 text-white text-sm flex items-center gap-1"><Phone className="w-4 h-4" /> 911</a>
          </div>
        </div>
      </div>
    </div>
  );
}
