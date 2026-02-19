"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Package, Search, CheckCircle2, Clock, ArrowLeft,
    Weight, Euro, Star, AlertCircle, Loader2
} from "lucide-react";
import Link from "next/link";
import { fetcher } from "@/lib/api";

// Helpers
const AGE_LABELS: Record<string, string> = { BB: "0-3 ans", PE: "3-6 ans", EN: "6-10 ans", AD: "10+" };
const ETAT_LABELS: Record<string, string> = { N: "Neuf", TB: "Très bon état", B: "Bon état" };
const CAT_LABELS: Record<string, string> = {
    SOC: "Jeux de société", FIG: "Figurines & Poupées", CON: "Jeux de construction",
    EXT: "Jeux d'extérieur", EVL: "Jeux d'éveil", LIV: "Livres jeunesse",
};
const ETAT_CLASS: Record<string, string> = {
    N: "bg-green-100 text-green-700",
    TB: "bg-blue-100 text-blue-700",
    B: "bg-orange-100 text-orange-700",
};

interface Box {
    id: string;
    score: number;
    poidsTotal: number;
    prixTotal: number;
    createdAt: string;
    campagne: { id: string; nom: string; createdAt: string };
    articles: {
        id: string; designation: string; categorie: string;
        trancheAge: string; etat: string; prix: number; poids: number;
    }[];
}

interface UserInfo {
    nom: string | null;
    prenom: string | null;
    email: string;
    trancheAgeEnfant: string | null;
}

