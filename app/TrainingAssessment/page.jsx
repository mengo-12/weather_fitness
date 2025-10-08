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
//                 const cacheKey = `weather_${lat}_${lon}`;
//                 const cached = localStorage.getItem(cacheKey);
//                 const now = new Date().getTime();

//                 if (cached) {
//                     const cachedData = JSON.parse(cached);
//                     if (now - cachedData.timestamp < 30 * 60 * 1000) {
//                         setWeather(cachedData.weather);
//                         return;
//                     }
//                 }

//                 const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
//                 const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&lang=ar`;
//                 const res = await fetch(url);
//                 const data = await res.json();
//                 console.log("بيانات الطقس:", data);

//                 if (data?.current) {
//                     const weatherObj = {
//                         city: data.location.name,
//                         temp: data.current.temp_c,
//                         humidity: data.current.humidity ?? 0,
//                         desc: data.current.condition.text,
//                         wind: data.current.wind_kph
//                     };
//                     setWeather(weatherObj);
//                     localStorage.setItem(cacheKey, JSON.stringify({
//                         timestamp: now,
//                         weather: weatherObj
//                     }));
//                 } else {
//                     console.error("⚠️ لم يتم العثور على بيانات الطقس:", data);
//                     setError('تعذر جلب بيانات الطقس حالياً.');
//                 }
//             } catch (err) {
//                 console.error('❌ خطأ في جلب بيانات الطقس:', err);
//                 setError('حدث خطأ أثناء جلب بيانات الطقس.');
//             }
//         };

//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(
//                 (pos) => {
//                     fetchWeather(pos.coords.latitude, pos.coords.longitude);
//                 },
//                 (err) => {
//                     console.warn("⚠️ رفض المستخدم الوصول إلى الموقع أو حدث خطأ:", err);
//                     setError('⚠️ لم يتم السماح بالوصول إلى موقعك، لا يمكن عرض بيانات الطقس.');
//                 },
//                 {
//                     enableHighAccuracy: true,
//                     timeout: 10000,
//                     maximumAge: 0
//                 }
//             );
//         } else {
//             setError('❌ المتصفح لا يدعم تحديد الموقع الجغرافي.');
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
//     const wind = weather?.wind ?? 0;

//     // 🔹 تقييمات حسب الاستبيان

//     // 💤 تقييم النوم
//     const assessSleep = (hours) => {
//         if (hours < 5) return { rating: t('unsafe', 'غير آمن'), advice: t('sleepAdviceLow', '- تقليل شدة التمرين.') };
//         if (hours <= 7) return { rating: t('caution', 'حذر'), advice: t('sleepAdviceMed', '- التدرج في شدة التمرين.\n- مراقبة علامات التعب والإرهاق.') };
//         return { rating: t('safe', 'آمن'), advice: t('sleepAdviceHigh', '- متابعة التدريب المعتاد.') };
//     };

//     // 🏋️‍♂️ تقييم الجاهزية
//     const assessReadiness = (val) => {
//         switch (val) {
//             case 'نعم، تمامًا':
//                 return { rating: t('safe', 'آمن'), advice: t('readinessYesAdvice', '- متابعة التدريب المعتاد.') };
//             case 'نوعًا ما':
//                 return { rating: t('allowed', 'مسموح'), advice: t('readinessSomewhatAdvice', '- تدريب معتدل، مراقبة التعب.') };
//             case 'لست متأكدًا':
//                 return { rating: t('caution', 'حذر'), advice: t('readinessNotSureAdvice', '- تدريب خفيف، زيادة فترات الراحة عند الحاجة.') };
//             case 'لا، أشعر بعدم الجاهزية':
//                 return { rating: t('unsafe', 'خطر'), advice: t('readinessNoAdvice', '- تأجيل التمرين أو استبداله بتمارين استشفاء خفيفة.') };
//             default:
//                 return { rating: '-', advice: '-' };
//         }
//     };

