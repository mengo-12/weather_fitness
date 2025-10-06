'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function TrainingReport() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [reportData, setReportData] = useState(null);

    useEffect(() => {
        const answers = searchParams.get('answers');
        const temperature = parseFloat(searchParams.get('temperature'));
        const humidity = parseFloat(searchParams.get('humidity'));
        if (!answers) {
            router.push('/');
            return;
        }
        setReportData({ answers: JSON.parse(answers), temperature, humidity });
    }, [searchParams, router]);

    if (!reportData) return <p>جاري التحميل...</p>;

    const { answers, temperature, humidity } = reportData;

    // دوال التقييم كما وضحتها سابقًا
    const assessSleep = (hours) => {
        if (hours < 5) return { rating: 'خطر', advice: '- تقليل شدة التمرين.' };
        if (hours <= 7) return { rating: 'متوسط', advice: '- التدرج في شدة التمرين.\n- مراقبة علامات التعب والإرهاق.' };
        return { rating: 'ممتاز', advice: '- متابعة التدريب المعتاد.' };
    };

    const assessReadiness = (val) => {
        switch (val) {
            case 'نعم، تمامًا': return { rating: 'جيد', advice: '- متابعة التدريب المعتاد.' };
            case 'نوعًا ما': return { rating: 'متوسط', advice: '- تدريب معتدل، مراقبة التعب.' };
            case 'لست متأكدًا': return { rating: 'حذر', advice: '- تدريب خفيف، زيادة فترات الراحة عند الحاجة.' };
            case 'لا، أشعر بعدم الجاهزية': return { rating: 'خطر', advice: '- تأجيل التمرين أو استبداله بتمارين استشفاء خفيفة.' };
            default: return { rating: '-', advice: '-' };
        }
    };

    const assessField = (val) => val === 'أخرى' ? { rating: 'حذر', advice: '- اختيار الحذاء والتجهيزات الواقية، زيادة الانتباه للحركة على الأرضية.' } : { rating: 'جيد', advice: '- استخدام الحذاء المناسب لتقليل خطر الإصابات.' };
    const assessEffort = (val) => {
        switch (val) {
            case 'جهد خفيف جداً (أقل من 40%)': return { rating: 'آمن', advice: '- متابعة التدريب المعتاد.' };
            case 'جهد منخفض إلى متوسط (40% – 70%)': return { rating: 'آمن / حذر', advice: '- تقليل شدة التدريب عند الحاجة والالتزام بالتعليمات الأساسية.\n- مراقبة التعب والإرهاق.' };
            case 'جهد عالٍ (70% – 90%)': return { rating: 'حذر / غير آمن', advice: '- تقليل شدة التدريب والالتزام بالتعليمات الأساسية مع مراقبة التعب والارهاق.' };
            case 'جهد شديد جداً (90% – 100%)': return { rating: 'غير آمن', advice: '- الراحة وإيقاف التدريب وعمل الاستشفاء.' };
            default: return { rating: '-', advice: '-' };
        }
    };
    const assessBody = (val) => {
        switch (val) {
            case 'أشعر بنشاط كامل وبدون أعراض': return { rating: 'آمن', advice: '- متابعة التدريب المعتاد وفق الخطة.' };
            case 'لدي تعب خفيف دون ألم أو تأثير على الأداء': return { rating: 'شبه آمن', advice: '- متابعة التدريب مع تقليل شدة بعض التمارين ومراقبة التعب.' };
            case 'أعاني من بعض الألم أو الشد العضلي': return { rating: 'حذر', advice: '- تقليل شدة التدريب، تجنب الحركات الشديدة، زيادة فترات الراحة، ومراقبة أي علامات إصابة.' };
            case 'أشعر بإرهاق شديد أو إصابة واضحة': return { rating: 'غير آمن', advice: '- تأجيل التدريب أو استبداله بتمارين استشفاء خفيفة، مع مراقبة الحالة الصحية والتأكد من عدم تفاقم الإصابة.' };
            default: return { rating: '-', advice: '-' };
        }
    };

    const assessTemperature = (temp) => {
        if (temp <= 30) return { rating: 'آمن', advice: '- متابعة التدريب المعتاد.' };
        if (temp <= 34) return { rating: 'متوسطة (حذر)', advice: '- تقليل شدة التدريب تدريجيًا والالتزام بالتعليمات الأساسية.' };
        return { rating: 'غير آمن', advice: '- تغيير وقت التمرين، تقليل شدة التدريب، مراقبة علامات التعب باستمرار.' };
    };

    const assessHumidity = (hum) => {
        if (hum <= 60) return { rating: 'آمنة', advice: '- استمر في التدريب حسب الخطة المعتادة.' };
        if (hum <= 70) return { rating: 'متوسطة (حذر)', advice: '- شرب السوائل كل 20 دقيقة، أخذ فترات راحة قصيرة، تقليل شدة التمرين عند الإرهاق، مراقبة علامات التعب.' };
        return { rating: 'غير آمنة', advice: '- تقليل شدة التدريب أو تأجيله، شرب السوائل، أخذ فترات استراحة متكررة، والانتباه للإرهاق.' };
    };

    const items = [
        { label: 'النوم', value: assessSleep(Number(answers.sleepHours.replace(/\D/g, ''))) },
        { label: 'الجاهزية', value: assessReadiness(answers.readiness) },
        { label: 'نوع الأرضية', value: assessField(answers.fieldType) },
        { label: 'مستوى الجهد', value: assessEffort(answers.effortLevel) },
        { label: 'الحالة الجسدية', value: assessBody(answers.bodyFeeling) },
        { label: 'درجة الحرارة', value: assessTemperature(temperature) },
        { label: 'الرطوبة', value: assessHumidity(humidity) },
    ];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-500">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-xl rounded-3xl p-6 sm:p-10 w-full max-w-3xl transition-colors duration-500">
                <h1 className="text-2xl font-bold text-center mb-6">📊 تقرير التدريب اليوم</h1>

                <div className="space-y-6">
                    {items.map(item => (
                        <div key={item.label} className="p-4 border border-gray-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700">
                            <h2 className="font-semibold mb-1">{item.label}</h2>
                            <p><span className="font-bold">التقييم:</span> {item.value.rating}</p>
                            <p><span className="font-bold">التعليمات:</span> {item.value.advice}</p>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => router.push('/')}
                    className="mt-6 w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-md transition-colors duration-200"
                >
                    العودة
                </button>
            </motion.div>
        </div>
    );
}