export default function MaBoxPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<{ utilisateur: UserInfo; boxes: Box[] } | null>(null);
    const [expandedBox, setExpandedBox] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const data = await fetcher<{ utilisateur: UserInfo; boxes: Box[] }>(
                `/api/boxes/subscriber/${encodeURIComponent(email.trim())}`
            );
            setResult(data);
            if (data.boxes.length === 1) setExpandedBox(data.boxes[0].id);
        } catch (err: any) {
            if (err.message?.includes("404") || err.message?.includes("introuvable")) {
                setError("Adresse email introuvable. Vérifiez votre saisie.");
            } else {
                setError("Erreur lors de la recherche. Réessayez.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const nomComplet = result?.utilisateur
        ? [result.utilisateur.prenom, result.utilisateur.nom].filter(Boolean).join(" ") || result.utilisateur.email
        : "";

    return (
        <main className="min-h-screen bg-[#fffcf5] font-sans">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-[#4c40cf]/10 px-6 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <span className="font-display font-bold text-xl tracking-tight text-[#131445]">Toys Academy</span>
                </Link>
                <Link href="/connexion" className="text-xs font-bold text-[#4c40cf] bg-[#4c40cf]/5 px-3 py-1.5 rounded-full hover:bg-[#4c40cf]/10 transition-colors">
                    Espace admin
                </Link>
            </header>

            <div className="pt-24 px-6 pb-20 max-w-xl mx-auto">
                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10 space-y-3"
                >
                    <div className="w-20 h-20 bg-[#4c40cf]/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
                        <Package className="w-10 h-10 text-[#4c40cf]" />
                    </div>
                    <h1 className="text-3xl font-display font-bold text-[#131445]">
                        Consulter ma Box
                    </h1>
                    <p className="text-[#131445]/60 font-medium">
                        Entrez votre adresse email pour voir les boxes qui vous sont destinées.
                    </p>
                </motion.div>

                {/* Formulaire */}
                <form onSubmit={handleSearch} className="flex gap-2 mb-8">
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="votre@email.com"
                        className="flex-1 bg-white border border-[#4c40cf]/10 rounded-2xl px-5 py-4 text-[#131445] font-medium placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4c40cf]/20 focus:border-[#4c40cf]/30 shadow-sm transition-all"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !email.trim()}
                        className="w-14 h-14 bg-[#4c40cf] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-[#4c40cf]/30 hover:bg-[#3b32a3] active:scale-95 transition-all disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                    </button>
                </form>

                {/* Erreur */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold flex items-center gap-3 mb-6"
                    >
                        <AlertCircle size={18} className="shrink-0" /> {error}
                    </motion.div>
                )}

                {/* Résultats */}
                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            {/* Info abonné */}
                            <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                                <div className="w-12 h-12 bg-[#4c40cf]/10 rounded-xl flex items-center justify-center text-[#4c40cf] font-black text-lg">
                                    {nomComplet.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-bold text-[#131445]">{nomComplet}</p>
                                    <p className="text-xs text-gray-400">{result.utilisateur.email}</p>
                                    {result.utilisateur.trancheAgeEnfant && (
                                        <span className="text-[10px] font-bold text-[#4c40cf] bg-[#4c40cf]/5 px-2 py-0.5 rounded-full">
                                            {AGE_LABELS[result.utilisateur.trancheAgeEnfant] ?? result.utilisateur.trancheAgeEnfant}
                                        </span>
                                    )}
                                </div>
                                <div className="ml-auto text-right">
                                    <span className="text-2xl font-black text-[#4c40cf]">{result.boxes.length}</span>
                                    <p className="text-[10px] font-bold text-gray-300 uppercase">box</p>
                                </div>
                            </div>

                            {/* Aucune box */}
                            {result.boxes.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-12 text-center bg-white border border-dashed border-gray-200 rounded-3xl">
                                    <Clock className="w-10 h-10 text-gray-200 mb-3" />
                                    <p className="text-gray-400 text-sm font-medium">Aucune box validée pour le moment.</p>
                                    <p className="text-gray-300 text-xs mt-1">Votre box sera disponible une fois la campagne validée par l'équipe.</p>
                                </div>
                            )}

                            {/* Liste des boxes */}
                            {result.boxes.map(box => (
                                <motion.div
                                    key={box.id}
                                    layout
                                    className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm"
                                >
                                    {/* Header box */}
                                    <button
                                        className="w-full p-5 flex items-center gap-4 text-left"
                                        onClick={() => setExpandedBox(expandedBox === box.id ? null : box.id)}
                                    >
                                        <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center shrink-0">
                                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-[#131445] truncate">{box.campagne.nom}</p>
                                            <p className="text-xs text-gray-400">
                                                {new Date(box.campagne.createdAt).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                                            </p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className="flex items-center gap-1 justify-end">
                                                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                                <span className="font-black text-[#131445]">{box.score}</span>
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-300">score</span>
                                        </div>
                                    </button>

                                    {/* Détail */}
                                    <AnimatePresence>
                                        {expandedBox === box.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden"
                                            >
                                                {/* Stats */}
                                                <div className="grid grid-cols-3 divide-x divide-gray-100 border-t border-gray-100">
                                                    <div className="p-3 text-center">
                                                        <Weight size={14} className="text-gray-300 mx-auto mb-1" />
                                                        <span className="block text-sm font-black text-[#131445]">{box.poidsTotal}g</span>
                                                        <span className="text-[9px] uppercase tracking-widest text-gray-300 font-bold">Poids</span>
                                                    </div>
                                                    <div className="p-3 text-center">
                                                        <Euro size={14} className="text-gray-300 mx-auto mb-1" />
                                                        <span className="block text-sm font-black text-[#131445]">{box.prixTotal}€</span>
                                                        <span className="text-[9px] uppercase tracking-widest text-gray-300 font-bold">Valeur</span>
                                                    </div>
                                                    <div className="p-3 text-center">
                                                        <Package size={14} className="text-gray-300 mx-auto mb-1" />
                                                        <span className="block text-sm font-black text-[#131445]">{box.articles.length}</span>
                                                        <span className="text-[9px] uppercase tracking-widest text-gray-300 font-bold">Articles</span>
                                                    </div>
                                                </div>

                                                {/* Articles */}
                                                <div className="p-4 space-y-2 bg-gray-50/50 border-t border-gray-100">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-3">Contenu de la box</p>
                                                    {box.articles.map(art => (
                                                        <div key={art.id} className="flex items-center gap-3 bg-white rounded-2xl p-3 shadow-sm border border-gray-50">
                                                            <div className="w-10 h-10 bg-[#4c40cf]/5 rounded-xl flex items-center justify-center shrink-0">
                                                                <Package size={16} className="text-[#4c40cf]/40" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-bold text-[#131445] truncate">{art.designation}</p>
                                                                <p className="text-[10px] text-gray-400">
                                                                    {CAT_LABELS[art.categorie] ?? art.categorie} · {AGE_LABELS[art.trancheAge] ?? art.trancheAge}
                                                                </p>
                                                            </div>
                                                            <div className="flex flex-col items-end gap-1 shrink-0">
                                                                <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md ${ETAT_CLASS[art.etat] ?? "bg-gray-100 text-gray-500"}`}>
                                                                    {ETAT_LABELS[art.etat] ?? art.etat}
                                                                </span>
                                                                <span className="text-[10px] font-bold text-gray-300">{art.poids}g · {art.prix}€</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