//     // 🌱 تقييم نوع الأرضية
//     const assessField = (val) => {
//         if (['عشب طبيعي', 'عشب صناعي', 'ترابية'].includes(val)) {
//             return { rating: t('safe', 'آمن'), advice: t('fieldNormalAdvice', '- استخدام الحذاء المناسب لتقليل خطر الإصابات.') };
//         }
//         return { rating: t('caution', 'حذر'), advice: t('fieldOtherAdvice', '- اختيار الحذاء والتجهيزات الواقية، زيادة الانتباه للحركة على الأرضية.') };
//     };

//     // باقي التقييمات كما هي
//     const assessEffort = (val) => {
//         switch (val) {
//             case 'جهد خفيف (أقل من 40%)':
//                 return { rating: t('safe', 'آمن'), advice: t('effortLowAdvice', '- متابعة التدريب المعتاد.') };
//             case 'جهد متوسط (40% – 70%)':
//                 return { rating: t('allowed', 'مسموح'), advice: t('effortMedAdvice', '- تقليل شدة التمرين عند الحاجة والالتزام بالتعليمات الأساسية.\n- مراقبة التعب والإرهاق.') };
//             case 'جهد مرتفع (70% – 90%)':
//                 return { rating: t('caution', 'حذر'), advice: t('effortHighAdvice', '- تقليل شدة التمرين والالتزام بالتعليمات الأساسية مع مراقبة التعب والارهاق.') };
//             case 'جهد مرتفع جدًا (90% – 100%)':
//                 return { rating: t('unsafe', 'غير آمن'), advice: t('effortMaxAdvice', '- الراحة وإيقاف التدريب وعمل الاستشفاء.') };
//             default:
//                 return { rating: '-', advice: '-' };
//         }
//     };

//     const assessBody = (val) => {
//         switch (val) {
//             case 'أشعر بنشاط كامل وبدون أعراض': return { rating: t('safe', 'آمن'), advice: t('bodyHealthyAdvice', '- متابعة التدريب المعتاد.') };
//             case 'لدي تعب خفيف دون ألم أو تأثير على الأداء': return { rating: t('semiSafe', 'شبه آمن'), advice: t('bodyMildTiredAdvice', '- متابعة التدريب مع تقليل الشدة.') };
//             case 'أعاني من بعض الألم أو الشد العضلي': return { rating: t('caution', 'حذر'), advice: t('bodySomePainAdvice', '- تقليل شدة التدريب وزيادة فترات الراحة.') };
//             case 'أشعر بإرهاق شديد أو إصابة واضحة': return { rating: t('unsafe', 'غير آمن'), advice: t('bodyExhaustedAdvice', '- تأجيل التدريب أو استبداله بتمارين استشفاء.') };
//             default: return { rating: '-', advice: '-' };
//         }
//     };

//     const assessTemperature = (temp) => {
//         if (temp <= 30) return { rating: t('safe', 'آمن'), advice: t('tempSafeAdvice', '- متابعة التدريب المعتاد.') };
//         if (temp <= 34) return { rating: t('caution', 'حذر'), advice: t('tempMedAdvice', '- تقليل شدة التدريب تدريجيًا.') };
//         return { rating: t('unsafe', 'غير آمن'), advice: t('tempUnsafeAdvice', '- تغيير وقت التمرين أو تقليل شدته.') };
//     };

//     const assessHumidity = (hum) => {
//         if (hum <= 60) return { rating: t('safe', 'آمن'), advice: t('humiditySafeAdvice', '- التدريب طبيعي.') };
//         if (hum <= 70) return { rating: t('caution', 'حذر'), advice: t('humidityMedAdvice', '- شرب السوائل بانتظام وأخذ فترات راحة.') };
//         return { rating: t('unsafe', 'غير آمن'), advice: t('humidityUnsafeAdvice', '- تقليل شدة التدريب أو تأجيله.') };
//     };

