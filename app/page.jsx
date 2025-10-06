// 'use client'

// import { useState, useEffect, useContext, createContext } from 'react'
// import { Cairo } from 'next/font/google'

// const cairo = Cairo({
//     subsets: ['arabic'],
//     weight: ['400', '600', '700'],
// })

// const cityList = [
//     'Jeddah',
//     'Riyadh',
//     'Makkah',
//     'Medina',
//     'Dammam',
//     'Abha',
//     'Tabuk',
//     'Hail',
// ]

// const intensityLevels = ['خفيف', 'متوسط', 'عالي']

// const DarkModeContext = createContext()

// export default function HomePageWrapper() {
//     const [darkMode, setDarkMode] = useState(false)

//     useEffect(() => {
//         const stored = localStorage.getItem('darkMode')
//         if (stored === 'true') setDarkMode(true)
//     }, [])

//     useEffect(() => {
//         if (darkMode) {
//             document.documentElement.classList.add('dark')
//             localStorage.setItem('darkMode', 'true')
//         } else {
//             document.documentElement.classList.remove('dark')
//             localStorage.setItem('darkMode', 'false')
//         }
//     }, [darkMode])

//     return (
//         <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
//             <Home />
//         </DarkModeContext.Provider>
//     )
// }

// function Home() {
//     const { darkMode, setDarkMode } = useContext(DarkModeContext)

//     const [form, setForm] = useState({
//         name: '',
//         age: '',
//         sleepHours: '',
//         intensity: 'متوسط',
//         injury: 'لا',
//         city: 'Jeddah',
//     })
//     const [loading, setLoading] = useState(false)
//     const [weather, setWeather] = useState(null)
//     const [advice, setAdvice] = useState('')
//     const [adviceColor, setAdviceColor] = useState('text-green-600')
//     const [adviceLevel, setAdviceLevel] = useState('safe') // safe, conditional, unsafe

//     const onChange = (e) => {
//         setForm({ ...form, [e.target.name]: e.target.value })
//     }

//     const getAdvice = async () => {
//         if (!form.name.trim()) {
//             setAdvice('⚠️ الرجاء إدخال الاسم.')
//             setAdviceColor('text-red-600')
//             setAdviceLevel('unsafe')
//             return
//         }
//         if (!form.age || isNaN(form.age) || form.age < 10) {
//             setAdvice('⚠️ الرجاء إدخال عمر صحيح (أكبر من 10).')
//             setAdviceColor('text-red-600')
//             setAdviceLevel('unsafe')
//             return
//         }
//         if (!form.sleepHours || isNaN(form.sleepHours) || form.sleepHours < 0) {
//             setAdvice('⚠️ الرجاء إدخال عدد ساعات نوم صحيح.')
//             setAdviceColor('text-red-600')
//             setAdviceLevel('unsafe')
//             return
//         }

//         setLoading(true)
//         setWeather(null)
//         setAdvice('')

//         try {
//             const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY
//             const res = await fetch(
//                 `https://api.openweathermap.org/data/2.5/weather?q=${form.city}&units=metric&appid=${apiKey}&lang=ar`
//             )
//             const data = await res.json()

//             if (!res.ok || data.cod !== 200) {
//                 setAdvice('⚠️ لم يتم العثور على المدينة أو المفتاح غير صحيح.')
//                 setAdviceColor('text-red-600')
//                 setAdviceLevel('unsafe')
//                 setLoading(false)
//                 return
//             }

//             setWeather({
//                 temp: data.main.temp,
//                 humidity: data.main.humidity,
//                 condition: data.weather[0].description,
//                 city: data.name,
//                 dustId: data.weather[0].id,
//             })


//             let level = 'safe'

//             if (form.sleepHours < 5) level = 'unsafe'
//             else if (form.injury === 'نعم') level = 'unsafe'
//             else if (data.main.temp > 33) level = 'unsafe'
//             else if (data.weather[0].id >= 751 && data.weather[0].id <= 762) level = 'unsafe'
//             else if (data.main.humidity > 66) level = 'conditional'
//             else if (form.intensity === 'عالي' && form.sleepHours < 7) level = 'conditional'
//             else level = 'safe'

//             setAdviceLevel(level)

//             if (level === 'unsafe')
//                 setAdvice('❌ الوقت غير آمن للتمرين.')
//             else if (level === 'conditional')
//                 setAdvice('⚠️ مسموح مع اشتراطات (شرب سوائل وتقليل الشدة).')
//             else
//                 setAdvice('✅ الطقس مناسب للتمارين.')

