"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Package,
    Heart,
    Calendar,
    LogOut,
    User,
    ChevronRight,
    Check,
    X,
    History
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { fetcher } from "@/lib/api";

const AGE_LABELS: Record<string, string> = {
    BB: "0-3 ans (Bébé)",
    PE: "3-6 ans (Petite Enfance)",
    EN: "6-10 ans (Enfance)",
    AD: "10+ ans (Ados)",
};

const CATEGORY_MAP: Record<string, { label: string, image: string }> = {
    SOC: { label: "Jeux de société", image: "/6icons/icon (1).png" },
    FIG: { label: "Figurines & Poupées", image: "/6icons/icon (2).png" },
    CON: { label: "Jeux de construction", image: "/6icons/icon (3).png" },
    EXT: { label: "Jeux d'extérieur", image: "/6icons/icon (4).png" },
    EVL: { label: "Jeux d'éveil", image: "/6icons/icon (5).png" },
    LIV: { label: "Livres jeunesse", image: "/6icons/icon (6).png" },
};

export default function DashboardPage() {
    const { data: session, status, update: updateSession } = useSession();
    const [isSyncing, setIsSyncing] = useState(false);
    const [isEditingAge, setIsEditingAge] = useState(false);
    const [isEditingPrefs, setIsEditingPrefs] = useState(false);
    const [userBoxes, setUserBoxes] = useState<any[]>([]);
    const [isLoadingBoxes, setIsLoadingBoxes] = useState(true);
    const [tempPrefs, setTempPrefs] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
            return;
        }

        if (status === "authenticated") {
            const quizPending = sessionStorage.getItem("quiz_pending_data");
            if (quizPending) {
                const syncQuiz = async () => {
                    setIsSyncing(true);
                    try {
                        const data = JSON.parse(quizPending);
                        await fetcher("/api/user/update-quiz", {
                            method: "POST",
                            body: JSON.stringify(data),
                        });
                        sessionStorage.removeItem("quiz_pending_data");
                        await updateSession();
                    } catch (err) {
                        console.error("Sync error:", err);
                    } finally {
                        setIsSyncing(false);
                    }
                };
                syncQuiz();
            }

            fetcher<any[]>("/api/user/boxes")
                .then(data => {
                    if (Array.isArray(data)) {
                        setUserBoxes(data);
                    }
                })
                .catch(console.error)
                .finally(() => setIsLoadingBoxes(false));
        }
    }, [status, router, updateSession]);

    const handleUpdateAge = async (newAge: string) => {
        setIsSyncing(true);
        try {
            await fetcher("/api/user/profile", {
                method: "PATCH",
                body: JSON.stringify({ trancheAgeEnfant: newAge }),
            });
            await updateSession();
            setIsEditingAge(false);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSyncing(false);
        }
    };

    const movePref = (index: number, direction: 'up' | 'down') => {
        const newPrefs = [...tempPrefs];
        if (direction === 'up' && index > 0) {
            [newPrefs[index], newPrefs[index - 1]] = [newPrefs[index - 1], newPrefs[index]];
        } else if (direction === 'down' && index < newPrefs.length - 1) {
            [newPrefs[index], newPrefs[index + 1]] = [newPrefs[index + 1], newPrefs[index]];
        }
        setTempPrefs(newPrefs);
    };

    const handleSavePrefs = async () => {
        setIsSyncing(true);
        try {
            const newPrefs = tempPrefs.map(p => p.id).join(",");
            await fetcher("/api/user/profile", {
                method: "PATCH",
                body: JSON.stringify({ preferencesCategories: newPrefs }),
            });
            await updateSession();
            setIsEditingPrefs(false);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSyncing(false);
        }
    };

    if (status === "loading" || isSyncing) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fffcf5]">
                <div className="w-10 h-10 rounded-full border-4 border-[#4c40cf]/20 border-t-[#4c40cf] animate-spin" />
            </div>
        );
    }

    if (!session) return null;

    const user = session.user as any;
    const preferences = user.preferencesCategories
        ? user.preferencesCategories.split(",")
            .map((id: string) => ({ id, ...CATEGORY_MAP[id] }))
            .filter((p: any) => p.image)
        : [];

    const currentBox = userBoxes.find(b => b.campagne.statut !== "VALIDEE");
    const pastBoxes = userBoxes.filter(b => b.campagne.statut === "VALIDEE");

    return (
        <div className="min-h-screen bg-[#fffcf5] text-[#131445] font-sans pb-32">
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-[#4c40cf]/10 px-6 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <span className="font-display font-bold text-xl tracking-tight">Toys Academy</span>
                </Link>
                <div className="flex items-center gap-2">
                    <button
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Déconnexion"
                        onClick={() => signOut({ callbackUrl: "/" })}
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                    <div className="w-10 h-10 rounded-full border-2 border-[#4c40cf]/20 overflow-hidden bg-white">
                        {user.image ? (
                            <Image src={user.image} alt="Avatar" width={40} height={40} />
                        ) : (
                            <User className="w-full h-full p-2 text-[#4c40cf]" />
                        )}
                    </div>
                </div>
            </header>

            <main className="pt-24 px-6 max-w-2xl mx-auto space-y-8">
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-1"
                >
                    <h1 className="text-3xl font-display font-bold">Bonjour, {user.name?.split(" ")[0]} ! 👋</h1>
                    <p className="text-[#131445]/60 font-medium">Ravi de vous revoir dans votre espace.</p>
                </motion.section>

                <motion.section
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="relative overflow-hidden bg-[#4c40cf] rounded-[2.5rem] p-8 text-white shadow-2xl shadow-[#4c40cf]/20"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12 blur-xl" />

                    <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
                        <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shrink-0">
                            <Package className="w-12 h-12 text-white" />
                        </div>
                        <div className="space-y-2 flex-1 text-center sm:text-left">
                            <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                {currentBox ? "Ma Box du mois" : "Statut de votre Box"}
                            </span>
                            <h2 className="text-2xl font-bold mt-2">
                                {currentBox ? currentBox.campagne.nom : "À venir"}
                            </h2>
                            <p className="text-white/80 font-medium text-sm">
                                {currentBox
                                    ? (currentBox.campagne.statut === "COMPOSEE" ? "Composition terminée ! Préparez-vous." : "En cours de préparation...")
                                    : "Votre prochaine box sera bientôt planifiée."}
                            </p>
                        </div>
                        {currentBox && (
                            <button className="px-6 py-3 bg-white text-[#4c40cf] font-bold rounded-full hover:scale-105 transition-transform active:scale-95 shadow-lg">
                                Suivre
                            </button>
                        )}
                    </div>

                    {currentBox && currentBox.articles.length > 0 && (
                        <div className="mt-8 pt-6 border-t border-white/20">
                            <h4 className="text-xs font-bold uppercase tracking-widest opacity-60 mb-4">Dans votre box ce mois-ci</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {currentBox.articles.map((art: any) => (
                                    <div key={art.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 flex flex-col items-center gap-2 border border-white/10">
                                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                            <Package className="w-5 h-5" />
                                        </div>
                                        <span className="text-[10px] font-bold text-center line-clamp-1">{art.nom || "Jouet"}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.section>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center text-pink-500">
                                    <Heart className="w-5 h-5 fill-current" />
                                </div>
                                <h3 className="font-bold text-lg">Âge Enfant</h3>
                            </div>
                            <button
                                onClick={() => setIsEditingAge(true)}
                                className="text-xs font-bold text-[#4c40cf] hover:underline"
                            >
                                Modifier
                            </button>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Tranche d'âge</span>
                                <span className="font-bold text-[#4c40cf]">{AGE_LABELS[user.trancheAgeEnfant] || "Non définie"}</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm space-y-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-lg">Abonnement</h3>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Formule</span>
                                <span className="font-bold">Premium mensuel</span>
                            </div>
                            <div className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-bold inline-block">
                                Actif
                            </div>
                        </div>
                    </motion.div>
                </div>

                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-4"
                >
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-display font-bold">Vos préférences</h3>
                        <button
                            className="text-sm font-bold text-[#4c40cf] flex items-center gap-1 bg-[#4c40cf]/5 px-3 py-1 rounded-full hover:bg-[#4c40cf]/10 transition-colors"
                            onClick={() => {
                                setTempPrefs(preferences);
                                setIsEditingPrefs(true);
                            }}
                        >
                            Réorganiser <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        {preferences.map((pref: any) => (
                            <motion.div
                                key={pref.id}
                                whileHover={{ scale: 1.05 }}
                                className="bg-white/50 backdrop-blur-sm border border-gray-100 rounded-2xl p-4 flex flex-col items-center gap-3 shadow-sm"
                            >
                                <div className="relative w-12 h-12">
                                    {pref.image && <Image src={pref.image} alt={pref.label} fill className="object-contain" />}
                                </div>
                                <span className="text-[10px] sm:text-xs font-bold text-center leading-tight">
                                    {pref.label}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-4"
                >
                    <div className="flex items-center gap-2">
                        <History className="w-5 h-5 text-gray-400" />
                        <h3 className="text-xl font-display font-bold">Historique des Box</h3>
                    </div>

                    {isLoadingBoxes ? (
                        <div className="h-24 bg-white rounded-3xl animate-pulse" />
                    ) : pastBoxes.length === 0 ? (
                        <div className="bg-white/50 border border-dashed border-gray-200 rounded-[2rem] p-8 text-center">
                            <Package className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                            <p className="text-gray-400 text-sm">Vous n'avez pas encore reçu de box.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {pastBoxes.map((box: any) => (
                                <motion.div
                                    key={box.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm space-y-4"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-bold text-lg">{box.campagne.nom}</h4>
                                            <p className="text-xs text-gray-400">Livrée le {new Date(box.createdAt).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}</p>
                                        </div>
                                        <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-[10px] font-bold">LIVRÉE</div>
                                    </div>
                                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                                        {box.articles.map((art: any) => (
                                            <div key={art.id} className="flex-none w-24 bg-gray-50 rounded-2xl p-3 flex flex-col items-center gap-2 border border-gray-100/50">
                                                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                                                    <Package className="w-5 h-5 text-[#4c40cf]/30" />
                                                </div>
                                                <span className="text-[10px] font-bold text-center line-clamp-2 leading-tight h-6">{art.nom || "Article"}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.section>
            </main>

            <AnimatePresence>
                {isEditingAge && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#131445]/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl space-y-6 relative overflow-hidden"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-display font-bold text-[#131445]">Modifier l'âge</h3>
                                <button onClick={() => setIsEditingAge(false)} className="p-2 bg-gray-50 rounded-full"><X className="w-4 h-4" /></button>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                {Object.entries(AGE_LABELS).map(([id, label]) => (
                                    <button
                                        key={id}
                                        onClick={() => handleUpdateAge(id)}
                                        className={`group p-4 rounded-2xl border-2 text-left transition-all relative ${user.trancheAgeEnfant === id
                                            ? "border-[#4c40cf] bg-[#4c40cf]/5 shadow-inner"
                                            : "border-gray-50 hover:border-[#4c40cf]/20 bg-gray-50/50"
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className={`font-bold ${user.trancheAgeEnfant === id ? "text-[#4c40cf]" : "text-[#131445]"}`}>{label}</span>
                                            {user.trancheAgeEnfant === id && <Check className="w-4 h-4 text-[#4c40cf]" />}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isEditingPrefs && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#131445]/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl h-[85vh] flex flex-col relative"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl font-display font-bold text-[#131445]">Vos préférences</h3>
                                <button onClick={() => setIsEditingPrefs(false)} className="p-2 bg-gray-50 rounded-full"><X className="w-4 h-4" /></button>
                            </div>
                            <p className="text-xs text-gray-400 mb-6 font-medium">Utilisez les flèches pour définir vos catégories prioritaires.</p>

                            <div className="flex-1 overflow-y-auto no-scrollbar pr-1">
                                <div className="space-y-3">
                                    {tempPrefs.map((pref, idx) => (
                                        <div
                                            key={pref.id}
                                            className="bg-white rounded-2xl p-4 flex items-center justify-between border border-gray-100 shadow-sm"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="text-[10px] font-black text-[#4c40cf] bg-[#4c40cf]/10 w-6 h-6 rounded flex items-center justify-center">
                                                    {idx + 1}
                                                </div>
                                                <div className="w-10 h-10 bg-gray-50 rounded-xl relative p-2 overflow-hidden">
                                                    {pref.image && <Image src={pref.image} alt={pref.label} fill className="object-contain" />}
                                                </div>
                                                <span className="font-bold text-sm text-[#131445]">{pref.label}</span>
                                            </div>
                                            <div className="flex gap-1">
                                                <button
                                                    type="button"
                                                    disabled={idx === 0}
                                                    onClick={() => movePref(idx, 'up')}
                                                    className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-[#4c40cf]/10 hover:text-[#4c40cf] flex items-center justify-center disabled:opacity-20 transition-colors"
                                                >
                                                    ▲
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={idx === tempPrefs.length - 1}
                                                    onClick={() => movePref(idx, 'down')}
                                                    className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-[#4c40cf]/10 hover:text-[#4c40cf] flex items-center justify-center disabled:opacity-20 transition-colors"
                                                >
                                                    ▼
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-6">
                                <button
                                    onClick={handleSavePrefs}
                                    className="w-full py-5 bg-[#4c40cf] text-white font-bold rounded-2xl shadow-xl shadow-[#4c40cf]/20 flex items-center justify-center gap-3 active:scale-95 transition-transform"
                                >
                                    <Check className="w-5 h-5" /> Enregistrer mes choix
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