//     // العناصر
//     const items = [
//         { label: t('sleep', 'النوم'), value: assessSleep(Number(answers.sleepHours.replace(/\D/g, ''))) },
//         { label: t('readiness', 'الجاهزية'), value: assessReadiness(answers.readiness) },
//         { label: t('fieldType', 'نوع الأرضية'), value: assessField(answers.fieldType) },
//         { label: t('effort', 'مستوى الجهد'), value: assessEffort(answers.effortLevel) },
//         { label: t('body', 'الحالة الجسدية'), value: assessBody(answers.bodyFeeling) },
//         { label: t('temperature', 'درجة الحرارة'), value: assessTemperature(temperature) },
//         { label: t('humidity', 'الرطوبة'), value: assessHumidity(humidity) },
//     ];

//     // دالة لتحديد لون الكارد حسب التقييم
//     const getCardColor = (rating) => {
//         switch (rating) {
//             case t('safe', 'آمن'): return 'bg-green-200 dark:bg-green-700';
//             case t('caution', 'حذر'): return 'bg-orange-200 dark:bg-orange-700';
//             case t('allowed', 'مسموح'): return 'bg-yellow-200 dark:bg-yellow-700';
//             case t('unsafe', 'غير آمن'): return 'bg-red-200 dark:bg-red-700';
//             default: return 'bg-gray-100 dark:bg-gray-600';
//         }
//     };

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
//                     {weather ? (
//                         <>
//                             <p>📍 <b>{city}</b></p>
//                             <p>🌡️ {temperature}°C | 💧 {humidity}% | 💨 {wind} كم/س</p>
//                             {desc && <p>☁️ {desc}</p>}
//                         </>
//                     ) : (
//                         <p className="text-red-500 text-sm mt-2">{error || 'جاري تحميل بيانات الطقس...'}</p>
//                     )}
//                 </div>

//                 <div className="grid gap-4 sm:grid-cols-2">
//                     {items.map(item => (
//                         <div key={item.label} className={`p-4 border border-gray-200 dark:border-slate-600 rounded-lg ${getCardColor(item.value.rating)}`}>
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




// 'use client';
// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { useSearchParams, useRouter } from 'next/navigation';
// import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaRegCircle } from 'react-icons/fa';
// import LanguageSwitcher from '../../app/components/LanguageSwitcher';
// import ThemeSwitcher from '../../app/components/ThemeSwitcher';

// export default function TrainingReport() {
//     const searchParams = useSearchParams();
//     const router = useRouter();

//     const [reportData, setReportData] = useState(null);
//     const [weather, setWeather] = useState(null);
//     const [error, setError] = useState('');

//     // 🌤️ جلب بيانات الطقس
//     useEffect(() => {
//         const fetchWeather = async (lat, lon) => {
//             try {
//                 const cacheKey = `weather_${lat}_${lon}`;
//                 const cached = localStorage.getItem(cacheKey);
//                 const now = new Date().getTime();

//                 if (cached) {
//                     const cachedData = JSON.parse(cached);
//                     if (now - cachedData.timestamp < 30 * 60 * 1000) {
//                         setWeather(cachedData.weather);
//                         return;
//                     }
//                 }

//                 const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
//                 const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&lang=ar`;
//                 const res = await fetch(url);
//                 const data = await res.json();

//                 if (data?.current) {
//                     const weatherObj = {
//                         temp: data.current.temp_c,
//                         humidity: data.current.humidity ?? 0,
//                         city: data.location.name,
//                         desc: data.current.condition.text,
//                         wind: data.current.wind_kph
//                     };
//                     setWeather(weatherObj);
//                     localStorage.setItem(cacheKey, JSON.stringify({ timestamp: now, weather: weatherObj }));
//                 } else setError('تعذر جلب بيانات الطقس حالياً.');
//             } catch (err) { setError('حدث خطأ أثناء جلب بيانات الطقس.'); }
//         };

//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(
//                 pos => fetchWeather(pos.coords.latitude, pos.coords.longitude),
//                 () => setError('⚠️ لم يتم السماح بالوصول إلى موقعك.'),
//                 { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
//             );
//         } else setError('❌ المتصفح لا يدعم تحديد الموقع الجغرافي.');
//     }, []);

//     // 🧾 جلب البيانات من صفحة الأسئلة
//     useEffect(() => {
//         const answers = searchParams.get('answers');
//         if (!answers) router.push('/');
//         else setReportData({ answers: JSON.parse(answers) });
//     }, [searchParams, router]);

