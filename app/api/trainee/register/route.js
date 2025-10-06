import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const { name, password } = await req.json();

        if (!name || !password) {
            return new Response(JSON.stringify({ error: "البيانات ناقصة" }), { status: 400 });
        }

        // تحقق هل المتدرب موجود مسبقًا
        const existing = await prisma.trainee.findUnique({
            where: { name },
        });

        if (existing) {
            // إذا موجود يرجع رسالة نجاح مع توجيه لتسجيل الدخول
            return new Response(JSON.stringify({ message: "المتدرب موجود، تسجيل الدخول" }), { status: 200 });
        }

        // إنشاء حساب جديد
        const hashedPassword = await bcrypt.hash(password, 10);

        const trainee = await prisma.trainee.create({
            data: {
                name,
                password: hashedPassword,
            },
        });

        return new Response(JSON.stringify({ message: "تم إنشاء الحساب بنجاح" }), { status: 201 });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
