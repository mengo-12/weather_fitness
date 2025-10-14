// 'use client';
// import { useState } from 'react';
// import { motion } from 'framer-motion';
// import { useTranslation } from 'react-i18next';
// import ThemeSwitcher from '../../app/components/ThemeSwitcher';
// import LanguageSwitcher from '../../app/components/LanguageSwitcher';

// export default function QuestionsPage({ onSubmit }) {
//     const { t, i18n } = useTranslation('common');
//     const [answers, setAnswers] = useState({
//         trainingTime: '',
//         sleepHours: '',
//         readiness: '',
//         fieldType: '',
//         fieldOther: '',
//         effortLevel: '',
//         bodyFeeling: '',
//     });

//     const handleChange = (key, value) => {
//         setAnswers(prev => ({ ...prev, [key]: value }));
//     };

//     const isComplete =
//         answers.trainingTime &&
//         answers.sleepHours &&
//         answers.readiness &&
//         answers.fieldType &&
//         answers.effortLevel &&
//         answers.bodyFeeling;

//     const handleSubmit = () => {
//         if (onSubmit) onSubmit(answers);
//         else alert(t('thankYou'));
//     };

//     return (
//         <div
//             dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
//             className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-500"
//         >
//             <motion.div
//                 initial={{ opacity: 0, y: 40 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//                 className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-xl rounded-3xl p-6 sm:p-10 w-full max-w-2xl transition-colors duration-500"
//             >
//                 <div className="flex justify-between items-center mb-6">
//                     <LanguageSwitcher />
//                     <ThemeSwitcher />
//                 </div>

//                 <h1 className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-8">
//                     📝 {t('title2')}
//                 </h1>

//                 <form className="space-y-8 text-gray-800 dark:text-gray-200 text-sm">
//                     {/* سؤال 1 */}
//                     <div>
//                         <label className="block font-semibold mb-3">
//                             {t('q1')} <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                             type="text"
//                             value={answers.trainingTime}
//                             onChange={e => handleChange('trainingTime', e.target.value)}
//                             className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
//                             placeholder={t('q1Placeholder')}
//                             required
//                         />
//                     </div>

// {/* سؤال 2 */}
// <div>
//     <label className="block font-semibold mb-3">{t('q2')}</label>
//     <div className="grid gap-2">
//         {[t('opt21'), t('opt22'), t('opt23')].map(opt => (
//             <label key={opt} className="flex items-center gap-2 cursor-pointer">
//                 <input
//                     type="radio"
//                     name="sleepHours"
//                     value={opt}
//                     checked={answers.sleepHours === opt}
//                     onChange={() => handleChange('sleepHours', opt)}
//                     className="accent-emerald-500"
//                 />
//                 {opt}
//             </label>
//         ))}
//     </div>
// </div>

// {/* سؤال 3 */}
// <div>
//     <label className="block font-semibold mb-3">{t('q3')}</label>
//     <div className="grid gap-2">
//         {[t('opt31'), t('opt32'), t('opt33'), t('opt34')].map(opt => (
//             <label key={opt} className="flex items-center gap-2 cursor-pointer">
//                 <input
//                     type="radio"
//                     name="readiness"
//                     value={opt}
//                     checked={answers.readiness === opt}
//                     onChange={() => handleChange('readiness', opt)}
//                     className="accent-emerald-500"
//                 />
//                 {opt}
//             </label>
//         ))}
//     </div>
// </div>

// {/* سؤال 4 */}
// <div>
//     <label className="block font-semibold mb-3">{t('q4')}</label>
//     <div className="grid gap-2">
//         {[t('opt41'), t('opt42'), t('opt43'), t('opt44')].map(opt => (
//             <label key={opt} className="flex items-center gap-2 cursor-pointer">
//                 <input
//                     type="radio"
//                     name="fieldType"
//                     value={opt}
//                     checked={answers.fieldType === opt}
//                     onChange={() => handleChange('fieldType', opt)}
//                     className="accent-emerald-500"
//                 />
//                 {opt}
//             </label>
//         ))}
//     </div>

