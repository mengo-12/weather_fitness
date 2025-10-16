// import prisma from "@/lib/prisma";
// import * as XLSX from "xlsx";

// export const runtime = "nodejs";

// export async function GET() {
//     try {
//         // جلب جميع نتائج التدريب مع بيانات المتدربين
//         const results = await prisma.trainingResult.findMany({
//             include: { trainee: true },
//             orderBy: { createdAt: "desc" }
//         });

//         // ملف الترجمات والتعليمات
//         const t = {
//             safe: "آمن",
//             caution: "حذر",
//             unsafe: "غير آمن",
//             allowed: "مسموح",
//             sleepAdviceLow: "- تقليل شدة التمرين.",
//             sleepAdviceMed: "- التدرج في شدة التمرين.\n- مراقبة علامات التعب والإرهاق.",
//             sleepAdviceHigh: "- متابعة التدريب المعتاد.",
//             readinessYesAdvice: "- متابعة التدريب المعتاد.",
//             readinessSomewhatAdvice: "- تدريب معتدل، مراقبة التعب.",
//             readinessNotSureAdvice: "- تدريب خفيف، زيادة فترات الراحة عند الحاجة.",
//             readinessNoAdvice: "- تأجيل التمرين أو استبداله بتمارين استشفاء خفيفة.",
//             fieldOtherAdvice: "- اختيار الحذاء والتجهيزات الواقية، زيادة الانتباه للحركة على الأرضية.",
//             fieldNormalAdvice: "- استخدام الحذاء المناسب لتقليل خطر الإصابات.",
//             effortLowAdvice: "- متابعة التدريب المعتاد.",
//             effortMedAdvice: "- تقليل شدة التدريب عند الحاجة والالتزام بالتعليمات الأساسية.\n- مراقبة التعب والإرهاق.",
//             effortHighAdvice: "- تقليل شدة التدريب والالتزام بالتعليمات الأساسية مع مراقبة التعب والارهاق.",
//             effortMaxAdvice: "- الراحة وإيقاف التدريب وعمل الاستشفاء.",
//             bodyHealthyAdvice: "- متابعة التدريب المعتاد وفق الخطة.",
//             bodyMildTiredAdvice: "- متابعة التدريب مع تقليل شدة بعض التمارين ومراقبة التعب.",
//             bodySomePainAdvice: "- تقليل شدة التدريب، تجنب الحركات الشديدة، زيادة فترات الراحة، ومراقبة أي علامات إصابة.",
//             bodyExhaustedAdvice: "- تأجيل التدريب أو استبداله بتمارين استشفاء خفيفة، مع مراقبة الحالة الصحية والتأكد من عدم تفاقم الإصابة.",
//             tempSafeAdvice: "- متابعة التدريب المعتاد.",
//             tempMedAdvice: "- تقليل شدة التدريب تدريجيًا والالتزام بالتعليمات الأساسية.",
//             tempUnsafeAdvice: "- تغيير وقت التمرين، تقليل شدة التدريب، مراقبة علامات التعب باستمرار.",
//             humiditySafeAdvice: "- استمر في التدريب حسب الخطة المعتادة.",
//             humidityMedAdvice: "- شرب السوائل كل 20 دقيقة، أخذ فترات استراحة قصيرة، تقليل شدة التمرين عند الإرهاق، مراقبة علامات التعب.",
//             humidityUnsafeAdvice: "- تقليل شدة التدريب أو تأجيله، شرب السوائل، أخذ فترات استراحة متكررة، والانتباه للإرهاق."
//         };