//             setAdviceColor(
//                 level === 'unsafe'
//                     ? 'text-red-600'
//                     : level === 'conditional'
//                         ? 'text-yellow-600'
//                         : 'text-green-600'
//             )
//         } catch (error) {
//             setAdvice('❌ حدث خطأ أثناء جلب البيانات.')
//             setAdviceColor('text-red-600')
//             setAdviceLevel('unsafe')
//         } finally {
//             setLoading(false)
//         }
//     }

//     const handleGeolocation = () => {
//         if (!navigator.geolocation) {
//             setAdvice('🌐 المتصفح لا يدعم تحديد الموقع.')
//             setAdviceColor('text-yellow-600')
//             setAdviceLevel('conditional')
//             return
//         }

//         setLoading(true)
//         setWeather(null)
//         setAdvice('')

//         navigator.geolocation.getCurrentPosition(
//             async (position) => {
//                 try {
//                     const { latitude, longitude } = position.coords
//                     const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY
//                     const res = await fetch(
//                         `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}&lang=ar`
//                     )
//                     const data = await res.json()

//                     if (!res.ok || data.cod !== 200) {
//                         setAdvice('❌ تعذر تحديد موقعك بدقة.')
//                         setAdviceColor('text-red-600')
//                         setAdviceLevel('unsafe')
//                         setLoading(false)
//                         return
//                     }

//                     setForm((prev) => ({ ...prev, city: data.name }))
//                     setWeather({
//                         temp: data.main.temp,
//                         humidity: data.main.humidity,
//                         condition: data.weather[0].description,
//                         city: data.name,
//                         dustId: data.weather[0].id,
//                     })


//                     let level = 'safe'

//                     if (form.sleepHours < 5) level = 'unsafe'
//                     else if (form.injury === 'نعم') level = 'unsafe'
//                     else if (data.main.temp > 33) level = 'unsafe'
//                     else if (data.weather[0].id >= 751 && data.weather[0].id <= 762) level = 'unsafe'
//                     else if (data.main.humidity > 66) level = 'conditional'
//                     else if (form.intensity === 'عالي' && form.sleepHours < 7) level = 'conditional'
//                     else level = 'safe'

//                     setAdviceLevel(level)

//                     if (level === 'unsafe')
//                         setAdvice('❌ الوقت غير آمن للتمرين.')
//                     else if (level === 'conditional')
//                         setAdvice('⚠️ مسموح مع اشتراطات (شرب سوائل وتقليل الشدة).')
//                     else
//                         setAdvice('✅ الطقس مناسب للتمارين.')

//                     setAdviceColor(
//                         level === 'unsafe'
//                             ? 'text-red-600'
//                             : level === 'conditional'
//                                 ? 'text-yellow-600'
//                                 : 'text-green-600'
//                     )
//                 } catch {
//                     setAdvice('❌ حدث خطأ في جلب موقعك.')
//                     setAdviceColor('text-red-600')
//                     setAdviceLevel('unsafe')
//                 } finally {
//                     setLoading(false)
//                 }
//             },
//             (error) => {
//                 setAdvice('⚠️ تم رفض إذن الموقع أو حدث خطأ.')
//                 setAdviceColor('text-red-600')
//                 setAdviceLevel('unsafe')
//                 setLoading(false)
//             }
//         )
//     }

//     return (
//         <main
//             className={`min-h-screen bg-gradient-to-b from-blue-100 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-6 text-center transition-colors duration-500 ${cairo.className}`}
//             dir="rtl"
//         >
//             <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl dark:shadow-gray-700 p-8 w-full max-w-md text-right transition-colors duration-500">

//                 <div className="flex justify-between items-center mb-6">
//                     <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-400">
//                         {/* تحقق من مدى ملائمة الطقس واللياقة للتمرين 🏃‍♂️ */}
//                         تاكد وقت التمرين
//                     </h1>
//                     <button
//                         onClick={() => setDarkMode(!darkMode)}
//                         className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full transition-colors"
//                         aria-label="تبديل الوضع الداكن"
//                         title="تبديل الوضع الداكن"
//                     >
//                         {darkMode ? (
//                             <span role="img" aria-label="شمس">
//                                 ☀️
//                             </span>
//                         ) : (
//                             <span role="img" aria-label="قمر">
//                                 🌙
//                             </span>
//                         )}
//                     </button>
//                 </div>



//                 <label className="block mb-2 font-semibold text-gray-800 dark:text-gray-200">
//                     الاسم:
//                 </label>
//                 <input
//                     name="name"
//                     type="text"
//                     value={form.name}
//                     onChange={onChange}
//                     className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg w-full mb-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
//                     placeholder="أدخل اسمك"
//                 />

