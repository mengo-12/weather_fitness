import prisma from '@/lib/prisma';
import * as XLSX from 'xlsx';

// 🧠 دوال التقييم مثل الموجودة في TrainingAssessment/page.jsx
function assessSleep(value) {
    if (!value) return { rating: 'غير معروف', advice: '-' };
    if (value.includes('أقل')) return { rating: 'حذر', advice: '- تقليل شدة التدريب والالتزام بالتعليمات الأساسية مع مراقبة التعب والإرهاق.' };
    if (value.includes('بين')) return { rating: 'مسموح', advice: '- تقليل شدة التدريب عند الحاجة والالتزام بالتعليمات الأساسية.\n- مراقبة التعب والإرهاق.' };
    return { rating: 'آمن', advice: '- متابعة التدريب المعتاد.' };
}

function assessReadiness(value) {
    if (!value) return { rating: 'غير معروف', advice: '-' };
    if (value.includes('غير جاهز')) return { rating: 'غير آمن', advice: '- يفضل تأجيل التدريب ومراجعة الحالة الصحية.' };
    if (value.includes('غير متأكد')) return { rating: 'حذر', advice: '- تقييم الجاهزية قبل التدريب ومراقبة أي علامات تعب أو دوار.' };
    if (value.includes('جزئي')) return { rating: 'مسموح', advice: '- متابعة التدريب مع تقليل الشدة ومراقبة الأداء.' };
    return { rating: 'آمن', advice: '- متابعة التدريب المعتاد.' };
}

function assessField(value) {
    if (!value) return { rating: 'غير معروف', advice: '-' };
    if (value.includes('أخرى')) return { rating: 'حذر', advice: '- التأكد من نوع الأرضية واستخدام الحذاء المناسب لتقليل خطر الإصابات.' };
    return { rating: 'آمن', advice: '- استخدام الحذاء المناسب لتقليل خطر الإصابات.' };
}

function assessEffort(value) {
    if (!value) return { rating: 'غير معروف', advice: '-' };
    if (value.includes('مكثف')) return { rating: 'غير آمن', advice: '- يجب تقليل شدة التدريب أو أخذ فترات راحة طويلة ومراقبة الإرهاق.' };
    if (value.includes('عالي')) return { rating: 'حذر', advice: '- تقليل شدة التدريب عند الحاجة والالتزام بالتعليمات الأساسية.\n- مراقبة التعب والإرهاق.' };
    if (value.includes('متوسط')) return { rating: 'مسموح', advice: '- تقليل شدة التدريب عند الحاجة والالتزام بالتعليمات الأساسية.' };
    return { rating: 'آمن', advice: '- متابعة التدريب المعتاد.' };
}

function assessBody(value) {
    if (!value) return { rating: 'غير معروف', advice: '-' };
    if (value.includes('إرهاق') || value.includes('شديد')) return { rating: 'غير آمن', advice: '- تأجيل التدريب ومراجعة الحالة الجسدية قبل الاستمرار.' };
    if (value.includes('ألم')) return { rating: 'حذر', advice: '- تقليل شدة التدريب والالتزام بالتعليمات الأساسية مع مراقبة التعب والإرهاق.' };
    if (value.includes('متوسط')) return { rating: 'مسموح', advice: '- متابعة التدريب مع تقليل شدة بعض التمارين ومراقبة التعب.' };
    return { rating: 'آمن', advice: '- متابعة التدريب المعتاد.' };
}

function assessTemperature(value) {
    if (value == null) return { rating: 'غير معروف', advice: '-' };
    if (value <= 30) return { rating: 'آمن', advice: '- متابعة التدريب المعتاد.' };
    if (value <= 34) return { rating: 'حذر', advice: '- تقليل شدة التدريب، شرب كميات كافية من الماء ومراقبة التعب.' };
    return { rating: 'غير آمن', advice: '- تأجيل التدريب أو تقليله لتجنب الإجهاد الحراري.' };
}

function assessHumidity(value) {
    if (value == null) return { rating: 'غير معروف', advice: '-' };
    if (value <= 60) return { rating: 'آمن', advice: '- متابعة التدريب المعتاد.' };
    if (value <= 70) return { rating: 'حذر', advice: '- تقليل شدة التدريب وأخذ فترات استراحة متكررة.' };
    return { rating: 'غير آمن', advice: '- تقليل شدة التدريب أو تأجيله، شرب السوائل، أخذ فترات استراحة متكررة، والانتباه للإرهاق.' };
}


async function fetchWeather(city) {
    try {
        const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${city || "Jeddah"}&lang=ar`);
        const data = await res.json();
        return {
            temperature: data?.current?.temp_c ?? 0,
            humidity: data?.current?.humidity ?? 0,
            condition: data?.current?.condition?.text ?? "غير معروف"
        };
    } catch (e) {
        console.error("خطأ في جلب الطقس:", e);
        return { temperature: 0, humidity: 0, condition: "غير معروف" };
    }
}

export async function GET() {
    try {
        const results = await prisma.trainingResult.findMany({
            include: { trainee: true },
            orderBy: { createdAt: 'desc' }
        });

        if (!results.length)
            return new Response(JSON.stringify({ error: 'لا توجد نتائج' }), { status: 404 });

        const data = [];

        for (const r of results) {
            // 🔹 جلب بيانات الطقس الفعلية
            const weather = await fetchWeather(r.city);

            // 🔹 تقييمات محدثة بناءً على الطقس الحقيقي
            const sleep = assessSleep(r.sleepHours);
            const ready = assessReadiness(r.readiness);
            const field = assessField(r.fieldType);
            const effort = assessEffort(r.effortLevel);
            const body = assessBody(r.bodyFeeling);
            const temp = assessTemperature(weather.temperature);
            const hum = assessHumidity(weather.humidity);

            data.push({
                "اسم المتدرب": r.trainee?.name || "غير معروف",
                "رقم الجوال": r.trainee?.phone || "",
                "العمر": r.trainee?.age || "",
                "وقت التدريب": r.trainingTime,
                "عدد ساعات النوم": r.sleepHours,
                "تقييم النوم": sleep.rating,
                "تعليمات النوم": sleep.advice,
                "الجاهزية": r.readiness,
                "تقييم الجاهزية": ready.rating,
                "تعليمات الجاهزية": ready.advice,
                "نوع الأرضية": r.fieldType,
                "تقييم الأرضية": field.rating,
                "تعليمات الأرضية": field.advice,
                "مستوى الجهد": r.effortLevel,
                "تقييم الجهد": effort.rating,
                "تعليمات الجهد": effort.advice,
                "الحالة الجسدية": r.bodyFeeling,
                "تقييم الحالة الجسدية": body.rating,
                "تعليمات الحالة الجسدية": body.advice,
                "درجة الحرارة": weather.temperature,
                "تقييم الحرارة": temp.rating,
                "تعليمات الحرارة": temp.advice,
                "الرطوبة": weather.humidity,
                "تقييم الرطوبة": hum.rating,
                "تعليمات الرطوبة": hum.advice,
                "المدينة": r.city,
                "الحالة الجوية": weather.condition,
                "تاريخ الإدخال": new Date(r.createdAt).toLocaleString("ar-SA")
            });
        }

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "تقرير التدريب");

        const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

        return new Response(buffer, {
            status: 200,
            headers: {
                'Content-Disposition': 'attachment; filename="Training_Assessment_Report.xlsx"',
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            }
        });

    } catch (error) {
        console.error('❌ خطأ أثناء تصدير الملف:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
