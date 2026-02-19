"use client";

import { History, Calendar, Loader2, ShieldCheck, RefreshCw, ChevronRight, Package, Star, Weight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useApiData } from "@/hooks/useApiData";
import { Campaign } from "@/lib/types";
import Link from "next/link";

export default function CampagnesPage() {
    const { data: campaigns, isLoading, refresh } = useApiData<Campaign[]>({
        baseUrl: '/api/campaigns',
        pollingInterval: 8000,
    });

    const hasPendingCampaign = campaigns?.some(c => c.statut === 'BROUILLON');

    // Synthèse globale toutes campagnes confondues (point 15)
    const totalBoxesAll = campaigns?.reduce((s, c) => s + (c._count?.boxes ?? 0), 0) ?? 0;
    const totalArticlesAll = campaigns?.reduce((s, c) => s + (c.totalArticlesConcernes ?? 0), 0) ?? 0;
    const campagnesValidees = campaigns?.filter(c => c.statut === 'VALIDEE') ?? [];
    const scoreMoyenGlobal = campagnesValidees.length > 0
        ? Math.round(campagnesValidees.reduce((s, c) => s + (c.totalScore ?? 0), 0) / campagnesValidees.length)
        : null;

    const getStatusVariant = (status: string) => {
        if (status === "VALIDEE") return "success";
        if (status === "COMPOSEE") return "brand";
        return "neutral";
    };

    const getStatusLabel = (status: string) => {
        if (status === "VALIDEE") return "Validée";
        if (status === "COMPOSEE") return "Composée";
        return "En cours";
    };

    return (
        <div className="font-sans min-h-screen bg-bg-primary pb-32">
            <PageHeader
                title="Campagnes"
                subtitle="Historique et suivi des compositions"
                actions={
                    <button
                        onClick={refresh}
                        className="w-9 h-9 rounded-xl bg-text-primary/5 flex items-center justify-center text-text-primary/40 hover:text-brand hover:bg-brand/10 transition-all"
                        title="Rafraîchir"
                    >
                        <RefreshCw size={16} />
                    </button>
                }
            >
                {hasPendingCampaign && (
                    <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-brand/10 text-brand text-xs font-bold">
                        <Loader2 size={13} className="animate-spin shrink-0" />
                        Composition en cours — mise à jour automatique toutes les 8s
                    </div>
                )}
            </PageHeader>

            <div className="px-5 pt-6 space-y-6">

                {/* ── Synthèse globale (point 15) ── */}
                {!isLoading && campaigns && campaigns.length > 0 && (
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-text-primary/20 mb-3">Vue d'ensemble</p>
                        <div className="grid grid-cols-3 gap-3">
                            <Card variant="white" className="p-4 text-center shadow-sm border border-[#131445]/5">
                                <span className="text-2xl font-black text-text-primary tabular-nums">{campaigns.length}</span>
                                <p className="text-[9px] font-black uppercase tracking-widest text-text-primary/20 mt-1">Campagnes</p>
                            </Card>
                            <Card variant="white" className="p-4 text-center shadow-sm border border-[#131445]/5">
                                <span className="text-2xl font-black text-text-primary tabular-nums">{totalBoxesAll}</span>
                                <p className="text-[9px] font-black uppercase tracking-widest text-text-primary/20 mt-1">Boxes total</p>
                            </Card>
                            <Card variant="white" className="p-4 text-center shadow-sm border border-[#131445]/5">
                                <span className="text-2xl font-black text-brand tabular-nums">
                                    {scoreMoyenGlobal ?? '—'}
                                </span>
                                <p className="text-[9px] font-black uppercase tracking-widest text-text-primary/20 mt-1">Score moyen</p>
                            </Card>
                        </div>
                        {totalArticlesAll > 0 && (
                            <div className="mt-3 flex items-center justify-center gap-2 p-3 rounded-2xl bg-text-primary/[0.02] border border-text-primary/5">
                                <Package size={13} className="text-text-primary/20" />
                                <span className="text-xs font-bold text-text-primary/40">
                                    <strong className="text-text-primary">{totalArticlesAll}</strong> articles distribués au total
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* ── Liste campagnes ── */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 size={32} className="text-brand animate-spin" />
                        <p className="text-text-primary/40 font-bold uppercase tracking-widest text-[10px]">Chargement...</p>
                    </div>
                ) : (
                    <>
                        {(campaigns || []).length > 0 && (
                            <p className="text-[9px] font-black uppercase tracking-widest text-text-primary/20">
                                {campaigns!.length} campagne{campaigns!.length > 1 ? 's' : ''}
                            </p>
                        )}
                        <div className="space-y-3">
                            {(campaigns || []).map(camp => (
                                <Link key={camp.id} href={`/admin/campagnes/${camp.id}`}>
                                    <Card variant="white" className="p-5 transition-all group active:scale-[0.98] hover:shadow-md cursor-pointer border border-[#131445]/5">
                                        {/* En-tête */}
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${camp.statut === 'BROUILLON'
                                                    ? 'bg-orange-100 text-orange-500'
                                                    : camp.statut === 'VALIDEE'
                                                        ? 'bg-green-100 text-green-600'
                                                        : 'bg-brand/10 text-brand'
                                                    }`}>
                                                    {camp.statut === 'BROUILLON'
                                                        ? <Loader2 size={18} className="animate-spin" />
                                                        : <History size={18} />
                                                    }
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h3 className="font-bold text-lg text-text-primary leading-tight">{camp.nom}</h3>
                                                        <Badge variant={getStatusVariant(camp.statut)} size="xs">
                                                            {getStatusLabel(camp.statut)}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-text-primary/30 text-[10px] font-black uppercase mt-0.5">
                                                        <Calendar size={10} />
                                                        {new Date(camp.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </div>
                                                </div>
                                            </div>
                                            <ChevronRight size={18} className="text-text-primary/20 group-hover:text-brand transition-colors mt-1 shrink-0" />
                                        </div>

                                        {/* Stats de synthèse (point 15) */}
                                        <div className="grid grid-cols-4 gap-2 pt-4 border-t border-text-primary/5">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black text-text-primary/20 uppercase tracking-widest mb-1">Poids max</span>
                                                <span className="text-text-primary font-bold text-sm">{camp.poidsMax}g</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black text-text-primary/20 uppercase tracking-widest mb-1">Boxes</span>
                                                <span className="text-text-primary font-bold text-base">{camp._count?.boxes ?? 0}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black text-text-primary/20 uppercase tracking-widest mb-1">Articles</span>
                                                <span className="text-text-primary font-bold text-sm tabular-nums">
                                                    {camp.totalArticlesConcernes ?? '—'}
                                                </span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-[9px] font-black uppercase tracking-widest mb-1 text-right text-brand/40">Score</span>
                                                {camp.statut === 'BROUILLON' ? (
                                                    <span className="text-orange-400 font-black text-sm flex items-center gap-1">
                                                        <Loader2 size={11} className="animate-spin" /> …
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-brand font-black text-lg tabular-nums">
                                                        {camp.totalScore !== null && camp.totalScore !== undefined ? (
                                                            <><Star size={11} className="text-amber-400 fill-amber-400" />{camp.totalScore}</>
                                                        ) : '—'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>

                        {!campaigns?.length && (
                            <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                                <ShieldCheck size={40} className="text-text-primary/10" />
                                <p className="text-text-primary/30 italic text-sm">Aucune campagne enregistrée</p>
                                <p className="text-text-primary/20 text-xs">Créez une session depuis l'onglet Composition</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
