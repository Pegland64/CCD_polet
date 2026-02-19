"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { ArrowRight, X, Check, Sparkles, Target, HandCoins, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

const AGE_GROUPS = [
    { id: "BB", label: "0-3 ans", range: "Bébé", image: "/4icons/age-baby.webp.png" },
    { id: "PE", label: "3-6 ans", range: "Petite Enfance", image: "/4icons/age-child.webp.png" },
    { id: "EN", label: "6-10 ans", range: "Enfance", image: "/4icons/Calque 4.png" },
    { id: "AD", label: "10+ ans", range: "Ados", image: "/4icons/Calque 5.png" },
];

const CATEGORIES = [
    { id: "SOC", label: "Jeux de société", image: "/6icons/icon (1).png" },
    { id: "FIG", label: "Figurines & Poupées", image: "/6icons/icon (2).png" },
    { id: "CON", label: "Jeux de construction", image: "/6icons/icon (3).png" },
    { id: "EXT", label: "Jeux d'extérieur", image: "/6icons/icon (4).png" },
    { id: "EVL", label: "Jeux d'éveil", image: "/6icons/icon (5).png" },
    { id: "LIV", label: "Livres jeunesse", image: "/6icons/icon (6).png" },
];

const StepIndicator = ({ currentStep }: { currentStep: string }) => {
    const steps = ["HERO", "AGE", "SELECTION"];
    const index = steps.indexOf(currentStep);
    if (index === -1) return null;
    return (
        <div className="absolute top-6 left-0 right-0 flex justify-center gap-2 z-50 pointer-events-none">
            {steps.map((s, i) => (
                <div
                    key={s}
                    className={`h-2 rounded-full transition-all duration-500 shadow-sm ${i <= index ? "w-8 bg-[var(--color-brand)]" : "w-2 bg-gray-300"
                        }`}
                />
            ))}
        </div>
    );
};

