'use client';

import { useState,useEffect  } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
    const router = useRouter();
    const { data: session } = useSession();

    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // إذا كان المستخدم مسجل دخول بالفعل كأدمن نوجهه مباشرة

// ...

useEffect(() => {
    if (session?.user?.role === "admin") {
        router.push("/admin/dashboard");
    }
}, [session, router]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.email || !form.password) {
            setError("الرجاء ملء جميع الحقول.");
            return;
        }

        setLoading(true);

        try {
            const res = await signIn("admin", { // استخدم id
                redirect: false,
                email: form.email,
                password: form.password,
            });

            if (res?.error) {
                setError("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
            } else {
                // إعادة جلب الجلسة بعد تسجيل الدخول
                const sessionRes = await fetch("/api/auth/session");
                const sessionData = await sessionRes.json();

                if (sessionData?.user?.role === "admin") {
                    router.push("/admin/dashboard");
                } else {
                    setError("غير مصرح بالدخول.");
                }
            }
        } catch (err) {
            console.error(err);
            setError("حدث خطأ أثناء تسجيل الدخول.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">تسجيل دخول الأدمن</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-1">البريد الإلكتروني</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-400 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">كلمة المرور</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-400 outline-none"
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" /> {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-xl text-white font-semibold transition-all 
                            ${loading ? "bg-gray-400" : "bg-emerald-500 hover:bg-emerald-600"}`}
                    >
                        {loading ? "جاري الدخول..." : "تسجيل الدخول"}
                    </button>
                </form>
            </div>
        </div>
    );
}
