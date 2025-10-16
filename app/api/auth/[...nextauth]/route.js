// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";

// export const authOptions = {
//     providers: [
//         CredentialsProvider({
//             name: "Credentials",
//             credentials: {
//                 username: { label: "Username", type: "text" },
//                 password: { label: "Password", type: "password" }
//             },
//             async authorize(credentials) {
//                 // هنا تحقق من المستخدم، مثال سريع:
//                 if (credentials.username === "admin" && credentials.password === "1234") {
//                     return { id: "1", name: "Admin", traineeId: "trainee_123" };
//                 }
//                 return null;
//             }
//         })
//     ],
//     session: {
//         strategy: "jwt"
//     },
//     secret: process.env.NEXTAUTH_SECRET
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };


// الكود الاعلى اصلي


// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";


export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Trainee Login",
            credentials: {
                name: { label: "Name", type: "text" },
                phone: { label: "Phone", type: "text" },
                age: { label: "Age", type: "number" },
            },
            async authorize(credentials) {
                const { name, phone, age } = credentials;
                if (!name || !phone || !age) return null;

                // 🔹 تحقق من وجود المتدرب
                let trainee = await prisma.trainee.findUnique({ where: { phone } });
                let isNew = false;

                if (!trainee) {
                    trainee = await prisma.trainee.create({
                        data: {
                            name,
                            phone,
                            age: parseInt(age),
                            agreed: true,
                        },
                    });
                    isNew = true;
                }

                // ✅ نضيف isNew للمخرجات
                return {
                    id: trainee.id,
                    name: trainee.name,
                    phone: trainee.phone,
                    age: trainee.age,
                    isNew,
                };
            },
        }),

        // 🔹 تسجيل دخول الأدمن
        CredentialsProvider({
            id: "admin",       // ✅ مهم جدًا
            name: "Admin Login",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                console.log("Trying admin login:", credentials);
                const { email, password } = credentials;

                if (!email || !password) {
                    console.log("Missing email or password");
                    return null;
                }

                const admin = await prisma.user.findUnique({ where: { email } });
                if (!admin) {
                    console.log("Admin not found");
                    return null;
                }

                if (admin.role !== "admin") {
                    console.log("User is not admin");
                    return null;
                }

                const match = await bcrypt.compare(password, admin.password);
                console.log("Password match:", match);

                if (!match) return null;

                return { id: admin.id, name: admin.name, email: admin.email, role: "admin" };
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.isNew = user.isNew; // 👈 نحفظ الفلاغ داخل الـ token
                token.role = user.role || "admin"; // 🔹 إضافة الدور
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user = {
                    id: token.id,
                    name: token.name,
                    isNew: token.isNew, // 👈 نمررها إلى الواجهة
                    role: token.role || "admin", // 🔹 إضافة الدور للجلسة
                };
            }
            return session;
        },
    },


    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