//     {answers.fieldType === t('opt44') && (
//         <input
//             type="text"
//             value={answers.fieldOther}
//             onChange={e => handleChange('fieldOther', e.target.value)}
//             placeholder={t('opt44')}
//             className="mt-2 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
//         />
//     )}
// </div>

// {/* سؤال 5 */}
// <div>
//     <label className="block font-semibold mb-3">{t('q5')}</label>
//     <div className="grid gap-2">
//         {[t('opt51'), t('opt52'), t('opt53'), t('opt54')].map(opt => (
//             <label key={opt} className="flex items-center gap-2 cursor-pointer">
//                 <input
//                     type="radio"
//                     name="effortLevel"
//                     value={opt}
//                     checked={answers.effortLevel === opt}
//                     onChange={() => handleChange('effortLevel', opt)}
//                     className="accent-emerald-500"
//                 />
//                 {opt}
//             </label>
//         ))}
//     </div>
// </div>

// {/* سؤال 6 */}
// <div>
//     <label className="block font-semibold mb-3">{t('q6')}</label>
//     <div className="grid gap-2">
//         {[t('opt61'), t('opt62'), t('opt63'), t('opt64')].map(opt => (
//             <label key={opt} className="flex items-center gap-2 cursor-pointer">
//                 <input
//                     type="radio"
//                     name="bodyFeeling"
//                     value={opt}
//                     checked={answers.bodyFeeling === opt}
//                     onChange={() => handleChange('bodyFeeling', opt)}
//                     className="accent-emerald-500"
//                 />
//                 {opt}
//             </label>
//         ))}
//     </div>
// </div>

//                     {/* زر الإرسال */}
//                     <motion.button
//                         type="button"
//                         onClick={handleSubmit}
//                         disabled={!isComplete}
//                         whileTap={{ scale: 0.96 }}
//                         whileHover={{ scale: isComplete ? 1.02 : 1 }}
//                         className={`w-full mt-6 py-3 rounded-2xl font-semibold text-lg transition-all duration-200 shadow-md 
//                 ${isComplete
//                                 ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
//                                 : 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
//                             }`}
//                     >
//                         {t('submit')}
//                     </motion.button>
//                 </form>
//             </motion.div>
//         </div>
//     );
// }





// 'use client';
// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { useTranslation } from 'react-i18next';
// import { useRouter } from 'next/navigation';
// import ThemeSwitcher from '../../app/components/ThemeSwitcher';
// import LanguageSwitcher from '../../app/components/LanguageSwitcher';

// export default function QuestionsPage() {
//     const { t, i18n } = useTranslation('common');
//     const router = useRouter();

//     const [answers, setAnswers] = useState({
//         trainingTime: '00:00',
//         sleepHours: '',
//         readiness: '',
//         fieldType: '',
//         fieldOther: '',
//         effortLevel: '',
//         bodyFeeling: '',
//     });

//     const [loadingWeather, setLoadingWeather] = useState(false);
//     const [locationError, setLocationError] = useState('');
//     const [weather, setWeather] = useState(null);

//     const isEdge = typeof navigator !== 'undefined' && /Edg/i.test(navigator.userAgent);

//     const handleChange = (key, value) => {
//         setAnswers(prev => ({ ...prev, [key]: value }));
//     };

//     const isComplete =
//         answers.trainingTime &&
//         answers.sleepHours &&
//         answers.readiness &&
//         answers.fieldType &&
//         answers.effortLevel &&
//         answers.bodyFeeling;

//     // 🌤️ جلب الطقس عند الدخول
//     useEffect(() => {
//         const fetchWeather = async (lat, lon) => {
//             try {
//                 const res = await fetch(
//                     `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=ar`
//                 );
//                 const data = await res.json();
//                 setWeather({
//                     temperature: data.main?.temp ?? null,
//                     humidity: data.main?.humidity ?? null,
//                     city: data.name ?? 'غير محدد',
//                     condition: data.weather?.[0]?.description ?? '',
//                 });
//             } catch (err) {
//                 console.error('⚠️ خطأ في جلب بيانات الطقس:', err);
//                 setWeather({ temperature: null, humidity: null, city: 'غير محدد', condition: '' });
//             }
//         };

