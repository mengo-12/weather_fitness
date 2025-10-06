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





'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import ThemeSwitcher from '../../app/components/ThemeSwitcher';
import LanguageSwitcher from '../../app/components/LanguageSwitcher';

const API_KEY = '2ce3fe36155b6e3a81cd25f33ba25e10';

export default function QuestionsPage() {
    const { t, i18n } = useTranslation('common');
    const router = useRouter();
    const [answers, setAnswers] = useState({
        trainingTime: '',
        sleepHours: '',
        readiness: '',
        fieldType: '',
        fieldOther: '',
        effortLevel: '',
        bodyFeeling: '',
    });
    const [loadingWeather, setLoadingWeather] = useState(false);

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

    const fetchWeather = async (lat, lon) => {
        try {
            const res = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
            );
            const data = await res.json();
            return { temperature: data.main.temp, humidity: data.main.humidity };
        } catch (err) {
            console.error(err);
            return { temperature: null, humidity: null };
        }
    };

    const handleSubmit = async () => {
        if (!isComplete) return;
        setLoadingWeather(true);

        let lat = 24.7136; // الرياض كافتراضية
        let lon = 46.6753;

        if (navigator.geolocation) {
            await new Promise(resolve => {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        lat = position.coords.latitude;
                        lon = position.coords.longitude;
                        resolve(true);
                    },
                    (error) => {
                        console.warn('تعذر جلب موقعك الحالي. سيتم استخدام الإعدادات الافتراضية.');
                        resolve(true);
                    },
                    { timeout: 10000 }
                );
            });
        }

        const weatherData = await fetchWeather(lat, lon);
        setLoadingWeather(false);

        // تحويل البيانات إلى query string يدوياً
        const query = new URLSearchParams({
            answers: JSON.stringify(answers),
            temperature: weatherData.temperature,
            humidity: weatherData.humidity
        }).toString();

        router.push(`/TrainingAssessment?${query}`);
    };

    return (
        <div dir={i18n.language === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-xl rounded-3xl p-6 sm:p-10 w-full max-w-2xl transition-colors duration-500"
            >
                <div className="flex justify-between items-center mb-6">
                    <LanguageSwitcher />
                    <ThemeSwitcher />
                </div>

                <h1 className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-8">
                    📝 {t('title2')}
                </h1>

                <form className="space-y-8 text-gray-800 dark:text-gray-200 text-sm">
                    {/* سؤال 1 */}
                    <div>
                        <label className="block font-semibold mb-3">
                            {t('q1')} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={answers.trainingTime}
                            onChange={e => handleChange('trainingTime', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
                            placeholder={t('q1Placeholder')}
                            required
                        />
                    </div>

                    {/* سؤال 2 */}
                    <div>
                        <label className="block font-semibold mb-3">{t('q2')}</label>
                        <div className="grid gap-2">
                            {[t('opt21'), t('opt22'), t('opt23')].map(opt => (
                                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="sleepHours"
                                        value={opt}
                                        checked={answers.sleepHours === opt}
                                        onChange={() => handleChange('sleepHours', opt)}
                                        className="accent-emerald-500"
                                    />
                                    {opt}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* سؤال 3 */}
                    <div>
                        <label className="block font-semibold mb-3">{t('q3')}</label>
                        <div className="grid gap-2">
                            {[t('opt31'), t('opt32'), t('opt33'), t('opt34')].map(opt => (
                                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="readiness"
                                        value={opt}
                                        checked={answers.readiness === opt}
                                        onChange={() => handleChange('readiness', opt)}
                                        className="accent-emerald-500"
                                    />
                                    {opt}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* سؤال 4 */}
                    <div>
                        <label className="block font-semibold mb-3">{t('q4')}</label>
                        <div className="grid gap-2">
                            {[t('opt41'), t('opt42'), t('opt43'), t('opt44')].map(opt => (
                                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="fieldType"
                                        value={opt}
                                        checked={answers.fieldType === opt}
                                        onChange={() => handleChange('fieldType', opt)}
                                        className="accent-emerald-500"
                                    />
                                    {opt}
                                </label>
                            ))}
                        </div>

                        {answers.fieldType === t('opt44') && (
                            <input
                                type="text"
                                value={answers.fieldOther}
                                onChange={e => handleChange('fieldOther', e.target.value)}
                                placeholder={t('opt44')}
                                className="mt-2 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                        )}
                    </div>

                    {/* سؤال 5 */}
                    <div>
                        <label className="block font-semibold mb-3">{t('q5')}</label>
                        <div className="grid gap-2">
                            {[t('opt51'), t('opt52'), t('opt53'), t('opt54')].map(opt => (
                                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="effortLevel"
                                        value={opt}
                                        checked={answers.effortLevel === opt}
                                        onChange={() => handleChange('effortLevel', opt)}
                                        className="accent-emerald-500"
                                    />
                                    {opt}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* سؤال 6 */}
                    <div>
                        <label className="block font-semibold mb-3">{t('q6')}</label>
                        <div className="grid gap-2">
                            {[t('opt61'), t('opt62'), t('opt63'), t('opt64')].map(opt => (
                                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="bodyFeeling"
                                        value={opt}
                                        checked={answers.bodyFeeling === opt}
                                        onChange={() => handleChange('bodyFeeling', opt)}
                                        className="accent-emerald-500"
                                    />
                                    {opt}
                                </label>
                            ))}
                        </div>
                    </div>
                </form>
                <motion.button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!isComplete || loadingWeather}
                    whileTap={{ scale: 0.96 }}
                    whileHover={{ scale: isComplete ? 1.02 : 1 }}
                    className={`w-full mt-6 py-3 rounded-2xl font-semibold text-lg transition-all duration-200 shadow-md ${isComplete && !loadingWeather ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'}`}
                >
                    {loadingWeather ? 'جاري جلب الطقس...' : t('submit')}
                </motion.button>
            </motion.div>
        </div>
    );
}

