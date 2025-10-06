// 'use client';
// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { useSearchParams, useRouter } from 'next/navigation';
// import { useTranslation } from 'react-i18next';
// import LanguageSwitcher from '../../app/components/LanguageSwitcher';
// import ThemeSwitcher from '../../app/components/ThemeSwitcher';

// export default function TrainingReport() {
//     const { t, i18n } = useTranslation('common');
//     const searchParams = useSearchParams();
//     const router = useRouter();

//     const [reportData, setReportData] = useState(null);
//     const [weather, setWeather] = useState(null);
//     const [error, setError] = useState('');


//     // 🌤️ جلب بيانات الطقس
//     useEffect(() => {
//         const fetchWeather = async (lat, lon) => {
//             try {
//                 const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
//                 const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&lang=ar`;
//                 const res = await fetch(url);
//                 const data = await res.json();
//                 console.log("بيانات الطقس:", data);

//                 if (data?.current) {
//                     setWeather({
//                         city: data.location.name,
//                         temp: data.current.temp_c,
//                         humidity: data.current.humidity ?? 0,
//                         desc: data.current.condition.text,
//                     });
//                 } else {
//                     console.error("⚠️ لم يتم العثور على بيانات الطقس:", data);
//                 }
//             } catch (err) {
//                 console.error('❌ خطأ في جلب بيانات الطقس:', err);
//             }
//         };