//                 <label className="block mb-2 font-semibold text-gray-800 dark:text-gray-200">
//                     العمر:
//                 </label>
//                 <input
//                     name="age"
//                     type="number"
//                     value={form.age}
//                     onChange={onChange}
//                     className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg w-full mb-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
//                     placeholder="أدخل عمرك"
//                     min={10}
//                 />

//                 <label className="block mb-2 font-semibold text-gray-800 dark:text-gray-200">
//                     عدد ساعات النوم:
//                 </label>
//                 <input
//                     name="sleepHours"
//                     type="number"
//                     value={form.sleepHours}
//                     onChange={onChange}
//                     className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg w-full mb-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
//                     placeholder="مثلاً: 7"
//                     min={0}
//                     max={24}
//                 />

//                 <label className="block mb-2 font-semibold text-gray-800 dark:text-gray-200">
//                     شدة التمرين:
//                 </label>
//                 <select
//                     name="intensity"
//                     value={form.intensity}
//                     onChange={onChange}
//                     className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg w-full mb-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
//                 >
//                     {intensityLevels.map((level) => (
//                         <option key={level} value={level}>
//                             {level}
//                         </option>
//                     ))}
//                 </select>

//                 <label className="block mb-2 font-semibold text-gray-800 dark:text-gray-200">
//                     هل لديك إصابة؟
//                 </label>
//                 <select
//                     name="injury"
//                     value={form.injury}
//                     onChange={onChange}
//                     className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg w-full mb-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
//                 >
//                     <option value="لا">لا</option>
//                     <option value="نعم">نعم</option>
//                 </select>

//                 <label className="block mb-2 font-semibold text-gray-800 dark:text-gray-200">
//                     اختر المدينة:
//                 </label>
//                 <select
//                     name="city"
//                     value={form.city}
//                     onChange={onChange}
//                     className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg w-full mb-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
//                 >
//                     {cityList.map((c) => (
//                         <option key={c} value={c}>
//                             {c}
//                         </option>
//                     ))}
//                 </select>

//                 <div className="flex gap-2 mb-6">
//                     <button
//                         onClick={getAdvice}
//                         disabled={loading}
//                         className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition disabled:opacity-50"
//                     >
//                         {loading ? 'جاري التحقق...' : 'تحقق من مدى ملائمة التمرين'}
//                     </button>
//                     <button
//                         onClick={handleGeolocation}
//                         className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-3 rounded-lg font-semibold transition"
//                     >
//                         📍 استخدم موقعي
//                     </button>
//                 </div>

//                 {weather && (
//                     <div className="mt-6 bg-gray-100 dark:bg-gray-800 rounded-xl p-4 text-gray-700 dark:text-gray-300 text-right transition-colors duration-500">
//                         <h2 className="font-semibold text-lg mb-2 text-blue-800 dark:text-blue-400">
//                             الطقس في {weather.city}:
//                         </h2>
//                         <p>🌡️ درجة الحرارة: {weather.temp}°C</p>
//                         <p>💧 الرطوبة: {weather.humidity}%</p>
//                         <p>☁️ الحالة: {weather.condition}</p>
//                     </div>
//                 )}


//                 <div className="mt-6 flex justify-center gap-6">

//                     <div
//                         className={`flex-1 p-4 rounded-lg border-4 text-white font-bold text-center select-none
//             ${adviceLevel === 'safe'
//                                 ? 'bg-green-600 border-green-700'
//                                 : 'bg-gray-300 border-gray-400 dark:bg-gray-700 dark:border-gray-600'
//                             }
//             `}
//                     >
//                         آمن
//                     </div>


//                     <div
//                         className={`flex-1 p-4 rounded-lg border-4 text-white font-bold text-center select-none
//             ${adviceLevel === 'conditional'
//                                 ? 'bg-yellow-500 border-yellow-600'
//                                 : 'bg-gray-300 border-gray-400 dark:bg-gray-700 dark:border-gray-600'
//                             }
//             `}
//                     >
//                         مسموح مع اشتراطات
//                     </div>


//                     <div
//                         className={`flex-1 p-4 rounded-lg border-4 text-white font-bold text-center select-none
//             ${adviceLevel === 'unsafe'
//                                 ? 'bg-red-600 border-red-700'
//                                 : 'bg-gray-300 border-gray-400 dark:bg-gray-700 dark:border-gray-600'
//                             }
//             `}
//                     >
//                         غير آمن
//                     </div>
//                 </div>


//                 {advice && (
//                     <div
//                         className={`mt-4 text-xl font-bold ${adviceColor} transition-colors duration-500`}
//                     >
//                         {advice}
//                     </div>
//                 )}
//             </div>
//         </main>
//     )
// }



