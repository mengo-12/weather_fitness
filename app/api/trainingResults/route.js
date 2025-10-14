import prisma from '@/lib/prisma';

// 🗺️ دوال الترجمة
const translateAnswer = (key, mapping) => mapping[key] || key;

const sleepMapping = {
    opt21: 'أقل من 5 ساعات',
    opt22: 'بين 5 و 7 ساعات',
    opt23: 'أكثر من 7 ساعات'
};
const readinessMapping = {
    opt31: 'جاهز جدًا',
    opt32: 'جاهز جزئيًا',
    opt33: 'غير متأكد',
    opt34: 'غير جاهز'
};
const fieldMapping = {
    opt41: 'أرضية طبيعية',
    opt42: 'أرضية صناعية',
    opt43: 'أرضية مغطاة',
    opt44: 'أخرى'
};
const effortMapping = {
    opt51: 'جهد منخفض',
    opt52: 'جهد متوسط',
    opt53: 'جهد عالي',
    opt54: 'جهد مكثف'
};
const bodyMapping = {
    opt61: 'شعور جيد',
    opt62: 'شعور متوسط',
    opt63: 'ألم خفيف',
    opt64: 'إرهاق شديد'
};

export async function POST(req) {
    try {
        const data = await req.json();

        if (!data.traineeId) {
            return new Response(
                JSON.stringify({ success: false, error: 'traineeId مطلوب' }),
                { status: 400 }
            );
        }

        // 🔹 تجهيز البيانات مع منع القيم الفارغة
        const resultData = {
            trainingTime: data.trainingTime || "غير محدد",
            sleepHours: translateAnswer(data.sleepHours, sleepMapping),
            readiness: translateAnswer(data.readiness, readinessMapping),
            fieldType: translateAnswer(data.fieldType, fieldMapping),
            fieldOther: data.fieldOther || "",
            effortLevel: translateAnswer(data.effortLevel, effortMapping),
            bodyFeeling: translateAnswer(data.bodyFeeling, bodyMapping),
            temperature: data.temperature ?? 0,
            humidity: data.humidity ?? 0,
            city: data.city?.trim() || "غير محدد",
            condition: data.condition?.trim() || "غير معروف",
        };

        // 🔁 تحديث إذا كانت موجودة، أو إنشاء جديدة
        const result = await prisma.trainingResult.upsert({
            where: { traineeId: data.traineeId },
            update: resultData,
            create: {
                traineeId: data.traineeId,
                ...resultData,
            },
            include: { trainee: true }, // ✅ حتى نجلب الاسم عند الحاجة لاحقًا
        });

        return new Response(
            JSON.stringify({ success: true, result }),
            { status: 200 }
        );

    } catch (error) {
        console.error("❌ Error in trainingResults API:", error);
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { status: 500 }
        );
    }
}