//     if (!reportData) return <p className="text-center mt-20">جاري التحميل...</p>;

//     const { answers } = reportData;
//     const temperature = weather?.temp ?? 30;
//     const humidity = weather?.humidity ?? 50;
//     const city = weather?.city ?? 'غير محدد';
//     const desc = weather?.desc ?? '';
//     const wind = weather?.wind ?? 0;

//     // ----------------------- تقييمات باستخدام المفاتيح -----------------------
//     const assessSleep = (val) => {
//         const hours = Number(val.replace(/\D/g, ''));
//         if (hours < 5) return { rating: 'غير آمن', advice: '- تقليل شدة التمرين.' };
//         if (hours <= 7) return { rating: 'حذر', advice: '- التدرج في شدة التمرين.\n- مراقبة علامات التعب والإرهاق.' };
//         return { rating: 'آمن', advice: '- متابعة التدريب المعتاد.' };
//     };

//     const assessReadiness = (key) => {
//         switch (key) {
//             case 'opt31': return { rating: 'آمن', advice: '- متابعة التدريب المعتاد.' };
//             case 'opt32': return { rating: 'مسموح', advice: '- تدريب معتدل، مراقبة التعب.' };
//             case 'opt33': return { rating: 'حذر', advice: '- تدريب خفيف، زيادة فترات الراحة عند الحاجة.' };
//             case 'opt34': return { rating: 'غير آمن', advice: '- تأجيل التمرين أو استبداله بتمارين استشفاء خفيفة.' };
//             default: return { rating: 'غير محدد', advice: '⚠️ لم يتم التعرف على القيمة.' };
//         }
//     };

//     const assessField = (key) => {
//         switch (key) {
//             case 'opt41':
//             case 'opt42':
//             case 'opt43':
//                 return { rating: 'آمن', advice: '- استخدام الحذاء المناسب لتقليل خطر الإصابات.' };
//             case 'opt44':
//                 return { rating: 'حذر', advice: '- اختيار الحذاء والتجهيزات الواقية، زيادة الانتباه للحركة على الأرضية.' };
//             default: return { rating: 'غير محدد', advice: '⚠️ لم يتم التعرف على القيمة.' };
//         }
//     };

//     const assessEffort = (key) => {
//         switch (key) {
//             case 'opt51': return { rating: 'آمن', advice: '- متابعة التدريب المعتاد.' };
//             case 'opt52': return { rating: 'مسموح', advice: '- تقليل شدة التمرين عند الحاجة.\n- مراقبة التعب والإرهاق.' };
//             case 'opt53': return { rating: 'حذر', advice: '- تقليل شدة التدريب ومراقبة التعب والارهاق.' };
//             case 'opt54': return { rating: 'غير آمن', advice: '- الراحة وإيقاف التدريب وعمل الاستشفاء.' };
//             default: return { rating: 'غير محدد', advice: '⚠️ لم يتم التعرف على القيمة.' };
//         }
//     };

//     const assessBody = (key) => {
//         switch (key) {
//             case 'opt61': return { rating: 'آمن', advice: '- متابعة التدريب المعتاد وفق الخطة.' };
//             case 'opt62': return { rating: 'مسموح', advice: '- تقليل شدة بعض التمارين ومراقبة التعب.' };
//             case 'opt63': return { rating: 'حذر', advice: '- تقليل شدة التدريب، زيادة فترات الراحة.' };
//             case 'opt64': return { rating: 'غير آمن', advice: '- تأجيل التدريب أو استبداله بتمارين استشفاء خفيفة.' };
//             default: return { rating: '-', advice: '-' };
//         }
//     };

//     const assessTemperature = (temp) => {
//         if (temp <= 30) return { rating: 'آمن', advice: '- متابعة التدريب المعتاد.' };
//         if (temp <= 34) return { rating: 'حذر', advice: '- تقليل شدة التدريب تدريجيًا والالتزام بالتعليمات.' };
//         return { rating: 'غير آمن', advice: '- تغيير وقت التمرين، تقليل الشدة، مراقبة التعب.' };
//     };