'use client';
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Dumbbell, ShieldCheck, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from "../app/components/LanguageSwitcher";
import ThemeSwitcher from "../app/components/ThemeSwitcher";

export default function AuthPage() {
    const router = useRouter();
    const { t, i18n } = useTranslation("common");

    const [form, setForm] = useState({
        name: "",
        password: "",
        agreed: false,
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!form.name.trim()) newErrors.name = t("name_required") || "الاسم مطلوب";
        else if (form.name.length < 3) newErrors.name = t("name_too_short") || "الاسم يجب أن يكون 3 أحرف على الأقل";

        if (!form.password) newErrors.password = t("password_required") || "كلمة المرور مطلوبة";
        else if (form.password.length < 8) newErrors.password = t("password_too_short") || "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
        else if (!/[A-Z]/.test(form.password) || !/[0-9]/.test(form.password)) newErrors.password = t("password_weak") || "كلمة المرور يجب أن تحتوي على حرف كبير ورقم واحد على الأقل";

        if (!form.agreed) newErrors.agreed = t("must_agree") || "يجب الموافقة على الشروط قبل المتابعة";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === "checkbox" ? checked : value });
        setErrors({ ...errors, [name]: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);

        try {
            const res = await fetch("/api/trainee/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: form.name, password: form.password }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "حدث خطأ");

            if (res.status === 200) {
                alert(data.message); // تم تسجيل الدخول
                router.push("/instructions");
            } else if (res.status === 201) {
                router.push("/instructions"); // تم إنشاء الحساب
            }
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            dir={i18n.language === "ar" ? "rtl" : "ltr"}
            className="min-h-screen flex items-center justify-center p-4 bg-white dark:bg-gray-900 transition-colors duration-500"
        >
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-lg rounded-3xl p-6 sm:p-10 w-full max-w-md transition-colors duration-500"
            >
                <div className="flex justify-between items-center mb-6">
                    <LanguageSwitcher />
                    <ThemeSwitcher />
                </div>

                <div className="flex flex-col items-center mb-6">
                    <Dumbbell className="w-16 h-16 text-emerald-500 dark:text-emerald-400 mb-3 animate-pulse" />
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white text-center">{t("register_title")}</h1>
                    <p className="text-gray-500 dark:text-gray-300 text-sm mt-2 text-center">{t("register_description")}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* الاسم */}
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-1">{t("full_name")}</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className={`w-full bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-400 focus:outline-none transition 
                                ${errors.name ? "border-red-500" : "border-gray-300 dark:border-slate-600"}`}
                            placeholder={t("full_name")}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" /> {errors.name}
                            </p>
                        )}
                    </div>

                    {/* كلمة المرور */}
                    <div className="relative">
                        <label className="block text-gray-700 dark:text-gray-300 mb-1">{t("password")}</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className={`w-full bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 border rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-emerald-400 focus:outline-none transition 
                                ${errors.password ? "border-red-500" : "border-gray-300 dark:border-slate-600"}`}
                            placeholder="********"
                        />
                        <motion.button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            whileTap={{ scale: 0.9 }}
                            whileHover={{ scale: 1.1 }}
                            className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                        </motion.button>
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" /> {errors.password}
                            </p>
                        )}
                    </div>

                    {/* الموافقة */}
                    <div className={`flex items-center space-x-3 space-x-reverse bg-gray-100 dark:bg-slate-700 rounded-xl px-3 py-2 border transition 
                        ${errors.agreed ? "border-red-500" : "border-gray-300 dark:border-slate-600"}`}>
                        <input
                            type="checkbox"
                            id="agree"
                            name="agreed"
                            checked={form.agreed}
                            onChange={handleChange}
                            className="w-5 h-5 accent-emerald-500 cursor-pointer"
                        />
                        <label htmlFor="agree" className="text-gray-700 dark:text-gray-300 text-sm flex items-center gap-2 cursor-pointer">
                            <ShieldCheck className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                            {t("terms_agreement")}
                        </label>
                    </div>
                    {errors.agreed && (
                        <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                            <AlertCircle className="w-4 h-4" /> {errors.agreed}
                        </p>
                    )}

                    {/* الزر */}
                    <motion.button
                        whileTap={{ scale: 0.96 }}
                        whileHover={{ scale: form.agreed ? 1.02 : 1 }}
                        className={`w-full py-3 rounded-xl text-lg font-semibold transition-all duration-200 shadow-md 
                            ${form.agreed
                                ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                                : "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
                            }`}
                        type="submit"
                        disabled={!form.agreed || loading}
                    >
                        {loading ? t("loading") : t("login_or_register")}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}