//         // دوال التقييم لكل بند
//         const assessSleep = (val) => {
//             if (!val) return { rating: t.caution, advice: t.sleepAdviceMed };
//             if (val.includes("أقل من 5")) return { rating: t.unsafe, advice: t.sleepAdviceLow };
//             if (val.includes("بين 5 و 7")) return { rating: t.caution, advice: t.sleepAdviceMed };
//             return { rating: t.safe, advice: t.sleepAdviceHigh };
//         };
//         const assessReadiness = (val) => {
//             switch (val) {
//                 case "جاهز جدًا": return { rating: t.safe, advice: t.readinessYesAdvice };
//                 case "جاهز جزئيًا": return { rating: t.safe, advice: t.readinessSomewhatAdvice };
//                 case "غير متأكد": return { rating: t.caution, advice: t.readinessNotSureAdvice };
//                 case "غير جاهز": return { rating: t.unsafe, advice: t.readinessNoAdvice };
//                 default: return { rating: "-", advice: "-" };
//             }
//         };
//         const assessField = (val) => {
//             switch (val) {
//                 case "أرضية طبيعية":
//                 case "أرضية صناعية":
//                 case "أرضية مغطاة":
//                     return { rating: t.safe, advice: t.fieldNormalAdvice };
//                 case "أخرى":
//                     return { rating: t.caution, advice: t.fieldOtherAdvice };
//                 default: return { rating: "-", advice: "-" };
//             }
//         };
//         const assessEffort = (val) => {
//             switch (val) {
//                 case "جهد منخفض": return { rating: t.safe, advice: t.effortLowAdvice };
//                 case "جهد متوسط": return { rating: t.allowed, advice: t.effortMedAdvice };
//                 case "جهد عالي": return { rating: t.caution, advice: t.effortHighAdvice };
//                 case "جهد مكثف": return { rating: t.unsafe, advice: t.effortMaxAdvice };
//                 default: return { rating: "-", advice: "-" };
//             }
//         };
//         const assessBody = (val) => {
//             switch (val) {
//                 case "شعور جيد": return { rating: t.safe, advice: t.bodyHealthyAdvice };
//                 case "شعور متوسط": return { rating: t.allowed, advice: t.bodyMildTiredAdvice };
//                 case "ألم خفيف": return { rating: t.caution, advice: t.bodySomePainAdvice };
//                 case "إرهاق شديد": return { rating: t.unsafe, advice: t.bodyExhaustedAdvice };
//                 default: return { rating: "-", advice: "-" };
//             }
//         };
//         const assessTemperature = (val) => {
//             if (val == null) return { rating: "-", advice: "-" };
//             if (val <= 30) return { rating: t.safe, advice: t.tempSafeAdvice };
//             if (val <= 34) return { rating: t.caution, advice: t.tempMedAdvice };
//             return { rating: t.unsafe, advice: t.tempUnsafeAdvice };
//         };
//         const assessHumidity = (val) => {
//             if (val == null) return { rating: "-", advice: "-" };
//             if (val <= 60) return { rating: t.safe, advice: t.humiditySafeAdvice };
//             if (val <= 70) return { rating: t.caution, advice: t.humidityMedAdvice };
//             return { rating: t.unsafe, advice: t.humidityUnsafeAdvice };
//         };

//         // ترويسة الأعمدة
//         const sheetData = [[
//             "اسم المتدرب", "الهاتف", "العمر", "المدينة",
//             "النوم (التقييم)", "النوم (التعليمات)",
//             "الجاهزية (التقييم)", "الجاهزية (التعليمات)",
//             "نوع الأرضية (التقييم)", "نوع الأرضية (التعليمات)",
//             "مستوى الجهد (التقييم)", "مستوى الجهد (التعليمات)",
//             "الحالة الجسدية (التقييم)", "الحالة الجسدية (التعليمات)",
//             "درجة الحرارة (التقييم)", "درجة الحرارة (التعليمات)",
//             "الرطوبة (التقييم)", "الرطوبة (التعليمات)",
//             "تاريخ التقييم"
//         ]];

//         // تعبئة الصفوف لكل متدرب
//         for (const r of results) {
//             const sleep = assessSleep(r.sleepHours);
//             const readiness = assessReadiness(r.readiness);
//             const field = assessField(r.fieldType);
//             const effort = assessEffort(r.effortLevel);
//             const body = assessBody(r.bodyFeeling);
//             const tempEval = assessTemperature(r.temperature);
//             const humEval = assessHumidity(r.humidity);


