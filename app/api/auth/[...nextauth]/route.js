// app/api/auth/[...nextauth]/route.js
// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import prisma from "@/lib/prisma";
// import bcrypt from "bcrypt";


// export const authOptions = {
//     providers: [
//         CredentialsProvider({
//             name: "Trainee Login",
//             credentials: {
//                 name: { label: "Name", type: "text" },
//                 phone: { label: "Phone", type: "text" },
//                 age: { label: "Age", type: "number" },
//             },
//             async authorize(credentials) {
//                 const { name, phone, age } = credentials;
//                 if (!name || !phone || !age) return null;

//                 // 🔹 تحقق من وجود المتدرب
//                 let trainee = await prisma.trainee.findUnique({ where: { phone } });
//                 let isNew = false;

//                 if (!trainee) {
//                     trainee = await prisma.trainee.create({
//                         data: {
//                             name,
//                             phone,
//                             age: parseInt(age),
//                             agreed: true,
//                         },
//                     });
//                     isNew = true;
//                 }

//                 // ✅ نضيف isNew للمخرجات
//                 return {
//                     id: trainee.id,
//                     name: trainee.name,
//                     phone: trainee.phone,
//                     age: trainee.age,
//                     isNew,
//                 };
//             },
//         }),

//         // 🔹 تسجيل دخول الأدمن
//         CredentialsProvider({
//             id: "admin",       // ✅ مهم جدًا
//             name: "Admin Login",
//             credentials: {
//                 email: { label: "Email", type: "text" },
//                 password: { label: "Password", type: "password" },
//             },
//             async authorize(credentials) {
//                 console.log("Trying admin login:", credentials);
//                 const { email, password } = credentials;

//                 if (!email || !password) {
//                     console.log("Missing email or password");
//                     return null;
//                 }

//                 const admin = await prisma.user.findUnique({ where: { email } });
//                 if (!admin) {
//                     console.log("Admin not found");
//                     return null;
//                 }

//                 if (admin.role !== "admin") {
//                     console.log("User is not admin");
//                     return null;
//                 }

//                 const match = await bcrypt.compare(password, admin.password);
//                 console.log("Password match:", match);

//                 if (!match) return null;

//                 return { id: admin.id, name: admin.name, email: admin.email, role: "admin" };
//             },
//         }),
//     ],
//     session: {
//         strategy: "jwt",
//     },
//     callbacks: {
//         async jwt({ token, user }) {
//             if (user) {
//                 token.id = user.id;
//                 token.name = user.name;
//                 token.isNew = user.isNew; // 👈 نحفظ الفلاغ داخل الـ token
//                 // token.role = user.role || "admin"; // 🔹 إضافة الدور
//                 token.role = user.role || "trainee";
//             }
//             return token;
//         },
//         async session({ session, token }) {
//             if (token) {
//                 session.user = {
//                     id: token.id,
//                     name: token.name,
//                     isNew: token.isNew, // 👈 نمررها إلى الواجهة
//                     // role: token.role || "admin", // 🔹 إضافة الدور للجلسة
//                     role: token.role || "trainee", // ✅ المتدربون ليسوا أدمن
//                 };
//             }
//             return session;
//         },
//     },


//     secret: process.env.NEXTAUTH_SECRET,
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };


// الكود الاعلى اصلي


import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions = {
    providers: [
        // 🔹 تسجيل دخول المتدرب
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

                return {
                    id: trainee.id,
                    name: trainee.name,
                    phone: trainee.phone,
                    age: trainee.age,
                    role: "trainee",  // ✅ دائمًا دور المتدرب
                    isNew,
                };
            },
        }),

        // 🔹 تسجيل دخول الأدمن
        CredentialsProvider({
            id: "admin",
            name: "Admin Login",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const { email, password } = credentials;
                if (!email || !password) return null;

                const admin = await prisma.user.findUnique({ where: { email } });
                if (!admin || admin.role !== "admin") return null;

                const match = await bcrypt.compare(password, admin.password);
                if (!match) return null;

                return {
                    id: admin.id,
                    name: admin.name,
                    email: admin.email,
                    role: "admin",  // ✅ دور الأدمن من قاعدة البيانات
                };
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
                token.role = user.role; // ✅ مهم جدًا
                token.isNew = user.isNew || false;
            }
            return token;
        },

        async session({ session, token }) {
            if (token) {
                session.user = {
                    id: token.id,
                    name: token.name,
                    role: token.role, // ✅ ضمان دور المستخدم
                    isNew: token.isNew || false,
                };
            }
            return session;
        },
    },

    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
