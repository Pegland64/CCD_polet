"use client";

import Link from "next/link";
import { CATEGORY_LABELS } from "@/lib/constants";
import { motion } from "framer-motion";
import {
    ShieldCheck,
    BarChart3,
    Boxes,
    PieChart,
    Sparkles,
    ArrowUpRight,
    Loader2,
    Users,
    History,
    ChevronRight,
    Star
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { useApiData } from "@/hooks/useApiData";
import { DashboardStats, Campaign } from "@/lib/types";

export default function AdminDashboardPage() {
    const { data: stats, isLoading } = useApiData<DashboardStats>({
        baseUrl: '/api/stats'
    });
    const { data: campaigns } = useApiData<Campaign[]>({
        baseUrl: '/api/campaigns',
    });

    if (isLoading || !stats) return <DashboardLoading />;

    return (
        <div className="font-sans min-h-screen bg-bg-primary pb-32">
            <PageHeader title="Pilotage" subtitle="Indicateurs de performance" />

            <div className="px-5 md:px-10 pt-8 space-y-8 pb-10">
                {/* --- TOP STATS --- */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    <Card variant="white" className="p-5 md:p-6 shadow-sm border border-[#131445]/5">
                        <span className="text-[9px] font-black uppercase text-text-primary/30 tracking-widest block mb-1">Stock Total</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl md:text-4xl font-black text-text-primary">{stats.totalArticles}</span>
                            <span className="text-[10px] font-bold text-text-primary">jouets</span>
                        </div>
                    </Card>

                    <Card variant="white" className="p-5 md:p-6 shadow-sm border border-[#131445]/5">
                        <span className="text-[9px] font-black uppercase text-text-primary/30 tracking-widest block mb-1">Inscrits</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl md:text-4xl font-black text-text-primary">{stats.totalAbonnes}</span>
                            <span className="text-[10px] font-bold text-text-primary">parents</span>
                        </div>
                    </Card>

                    <Card variant="dark" className="p-5 md:p-6 overflow-hidden relative shadow-xl shadow-brand/10">
                        <span className="relative z-10 text-[9px] font-black uppercase text-white/30 tracking-widest block mb-1">Qualité moyenne</span>
                        <div className="relative z-10 flex items-baseline gap-1">
                            <span className="text-3xl md:text-4xl font-black text-white">{stats.scoreMoyen}</span>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand/20 blur-3xl -mr-16 -mt-16" />
                    </Card>

                </div>

                {/* --- MAIN DASHBOARD GRID --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    {/* Volume per Category */}
                    <Card variant="white" className="p-6 md:p-8 space-y-8 shadow-sm border border-[#131445]/5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div>
                                    <p className="text-[9px] font-black uppercase text-brand tracking-[0.2em] mb-0.5">Distribution</p>
                                    <h3 className="font-bold text-lg text-text-primary">Indemnité de Stock</h3>
                                </div>
                            </div>
                            <ArrowUpRight size={18} className="text-text-primary/20" />
                        </div>

                        <div className="space-y-6">
                            {stats.stockParCategorie.map(cat => (
                                <div key={cat.id} className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[11px] font-black uppercase text-text-primary/60 tracking-wider">
                                            {CATEGORY_LABELS[cat.id] || cat.id}
                                        </span>
                                        <span className="text-sm font-black text-text-primary">{cat.count}</span>
                                    </div>
                                    <div className="h-2 w-full bg-text-primary/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(cat.count / Math.max(...stats.stockParCategorie.map(c => c.count))) * 100}%` }}
                                            className={`h-full ${cat.color} rounded-full transition-all duration-1000`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <div className="space-y-6 md:space-y-8">
                        {/* State Repartition */}
                        <Card variant="white" className="p-6 md:p-8 space-y-6 shadow-sm border border-[#131445]/5">
                            <div className="flex items-center gap-3">
                                <div>
                                    <p className="text-[9px] font-black uppercase text-text-primary tracking-[0.2em] mb-0.5">État Initial</p>
                                    <h3 className="font-bold text-lg text-text-primary">Répartition de l'État</h3>
                                </div>
                            </div>
                            <div className="flex h-12 w-full rounded-2xl overflow-hidden border border-text-primary/5 shadow-inner">
                                {stats.repartitionEtat.map(etat => (
                                    <div
                                        key={etat.id}
                                        className={`${etat.color} h-full flex items-center justify-center text-[10px] font-black text-white/90 border-r border-white/5 last:border-none transition-all hover:brightness-110`}
                                        style={{ width: `${etat.percentage}%` }}
                                        title={`${etat.label}: ${etat.percentage}%`}
                                    >
                                        {etat.percentage > 8 ? `${etat.percentage}%` : ''}
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-center gap-6 pt-2">
                                {stats.repartitionEtat.map(etat => (
                                    <div key={etat.id} className="flex items-center gap-2">
                                        <div className={`w-2.5 h-2.5 rounded-full ${etat.color}`} />
                                        <span className="text-[10px] font-bold text-text-primary/40 uppercase">{etat.label}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Age Groups */}
                        <Card variant="white" className="p-6 md:p-8 shadow-sm border border-[#131445]/5">
                            <div className="flex items-center gap-3 mb-8">
                                <div>
                                    <p className="text-[9px] font-black uppercase text-indigo-500 tracking-[0.2em] mb-0.5">Ciblage</p>
                                    <h3 className="font-bold text-lg text-text-primary">Articles par Tranche d'Âge</h3>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 gap-3 md:gap-4">
                                {stats.repartitionAge.map(age => (
                                    <div key={age.id} className="text-center group">
                                        <div className="aspect-[3/4] bg-text-primary/[0.02] rounded-3xl flex flex-col items-center justify-center border border-transparent group-hover:border-brand/20 group-hover:bg-brand/5 transition-all duration-300">
                                            <span className="text-2xl md:text-3xl font-black text-text-primary mb-1">{age.count}</span>
                                            <span className="text-[9px] font-black text-brand uppercase tracking-widest">{age.id}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>

                {/* --- HISTORIQUE GLOBAL --- */}
                {campaigns && campaigns.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <History size={16} className="text-brand" />
                                <h3 className="font-bold text-text-primary">Historique des Campagnes</h3>
                            </div>
                            <Link href="/admin/campagnes" className="text-xs font-bold text-brand hover:underline flex items-center gap-1">
                                Tout voir <ChevronRight size={12} />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {campaigns.slice(0, 3).map(camp => (
                                <Link key={camp.id} href={`/admin/campagnes/${camp.id}`}>
                                    <Card variant="white" className="p-5 hover:shadow-md transition-all cursor-pointer group active:scale-[0.98] border border-[#131445]/5">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${camp.statut === 'VALIDEE' ? 'bg-green-100 text-green-600' :
                                                    camp.statut === 'COMPOSEE' ? 'bg-brand/10 text-brand' :
                                                        'bg-orange-100 text-orange-500'
                                                }`}>
                                                {camp.statut === 'BROUILLON'
                                                    ? <Loader2 size={14} className="animate-spin" />
                                                    : <History size={14} />}
                                            </div>
                                            <ChevronRight size={14} className="text-text-primary/20 group-hover:text-brand transition-colors" />
                                        </div>
                                        <p className="font-bold text-text-primary text-sm truncate mb-1">{camp.nom}</p>
                                        <p className="text-[10px] text-text-primary/30 font-bold">
                                            {new Date(camp.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-text-primary/5">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-text-primary/20">{camp._count?.boxes ?? 0} boxes</span>
                                            {camp.totalScore !== null ? (
                                                <span className="flex items-center gap-1 text-xs font-black text-brand">
                                                    <Star size={10} className="fill-amber-400 text-amber-400" />
                                                    {camp.totalScore}
                                                </span>
                                            ) : (
                                                <span className="text-[9px] font-bold text-orange-400">En cours…</span>
                                            )}
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function DashboardLoading() {
    return (
        <div className="font-sans min-h-screen bg-bg-primary">
            <PageHeader title="Pilotage" subtitle="Données d'analyse" />
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <Loader2 size={32} className="text-brand animate-spin" />
                <p className="text-text-primary/40 font-bold uppercase tracking-widest text-[10px]">Chargement des indicateurs...</p>
            </div>
        </div>
    );
}