//     const assessHumidity = (hum) => {
//         if (hum <= 60) return { rating: 'آمن', advice: '- استمر في التدريب حسب الخطة المعتادة.' };
//         if (hum <= 70) return { rating: 'حذر', advice: '- شرب السوائل كل 20 دقيقة، أخذ استراحات قصيرة، مراقبة التعب.' };
//         return { rating: 'غير آمن', advice: '- تقليل الشدة أو تأجيل التدريب، شرب سوائل متكررة، مراقبة الحالة.' };
//     };

//     const items = [
//         { label: 'النوم', value: assessSleep(answers.sleepHours) },
//         { label: 'الجاهزية', value: assessReadiness(answers.readiness) },
//         { label: 'نوع الأرضية', value: assessField(answers.fieldType) },
//         { label: 'مستوى الجهد', value: assessEffort(answers.effortLevel) },
//         { label: 'الحالة الجسدية', value: assessBody(answers.bodyFeeling) },
//         { label: 'درجة الحرارة', value: assessTemperature(temperature) },
//         { label: 'الرطوبة', value: assessHumidity(humidity) },
//     ];

//     const getCardStyle = (rating) => {
//         switch (rating) {
//             case 'آمن': return { bg: 'bg-green-200 dark:bg-green-700', icon: <FaCheckCircle className="text-green-600 dark:text-green-300 w-6 h-6" /> };
//             case 'حذر': return { bg: 'bg-orange-200 dark:bg-orange-700', icon: <FaExclamationTriangle className="text-orange-600 dark:text-orange-300 w-6 h-6" /> };
//             case 'مسموح': return { bg: 'bg-yellow-200 dark:bg-yellow-700', icon: <FaRegCircle className="text-yellow-600 dark:text-yellow-300 w-6 h-6" /> };
//             case 'غير آمن': return { bg: 'bg-red-200 dark:bg-red-700', icon: <FaTimesCircle className="text-red-600 dark:text-red-300 w-6 h-6" /> };
//             default: return { bg: 'bg-gray-100 dark:bg-gray-600', icon: null };
//         }
//     };

//     return (
//         <div dir="rtl" className="min-h-screen flex flex-col items-center justify-start p-4 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-500">
//             <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
//                 className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-lg rounded-3xl p-6 sm:p-8 w-full max-w-4xl">
//                 <div className="flex justify-between items-center mb-4">
//                     <LanguageSwitcher />
//                     <ThemeSwitcher />
//                 </div>

//                 <h1 className="text-3xl font-bold text-center mb-2">📊 تقرير التدريب اليوم</h1>

//                 <div className="text-center mb-6">
//                     {weather ? (
//                         <>
//                             <p>📍 <b>{city}</b></p>
//                             <p>🌡️ {temperature}°C | 💧 {humidity}% | 💨 {wind} كم/س</p>
//                             {desc && <p>☁️ {desc}</p>}
//                         </>
//                     ) : (
//                         <p className="text-red-500 text-sm mt-2">{error || 'جاري تحميل بيانات الطقس...'}</p>
//                     )}
//                 </div>

//                 <div className="grid gap-4 sm:grid-cols-2">
//                     {items.map(item => {
//                         const style = getCardStyle(item.value.rating);
//                         return (
//                             <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
//                                 className={`p-4 border border-gray-200 dark:border-slate-600 rounded-xl ${style.bg} flex flex-col gap-2`}>
//                                 <div className="flex items-center gap-2">
//                                     {style.icon}
//                                     <h2 className="font-semibold text-lg">{item.label}</h2>
//                                 </div>
//                                 <p><span className="font-bold">التقييم:</span> {item.value.rating}</p>
//                                 <p className="whitespace-pre-line"><span className="font-bold">التعليمات:</span> {item.value.advice}</p>
//                             </motion.div>
//                         )
//                     })}
//                 </div>

//                 <button onClick={() => router.push('/')} className="mt-6 w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-md transition-colors duration-200">
//                     العودة
//                 </button>
//             </motion.div>
//         </div>
//     );
// }