export default function LandingPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [view, setView] = useState<"HERO" | "AGE" | "SELECTION">("HERO");
    const [selectedAge, setSelectedAge] = useState<string | null>(null);
    const [boxSlots, setBoxSlots] = useState<(typeof CATEGORIES[0] | null)[]>([null, null, null, null, null, null]);
    const [reservoir, setReservoir] = useState<typeof CATEGORIES>(CATEGORIES);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        const timer = setTimeout(() => setIsLoading(false), 1800);
        return () => clearTimeout(timer);
    }, []);

    const startQuiz = () => setView("AGE");

    const handleAgeSelection = (ageId: string) => {
        setSelectedAge(ageId);
        setTimeout(() => setView("SELECTION"), 300);
    };

    const handleAddToBox = (category: typeof CATEGORIES[0]) => {
        const firstEmptyIndex = boxSlots.indexOf(null);
        if (firstEmptyIndex !== -1) {
            const newSlots = [...boxSlots];
            newSlots[firstEmptyIndex] = category;
            setBoxSlots(newSlots);
            setReservoir((prev) => prev.filter((c) => c.id !== category.id));
        }
    };

    const handleRemoveFromBox = (category: typeof CATEGORIES[0]) => {
        setBoxSlots((prev) => prev.map((slot) => (slot?.id === category.id ? null : slot)));
        setReservoir((prev) => [...prev, category]);
    };

    const isBoxFull = boxSlots.every((slot) => slot !== null);
    const isValid = selectedAge !== null && isBoxFull;

    return (
        <main className="fixed inset-0 w-full h-full overflow-hidden bg-[#fffcf5] font-sans">
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        key="loader"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#fffcf5]"
                    >
                        <div className="w-10 h-10 rounded-full border-4 border-[#4c40cf]/20 border-t-[#4c40cf] animate-spin" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Background Animations */}
            <div className="fixed inset-0 -z-0 overflow-hidden pointer-events-none bg-[#fffcf5]">
                <motion.div
                    animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] bg-[#4c40cf]/10 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{ x: [0, -80, 0], y: [0, 40, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute top-[40%] -right-[10%] w-[400px] h-[400px] bg-[#4c40cf]/15 rounded-full blur-[80px]"
                />
                <motion.div
                    animate={{ x: [0, 50, 0], y: [0, 60, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 5 }}
                    className="absolute -bottom-[20%] left-[20%] w-[600px] h-[600px] bg-[#4c40cf]/10 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{ x: ["-25%", "0%"] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear", repeatType: "mirror" }}
                    className="absolute bottom-0 left-0 w-[200%] h-[50%] opacity-20"
                >
                    <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-full text-[#4c40cf] fill-current blur-3xl">
                        <path d="M0,160L48,170.7C96,181,192,203,288,202.7C384,203,480,181,576,181.3C672,181,768,203,864,224C960,245,1056,267,1152,266.7C1248,267,1344,245,1392,234.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
                    </svg>
                </motion.div>
                <motion.div
                    animate={{ x: ["0%", "-25%"] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear", repeatType: "mirror" }}
                    className="absolute bottom-[-10%] left-0 w-[200%] h-[60%] opacity-30"
                >
                    <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-full text-[#4c40cf] fill-current blur-2xl">
                        <path d="M0,64L48,85.3C96,107,192,149,288,160C384,171,480,149,576,133.3C672,117,768,107,864,122.7C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
                    </svg>
                </motion.div>
            </div>

            <StepIndicator currentStep={view} />

            {/* Login Overlay */}
            <div className="fixed top-6 right-6 z-50 flex items-center gap-2">
                <Link
                    href="/ma-box"
                    className="flex items-center gap-2 px-4 py-2.5 bg-white/40 backdrop-blur-xl border border-white/60 text-[#131445] font-bold text-sm rounded-2xl hover:bg-white/60 transition-all active:scale-95 shadow-sm"
                >
                    Ma Box
                </Link>
                <Link
                    href="/connexion"
                    className="flex items-center gap-2 px-5 py-2.5 bg-white/40 backdrop-blur-xl border border-white/60 text-[#131445] font-bold text-sm rounded-2xl hover:bg-white/60 transition-all active:scale-95 shadow-sm"
                >
                    <User className="w-4 h-4 text-[#4c40cf]" />
                    Se connecter (admin)
                </Link>
            </div>

            <AnimatePresence mode="wait">
                {view === "HERO" && (
                    <motion.section
                        key="hero"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.6 }}
                        className="w-full h-full relative z-10 flex flex-col items-center justify-center p-4 overflow-y-auto no-scrollbar"
                    >
                        <div className="relative w-full max-w-lg">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                                className="relative z-20 m-4 mt-8 bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_0_rgba(76,64,207,0.1)] rounded-[40px] p-8 text-center space-y-6"
                            >
                                <motion.h1
                                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                                    className="text-4xl md:text-5xl font-display font-bold leading-tight text-[#131445]"
                                >
                                    La première Box solidaire{" "}
                                    <em className="text-[#4c40cf] not-italic">sur-mesure</em>.
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6, duration: 0.6 }}
                                    className="text-lg text-[#131445]/80 font-medium"
                                >
                                    Vous choisissez ce qu'ils aiment, on s'occupe du reste.
                                </motion.p>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.8 }}
                                    className="flex flex-wrap justify-center gap-2"
                                >
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 border border-white/50 text-sm font-bold text-[#131445]">
                                        <Sparkles className="w-4 h-4 text-[#4c40cf]" /> Nettoyés
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 border border-white/50 text-sm font-bold text-[#131445]">
                                        <Target className="w-4 h-4 text-[#4c40cf]" /> Adaptés
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 border border-white/50 text-sm font-bold text-[#131445]">
                                        <HandCoins className="w-4 h-4 text-[#4c40cf]" /> Flexible
                                    </div>
                                </motion.div>

                                <motion.button
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.0 }}
                                    onClick={startQuiz}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full px-8 py-5 bg-[#4c40cf] text-white text-xl font-bold rounded-full shadow-xl shadow-[#4c40cf]/30 flex items-center justify-center gap-3"
                                >
                                    Créer ma Box <ArrowRight className="w-6 h-6" />
                                </motion.button>
                            </motion.div>

                            <motion.div
                                initial={{ y: 50, opacity: 0, scale: 0.9 }}
                                animate={{ y: 0, opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4, type: "spring" }}
                                className="relative z-30 -mt-6 mx-auto w-[90%] aspect-[16/10] pointer-events-none"
                            >
                                <Image
                                    src="/box-hero.webp"
                                    alt="Toys Academy Box"
                                    fill
                                    priority
                                    className="object-contain drop-shadow-2xl"
                                />
                            </motion.div>
                        </div>
                    </motion.section>
                )}

                {mounted && view === "AGE" && (
                    <motion.section
                        key="age"
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "-100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="w-full h-full flex flex-col items-center justify-center p-4 z-10 overflow-y-auto"
                    >
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="text-3xl font-display font-bold mb-8 text-[#4c40cf] text-center mt-20"
                        >
                            Quel âge a l'enfant ?
                        </motion.h2>

                        <div className="grid grid-cols-2 gap-4 w-full max-w-sm mx-auto pb-8">
                            {AGE_GROUPS.map((group) => (
                                <motion.button
                                    key={group.id}
                                    onClick={() => handleAgeSelection(group.id)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border-2 transition-all duration-300 flex flex-col items-center text-center shadow-sm group ${selectedAge === group.id
                                        ? "border-[#4c40cf] bg-white ring-4 ring-[#4c40cf]/20"
                                        : "bg-white/80 border-transparent hover:border-[#4c40cf]/50"
                                        }`}
                                >
                                    <div className="w-full h-[65%] relative p-4">
                                        <Image
                                            src={group.image}
                                            alt={group.label}
                                            fill
                                            className="object-contain p-2"
                                        />
                                    </div>
                                    <div className="w-full h-[35%] flex flex-col justify-center items-center px-2 bg-white/50 backdrop-blur-sm">
                                        <span className="text-lg font-bold text-[#131445] leading-none mb-1">{group.label}</span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#4c40cf] opacity-80">{group.range}</span>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </motion.section>
                )}

                {view === "SELECTION" && (
                    <motion.section
                        key="selection"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="w-full h-full flex flex-col z-10 overflow-hidden"
                    >
                        <div className="flex-none pt-20 pb-2 px-6 text-center z-20">
                            <h3 className="text-2xl font-display font-bold text-[#131445]">
                                Remplissez votre Box
                            </h3>
                            <p className="text-sm text-gray-500 font-medium">
                                Touchez pour ajouter ({boxSlots.filter(s => s).length}/6)
                            </p>
                        </div>

                        <LayoutGroup>
                            <div className="flex-none w-full px-4 mb-2 flex justify-center">
                                <div className="w-full max-w-sm aspect-[4/3] relative bg-[url('/box-top-view.webp')] bg-contain bg-center bg-no-repeat p-8">
                                    <div className="grid grid-cols-3 grid-rows-2 gap-2 w-full h-full">
                                        {boxSlots.map((slot, i) => (
                                            <div
                                                key={i}
                                                className="relative rounded-lg border-2 border-dashed border-[#4c40cf]/30 bg-white/40 backdrop-blur-sm flex items-center justify-center overflow-hidden shadow-sm w-full h-full"
                                            >
                                                {!slot && (
                                                    <span className="text-xl font-bold text-[#4c40cf]/20 select-none">
                                                        {i + 1}
                                                    </span>
                                                )}
                                                <AnimatePresence mode="popLayout">
                                                    {slot && (
                                                        <motion.button
                                                            layoutId={`card-${slot.id}`}
                                                            onClick={() => handleRemoveFromBox(slot)}
                                                            className="absolute inset-0 w-full h-full bg-white rounded-lg flex flex-col items-center justify-between p-1 cursor-pointer shadow-md border border-[#4c40cf]/20 z-10"
                                                            initial={{ opacity: 0, scale: 0.5 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.5 }}
                                                            whileTap={{ scale: 0.9 }}
                                                        >
                                                            <div className="relative w-full h-[70%]">
                                                                <Image
                                                                    src={slot.image}
                                                                    alt={slot.label}
                                                                    fill
                                                                    className="object-contain"
                                                                />
                                                            </div>
                                                            <div className="w-full h-[30%] flex items-center justify-center">
                                                                <span className="text-[8px] font-bold text-center leading-none text-[#131445] line-clamp-2 w-full px-0.5">
                                                                    {slot.label}
                                                                </span>
                                                            </div>
                                                            <div className="absolute top-0.5 right-0.5 bg-white/80 rounded-full p-0.5">
                                                                <X className="w-2 h-2 text-red-400" />
                                                            </div>
                                                        </motion.button>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 bg-white border-t border-[#4c40cf]/10 shadow-[0_-10px_40px_rgba(76,64,207,0.05)] rounded-t-[2.5rem] p-6 pb-24 overflow-y-auto relative z-30">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 text-center">
                                    Disponibles
                                </h4>

                                <div className="grid grid-cols-2 gap-3 w-full max-w-sm mx-auto">
                                    <AnimatePresence mode="popLayout">
                                        {reservoir.map((category) => (
                                            <motion.button
                                                layoutId={`card-${category.id}`}
                                                key={category.id}
                                                onClick={() => handleAddToBox(category)}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.5 }}
                                                className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col items-center gap-2 active:scale-95 transition-transform"
                                            >
                                                <div className="relative w-16 h-16">
                                                    <Image
                                                        src={category.image}
                                                        alt={category.label}
                                                        fill
                                                        className="object-contain"
                                                    />
                                                </div>
                                                <span className="text-center text-sm font-bold text-[#131445] leading-tight break-words px-1">
                                                    {category.label}
                                                </span>
                                            </motion.button>
                                        ))}
                                    </AnimatePresence>
                                </div>

                                {reservoir.length === 0 && (
                                    <div className="w-full flex flex-col items-center justify-center py-8 text-gray-400 italic gap-2">
                                        <Check className="w-8 h-8 text-[#4c40cf]" />
                                        <span>Sélection complète !</span>
                                    </div>
                                )}
                            </div>
                        </LayoutGroup>

                        <div className="absolute bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none">
                            <AnimatePresence>
                                {isValid && (
                                    <motion.button
                                        initial={{ y: 100, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: 100, opacity: 0 }}
                                        onClick={() => setIsModalOpen(true)}
                                        className="pointer-events-auto bg-[#4c40cf] text-white px-8 py-4 rounded-full font-bold shadow-2xl flex items-center gap-2 hover:bg-[#3b32a3] transition-colors"
                                    >
                                        Valider ma Box <Check className="w-5 h-5" />
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 bg-[#131445]/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-white w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2rem] p-8 pb-12 shadow-2xl relative overflow-hidden"
                        >
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>

                            <div className="text-center space-y-4 mb-8">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-3xl">
                                    🎉
                                </div>
                                <h3 className="text-2xl font-display font-bold text-[#131445]">
                                    Super choix !
                                </h3>
                                <p className="text-gray-600">
                                    Dernière étape : créez votre compte pour valider cette box.
                                </p>
                            </div>

                            <form className="space-y-4" onSubmit={async (e) => {
                                e.preventDefault();
                                setIsSubmitting(true);

                                const categories = boxSlots.filter((s): s is typeof CATEGORIES[0] => s !== null).map(s => s.id);
                                const quizData = {
                                    trancheAgeEnfant: selectedAge,
                                    preferencesCategories: categories.join(",")
                                };
                                sessionStorage.setItem("quiz_pending_data", JSON.stringify(quizData));

                                await signIn("google", { callbackUrl: "/dashboard" });
                            }}>
                                <div className="p-4 bg-brand/5 rounded-2xl border border-brand/10 text-center space-y-3">
                                    <p className="text-xs font-bold text-brand uppercase tracking-widest">Recommandé</p>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-4 bg-white text-[#131445] font-bold rounded-xl border border-gray-200 shadow-sm hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                                    >
                                        {isSubmitting ? (
                                            <div className="w-5 h-5 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Image src="https://authjs.dev/img/providers/google.svg" alt="Google" width={20} height={20} />
                                                Continuer avec Google
                                            </>
                                        )}
                                    </button>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] text-gray-400">
                                        En continuant, vous acceptez nos conditions d'utilisation.
                                    </p>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