//         // 🔹 تحديد موقع المستخدم بدقّة عالية
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(
//                 (pos) => {
//                     console.log("✅ الموقع الحالي:", pos.coords.latitude, pos.coords.longitude);
//                     fetchWeather(pos.coords.latitude, pos.coords.longitude);
//                 },
//                 (err) => {
//                     console.warn("⚠️ تعذر تحديد الموقع بدقة:", err);
//                     // الموقع الافتراضي: مكة المكرمة
//                     fetchWeather(21.3891, 39.8579);
//                 },
//                 {
//                     enableHighAccuracy: true, // GPS عالي الدقة
//                     timeout: 10000,
//                     maximumAge: 0
//                 }
//             );
//         } else {
//             console.warn("❌ المتصفح لا يدعم تحديد الموقع الجغرافي.");
//             fetchWeather(21.3891, 39.8579);
//         }
//     }, []);
//     // 🧾 جلب البيانات القادمة من صفحة الأسئلة
//     useEffect(() => {
//         const answers = searchParams.get('answers');
//         if (!answers) {
//             router.push('/');
//             return;
//         }
//         setReportData({ answers: JSON.parse(answers) });
//     }, [searchParams, router]);

//     if (!reportData)
//         return <p className="text-center mt-20">{t('loading', 'جاري التحميل...')}</p>;

//     const { answers } = reportData;
//     const temperature = weather?.temp ?? 30;
//     const humidity = weather?.humidity ?? 50;
//     const city = weather?.city ?? 'غير محدد';
//     const desc = weather?.desc ?? '';

//     // 🔹 تقييمات (كما هي عندك)
//     const assessSleep = (hours) => {
//         if (hours < 5) return { rating: t('danger', 'خطر'), advice: t('sleepAdviceLow', '- تقليل شدة التمرين.') };
//         if (hours <= 7) return { rating: t('medium', 'متوسط'), advice: t('sleepAdviceMed', '- التدرج في شدة التمرين.\n- مراقبة علامات التعب والإرهاق.') };
//         return { rating: t('excellent', 'ممتاز'), advice: t('sleepAdviceHigh', '- متابعة التدريب المعتاد.') };
//     };

//     const assessReadiness = (val) => {
//         switch (val) {
//             case 'نعم، تمامًا': return { rating: t('good', 'جيد'), advice: t('readinessYesAdvice', '- متابعة التدريب المعتاد.') };
//             case 'نوعًا ما': return { rating: t('medium', 'متوسط'), advice: t('readinessSomewhatAdvice', '- تدريب معتدل، مراقبة التعب.') };
//             case 'لست متأكدًا': return { rating: t('caution', 'حذر'), advice: t('readinessNotSureAdvice', '- تدريب خفيف، زيادة فترات الراحة عند الحاجة.') };
//             case 'لا، أشعر بعدم الجاهزية': return { rating: t('danger', 'خطر'), advice: t('readinessNoAdvice', '- تأجيل التمرين أو استبداله بتمارين استشفاء خفيفة.') };
//             default: return { rating: '-', advice: '-' };
//         }
//     };

//     const assessField = (val) => val === 'أخرى'
//         ? { rating: t('caution', 'حذر'), advice: t('fieldOtherAdvice', '- اختيار الحذاء والتجهيزات الواقية، زيادة الانتباه للحركة على الأرضية.') }
//         : { rating: t('good', 'جيد'), advice: t('fieldNormalAdvice', '- استخدام الحذاء المناسب لتقليل خطر الإصابات.') };

//     const assessEffort = (val) => {
//         switch (val) {
//             case 'جهد خفيف جداً (أقل من 40%)': return { rating: t('safe', 'آمن'), advice: t('effortLowAdvice', '- متابعة التدريب المعتاد.') };
//             case 'جهد منخفض إلى متوسط (40% – 70%)': return { rating: t('safeCaution', 'آمن / حذر'), advice: t('effortMedAdvice', '- تقليل شدة التدريب عند الحاجة.\n- مراقبة التعب والإرهاق.') };
//             case 'جهد عالٍ (70% – 90%)': return { rating: t('cautionUnsafe', 'حذر / غير آمن'), advice: t('effortHighAdvice', '- تقليل شدة التدريب ومراقبة التعب.') };
//             case 'جهد شديد جداً (90% – 100%)': return { rating: t('unsafe', 'غير آمن'), advice: t('effortMaxAdvice', '- الراحة وإيقاف التدريب فوراً.') };
//             default: return { rating: '-', advice: '-' };
//         }
//     };

//     const assessBody = (val) => {
//         switch (val) {
//             case 'أشعر بنشاط كامل وبدون أعراض': return { rating: t('safe', 'آمن'), advice: t('bodyHealthyAdvice', '- متابعة التدريب المعتاد.') };
//             case 'لدي تعب خفيف دون ألم أو تأثير على الأداء': return { rating: t('semiSafe', 'شبه آمن'), advice: t('bodyMildTiredAdvice', '- متابعة التدريب مع تقليل الشدة ومراقبة التعب.') };
//             case 'أعاني من بعض الألم أو الشد العضلي': return { rating: t('caution', 'حذر'), advice: t('bodySomePainAdvice', '- تقليل شدة التدريب وزيادة فترات الراحة.') };
//             case 'أشعر بإرهاق شديد أو إصابة واضحة': return { rating: t('unsafe', 'غير آمن'), advice: t('bodyExhaustedAdvice', '- تأجيل التدريب أو استبداله بتمارين استشفاء.') };
//             default: return { rating: '-', advice: '-' };
//         }
//     };

//     const assessTemperature = (temp) => {
//         if (temp <= 30) return { rating: t('safe', 'آمن'), advice: t('tempSafeAdvice', '- متابعة التدريب المعتاد.') };
//         if (temp <= 34) return { rating: t('medium', 'متوسطة (حذر)'), advice: t('tempMedAdvice', '- تقليل شدة التدريب تدريجيًا.') };
//         return { rating: t('unsafe', 'غير آمن'), advice: t('tempUnsafeAdvice', '- تغيير وقت التمرين أو تقليل شدته.') };
//     };

//     const assessHumidity = (hum) => {
//         if (hum <= 60) return { rating: t('safe', 'آمنة'), advice: t('humiditySafeAdvice', '- التدريب طبيعي.') };
//         if (hum <= 70) return { rating: t('medium', 'متوسطة (حذر)'), advice: t('humidityMedAdvice', '- شرب السوائل بانتظام وأخذ فترات راحة.') };
//         return { rating: t('unsafe', 'غير آمنة'), advice: t('humidityUnsafeAdvice', '- تقليل شدة التدريب أو تأجيله.') };
//     };

//     const items = [
//         { label: t('sleep', 'النوم'), value: assessSleep(Number(answers.sleepHours.replace(/\D/g, ''))) },
//         { label: t('readiness', 'الجاهزية'), value: assessReadiness(answers.readiness) },
//         { label: t('fieldType', 'نوع الأرضية'), value: assessField(answers.fieldType) },
//         { label: t('effort', 'مستوى الجهد'), value: assessEffort(answers.effortLevel) },
//         { label: t('body', 'الحالة الجسدية'), value: assessBody(answers.bodyFeeling) },
//         { label: t('temperature', 'درجة الحرارة'), value: assessTemperature(temperature) },
//         { label: t('humidity', 'الرطوبة'), value: assessHumidity(humidity) },
//     ];

//     return (
//         <div dir={i18n.language === "ar" ? "rtl" : "ltr"} className="min-h-screen flex flex-col items-center justify-start p-4 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-500">
//             <motion.div
//                 initial={{ opacity: 0, y: 40 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//                 className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-lg rounded-3xl p-6 sm:p-8 w-full max-w-4xl"
//             >
//                 <div className="flex justify-between items-center mb-4">
//                     <LanguageSwitcher />
//                     <ThemeSwitcher />
//                 </div>

//                 <h1 className="text-3xl font-bold text-center mb-2">
//                     {t('trainingReport', '📊 تقرير التدريب اليوم')}
//                 </h1>

//                 <div className="text-center mb-6">
//                     <p>📍 <b>{city}</b></p>
//                     <p>🌡️ {temperature}°C | 💧 {humidity}%</p>
//                     {desc && <p>☁️ {desc}</p>}
//                     {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
//                 </div>

//                 <div className="grid gap-4 sm:grid-cols-2">
//                     {items.map(item => (
//                         <div key={item.label} className="p-4 border border-gray-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700">
//                             <h2 className="font-semibold mb-1">{item.label}</h2>
//                             <p><span className="font-bold">{t('rating', 'التقييم')}:</span> {item.value.rating}</p>
//                             <p><span className="font-bold">{t('advice', 'التعليمات')}:</span> {item.value.advice}</p>
//                         </div>
//                     ))}
//                 </div>

//                 <button
//                     onClick={() => router.push('/')}
//                     className="mt-6 w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-md transition-colors duration-200"
//                 >
//                     {t('back', 'العودة')}
//                 </button>
//             </motion.div>
//         </div>
//     );
// }




'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../app/components/LanguageSwitcher';
import ThemeSwitcher from '../../app/components/ThemeSwitcher';

export default function TrainingReport() {
    const { t, i18n } = useTranslation('common');
    const searchParams = useSearchParams();
    const router = useRouter();

    const [reportData, setReportData] = useState(null);
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState('');

    // 🌤️ جلب بيانات الطقس
    useEffect(() => {
        const fetchWeather = async (lat, lon) => {
            try {
                // تحقق من البيانات المخزنة مسبقًا
                const cacheKey = `weather_${lat}_${lon}`;
                const cached = localStorage.getItem(cacheKey);
                const now = new Date().getTime();

                if (cached) {
                    const cachedData = JSON.parse(cached);
                    // إذا لم يتجاوز عمر البيانات 30 دقيقة
                    if (now - cachedData.timestamp < 30 * 60 * 1000) {
                        setWeather(cachedData.weather);
                        return;
                    }
                }

                const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
                const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&lang=ar`;
                const res = await fetch(url);
                const data = await res.json();
                console.log("بيانات الطقس:", data);

                if (data?.current) {
                    const weatherObj = {
                        city: data.location.name,
                        temp: data.current.temp_c,
                        humidity: data.current.humidity ?? 0,
                        desc: data.current.condition.text,
                        wind: data.current.wind_kph
                    };
                    setWeather(weatherObj);

                    // حفظ البيانات في localStorage
                    localStorage.setItem(cacheKey, JSON.stringify({
                        timestamp: now,
                        weather: weatherObj
                    }));
                } else {
                    console.error("⚠️ لم يتم العثور على بيانات الطقس:", data);
                }
            } catch (err) {
                console.error('❌ خطأ في جلب بيانات الطقس:', err);
            }
        };

        // 🔹 تحديد موقع المستخدم بدقّة عالية
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    fetchWeather(pos.coords.latitude, pos.coords.longitude);
                },
                (err) => {
                    console.warn("⚠️ تعذر تحديد الموقع بدقة:", err);
                    // fetchWeather(21.3891, 39.8579); // مكة
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        } else {
            fetchWeather(21.3891, 39.8579);
        }
    }, []);

    // 🧾 جلب البيانات القادمة من صفحة الأسئلة
    useEffect(() => {
        const answers = searchParams.get('answers');
        if (!answers) {
            router.push('/');
            return;
        }
        setReportData({ answers: JSON.parse(answers) });
    }, [searchParams, router]);

    if (!reportData)
        return <p className="text-center mt-20">{t('loading', 'جاري التحميل...')}</p>;

    const { answers } = reportData;
    const temperature = weather?.temp ?? 30;
    const humidity = weather?.humidity ?? 50;
    const city = weather?.city ?? 'غير محدد';
    const desc = weather?.desc ?? '';
    const wind = weather?.wind ?? 0;

    // 🔹 تقييمات
    const assessSleep = (hours) => {
        if (hours < 5) return { rating: t('danger', 'خطر'), advice: t('sleepAdviceLow', '- تقليل شدة التمرين.') };
        if (hours <= 7) return { rating: t('medium', 'متوسط'), advice: t('sleepAdviceMed', '- التدرج في شدة التمرين.\n- مراقبة علامات التعب والإرهاق.') };
        return { rating: t('excellent', 'ممتاز'), advice: t('sleepAdviceHigh', '- متابعة التدريب المعتاد.') };
    };
    const assessReadiness = (val) => {
        switch (val) {
            case 'نعم، تمامًا': return { rating: t('good', 'جيد'), advice: t('readinessYesAdvice', '- متابعة التدريب المعتاد.') };
            case 'نوعًا ما': return { rating: t('medium', 'متوسط'), advice: t('readinessSomewhatAdvice', '- تدريب معتدل، مراقبة التعب.') };
            case 'لست متأكدًا': return { rating: t('caution', 'حذر'), advice: t('readinessNotSureAdvice', '- تدريب خفيف، زيادة فترات الراحة عند الحاجة.') };
            case 'لا، أشعر بعدم الجاهزية': return { rating: t('danger', 'خطر'), advice: t('readinessNoAdvice', '- تأجيل التمرين أو استبداله بتمارين استشفاء خفيفة.') };
            default: return { rating: '-', advice: '-' };
        }
    };
    const assessField = (val) => val === 'أخرى'
        ? { rating: t('caution', 'حذر'), advice: t('fieldOtherAdvice', '- اختيار الحذاء والتجهيزات الواقية.') }
        : { rating: t('good', 'جيد'), advice: t('fieldNormalAdvice', '- استخدام الحذاء المناسب.') };
    const assessEffort = (val) => {
        switch (val) {
            case 'جهد خفيف جداً (أقل من 40%)': return { rating: t('safe', 'آمن'), advice: t('effortLowAdvice', '- متابعة التدريب المعتاد.') };
            case 'جهد منخفض إلى متوسط (40% – 70%)': return { rating: t('safeCaution', 'آمن / حذر'), advice: t('effortMedAdvice', '- تقليل شدة التدريب ومراقبة التعب.') };
            case 'جهد عالٍ (70% – 90%)': return { rating: t('cautionUnsafe', 'حذر / غير آمن'), advice: t('effortHighAdvice', '- تقليل شدة التدريب ومراقبة التعب.') };
            case 'جهد شديد جداً (90% – 100%)': return { rating: t('unsafe', 'غير آمن'), advice: t('effortMaxAdvice', '- الراحة وإيقاف التدريب فوراً.') };
            default: return { rating: '-', advice: '-' };
        }
    };
    const assessBody = (val) => {
        switch (val) {
            case 'أشعر بنشاط كامل وبدون أعراض': return { rating: t('safe', 'آمن'), advice: t('bodyHealthyAdvice', '- متابعة التدريب المعتاد.') };
            case 'لدي تعب خفيف دون ألم أو تأثير على الأداء': return { rating: t('semiSafe', 'شبه آمن'), advice: t('bodyMildTiredAdvice', '- متابعة التدريب مع تقليل الشدة.') };
            case 'أعاني من بعض الألم أو الشد العضلي': return { rating: t('caution', 'حذر'), advice: t('bodySomePainAdvice', '- تقليل شدة التدريب وزيادة فترات الراحة.') };
            case 'أشعر بإرهاق شديد أو إصابة واضحة': return { rating: t('unsafe', 'غير آمن'), advice: t('bodyExhaustedAdvice', '- تأجيل التدريب أو استبداله بتمارين استشفاء.') };
            default: return { rating: '-', advice: '-' };
        }
    };
    const assessTemperature = (temp) => {
        if (temp <= 30) return { rating: t('safe', 'آمن'), advice: t('tempSafeAdvice', '- متابعة التدريب المعتاد.') };
        if (temp <= 34) return { rating: t('medium', 'متوسطة (حذر)'), advice: t('tempMedAdvice', '- تقليل شدة التدريب تدريجيًا.') };
        return { rating: t('unsafe', 'غير آمن'), advice: t('tempUnsafeAdvice', '- تغيير وقت التمرين أو تقليل شدته.') };
    };
    const assessHumidity = (hum) => {
        if (hum <= 60) return { rating: t('safe', 'آمنة'), advice: t('humiditySafeAdvice', '- التدريب طبيعي.') };
        if (hum <= 70) return { rating: t('medium', 'متوسطة (حذر)'), advice: t('humidityMedAdvice', '- شرب السوائل بانتظام وأخذ فترات راحة.') };
        return { rating: t('unsafe', 'غير آمنة'), advice: t('humidityUnsafeAdvice', '- تقليل شدة التدريب أو تأجيله.') };
    };

    const items = [
        { label: t('sleep', 'النوم'), value: assessSleep(Number(answers.sleepHours.replace(/\D/g, ''))) },
        { label: t('readiness', 'الجاهزية'), value: assessReadiness(answers.readiness) },
        { label: t('fieldType', 'نوع الأرضية'), value: assessField(answers.fieldType) },
        { label: t('effort', 'مستوى الجهد'), value: assessEffort(answers.effortLevel) },
        { label: t('body', 'الحالة الجسدية'), value: assessBody(answers.bodyFeeling) },
        { label: t('temperature', 'درجة الحرارة'), value: assessTemperature(temperature) },
        { label: t('humidity', 'الرطوبة'), value: assessHumidity(humidity) },
    ];

    return (
        <div dir={i18n.language === "ar" ? "rtl" : "ltr"} className="min-h-screen flex flex-col items-center justify-start p-4 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-500">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-lg rounded-3xl p-6 sm:p-8 w-full max-w-4xl"
            >
                <div className="flex justify-between items-center mb-4">
                    <LanguageSwitcher />
                    <ThemeSwitcher />
                </div>

                <h1 className="text-3xl font-bold text-center mb-2">
                    {t('trainingReport', '📊 تقرير التدريب اليوم')}
                </h1>

                <div className="text-center mb-6">
                    <p>📍 <b>{city}</b></p>
                    <p>🌡️ {temperature}°C | 💧 {humidity}% | 💨 {wind} كم/س</p>
                    {desc && <p>☁️ {desc}</p>}
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    {items.map(item => (
                        <div key={item.label} className="p-4 border border-gray-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700">
                            <h2 className="font-semibold mb-1">{item.label}</h2>
                            <p><span className="font-bold">{t('rating', 'التقييم')}:</span> {item.value.rating}</p>
                            <p><span className="font-bold">{t('advice', 'التعليمات')}:</span> {item.value.advice}</p>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => router.push('/')}
                    className="mt-6 w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-md transition-colors duration-200"
                >
                    {t('back', 'العودة')}
                </button>
            </motion.div>
        </div>
    );
}