//         const getLocation = async () => {
//             setLoadingWeather(true);
//             setLocationError('');
//             let lat = 24.7136, lon = 46.6753; // الرياض افتراضيًا

//             if (navigator.geolocation) {
//                 await new Promise(resolve => {
//                     navigator.geolocation.getCurrentPosition(
//                         pos => {
//                             lat = pos.coords.latitude;
//                             lon = pos.coords.longitude;
//                             console.log('✅ موقع المستخدم:', lat, lon);
//                             resolve(true);
//                         },
//                         err => {
//                             console.warn('⚠️ تعذر تحديد الموقع:', err);
//                             switch (err.code) {
//                                 case err.PERMISSION_DENIED:
//                                     setLocationError('يرجى السماح بالوصول إلى الموقع.');
//                                     break;
//                                 case err.POSITION_UNAVAILABLE:
//                                     setLocationError('تعذر تحديد الموقع بدقة.');
//                                     break;
//                                 case err.TIMEOUT:
//                                     setLocationError('انتهت مهلة تحديد الموقع، تم استخدام الموقع الافتراضي (الرياض).');
//                                     break;
//                                 default:
//                                     setLocationError('حدث خطأ أثناء تحديد الموقع.');
//                             }
//                             resolve(true);
//                         },
//                         {
//                             enableHighAccuracy: !isEdge,
//                             timeout: 15000,
//                             maximumAge: 0,
//                         }
//                     );
//                 });
//             } else {
//                 setLocationError('المتصفح لا يدعم تحديد الموقع الجغرافي.');
//             }

//             await fetchWeather(lat, lon);
//             setLoadingWeather(false);
//         };

//         getLocation();
//     }, [isEdge]);

//     const handleSubmit = async () => {
//         if (!isComplete || !weather) return;

//         const query = new URLSearchParams({
//             answers: JSON.stringify(answers),
//             temperature: weather.temperature ?? '',
//             humidity: weather.humidity ?? '',
//             city: weather.city,
//             condition: weather.condition,
//         }).toString();

//         router.push(`/TrainingAssessment?${query}`);
//     };

//     return (
//         <div
//             dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
//             className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-500"
//         >
//             <motion.div
//                 initial={{ opacity: 0, y: 40 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//                 className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-xl rounded-3xl p-6 sm:p-10 w-full max-w-2xl"
//             >
//                 <div className="flex justify-between items-center mb-6">
//                     <LanguageSwitcher />
//                     <ThemeSwitcher />
//                 </div>

//                 <h1 className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-6">
//                     📝 {t('title2')}
//                 </h1>

//                 <form className="space-y-6 text-gray-800 dark:text-gray-200 text-sm">
//                     {/* سؤال 1: اختيار الوقت */}
//                     <div>
//                         <label className="block font-semibold mb-3">
//                             {t('q1')} <span className="text-red-500">*</span>
//                         </label>
//                         <div className="flex items-center gap-2">
//                             {/* ساعات */}
//                             <select
//                                 value={answers.trainingTime.split(':')[0]}
//                                 onChange={e => {
//                                     const minutes = answers.trainingTime.split(':')[1];
//                                     handleChange('trainingTime', `${e.target.value}:${minutes}`);
//                                 }}
//                                 className="px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
//                             >
//                                 {Array.from({ length: 24 }, (_, i) => (
//                                     <option key={i} value={i.toString().padStart(2, '0')}>
//                                         {i.toString().padStart(2, '0')}
//                                     </option>
//                                 ))}
//                             </select>
//                             <span className="text-gray-700 dark:text-gray-300 font-semibold">H</span>

