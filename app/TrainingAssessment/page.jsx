'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaRegCircle, FaFileExport } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../app/components/LanguageSwitcher';
import ThemeSwitcher from '../../app/components/ThemeSwitcher';
import * as XLSX from "xlsx";

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

    // 💾 حفظ النتائج تلقائياً في قاعدة البيانات
    useEffect(() => {
        const saveResult = async () => {
            if (!reportData || !weather) return;

            try {
                await fetch('/api/trainingResults', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...reportData.answers,
                        temperature: weather.temp ?? null,
                        humidity: weather.humidity ?? null,
                        city: weather.city ?? null,
                        condition: weather.desc ?? null,
                    }),
                });
            } catch (err) {
                console.error('⚠️ خطأ في حفظ النتائج:', err);
            }
        };
        saveResult();
    }, [reportData, weather]);

    if (!reportData) return <p className="text-center mt-20">{t('loading')}</p>;

    const { answers } = reportData;
    const temperature = weather?.temp ?? 30;
    const humidity = weather?.humidity ?? 50;
    const city = weather?.city ?? t('undefined');
    const desc = weather?.desc ?? '';
    const wind = weather?.wind ?? 0;

    // 🧠 التقييمات
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
            case 'opt41': case 'opt42': case 'opt43':
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

    // 🌟 دالة لتصدير النتائج كملف Excel
    // const exportToExcel = async () => {
    //     try {
    //         const res = await fetch('/api/trainingResults/export');
    //         const blob = await res.blob();
    //         const url = window.URL.createObjectURL(blob);
    //         const a = document.createElement('a');
    //         a.href = url;
    //         a.download = 'TrainingResults.xlsx';
    //         document.body.appendChild(a);
    //         a.click();
    //         a.remove();
    //     } catch (err) {
    //         console.error('⚠️ خطأ في تصدير Excel:', err);
    //     }
    // };


    // 🌟 دالة تصدير مطابقة للصفحة
    const exportToExcel = () => {
        const exportData = items.map(item => ({
            "البند": item.label,
            "التقييم": item.value.rating,
            "التعليمات": item.value.advice,
            "المدينة": city,
            "درجة الحرارة": `${temperature}°C`,
            "الرطوبة": `${humidity}%`,
            "تاريخ التقييم": new Date().toLocaleString("ar-SA")
        }));

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        XLSX.utils.book_append_sheet(workbook, worksheet, "تقرير التدريب");

        XLSX.writeFile(workbook, "TrainingAssessment.xlsx");
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

                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                    <button onClick={() => router.push('/')} className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-md transition-colors duration-200">
                        {t('back')}
                    </button>
                    <button onClick={exportToExcel} className="flex-1 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-md transition-colors duration-200 flex items-center justify-center gap-2">
                        <FaFileExport /> {t('exportExcel')}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
