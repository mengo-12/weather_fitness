// /app/api/trainee/auth/route.js
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const { name, password } = await req.json();

        if (!name || !password) {
            return new Response(JSON.stringify({ error: "الاسم وكلمة المرور مطلوبة" }), { status: 400 });
        }

        // تحقق إذا كان المستخدم موجود
        const existingUser = await prisma.trainee.findFirst({
            where: { name },
        });

        if (existingUser) {
            // تحقق من كلمة المرور
            const match = await bcrypt.compare(password, existingUser.password);
            if (!match) {
                return new Response(JSON.stringify({ error: "كلمة المرور غير صحيحة" }), { status: 401 });
            }

            // تسجيل الدخول ناجح
            return new Response(JSON.stringify({ message: "تم تسجيل الدخول بنجاح" }), { status: 200 });
        }

        // إنشاء مستخدم جديد
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.trainee.create({
            data: {
                name,
                password: hashedPassword,
            },
        });

        return new Response(JSON.stringify({ message: "تم إنشاء الحساب بنجاح", userId: newUser.id }), { status: 201 });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "حدث خطأ داخلي" }), { status: 500 });
    }
}

