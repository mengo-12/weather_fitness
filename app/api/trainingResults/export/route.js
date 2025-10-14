import prisma from "@/lib/prisma";
import * as XLSX from "xlsx";

export const runtime = "nodejs";

export async function GET() {
    try {
        // جلب نتائج التدريب مع المتدربين
        const results = await prisma.trainingResult.findMany({
            include: { trainee: true },
            orderBy: { createdAt: 'desc' }
        });

        const sheetData = [
            ["اسم المتدرب", "رقم الجوال", "العمر", "المدينة", "درجة الحرارة", "الرطوبة",
                "النوم (التقييم)", "النوم (التعليمات)",
                "الجاهزية (التقييم)", "الجاهزية (التعليمات)",
                "نوع الأرضية (التقييم)", "نوع الأرضية (التعليمات)",
                "مستوى الجهد (التقييم)", "مستوى الجهد (التعليمات)",
                "الحالة الجسدية (التقييم)", "الحالة الجسدية (التعليمات)",
                "درجة الحرارة (التقييم)", "درجة الحرارة (التعليمات)",
                "الرطوبة (التقييم)", "الرطوبة (التعليمات)",
                "تاريخ الإدخال"]
        ];

        // ملف الترجمات
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
            bodyExhaustedAdvice: "- تأجيل التدريب أو استبداله بتمارين استشفاء خفيفة، مع مراقبة الحالة الصحية والتأكد من عدم تفاقم الإصابة.",
            tempSafeAdvice: "- متابعة التدريب المعتاد.",
            tempMedAdvice: "- تقليل شدة التدريب تدريجيًا والالتزام بالتعليمات الأساسية.",
            tempUnsafeAdvice: "- تغيير وقت التمرين، تقليل شدة التدريب، مراقبة علامات التعب باستمرار.",
            humiditySafeAdvice: "- استمر في التدريب حسب الخطة المعتادة.",
            humidityMedAdvice: "- شرب السوائل كل 20 دقيقة، أخذ فترات استراحة قصيرة، تقليل شدة التمرين عند الإرهاق، مراقبة علامات التعب.",
            humidityUnsafeAdvice: "- تقليل شدة التدريب أو تأجيله، شرب السوائل، أخذ فترات استراحة متكررة، والانتباه للإرهاق."
        };

        // دوال التقييم باستخدام النصوص مباشرة
        const assessSleep = (hours) => {
            if (!hours) return { rating: t.caution, advice: t.sleepAdviceMed };
            if (hours < 5) return { rating: t.unsafe, advice: t.sleepAdviceLow };
            if (hours <= 7) return { rating: t.caution, advice: t.sleepAdviceMed };
            return { rating: t.safe, advice: t.sleepAdviceHigh };
        };

        const assessReadiness = (val) => {
            switch(val) {
                case "high": return { rating: t.safe, advice: t.readinessYesAdvice };
                case "medium": return { rating: t.caution, advice: t.readinessSomewhatAdvice };
                case "low": return { rating: t.allowed, advice: t.readinessNotSureAdvice };
                case "none": return { rating: t.unsafe, advice: t.readinessNoAdvice };
                default: return { rating: "-", advice: "-" };
            }
        };

        const assessField = (val) => {
            switch(val) {
                case "normal": return { rating: t.safe, advice: t.fieldNormalAdvice };
                case "other": return { rating: t.caution, advice: t.fieldOtherAdvice };
                default: return { rating: "-", advice: "-" };
            }
        };

        const assessEffort = (val) => {
            switch(val) {
                case "low": return { rating: t.safe, advice: t.effortLowAdvice };
                case "medium": return { rating: t.allowed, advice: t.effortMedAdvice };
                case "high": return { rating: t.caution, advice: t.effortHighAdvice };
                case "max": return { rating: t.unsafe, advice: t.effortMaxAdvice };
                default: return { rating: "-", advice: "-" };
            }
        };

        const assessBody = (val) => {
            switch(val) {
                case "healthy": return { rating: t.safe, advice: t.bodyHealthyAdvice };
                case "mildTired": return { rating: t.allowed, advice: t.bodyMildTiredAdvice };
                case "somePain": return { rating: t.caution, advice: t.bodySomePainAdvice };
                case "exhausted": return { rating: t.unsafe, advice: t.bodyExhaustedAdvice };
                default: return { rating: "-", advice: "-" };
            }
        };

        const assessTemperature = (temp) => {
            if (temp <= 30) return { rating: t.safe, advice: t.tempSafeAdvice };
            if (temp <= 34) return { rating: t.caution, advice: t.tempMedAdvice };
            return { rating: t.unsafe, advice: t.tempUnsafeAdvice };
        };

        const assessHumidity = (hum) => {
            if (hum <= 60) return { rating: t.safe, advice: t.humiditySafeAdvice };
            if (hum <= 70) return { rating: t.caution, advice: t.humidityMedAdvice };
            return { rating: t.unsafe, advice: t.humidityUnsafeAdvice };
        };

        // تجهيز الصفوف
        for (const r of results) {
            const trainee = r.trainee;
            const sleep = assessSleep(r.sleepHours);
            const readiness = assessReadiness(r.readinessLevel);
            const field = assessField(r.fieldType);
            const effort = assessEffort(r.effortLevel);
            const body = assessBody(r.bodyFeeling);
            const tempEval = assessTemperature(r.temperature);
            const humEval = assessHumidity(r.humidity);

            sheetData.push([
                trainee?.name ?? "غير معروف",
                trainee?.phone ?? "",
                trainee?.age ?? "",
                r.city ?? "غير محدد",
                r.temperature ?? 0,
                r.humidity ?? 0,
                sleep.rating, sleep.advice,
                readiness.rating, readiness.advice,
                field.rating, field.advice,
                effort.rating, effort.advice,
                body.rating, body.advice,
                tempEval.rating, tempEval.advice,
                humEval.rating, humEval.advice,
                new Date(r.createdAt).toLocaleString("ar-SA")
            ]);
        }

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, "نتائج التدريب");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

        return new Response(excelBuffer, {
            status: 200,
            headers: {
                "Content-Disposition": 'attachment; filename="TrainingResults.xlsx"',
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            },
        });

    } catch (err) {
        console.error("Export error:", err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}