//                             {/* دقائق */}
//                             <select
//                                 value={answers.trainingTime.split(':')[1]}
//                                 onChange={e => {
//                                     const hours = answers.trainingTime.split(':')[0];
//                                     handleChange('trainingTime', `${hours}:${e.target.value}`);
//                                 }}
//                                 className="px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
//                             >
//                                 {Array.from({ length: 60 }, (_, i) => (
//                                     <option key={i} value={i.toString().padStart(2, '0')}>
//                                         {i.toString().padStart(2, '0')}
//                                     </option>
//                                 ))}
//                             </select>
//                             <span className="text-gray-700 dark:text-gray-300 font-semibold">M</span>
//                         </div>
//                     </div>


//                     {/* سؤال 2 */}
//                     <div>
//                         <label className="block font-semibold mb-3">{t('q2')}</label>
//                         <div className="grid gap-2">
//                             {[t('opt21'), t('opt22'), t('opt23')].map(opt => (
//                                 <label key={opt} className="flex items-center gap-2 cursor-pointer">
//                                     <input
//                                         type="radio"
//                                         name="sleepHours"
//                                         value={opt}
//                                         checked={answers.sleepHours === opt}
//                                         onChange={() => handleChange('sleepHours', opt)}
//                                         className="accent-emerald-500"
//                                     />
//                                     {opt}
//                                 </label>
//                             ))}
//                         </div>
//                     </div>

//                     {/* سؤال 3 */}
//                     <div>
//                         <label className="block font-semibold mb-3">{t('q3')}</label>
//                         <div className="grid gap-2">
//                             {[t('opt31'), t('opt32'), t('opt33'), t('opt34')].map(opt => (
//                                 <label key={opt} className="flex items-center gap-2 cursor-pointer">
//                                     <input
//                                         type="radio"
//                                         name="readiness"
//                                         value={opt}
//                                         checked={answers.readiness === opt}
//                                         onChange={() => handleChange('readiness', opt)}
//                                         className="accent-emerald-500"
//                                     />
//                                     {opt}
//                                 </label>
//                             ))}
//                         </div>
//                     </div>

//                     {/* سؤال 4 */}
//                     <div>
//                         <label className="block font-semibold mb-3">{t('q4')}</label>
//                         <div className="grid gap-2">
//                             {[t('opt41'), t('opt42'), t('opt43'), t('opt44')].map(opt => (
//                                 <label key={opt} className="flex items-center gap-2 cursor-pointer">
//                                     <input
//                                         type="radio"
//                                         name="fieldType"
//                                         value={opt}
//                                         checked={answers.fieldType === opt}
//                                         onChange={() => handleChange('fieldType', opt)}
//                                         className="accent-emerald-500"
//                                     />
//                                     {opt}
//                                 </label>
//                             ))}
//                         </div>

//                         {answers.fieldType === t('opt44') && (
//                             <input
//                                 type="text"
//                                 value={answers.fieldOther}
//                                 onChange={e => handleChange('fieldOther', e.target.value)}
//                                 placeholder={t('opt44')}
//                                 className="mt-2 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
//                             />
//                         )}
//                     </div>

//                     {/* سؤال 5 */}
//                     <div>
//                         <label className="block font-semibold mb-3">{t('q5')}</label>
//                         <div className="grid gap-2">
//                             {[t('opt51'), t('opt52'), t('opt53'), t('opt54')].map(opt => (
//                                 <label key={opt} className="flex items-center gap-2 cursor-pointer">
//                                     <input
//                                         type="radio"
//                                         name="effortLevel"
//                                         value={opt}
//                                         checked={answers.effortLevel === opt}
//                                         onChange={() => handleChange('effortLevel', opt)}
//                                         className="accent-emerald-500"
//                                     />
//                                     {opt}
//                                 </label>
//                             ))}
//                         </div>
//                     </div>

//                     {/* سؤال 6 */}
//                     <div>
//                         <label className="block font-semibold mb-3">{t('q6')}</label>
//                         <div className="grid gap-2">
//                             {[t('opt61'), t('opt62'), t('opt63'), t('opt64')].map(opt => (
//                                 <label key={opt} className="flex items-center gap-2 cursor-pointer">
//                                     <input
//                                         type="radio"
//                                         name="bodyFeeling"
//                                         value={opt}
//                                         checked={answers.bodyFeeling === opt}
//                                         onChange={() => handleChange('bodyFeeling', opt)}
//                                         className="accent-emerald-500"
//                                     />
//                                     {opt}
//                                 </label>
//                             ))}
//                         </div>
//                     </div>