'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaRegCircle } from 'react-icons/fa';
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
                const cacheKey = `weather_${lat}_${lon}`;
                const cached = localStorage.getItem(cacheKey);
                const now = new Date().getTime();

                if (cached) {
                    const cachedData = JSON.parse(cached);
                    if (now - cachedData.timestamp < 30 * 60 * 1000) {
                        setWeather(cachedData.weather);
                        return;
                    }
                }

                const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
                const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&lang=${i18n.language}`;
                const res = await fetch(url);
                const data = await res.json();

                if (data?.current) {
                    const weatherObj = {
                        temp: data.current.temp_c,
                        humidity: data.current.humidity ?? 0,
                        city: data.location.name,
                        desc: data.current.condition.text,
                        wind: data.current.wind_kph
                    };
                    setWeather(weatherObj);
                    localStorage.setItem(cacheKey, JSON.stringify({ timestamp: now, weather: weatherObj }));
                } else setError(t('loadingWeather'));
            } catch (err) {
                setError(t('loadingWeather'));
            }
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                pos => fetchWeather(pos.coords.latitude, pos.coords.longitude),
                () => setError(t('locationError')),
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else setError(t('locationNotSupported'));
    }, [i18n.language]);

    // 🧾 جلب البيانات من صفحة الأسئلة
    useEffect(() => {
        const answers = searchParams.get('answers');
        if (!answers) router.push('/');
        else setReportData({ answers: JSON.parse(answers) });
    }, [searchParams, router]);

    if (!reportData) return <p className="text-center mt-20">{t('loading')}</p>;

    const { answers } = reportData;
    const temperature = weather?.temp ?? 30;
    const humidity = weather?.humidity ?? 50;
    const city = weather?.city ?? t('undefined');
    const desc = weather?.desc ?? '';
    const wind = weather?.wind ?? 0;

    // 🧠 التقييمات مع الترجمة الجديدة
    const assessSleep = (val) => {
        const hours = Number(val.replace(/\D/g, ''));
        if (hours < 5) return { rating: t('unsafe'), advice: t('sleepAdviceLow') };
        if (hours <= 7) return { rating: t('caution'), advice: t('sleepAdviceMed') };
        return { rating: t('safe'), advice: t('sleepAdviceHigh') };
    };

    const assessReadiness = (key) => {
        switch (key) {
            case 'opt31': return { rating: t('safe'), advice: t('readinessYesAdvice') };
            case 'opt32': return { rating: t('allowed'), advice: t('readinessSomewhatAdvice') };
            case 'opt33': return { rating: t('caution'), advice: t('readinessNotSureAdvice') };
            case 'opt34': return { rating: t('unsafe'), advice: t('readinessNoAdvice') };
            default: return { rating: t('undefined'), advice: t('notRecognized') };
        }
    };

    const assessField = (key) => {
        switch (key) {
            case 'opt41':
            case 'opt42':
            case 'opt43':
                return { rating: t('safe'), advice: t('fieldNormalAdvice') };
            case 'opt44':
                return { rating: t('caution'), advice: t('fieldOtherAdvice') };
            default: return { rating: t('undefined'), advice: t('notRecognized') };
        }
    };

    const assessEffort = (key) => {
        switch (key) {
            case 'opt51': return { rating: t('safe'), advice: t('effortLowAdvice') };
            case 'opt52': return { rating: t('allowed'), advice: t('effortMedAdvice') };
            case 'opt53': return { rating: t('caution'), advice: t('effortHighAdvice') };
            case 'opt54': return { rating: t('unsafe'), advice: t('effortMaxAdvice') };
            default: return { rating: t('undefined'), advice: t('notRecognized') };
        }
    };

    const assessBody = (key) => {
        switch (key) {
            case 'opt61': return { rating: t('safe'), advice: t('bodyHealthyAdvice') };
            case 'opt62': return { rating: t('allowed'), advice: t('bodyMildTiredAdvice') };
            case 'opt63': return { rating: t('caution'), advice: t('bodySomePainAdvice') };
            case 'opt64': return { rating: t('unsafe'), advice: t('bodyExhaustedAdvice') };
            default: return { rating: t('undefined'), advice: t('notRecognized') };
        }
    };

    const assessTemperature = (temp) => {
        if (temp <= 30) return { rating: t('safe'), advice: t('tempSafeAdvice') };
        if (temp <= 34) return { rating: t('caution'), advice: t('tempMedAdvice') };
        return { rating: t('unsafe'), advice: t('tempUnsafeAdvice') };
    };

    const assessHumidity = (hum) => {
        if (hum <= 60) return { rating: t('safe'), advice: t('humiditySafeAdvice') };
        if (hum <= 70) return { rating: t('caution'), advice: t('humidityMedAdvice') };
        return { rating: t('unsafe'), advice: t('humidityUnsafeAdvice') };
    };

    const items = [
        { label: t('sleep'), value: assessSleep(answers.sleepHours) },
        { label: t('readiness'), value: assessReadiness(answers.readiness) },
        { label: t('fieldType'), value: assessField(answers.fieldType) },
        { label: t('effort'), value: assessEffort(answers.effortLevel) },
        { label: t('body'), value: assessBody(answers.bodyFeeling) },
        { label: t('temperature'), value: assessTemperature(temperature) },
        { label: t('humidity'), value: assessHumidity(humidity) },
    ];

    const getCardStyle = (rating) => {
        switch (rating) {
            case t('safe'): return { bg: 'bg-green-200 dark:bg-green-700', icon: <FaCheckCircle className="text-green-600 dark:text-green-300 w-6 h-6" /> };
            case t('caution'): return { bg: 'bg-orange-200 dark:bg-orange-700', icon: <FaExclamationTriangle className="text-orange-600 dark:text-orange-300 w-6 h-6" /> };
            case t('allowed'): return { bg: 'bg-yellow-200 dark:bg-yellow-700', icon: <FaRegCircle className="text-yellow-600 dark:text-yellow-300 w-6 h-6" /> };
            case t('unsafe'): return { bg: 'bg-red-200 dark:bg-red-700', icon: <FaTimesCircle className="text-red-600 dark:text-red-300 w-6 h-6" /> };
            default: return { bg: 'bg-gray-100 dark:bg-gray-600', icon: null };
        }
    };

    return (
        <div dir={i18n.language === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen flex flex-col items-center justify-start p-4 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-500">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-lg rounded-3xl p-6 sm:p-8 w-full max-w-4xl">
                <div className="flex justify-between items-center mb-4">
                    <LanguageSwitcher />
                    <ThemeSwitcher />
                </div>

                <h1 className="text-3xl font-bold text-center mb-2">{t('trainingReport')}</h1>

                <div className="text-center mb-6">
                    {weather ? (
                        <>
                            <p>📍 <b>{t('location')}:</b> {city}</p>
                            <p>{t('weatherInfo')}: {temperature}°C | {t('humidity')}: {humidity}% | 💨 {wind} km/h</p>
                            {desc && <p>{t('weatherDesc')}: {desc}</p>}
                        </>
                    ) : (
                        <p className="text-red-500 text-sm mt-2">{error || t('loadingWeather')}</p>
                    )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    {items.map(item => {
                        const style = getCardStyle(item.value.rating);
                        return (
                            <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                                className={`p-4 border border-gray-200 dark:border-slate-600 rounded-xl ${style.bg} flex flex-col gap-2`}>
                                <div className="flex items-center gap-2">
                                    {style.icon}
                                    <h2 className="font-semibold text-lg">{item.label}</h2>
                                </div>
                                <p><span className="font-bold">{t('rating')}:</span> {item.value.rating}</p>
                                <p className="whitespace-pre-line"><span className="font-bold">{t('advice')}:</span> {item.value.advice}</p>
                            </motion.div>
                        )
                    })}
                </div>

                <button onClick={() => router.push('/')} className="mt-6 w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-md transition-colors duration-200">
                    {t('back')}
                </button>
            </motion.div>
        </div>
    );
}



