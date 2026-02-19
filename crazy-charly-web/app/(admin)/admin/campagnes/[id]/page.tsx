"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft, Package, CheckCircle2, Clock, ShieldCheck,
    Weight, Euro, Star, User, Loader2, AlertCircle, ChevronDown, ChevronUp,
    Download, ShieldAlert
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { fetcher } from "@/lib/api";

// ─── Types ──────────────────────────────────────────────────────────────────
interface Article {
    id: string;
    designation: string;
    categorie: string;
    trancheAge: string;
    etat: string;
    prix: number;
    poids: number;
    statut?: string;
}

interface BoxDetail {
    id: string;
    score: number;
    poidsTotal: number;
    prixTotal: number;
    utilisateur: {
        id: string;
        nom: string | null;
        prenom: string | null;
        email: string;
        trancheAgeEnfant: string | null;
    };
    articles: Article[];
}

interface CampagneDetail {
    id: string;
    nom: string;
    poidsMax: number;
    statut: string;
    totalScore: number | null;
}

// Helpers
const AGE_LABELS: Record<string, string> = { BB: "Bébé", PE: "3-6 ans", EN: "6-10 ans", AD: "10+" };
const ETAT_LABELS: Record<string, string> = { N: "Neuf", TB: "Très bon", B: "Bon" };
const CAT_LABELS: Record<string, string> = {
    SOC: "Société", FIG: "Figurines", CON: "Construction",
    EXT: "Extérieur", EVL: "Éveil", LIV: "Livres",
};

const ETAT_CLASS: Record<string, string> = {
    N: "bg-green-100 text-green-700",
    TB: "bg-blue-100 text-blue-700",
    B: "bg-orange-100 text-orange-700",
};

