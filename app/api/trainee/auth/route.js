import prisma from "@/lib/prisma";

export async function POST(req) {
    try {
        const { name, phone, age } = await req.json();

        if (!name || !phone || !age) {
            return new Response(
                JSON.stringify({ error: "الاسم، رقم الجوال والعمر مطلوبة" }),
                { status: 400 }
            );
        }

        // 🔹 البحث عن مستخدم بنفس رقم الجوال
        const existingTrainee = await prisma.trainee.findUnique({
            where: { phone },
        });

        if (existingTrainee) {
            return new Response(
                JSON.stringify({
                    message: "تم تسجيل الدخول بنجاح",
                    traineeId: existingTrainee.id, // ✅ أضفنا هذا
                }),
                { status: 200 }
            );
        }

        // 🔹 إنشاء حساب جديد
        const newTrainee = await prisma.trainee.create({
            data: {
                name,
                phone,
                age: parseInt(age),
                agreed: true,
            },
        });

        return new Response(
            JSON.stringify({
                message: "تم إنشاء الحساب بنجاح",
                traineeId: newTrainee.id,
            }),
            { status: 201 }
        );

    } catch (error) {
        console.error("❌ خطأ في API:", error);
        return new Response(
            JSON.stringify({ error: "حدث خطأ داخلي في الخادم" }),
            { status: 500 }
        );
    }
}
