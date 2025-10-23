'use client';

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { FaFileExport } from "react-icons/fa";

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    // // تحقق من صلاحية الأدمن
    useEffect(() => {
        if (status === "loading") return;
        if (!session || session.user.role !== "admin") {
            router.push("/admin/login");
        }
    }, [session, status, router]);

    // جلب النتائج من الـ API
    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await fetch("/api/trainingResults/all");
                const data = await res.json();
                setResults(data.results || []);
            } catch (err) {
                console.error("Error fetching results:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, []);

    // دوال التقييم
    const t = {
        safe: "آمن",
        caution: "حذر",
        unsafe: "غير آمن",
        allowed: "مسموح",
        sleepAdviceLow: "- تقليل شدة التمرين.",
        sleepAdviceMed: "- التدرج في شدة التمرين.\n- مراقبة علامات التعب والإرهاق.",
        sleepAdviceHigh: "- متابعة التدريب المعتاد.",
        readinessYesAdvice: "- متابعة التدريب المعتاد.",
        readinessSomewhatAdvice: "- تدريب معتدل، مراقبة التعب.",
        readinessNotSureAdvice: "- تدريب خفيف، زيادة فترات الراحة عند الحاجة.",
        readinessNoAdvice: "- تأجيل التمرين أو استبداله بتمارين استشفاء خفيفة.",
        fieldOtherAdvice: "- اختيار الحذاء والتجهيزات الواقية، زيادة الانتباه للحركة على الأرضية.",
        fieldNormalAdvice: "- استخدام الحذاء المناسب لتقليل خطر الإصابات.",
        effortLowAdvice: "- متابعة التدريب المعتاد.",
        effortMedAdvice: "- تقليل شدة التدريب عند الحاجة والالتزام بالتعليمات الأساسية.\n- مراقبة التعب والإرهاق.",
        effortHighAdvice: "- تقليل شدة التدريب والالتزام بالتعليمات الأساسية مع مراقبة التعب والارهاق.",
        effortMaxAdvice: "- الراحة وإيقاف التدريب وعمل الاستشفاء.",
        bodyHealthyAdvice: "- متابعة التدريب المعتاد وفق الخطة.",
        bodyMildTiredAdvice: "- متابعة التدريب مع تقليل شدة بعض التمارين ومراقبة التعب.",
        bodySomePainAdvice: "- تقليل شدة التدريب، تجنب الحركات الشديدة، زيادة فترات الراحة، ومراقبة أي علامات إصابة.",
        bodyExhaustedAdvice: "- تأجيل التدريب أو استبداله بتمارين استشفاء خفيفة.",
        tempSafeAdvice: "- متابعة التدريب المعتاد.",
        tempMedAdvice: "- تقليل شدة التدريب تدريجيًا والالتزام بالتعليمات الأساسية.",
        tempUnsafeAdvice: "- تغيير وقت التمرين، تقليل شدة التدريب، مراقبة علامات التعب باستمرار.",
        humiditySafeAdvice: "- استمر في التدريب حسب الخطة المعتادة.",
        humidityMedAdvice: "- شرب السوائل كل 20 دقيقة، أخذ فترات استراحة قصيرة، تقليل شدة التمرين عند الإرهاق.",
        humidityUnsafeAdvice: "- تقليل شدة التدريب أو تأجيله، شرب السوائل، والانتباه للإرهاق."
    };

    const assessSleep = val => val.includes("أقل من 5") ? { rating: t.unsafe, advice: t.sleepAdviceLow } :
                                val.includes("بين 5") ? { rating: t.caution, advice: t.sleepAdviceMed } :
                                { rating: t.safe, advice: t.sleepAdviceHigh };
    const assessReadiness = val => val === "جاهز جدًا" ? { rating: t.safe, advice: t.readinessYesAdvice } :
                                   val === "جاهز جزئيًا" ? { rating: t.allowed, advice: t.readinessSomewhatAdvice } :
                                   val === "غير متأكد" ? { rating: t.caution, advice: t.readinessNotSureAdvice } :
                                   val === "غير جاهز" ? { rating: t.unsafe, advice: t.readinessNoAdvice } :
                                   { rating: "-", advice: "-" };
    const assessField = val => ["أرضية طبيعية", "أرضية صناعية", "أرضية مغطاة"].includes(val) ? { rating: t.safe, advice: t.fieldNormalAdvice } :
                               val === "أخرى" ? { rating: t.caution, advice: t.fieldOtherAdvice } :
                               { rating: "-", advice: "-" };
    const assessEffort = val => val === "جهد منخفض" ? { rating: t.safe, advice: t.effortLowAdvice } :
                                val === "جهد متوسط" ? { rating: t.allowed, advice: t.effortMedAdvice } :
                                val === "جهد عالي" ? { rating: t.caution, advice: t.effortHighAdvice } :
                                val === "جهد مكثف" ? { rating: t.unsafe, advice: t.effortMaxAdvice } :
                                { rating: "-", advice: "-" };
    const assessBody = val => val === "شعور جيد" ? { rating: t.safe, advice: t.bodyHealthyAdvice } :
                               val === "شعور متوسط" ? { rating: t.allowed, advice: t.bodyMildTiredAdvice } :
                               val === "ألم خفيف" ? { rating: t.caution, advice: t.bodySomePainAdvice } :
                               val === "إرهاق شديد" ? { rating: t.unsafe, advice: t.bodyExhaustedAdvice } :
                               { rating: "-", advice: "-" };
    const assessTemperature = val => val <= 30 ? { rating: t.safe, advice: t.tempSafeAdvice } :
                                     val <= 34 ? { rating: t.caution, advice: t.tempMedAdvice } :
                                     { rating: t.unsafe, advice: t.tempUnsafeAdvice };
    const assessHumidity = val => val <= 60 ? { rating: t.safe, advice: t.humiditySafeAdvice } :
                                  val <= 70 ? { rating: t.caution, advice: t.humidityMedAdvice } :
                                  { rating: t.unsafe, advice: t.humidityUnsafeAdvice };

    const exportExcel = () => {
        const sheetData = [["اسم المتدرب","الهاتف","العمر","المدينة",
            "النوم (التقييم)","النوم (التعليمات)","الجاهزية (التقييم)","الجاهزية (التعليمات)",
            "نوع الأرضية (التقييم)","نوع الأرضية (التعليمات)","مستوى الجهد (التقييم)","مستوى الجهد (التعليمات)",
            "الحالة الجسدية (التقييم)","الحالة الجسدية (التعليمات)","درجة الحرارة (التقييم)","درجة الحرارة (التعليمات)",
            "الرطوبة (التقييم)","الرطوبة (التعليمات)","تاريخ التقييم"
        ]];

        results.forEach(r => {
            const sleep = assessSleep(r.sleepHours);
            const readiness = assessReadiness(r.readiness);
            const field = assessField(r.fieldType);
            const effort = assessEffort(r.effortLevel);
            const body = assessBody(r.bodyFeeling);
            const tempEval = assessTemperature(r.temperature);
            const humEval = assessHumidity(r.humidity);

            sheetData.push([
                r.trainee?.name || "",
                r.trainee?.phone || "",
                r.trainee?.age || "",
                r.city || "",
                sleep.rating, sleep.advice,
                readiness.rating, readiness.advice,
                field.rating, field.advice,
                effort.rating, effort.advice,
                body.rating, body.advice,
                tempEval.rating, tempEval.advice,
                humEval.rating, humEval.advice,
                new Date(r.createdAt).toLocaleString("ar-SA")
            ]);
        });

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(sheetData);
        XLSX.utils.book_append_sheet(wb, ws, "نتائج التدريب");
        XLSX.writeFile(wb, "TrainingResults_All.xlsx");
    };

    if (loading) return <p className="text-center mt-20">جاري تحميل النتائج...</p>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">لوحة تحكم الأدمن</h1>
                {session?.user && (
                    <button
                        onClick={() => signOut({ callbackUrl: "/admin/login" })}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                        تسجيل الخروج
                    </button>
                )}
            </div>

            <button
                onClick={exportExcel}
                className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg mb-6 hover:bg-emerald-600"
            >
                <FaFileExport /> تحميل ملف Excel
            </button>

            <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="border p-2">اسم المتدرب</th>
                        <th className="border p-2">الهاتف</th>
                        <th className="border p-2">العمر</th>
                        <th className="border p-2">المدينة</th>
                        <th className="border p-2">النوم</th>
                        <th className="border p-2">الجاهزية</th>
                        <th className="border p-2">نوع الأرضية</th>
                        <th className="border p-2">مستوى الجهد</th>
                        <th className="border p-2">الحالة الجسدية</th>
                        <th className="border p-2">درجة الحرارة</th>
                        <th className="border p-2">الرطوبة</th>
                        <th className="border p-2">تاريخ التقييم</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map((r, i) => (
                        <tr key={i} className="text-center">
                            <td className="border p-2">{r.trainee?.name}</td>
                            <td className="border p-2">{r.trainee?.phone}</td>
                            <td className="border p-2">{r.trainee?.age}</td>
                            <td className="border p-2">{r.city}</td>
                            <td className="border p-2">{assessSleep(r.sleepHours).rating}</td>
                            <td className="border p-2">{assessReadiness(r.readiness).rating}</td>
                            <td className="border p-2">{assessField(r.fieldType).rating}</td>
                            <td className="border p-2">{assessEffort(r.effortLevel).rating}</td>
                            <td className="border p-2">{assessBody(r.bodyFeeling).rating}</td>
                            <td className="border p-2">{assessTemperature(r.temperature).rating}</td>
                            <td className="border p-2">{assessHumidity(r.humidity).rating}</td>
                            <td className="border p-2">{new Date(r.createdAt).toLocaleString("ar-SA")}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