//             sheetData.push([
//                 r.trainee?.name || "",
//                 r.trainee?.phone || "",
//                 r.trainee?.age || "",
//                 r.city || "",
//                 r.trainingTime || "",                  // وقت التدريب
//                 r.sleepHours || "",
//                 assessSleep(r.sleepHours).rating,
//                 assessSleep(r.sleepHours).advice,
//                 r.readiness || "",
//                 assessReadiness(r.readiness).rating,
//                 assessReadiness(r.readiness).advice,
//                 r.fieldType || "",
//                 assessField(r.fieldType).rating,
//                 assessField(r.fieldType).advice,
//                 r.effortLevel || "",
//                 assessEffort(r.effortLevel).rating,
//                 assessEffort(r.effortLevel).advice,
//                 r.bodyFeeling || "",
//                 assessBody(r.bodyFeeling).rating,
//                 assessBody(r.bodyFeeling).advice,
//                 r.temperature != null ? `${r.temperature}°C` : "",
//                 assessTemperature(r.temperature).rating,
//                 assessTemperature(r.temperature).advice,
//                 r.humidity != null ? `${r.humidity}%` : "",
//                 assessHumidity(r.humidity).rating,
//                 assessHumidity(r.humidity).advice,
//                 new Date(r.createdAt).toLocaleString("ar-SA")
//             ]);
//         }

//         const workbook = XLSX.utils.book_new();
//         const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
//         XLSX.utils.book_append_sheet(workbook, worksheet, "نتائج التدريب");

//         const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

//         return new Response(excelBuffer, {
//             status: 200,
//             headers: {
//                 "Content-Disposition": 'attachment; filename="TrainingResults.xlsx"',
//                 "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//             },
//         });

//     } catch (err) {
//         console.error("Export error:", err);
//         return new Response(JSON.stringify({ error: err.message }), { status: 500 });
//     }
// }



// الكود الاعلى اصلي


import prisma from "@/lib/prisma";
import * as XLSX from "xlsx";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

export async function GET() {
    try {

        // 🔹 جلب الجلسة
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== "admin") {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        // ✅ جلب جميع نتائج التدريب مع بيانات المتدربين
        const results = await prisma.trainingResult.findMany({
            include: { trainee: true },
            orderBy: { createdAt: "desc" }
        });

        console.log("عدد النتائج:", results.length);
        console.log("أول نتيجة لفحص القيم:", results[0]);

        // ✅ نصوص الترجمة
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

        // ✅ دوال التقييم
        const assessTemperature = (val) => {
            if (val == null) return { rating: "-", advice: "-" };
            if (val <= 30) return { rating: t.safe, advice: t.tempSafeAdvice };
            if (val <= 34) return { rating: t.caution, advice: t.tempMedAdvice };
            return { rating: t.unsafe, advice: t.tempUnsafeAdvice };
        };
        const assessHumidity = (val) => {
            if (val == null) return { rating: "-", advice: "-" };
            if (val <= 60) return { rating: t.safe, advice: t.humiditySafeAdvice };
            if (val <= 70) return { rating: t.caution, advice: t.humidityMedAdvice };
            return { rating: t.unsafe, advice: t.humidityUnsafeAdvice };
        };

        // ✅ ترويسة الأعمدة
        const sheetData = [[
            "اسم المتدرب", "الهاتف", "العمر", "المدينة", "وقت التدريب",
            "النوم", "الجاهزية", "نوع الأرضية", "مستوى الجهد", "الحالة الجسدية",
            "درجة الحرارة", "تقييم الحرارة", "تعليمات الحرارة",
            "الرطوبة", "تقييم الرطوبة", "تعليمات الرطوبة",
            "تاريخ التقييم"
        ]];

        // ✅ تعبئة الصفوف
        for (const r of results) {
            const tempEval = assessTemperature(r.temperature);
            const humEval = assessHumidity(r.humidity);

            sheetData.push([
                r.trainee?.name || "",
                r.trainee?.phone || "",
                r.trainee?.age || "",
                r.city || "",
                r.trainingTime || "",
                r.sleepHours || "",
                r.readiness || "",
                r.fieldType || "",
                r.effortLevel || "",
                r.bodyFeeling || "",
                r.temperature !== null && r.temperature !== undefined ? `${r.temperature}` : "غير محدد",
                tempEval.rating,
                tempEval.advice,
                r.humidity !== null && r.humidity !== undefined ? `${r.humidity}` : "غير محدد",
                humEval.rating,
                humEval.advice,
                new Date(r.createdAt).toLocaleString("ar-SA")
            ]);
        }

        // ✅ إنشاء ملف Excel
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, "تقرير التدريب اليومي");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

        return new Response(excelBuffer, {
            status: 200,
            headers: {
                "Content-Disposition": 'attachment; filename="TrainingResults.xlsx"',
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            },
        });

    } catch (err) {
        console.error("❌ Export error:", err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
