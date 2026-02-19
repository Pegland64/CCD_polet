"use client";

import { useState, useEffect } from "react";
import {
    Weight, AlertCircle, CheckCircle, Users, Loader2,
    Zap, ArrowRight, Clock, Info, ExternalLink
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { fetcher } from "@/lib/api";
import { useRouter } from "next/navigation";

interface Stats {
    totalArticles: number;
    totalAbonnes: number;
}

interface CampagneBrouillon {
    id: string;
    nom: string;
    createdAt: string;
}

export default function CompositionView() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [campaignName, setCampaignName] = useState(`Session ${new Date().toLocaleDateString('fr-FR')}`);
    const [wMax, setWMax] = useState("2000");
    const [createdCampagne, setCreatedCampagne] = useState<{ id: string; nom: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<Stats | null>(null);
    const [campagneBrouillon, setCampagneBrouillon] = useState<CampagneBrouillon | null>(null);
    const [isCheckingStatus, setIsCheckingStatus] = useState(true);

    // Charger les stats et vérifier s'il y a déjà une campagne en cours
    useEffect(() => {
        const init = async () => {
            try {
                const [statsData, campagnesData] = await Promise.all([
                    fetcher<Stats>('/api/stats'),
                    fetcher<CampagneBrouillon[]>('/api/campaigns'),
                ]);
                setStats(statsData);
                const brouillon = campagnesData.find((c: any) => c.statut === 'BROUILLON');
                if (brouillon) setCampagneBrouillon(brouillon);
            } catch (err) {
                console.error(err);
            } finally {
                setIsCheckingStatus(false);
            }
        };
        init();
    }, []);

    // Polling: si une campagne BROUILLON est détectée, vérifier si elle est passée à COMPOSEE
    useEffect(() => {
        if (!campagneBrouillon) return;
        const interval = setInterval(async () => {
            try {
                const campagnes = await fetcher<any[]>('/api/campaigns');
                const brouillon = campagnes.find((c: any) => c.statut === 'BROUILLON');
                if (!brouillon) {
                    setCampagneBrouillon(null);
                    clearInterval(interval);
                }
            } catch { }
        }, 5000);
        return () => clearInterval(interval);
    }, [campagneBrouillon]);

    const handleCreateCampaign = async () => {
        if (!campaignName.trim() || !wMax || parseInt(wMax) <= 0) {
            setError("Nom de session et poids max requis (poids > 0)");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const campaign = await fetcher<any>('/api/campaigns', {
                method: 'POST',
                body: JSON.stringify({ nom: campaignName, poidsMax: parseInt(wMax) })
            });
            setCreatedCampagne({ id: campaign.id, nom: campaign.nom });
            setCampagneBrouillon({ id: campaign.id, nom: campaign.nom, createdAt: campaign.createdAt });
        } catch (err: any) {
            // Extraire le message d'erreur JSON
            const msg = err?.message || "Erreur lors de la création";
            setError(msg.includes('{') ? JSON.parse(msg)?.error ?? msg : msg);
        } finally {
            setIsLoading(false);
        }
    };

    // ── Campagne vient d'être créée : afficher le statut live ──────────────
    if (createdCampagne) {
        return (
            <div className="space-y-6 animate-in fade-in duration-500">
                <div className="text-center py-6">
                    <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4 shadow-xl border border-green-200">
                        <CheckCircle size={40} strokeWidth={2} />
                    </div>
                    <h2 className="text-2xl font-bold text-text-primary mb-2">Session créée !</h2>
                    <p className="text-text-primary/50 text-sm max-w-sm mx-auto">
                        <strong className="text-brand">{createdCampagne.nom}</strong> est en cours de composition.
                        L'algorithme va automatiquement générer les boxes.
                    </p>
                </div>

                {/* Statut temps réel */}
                <Card variant="glass" className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-3 h-3 rounded-full bg-orange-400 animate-pulse" />
                        <span className="font-bold text-sm text-text-primary">Composition en cours…</span>
                        <Loader2 size={14} className="text-brand animate-spin ml-auto" />
                    </div>
                    <div className="space-y-2 text-xs text-text-primary/50">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            Données transmises à l'algorithme d'optimisation
                        </div>
                        <div className="flex items-center gap-2">
                            <Loader2 size={10} className="animate-spin text-orange-400" />
                            Algorithme glouton en cours d'exécution…
                        </div>
                        <div className="flex items-center gap-2 text-text-primary/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-text-primary/10" />
                            Enregistrement des boxes en base de données
                        </div>
                    </div>
                    <p className="text-[10px] text-text-primary/30 mt-3 font-bold">
                        La page se met à jour automatiquement. Résultats disponibles dans quelques secondes.
                    </p>
                </Card>

                <div className="flex flex-col gap-3">
                    <Button
                        variant="primary"
                        size="lg"
                        className="w-full shadow-lg shadow-brand/20"
                        onClick={() => router.push(`/admin/campagnes/${createdCampagne.id}`)}
                        icon={<ExternalLink size={16} />}
                    >
                        Suivre la composition
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setCreatedCampagne(null);
                            setCampaignName(`Session ${new Date().toLocaleDateString('fr-FR')}`);
                        }}
                    >
                        Créer une autre session
                    </Button>
                </div>
            </div>
        );
    }

    // ── Composition déjà en cours (détectée au chargement) ────────────────
    if (campagneBrouillon) {
        return (
            <div className="space-y-6 animate-in fade-in duration-500">
                <Card variant="glass" className="p-6 border-2 border-orange-200/50">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center shrink-0">
                            <Loader2 size={20} className="animate-spin" />
                        </div>
                        <div>
                            <p className="font-bold text-text-primary mb-1">Composition en cours</p>
                            <p className="text-sm text-text-primary/60">
                                La campagne <strong>"{campagneBrouillon.nom}"</strong> est actuellement traitée par l'algorithme.
                                Vous ne pouvez pas lancer une nouvelle composition avant qu'elle soit terminée.
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => router.push(`/admin/campagnes/${campagneBrouillon.id}`)}
                            icon={<ExternalLink size={14} />}
                        >
                            Voir la campagne
                        </Button>
                    </div>
                </Card>

                <Card variant="white" className="p-4">
                    <div className="flex items-center gap-2 text-xs text-text-primary/40 font-bold">
                        <Info size={14} className="shrink-0" />
                        <p>Une nouvelle session pourra être créée une fois la campagne en cours passée au statut <span className="text-brand">COMPOSÉE</span>.</p>
                    </div>
                </Card>
            </div>
        );
    }

    // ── Formulaire de création ────────────────────────────────────────────
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            {error && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-600 text-xs font-bold">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" /> {error}
                </div>
            )}

            {/* Info architecture — point 10 */}
            <Card variant="glass" className="p-4">
                <div className="flex items-start gap-3">
                    <Zap size={16} className="text-brand shrink-0 mt-0.5" />
                    <div className="text-xs text-text-primary/60">
                        <p className="font-bold text-text-primary mb-1">Composition automatique</p>
                        <p>Une fois la session créée, le <strong>service d'optimisation</strong> détecte automatiquement la nouvelle campagne et génère les boxes en appliquant l'algorithme glouton. Résultats disponibles en quelques secondes.</p>
                    </div>
                </div>
            </Card>

            {/* Compteur abonnés */}
            <Card variant="white" className="p-5 flex items-center gap-4 shadow-sm border border-[#131445]/5">
                <div className="w-12 h-12 bg-brand/5 rounded-xl flex items-center justify-center text-brand">
                    <Users size={22} />
                </div>
                <div>
                    <span className="text-3xl font-black text-text-primary tabular-nums">
                        {isCheckingStatus ? '—' : (stats?.totalAbonnes ?? 0)}
                    </span>
                    <p className="text-[10px] font-bold text-text-primary/30 uppercase tracking-widest">Abonnés à traiter</p>
                </div>
                <div className="ml-auto text-right">
                    <span className="text-3xl font-black text-text-primary/20 tabular-nums">
                        {isCheckingStatus ? '—' : (stats?.totalArticles ?? 0)}
                    </span>
                    <p className="text-[10px] font-bold text-text-primary/20 uppercase tracking-widest">Articles dispo</p>
                </div>
            </Card>

            {/* Nom de la session */}
            <Card variant="glass" className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center text-brand">
                        <Clock size={18} />
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase text-brand tracking-[0.2em] mb-0.5">Session</p>
                        <h3 className="font-bold text-lg text-text-primary">Nom de la campagne</h3>
                    </div>
                </div>
                <Input
                    type="text"
                    value={campaignName}
                    onChange={e => setCampaignName(e.target.value)}
                    placeholder="ex: Noël 2026"
                    className="h-12 font-bold"
                />
            </Card>

            {/* Poids max */}
            <Card variant="glass" className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center text-brand">
                        <Weight size={18} />
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase text-brand tracking-[0.2em] mb-0.5">Contrainte (point 9)</p>
                        <h3 className="font-bold text-lg text-text-primary">Poids maximum par box</h3>
                    </div>
                </div>
                <div className="relative">
                    <Input
                        type="number"
                        value={wMax}
                        onChange={e => setWMax(e.target.value)}
                        min={100}
                        max={10000}
                        step={100}
                        className="h-20 text-center text-4xl font-black !bg-text-primary/5 pr-12 tabular-nums"
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-text-primary/20 font-black text-2xl">g</span>
                </div>
                <p className="text-[10px] text-text-primary/30 font-bold text-center">
                    Recommandé : 1000g – 3000g selon le stock disponible
                </p>
            </Card>

            {/* Bouton lancer */}
            <Button
                variant="primary"
                size="xl"
                onClick={handleCreateCampaign}
                disabled={isLoading || isCheckingStatus}
                className="w-full shadow-xl shadow-brand/20"
                icon={isLoading ? <Loader2 className="animate-spin" /> : <ArrowRight size={20} />}
            >
                {isLoading ? "Création en cours…" : "Lancer la session de composition"}
            </Button>
        </div>
    );
}
