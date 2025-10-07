import React from "react";
import { Badge } from "@/components/ui/badge";

const mockOrders = [
  {
    id: "o1",
    number: "ORD-2024-021",
    clinic: "عيادة الرعاية",
    total: 950000,
    status: "processing",
    date: "2024-01-20",
  },
  {
    id: "o2",
    number: "ORD-2024-020",
    clinic: "ابتسامة البصرة",
    total: 1260000,
    status: "delivered",
    date: "2024-01-19",
  },
  {
    id: "o3",
    number: "ORD-2024-019",
    clinic: "مركز الابتسامة",
    total: 480000,
    status: "pending",
    date: "2024-01-18",
  },
];

export default function SupplierOrders() {
  return (
    <div className="p-4 lg:p-6" dir="rtl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">طلبات المورد</h1>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-600">
          <div className="col-span-3">رقم الطلب</div>
          <div className="col-span-3">العيادة</div>
          <div className="col-span-2">الإجمالي</div>
          <div className="col-span-2">الحالة</div>
          <div className="col-span-2 text-left">التاريخ</div>
        </div>
        <div className="divide-y">
          {mockOrders.map((o) => (
            <div
              key={o.id}
              className="grid grid-cols-12 px-4 py-3 items-center text-sm"
            >
              <div className="col-span-3 font-medium text-gray-900">
                {o.number}
              </div>
              <div className="col-span-3 text-gray-700">{o.clinic}</div>
              <div className="col-span-2 font-semibold">
                {o.total.toLocaleString("ar-IQ")} IQD
              </div>
              <div className="col-span-2">
                <Badge
                  className={
                    o.status === "delivered"
                      ? "bg-green-100 text-green-800"
                      : o.status === "processing"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                  }
                >
                  {o.status === "delivered"
                    ? "تم التسليم"
                    : o.status === "processing"
                      ? "قيد المعالجة"
                      : "قيد الانتظار"}
                </Badge>
              </div>
              <div className="col-span-2 text-left text-gray-600">{o.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