//                     {locationError && (
//                         <p className="text-red-500 text-sm text-center mt-4">⚠️ {locationError}</p>
//                     )}

//                     <motion.button
//                         type="button"
//                         onClick={handleSubmit}
//                         disabled={!isComplete || loadingWeather}
//                         whileTap={{ scale: 0.96 }}
//                         whileHover={{ scale: isComplete ? 1.02 : 1 }}
//                         className={`w-full mt-6 py-3 rounded-2xl font-semibold text-lg transition-all duration-200 shadow-md ${isComplete && !loadingWeather
//                             ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
//                             : 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
//                             }`}
//                     >
//                         {loadingWeather ? '🔍 جاري تحديد موقعك...' : t('submit')}
//                     </motion.button>
//                 </form>
//             </motion.div>
//         </div>
//     );
// }






'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import ThemeSwitcher from '../../app/components/ThemeSwitcher';
import LanguageSwitcher from '../../app/components/LanguageSwitcher';
import { useSession } from "next-auth/react";

export default function QuestionsPage() {
    const { t, i18n } = useTranslation('common');
    const router = useRouter();

    const [answers, setAnswers] = useState({
        trainingTime: '00:00',
        sleepHours: '',
        readiness: '',
        fieldType: '',
        fieldOther: '',
        effortLevel: '',
        bodyFeeling: '',
    });

    const [loadingWeather, setLoadingWeather] = useState(false);
    const [locationError, setLocationError] = useState('');
    const [weather, setWeather] = useState(null);
    const { data: session } = useSession();
    const currentUser = session?.user;

    const isEdge = typeof navigator !== 'undefined' && /Edg/i.test(navigator.userAgent);

    const handleChange = (key, value) => {
        setAnswers(prev => ({ ...prev, [key]: value }));
    };

    const isComplete =
        answers.trainingTime &&
        answers.sleepHours &&
        answers.readiness &&
        answers.fieldType &&
        answers.effortLevel &&
        answers.bodyFeeling;

    // 🌤️ جلب الطقس عند الدخول
    useEffect(() => {
        const fetchWeather = async (lat, lon) => {
            try {
                const res = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=ar`
                );
                const data = await res.json();
                setWeather({
                    temperature: data.main?.temp ?? null,
                    humidity: data.main?.humidity ?? null,
                    city: data.name ?? 'غير محدد',
                    condition: data.weather?.[0]?.description ?? '',
                });
            } catch (err) {
                console.error('⚠️ خطأ في جلب بيانات الطقس:', err);
                setWeather({ temperature: null, humidity: null, city: 'غير محدد', condition: '' });
            }
        };

        const getLocation = async () => {
            setLoadingWeather(true);
            setLocationError('');
            let lat = 24.7136, lon = 46.6753; // الرياض افتراضيًا

            if (navigator.geolocation) {
                await new Promise(resolve => {
                    navigator.geolocation.getCurrentPosition(
                        pos => {
                            lat = pos.coords.latitude;
                            lon = pos.coords.longitude;
                            resolve(true);
                        },
                        err => {
                            switch (err.code) {
                                case err.PERMISSION_DENIED:
                                    setLocationError('يرجى السماح بالوصول إلى الموقع.');
                                    break;
                                case err.POSITION_UNAVAILABLE:
                                    setLocationError('تعذر تحديد الموقع بدقة.');
                                    break;
                                case err.TIMEOUT:
                                    setLocationError('انتهت مهلة تحديد الموقع، تم استخدام الموقع الافتراضي (الرياض).');
                                    break;
                                default:
                                    setLocationError('حدث خطأ أثناء تحديد الموقع.');
                            }
                            resolve(true);
                        },
                        { enableHighAccuracy: !isEdge, timeout: 15000, maximumAge: 0 }
                    );
                });
            } else {
                setLocationError('المتصفح لا يدعم تحديد الموقع الجغرافي.');
            }

            await fetchWeather(lat, lon);
            setLoadingWeather(false);
        };

        getLocation();
    }, [isEdge]);

    // const handleSubmit = async () => {
    //     if (!isComplete || !weather) return;

    //     const query = new URLSearchParams({
    //         answers: JSON.stringify(answers),
    //         temperature: weather.temperature ?? '',
    //         humidity: weather.humidity ?? '',
    //         city: weather.city,
    //         condition: weather.condition,
    //     }).toString();

    //     router.push(`/TrainingAssessment?${query}`);
    // };


    const handleSubmit = async () => {
        if (!isComplete || !weather) return;

        if (!currentUser) {
            alert("يرجى تسجيل الدخول أولاً");
            return;
        }

        const payload = {
            traineeId: currentUser.id,
            ...answers,
            temperature: weather.temperature ?? null,
            humidity: weather.humidity ?? null,
            city: weather.city,
            condition: weather.condition,
        };

        // حفظ في قاعدة البيانات
        try {
            const res = await fetch('/api/trainingResults', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.error);

            // ثم الانتقال إلى صفحة التقرير
            const query = new URLSearchParams({ answers: JSON.stringify(answers) }).toString();
            router.push(`/TrainingAssessment?${query}`);
        } catch (err) {
            alert('خطأ أثناء حفظ البيانات: ' + err.message);
        }
    };


    // ✅ خيارات الأسئلة مع مفتاح ثابت
    const sleepOptions = [
        { key: 'opt21', label: t('opt21') },
        { key: 'opt22', label: t('opt22') },
        { key: 'opt23', label: t('opt23') },
    ];

    const readinessOptions = [
        { key: 'opt31', label: t('opt31') },
        { key: 'opt32', label: t('opt32') },
        { key: 'opt33', label: t('opt33') },
        { key: 'opt34', label: t('opt34') },
    ];

    const fieldOptions = [
        { key: 'opt41', label: t('opt41') },
        { key: 'opt42', label: t('opt42') },
        { key: 'opt43', label: t('opt43') },
        { key: 'opt44', label: t('opt44') },
    ];

    const effortOptions = [
        { key: 'opt51', label: t('opt51') },
        { key: 'opt52', label: t('opt52') },
        { key: 'opt53', label: t('opt53') },
        { key: 'opt54', label: t('opt54') },
    ];

    const bodyOptions = [
        { key: 'opt61', label: t('opt61') },
        { key: 'opt62', label: t('opt62') },
        { key: 'opt63', label: t('opt63') },
        { key: 'opt64', label: t('opt64') },
    ];

    return (
        <div
            dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
            className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-500"
        >
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-xl rounded-3xl p-6 sm:p-10 w-full max-w-2xl"
            >
                <div className="flex justify-between items-center mb-6">
                    <LanguageSwitcher />
                    <ThemeSwitcher />
                </div>

                <h1 className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-6">
                    📝 {t('title2')}
                </h1>

                <form className="space-y-6 text-gray-800 dark:text-gray-200 text-sm">
                    {/* سؤال 1: اختيار الوقت */}
                    <div>
                        <label className="block font-semibold mb-3">
                            {t('q1')} <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center gap-2">
                            {/* ساعات */}
                            <select
                                value={answers.trainingTime.split(':')[0]}
                                onChange={e => {
                                    const minutes = answers.trainingTime.split(':')[1];
                                    handleChange('trainingTime', `${e.target.value}:${minutes}`);
                                }}
                                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
                            >
                                {Array.from({ length: 24 }, (_, i) => (
                                    <option key={i} value={i.toString().padStart(2, '0')}>
                                        {i.toString().padStart(2, '0')}
                                    </option>
                                ))}
                            </select>
                            <span className="text-gray-700 dark:text-gray-300 font-semibold">H</span>

                            {/* دقائق */}
                            <select
                                value={answers.trainingTime.split(':')[1]}
                                onChange={e => {
                                    const hours = answers.trainingTime.split(':')[0];
                                    handleChange('trainingTime', `${hours}:${e.target.value}`);
                                }}
                                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
                            >
                                {Array.from({ length: 60 }, (_, i) => (
                                    <option key={i} value={i.toString().padStart(2, '0')}>
                                        {i.toString().padStart(2, '0')}
                                    </option>
                                ))}
                            </select>
                            <span className="text-gray-700 dark:text-gray-300 font-semibold">M</span>
                        </div>
                    </div>

                    {/* سؤال 2: النوم */}
                    <div>
                        <label className="block font-semibold mb-3">{t('q2')}</label>
                        <div className="grid gap-2">
                            {sleepOptions.map(opt => (
                                <label key={opt.key} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="sleepHours"
                                        value={opt.key} // استخدام المفتاح الثابت
                                        checked={answers.sleepHours === opt.key}
                                        onChange={() => handleChange('sleepHours', opt.key)}
                                        className="accent-emerald-500"
                                    />
                                    {opt.label}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* سؤال 3: الجاهزية */}
                    <div>
                        <label className="block font-semibold mb-3">{t('q3')}</label>
                        <div className="grid gap-2">
                            {readinessOptions.map(opt => (
                                <label key={opt.key} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="readiness"
                                        value={opt.key} // المفتاح الثابت
                                        checked={answers.readiness === opt.key}
                                        onChange={() => handleChange('readiness', opt.key)}
                                        className="accent-emerald-500"
                                    />
                                    {opt.label}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* سؤال 4: نوع الأرضية */}
                    <div>
                        <label className="block font-semibold mb-3">{t('q4')}</label>
                        <div className="grid gap-2">
                            {fieldOptions.map(opt => (
                                <label key={opt.key} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="fieldType"
                                        value={opt.key}
                                        checked={answers.fieldType === opt.key}
                                        onChange={() => handleChange('fieldType', opt.key)}
                                        className="accent-emerald-500"
                                    />
                                    {opt.label}
                                </label>
                            ))}
                        </div>

                        {answers.fieldType === 'opt44' && (
                            <input
                                type="text"
                                value={answers.fieldOther}
                                onChange={e => handleChange('fieldOther', e.target.value)}
                                placeholder={t('opt44')}
                                className="mt-2 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                        )}
                    </div>

                    {/* سؤال 5: مستوى الجهد */}
                    <div>
                        <label className="block font-semibold mb-3">{t('q5')}</label>
                        <div className="grid gap-2">
                            {effortOptions.map(opt => (
                                <label key={opt.key} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="effortLevel"
                                        value={opt.key}
                                        checked={answers.effortLevel === opt.key}
                                        onChange={() => handleChange('effortLevel', opt.key)}
                                        className="accent-emerald-500"
                                    />
                                    {opt.label}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* سؤال 6: الحالة الجسدية */}
                    <div>
                        <label className="block font-semibold mb-3">{t('q6')}</label>
                        <div className="grid gap-2">
                            {bodyOptions.map(opt => (
                                <label key={opt.key} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="bodyFeeling"
                                        value={opt.key}
                                        checked={answers.bodyFeeling === opt.key}
                                        onChange={() => handleChange('bodyFeeling', opt.key)}
                                        className="accent-emerald-500"
                                    />
                                    {opt.label}
                                </label>
                            ))}
                        </div>
                    </div>

                    {locationError && (
                        <p className="text-red-500 text-sm text-center mt-4">⚠️ {locationError}</p>
                    )}

                    <motion.button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!isComplete || loadingWeather}
                        whileTap={{ scale: 0.96 }}
                        whileHover={{ scale: isComplete ? 1.02 : 1 }}
                        className={`w-full mt-6 py-3 rounded-2xl font-semibold text-lg transition-all duration-200 shadow-md ${isComplete && !loadingWeather
                            ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                            : 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        {loadingWeather ? '🔍 جاري تحديد موقعك...' : t('submit')}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}