// Composant Box individuelle
function BoxCard({
    box,
    poidsMax,
    campagneStatut,
    onValidate,
    isValidating,
}: {
    box: BoxDetail;
    poidsMax: number;
    campagneStatut: string;
    onValidate: (boxId: string) => void;
    isValidating: boolean;
}) {
    const [expanded, setExpanded] = useState(false);
    const isValidated = box.articles.every(a => a.statut === "VALIDE");
    const nomComplet = [box.utilisateur.prenom, box.utilisateur.nom].filter(Boolean).join(" ") || box.utilisateur.email;
    const poidsPct = Math.min((box.poidsTotal / poidsMax) * 100, 100);
    const canValidate = campagneStatut === "COMPOSEE" && !isValidated;

    return (
        <Card variant="white" className="overflow-hidden">
            {/* Header box */}
            <div
                className="p-4 flex items-center gap-3 cursor-pointer select-none"
                onClick={() => setExpanded(v => !v)}
            >
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isValidated ? "bg-green-100 text-green-600" : "bg-brand/10 text-brand"}`}>
                    {isValidated ? <CheckCircle2 size={20} /> : <User size={18} />}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-text-primary truncate">{nomComplet}</span>
                        {box.utilisateur.trancheAgeEnfant && (
                            <span className="text-[9px] font-black uppercase tracking-widest text-brand/60 bg-brand/5 px-1.5 py-0.5 rounded-md">
                                {AGE_LABELS[box.utilisateur.trancheAgeEnfant] ?? box.utilisateur.trancheAgeEnfant}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-[10px] font-bold text-text-primary/30 uppercase tracking-widest">
                            {box.articles.length} article{box.articles.length !== 1 ? "s" : ""}
                        </span>
                        <span className="text-[10px] font-bold text-brand/60">{box.poidsTotal}g / {poidsMax}g</span>
                    </div>
                </div>

                {/* Score + toggle */}
                <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                        <div className="flex items-center gap-1 justify-end">
                            <Star size={12} className="text-amber-400 fill-amber-400" />
                            <span className="text-lg font-black text-text-primary tabular-nums">{box.score}</span>
                        </div>
                        {isValidated && (
                            <span className="text-[9px] font-black text-green-600 uppercase tracking-widest">Validée</span>
                        )}
                    </div>
                    <div className="text-text-primary/20">
                        {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                </div>
            </div>

            {/* Barre de poids */}
            <div className="px-4 pb-3">
                <div className="w-full h-1.5 bg-text-primary/5 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${poidsPct >= 95 ? "bg-orange-400" : "bg-brand"}`}
                        style={{ width: `${poidsPct}%` }}
                    />
                </div>
            </div>

            {/* Détail dépliable */}
            {expanded && (
                <div className="border-t border-text-primary/5">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-0 divide-x divide-text-primary/5">
                        <div className="p-3 text-center">
                            <Weight size={14} className="text-text-primary/20 mx-auto mb-1" />
                            <span className="block text-sm font-black text-text-primary tabular-nums">{box.poidsTotal}g</span>
                            <span className="text-[9px] font-bold text-text-primary/20 uppercase tracking-widest">Poids</span>
                        </div>
                        <div className="p-3 text-center">
                            <Euro size={14} className="text-text-primary/20 mx-auto mb-1" />
                            <span className="block text-sm font-black text-text-primary tabular-nums">{box.prixTotal}€</span>
                            <span className="text-[9px] font-bold text-text-primary/20 uppercase tracking-widest">Valeur</span>
                        </div>
                        <div className="p-3 text-center">
                            <Star size={14} className="text-amber-400 fill-amber-400 mx-auto mb-1" />
                            <span className="block text-sm font-black text-text-primary tabular-nums">{box.score}</span>
                            <span className="text-[9px] font-bold text-text-primary/20 uppercase tracking-widest">Score</span>
                        </div>
                    </div>

                    {/* Liste des articles */}
                    <div className="px-4 pb-3 space-y-2">
                        <p className="text-[9px] font-black uppercase tracking-widest text-text-primary/20 mb-3">Articles</p>
                        {box.articles.length === 0 ? (
                            <div className="flex items-center gap-2 text-orange-500 text-xs font-bold py-2">
                                <AlertCircle size={14} /> Box vide — aucun article assigné
                            </div>
                        ) : (
                            box.articles.map(art => (
                                <div key={art.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-text-primary/[0.02] border border-text-primary/5">
                                    <div className="w-8 h-8 rounded-lg bg-brand/5 flex items-center justify-center shrink-0">
                                        <Package size={14} className="text-brand/40" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-text-primary truncate">{art.designation}</p>
                                        <p className="text-[10px] text-text-primary/30">
                                            {CAT_LABELS[art.categorie] ?? art.categorie} · {AGE_LABELS[art.trancheAge] ?? art.trancheAge} · {art.poids}g · {art.prix}€
                                        </p>
                                    </div>
                                    <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md shrink-0 ${ETAT_CLASS[art.etat] ?? "bg-gray-100 text-gray-500"}`}>
                                        {ETAT_LABELS[art.etat] ?? art.etat}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Bouton de validation */}
                    {canValidate && (
                        <div className="px-4 pb-4">
                            <button
                                onClick={() => onValidate(box.id)}
                                disabled={isValidating}
                                className="w-full py-3 bg-green-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-60 shadow-lg shadow-green-500/20 hover:bg-green-600"
                            >
                                {isValidating ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <CheckCircle2 size={16} />
                                )}
                                Valider cette box
                            </button>
                        </div>
                    )}
                    {isValidated && (
                        <div className="px-4 pb-4">
                            <div className="w-full py-3 bg-green-50 border border-green-200 text-green-700 font-bold rounded-xl flex items-center justify-center gap-2 text-sm">
                                <CheckCircle2 size={16} /> Box validée — articles retirés du stock
                            </div>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function CampagneDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [campagne, setCampagne] = useState<CampagneDetail | null>(null);
    const [boxes, setBoxes] = useState<BoxDetail[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [validatingId, setValidatingId] = useState<string | null>(null);
    const [isValidatingAll, setIsValidatingAll] = useState(false);
    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const showToast = (type: "success" | "error", message: string) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3500);
    };

    const load = useCallback(async () => {
        try {
            const data = await fetcher<{ campagne: CampagneDetail; boxes: BoxDetail[] }>(
                `/api/campaigns/${id}/boxes`
            );
            setCampagne(data.campagne);
            setBoxes(data.boxes);
        } catch (e) {
            showToast("error", "Impossible de charger les données");
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => { load(); }, [load]);

    const handleValidateBox = async (boxId: string) => {
        setValidatingId(boxId);
        try {
            const result = await fetcher<{ message: string; allValidated: boolean }>(
                `/api/boxes/${boxId}`, { method: "PATCH" }
            );
            showToast("success", result.allValidated
                ? "Toutes les boxes validées ! Campagne passée en VALIDÉE."
                : result.message
            );
            await load();
        } catch (e: any) {
            showToast("error", e.message || "Erreur lors de la validation");
        } finally {
            setValidatingId(null);
        }
    };

    // Valider toutes les boxes non validées d'un coup
    const handleValidateAll = async () => {
        if (!campagne || campagne.statut !== "COMPOSEE") return;
        setIsValidatingAll(true);
        try {
            const unvalidated = boxes.filter(b => !b.articles.every(a => a.statut === "VALIDE"));
            for (const box of unvalidated) {
                await fetcher(`/api/boxes/${box.id}`, { method: "PATCH" });
            }
            showToast("success", `${unvalidated.length} box(es) validée(s) — Campagne VALIDÉE.`);
            await load();
        } catch (e: any) {
            showToast("error", e.message || "Erreur lors de la validation globale");
        } finally {
            setIsValidatingAll(false);
        }
    };

    // Télécharger l'export CSV
    const handleExport = () => {
        window.open(`/api/campaigns/${id}/export`, "_blank");
    };

    const getStatusVariant = (s: string) =>
        s === "VALIDEE" ? "success" : s === "COMPOSEE" ? "brand" : "neutral";
    const getStatusLabel = (s: string) =>
        ({ VALIDEE: "Validée", COMPOSEE: "Composée", BROUILLON: "Brouillon" }[s] ?? s);

    const scoreTotal = boxes.reduce((sum, b) => sum + b.score, 0);
    const boxesValidees = boxes.filter(b => b.articles.every(a => a.statut === "VALIDE")).length;

    return (
        <div className="font-sans min-h-screen bg-bg-primary pb-32">
            <PageHeader
                title={campagne?.nom ?? "Chargement…"}
                subtitle={campagne ? `${campagne.poidsMax}g max · ${boxes.length} box` : ""}
                actions={
                    <div className="flex items-center gap-2">
                        {campagne && (campagne.statut === "COMPOSEE" || campagne.statut === "VALIDEE") && (
                            <button
                                onClick={handleExport}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-text-primary/5 text-text-primary/40 hover:text-brand hover:bg-brand/10 transition-all text-xs font-bold"
                                title="Exporter CSV"
                            >
                                <Download size={14} /> CSV
                            </button>
                        )}
                        {campagne?.statut === "COMPOSEE" && boxesValidees < boxes.length && (
                            <button
                                onClick={handleValidateAll}
                                disabled={isValidatingAll}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-500 text-white text-xs font-bold hover:bg-green-600 active:scale-95 transition-all disabled:opacity-60 shadow-md shadow-green-500/20"
                            >
                                {isValidatingAll
                                    ? <Loader2 size={14} className="animate-spin" />
                                    : <ShieldAlert size={14} />}
                                Tout valider
                            </button>
                        )}
                        {campagne && (
                            <Badge variant={getStatusVariant(campagne.statut)} size="sm">
                                {getStatusLabel(campagne.statut)}
                            </Badge>
                        )}
                    </div>
                }
            >
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-1.5 text-xs font-bold text-text-primary/40 hover:text-text-primary transition-colors mt-1"
                >
                    <ArrowLeft size={14} /> Retour aux campagnes
                </button>
            </PageHeader>

            <div className="px-5 pt-6 space-y-4">
                {/* KPIs */}
                {!isLoading && campagne && (
                    <div className="grid grid-cols-3 gap-3">
                        <Card variant="glass" className="p-4 text-center">
                            <span className="text-2xl font-black text-text-primary tabular-nums">{boxes.length}</span>
                            <p className="text-[9px] font-black uppercase tracking-widest text-text-primary/30 mt-0.5">Boxes</p>
                        </Card>
                        <Card variant="glass" className="p-4 text-center">
                            <span className="text-2xl font-black text-brand tabular-nums">{scoreTotal}</span>
                            <p className="text-[9px] font-black uppercase tracking-widest text-text-primary/30 mt-0.5">Score</p>
                        </Card>
                        <Card variant="glass" className="p-4 text-center">
                            <span className="text-2xl font-black text-green-500 tabular-nums">{boxesValidees}/{boxes.length}</span>
                            <p className="text-[9px] font-black uppercase tracking-widest text-text-primary/30 mt-0.5">Validées</p>
                        </Card>
                    </div>
                )}

                {/* Indicateur de statut */}
                {campagne?.statut === "BROUILLON" && (
                    <div className="flex items-center gap-2 p-3 rounded-2xl bg-orange-50 border border-orange-100 text-orange-600 text-xs font-bold">
                        <Loader2 size={14} className="animate-spin shrink-0" />
                        Composition en cours — l'algorithme est en train d'optimiser les boxes…
                    </div>
                )}
                {campagne?.statut === "COMPOSEE" && boxesValidees < boxes.length && (
                    <div className="flex items-center gap-2 p-3 rounded-2xl bg-brand/5 border border-brand/10 text-brand text-xs font-bold">
                        <ShieldCheck size={14} className="shrink-0" />
                        {boxes.length - boxesValidees} box à valider — dépliez chaque box pour valider
                    </div>
                )}
                {campagne?.statut === "VALIDEE" && (
                    <div className="flex items-center gap-2 p-3 rounded-2xl bg-green-50 border border-green-100 text-green-700 text-xs font-bold">
                        <CheckCircle2 size={14} className="shrink-0" />
                        Campagne entièrement validée — tous les articles sont retirés du stock
                    </div>
                )}

                {/* Loading */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 size={32} className="text-brand animate-spin" />
                        <p className="text-text-primary/40 font-bold uppercase tracking-widest text-[10px]">Chargement…</p>
                    </div>
                ) : boxes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                        <Clock size={40} className="text-text-primary/10" />
                        <p className="text-text-primary/30 italic text-sm">En attente de la composition par l'algorithme…</p>
                    </div>
                ) : (
                    /* Liste des boxes */
                    <div className="space-y-3">
                        {boxes.map(box => (
                            <BoxCard
                                key={box.id}
                                box={box}
                                poidsMax={campagne!.poidsMax}
                                campagneStatut={campagne!.statut}
                                onValidate={handleValidateBox}
                                isValidating={validatingId === box.id}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Toast */}
            {toast && (
                <div className={`fixed bottom-24 left-4 right-4 z-50 p-4 rounded-2xl font-bold text-sm flex items-center gap-3 shadow-2xl ${toast.type === "success"
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                    }`}>
                    {toast.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    {toast.message}
                </div>
            )}
        </div>
    );
}
