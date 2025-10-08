import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Activity, Pill, IceCream2, Phone, Shield, Clock } from "lucide-react";

export default function PainManagement() {
  const steps = [
    { icon: IceCream2, title: "كمادات باردة", desc: "ضع كمادات باردة خارج الخد لمدة 10 دقائق لتخفيف التورم." },
    { icon: Pill, title: "مسكن مناسب", desc: "تناول مسكن ألم آمن مثل الإيبوبروفين وفق الإرشادات، وتجنب وضع الأقراص على اللثة." },
    { icon: Shield, title: "نظافة لطيفة", desc: "اغسل الفم بماء فاتر وملح برفق، واستخدم الخيط لإزالة بقايا الطعام." },
    { icon: Clock, title: "احجز موعد", desc: "إذا استمر الألم أو ازداد، احجز موعداً عاجلاً لدى طبيب الأسنان." },
  ];

  const medications = [
    { name: "إيبوبروفين (Ibuprofen)", dose: "200-400mg كل 4-6 ساعات (لا تتجاوز 1200mg يوميًا دون استشارة)", note: "مناسب لتقليل الالتهاب والألم، تجنب عند حساسية أو مشاكل معدية" },
    { name: "باراسيتامول (Paracetamol)", dose: "500-1000mg كل 4-6 ساعات (لا تتجاوز 3000mg يوميًا)", note: "خيار آمن لمن لا يستطيعون تناول NSAIDs" },
    { name: "أموكسيسيلين (Antibiotic - عند الحاجة)", dose: "جرعة وفق وصفة الطبيب", note: "يستخدم عندما يكون هناك عدوى مؤكدة (خراج)" },
  ];

  const faqs = [
    { q: "هل يمكن وضع الثلج داخل الفم؟", a: "لا — ضع الثلج خارجيًا على الخد؛ وضع الثلج داخل الفم قد يسبب إصابات أو حساسية لدى البعض." },
    { q: "متى أذهب للمستشفى؟", a: "عند وجود صعوبة في التنفس أو ابتلاع أو تورم سريع في الوجه أو حمى شديدة — تواصل مع الطوارئ فورًا." },
    { q: "هل أستطيع تأجيل زيارة الطبيب؟", a: "إذا تحسنت الأعراض خلال 48 ساعة مع العلاجات المنزلية، راجع طبيبك خلال أيام. إن لم يتحسن، احجز فورًا." },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      <div className="bg-white border-b py-4">
        <div className="max-w-6xl mx-auto px-4">
          <Link to="/emergency" className="inline-flex items-center gap-2 text-gray-700 hover:text-red-600">
            <ArrowRight className="w-5 h-5" />
            <span>العودة إلى الطوارئ</span>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة ألم الأسنان</h1>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="bg-white rounded-xl shadow-md p-4">
                <div className="w-10 h-10 rounded-lg bg-red-100 text-red-700 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold mb-1">{s.title}</h3>
                <p className="text-sm text-gray-600">{s.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 col-span-2">
            <h2 className="text-lg font-bold mb-3">خطوات عملية لتخفيف الألم فورًا</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-800">
              <li>اشطف الفم بماء فاتر مع قليل من الملح بهدوء.</li>
              <li>استخدم كمادة باردة على الجزء الخارجي من الخد لخفض التورم.</li>
              <li>تناول مسكن مناسب حسب التعليمات وبجرعات آمنة.</li>
              <li>تجنب الأطعمة الساخنة أو المقرمشة على جهة الألم.</li>
              <li>حافظ على النظافة الفموية بلطف ولا تضغط على المنطقة المصابة.</li>
            </ol>

            <h3 className="mt-4 font-semibold">متى تحتاج مضاد حيوي؟</h3>
            <p className="text-sm text-gray-700 mt-2">المضادات الحيوية تُوصف عند وجود خراج، حمى، أو انتشار العدوى؛ لا تستعملها دون استشارة الطبيب.</p>

            <h3 className="mt-4 font-semibold">نصائح آمنة للأطفال وكبار السن</h3>
            <p className="text-sm text-gray-700 mt-2">تجنّب إعطاء الأطفال أو كبار السن جرعات زمينة من NSAIDs دون استشارة مختص. استخدم باراسيتامول كخيار أولي للأطفال بحسب الوزن.</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold mb-3">الأدوية الشائعة</h2>
            <ul className="space-y-2 text-gray-800">
              {medications.map((m, idx) => (
                <li key={idx}>
                  <div className="font-semibold">{m.name}</div>
                  <div className="text-sm text-gray-600">{m.dose}</div>
                  <div className="text-xs text-gray-500">{m.note}</div>
                </li>
              ))}
            </ul>

            <div className="mt-4">
              <a href="tel:911" className="block w-full text-center bg-red-600 text-white py-2 rounded-xl font-semibold">اتصال بالطوارئ 911</a>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-lg font-bold mb-3">الأسئلة الشائعة</h2>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={i}>
                <div className="font-semibold">{f.q}</div>
                <div className="text-sm text-gray-700">{f.a}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold mb-3">متى تتوجه للطبيب فورًا؟</h2>
          <ul className="list-disc list-inside text-sm text-gray-700">
            <li>صعوبة في التنفس أو ابتلاع.</li>
            <li>تورم سريع في الوجه أو عنق.</li>
            <li>حمى عالية مع ألم وانتشار احمرار.</li>
            <li>فقدان الوعي أو نزيف لا يتوقف.</li>
          </ul>
          <div className="mt-4 flex gap-3">
            <a href="tel:911" className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold text-center">اتصال بالطوارئ 911</a>
            <Link to="/medical-services" className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-xl font-semibold text-center">احجز موعداً قريباً</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
