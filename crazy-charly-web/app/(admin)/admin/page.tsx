"use client";

import { CATEGORY_LABELS } from "@/lib/constants";
import {
    ShieldCheck,
    BarChart3,
    Boxes,
    PieChart,
    Sparkles,
    ArrowUpRight,
    Loader2
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { useApiData } from "@/hooks/useApiData";
import { DashboardStats } from "@/lib/types";

export default function AdminDashboardPage() {
    const { data: stats, isLoading } = useApiData<DashboardStats>({
        baseUrl: '/api/stats'
    });

    if (isLoading || !stats) return <DashboardLoading />;

    return (
        <div className="font-sans min-h-screen bg-bg-primary pb-32">
            <PageHeader title="Pilotage" subtitle="Indicateurs de performance" />

            <div className="px-5 pt-8 space-y-8">
                <div className="grid grid-cols-2 gap-4">
                    <Card variant="white" className="p-5">
                        <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand mb-3">
                            <Boxes size={20} />
                        </div>
                        <span className="text-[9px] font-black uppercase text-text-primary/30 tracking-widest block mb-1">Stock</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-black text-text-primary">{stats.totalArticles}</span>
                            <span className="text-[10px] font-bold text-brand">jouets</span>
                        </div>
                    </Card>
                    <Card variant="dark" className="p-5 overflow-hidden relative">
                        <div className="relative z-10 w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white mb-3">
                            <Sparkles size={20} />
                        </div>
                        <span className="relative z-10 text-[9px] font-black uppercase text-white/30 tracking-widest block mb-1">Qualité moyenne</span>
                        <div className="relative z-10 flex items-baseline gap-1">
                            <span className="text-3xl font-black text-white">{stats.scoreMoyen}%</span>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand/20 blur-3xl -mr-16 -mt-16" />
                    </Card>
                </div>

                <Card variant="white" className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <BarChart3 size={18} className="text-brand" />
                            <h3 className="font-bold text-sm text-text-primary">Volume par Catégorie</h3>
                        </div>
                        <ArrowUpRight size={16} className="text-text-primary/20" />
                    </div>

                    <div className="space-y-4">
                        {stats.stockParCategorie.map(cat => (
                            <div key={cat.id} className="space-y-1.5">
                                <div className="flex justify-between text-[10px] font-black uppercase">
                                    <span className="text-text-primary/60">{CATEGORY_LABELS[cat.id] || cat.id}</span>
                                    <span className="text-text-primary">{cat.count}</span>
                                </div>
                                <div className="h-1.5 w-full bg-text-primary/5 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${cat.color} rounded-full transition-all duration-1000`}
                                        style={{ width: `${(cat.count / Math.max(...stats.stockParCategorie.map(c => c.count))) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <div className="grid grid-cols-1 gap-6">
                    <Card variant="white" className="p-6 space-y-6">
                        <div className="flex items-center gap-2">
                            <PieChart size={18} className="text-brand" />
                            <h3 className="font-bold text-sm text-text-primary">Répartition de l'État</h3>
                        </div>
                        <div className="flex h-10 w-full rounded-2xl overflow-hidden border border-text-primary/5">
                            {stats.repartitionEtat.map(etat => (
                                <div
                                    key={etat.id}
                                    className={`${etat.color} h-full flex items-center justify-center text-[9px] font-black text-white/80 border-r border-white/10 last:border-none`}
                                    style={{ width: `${etat.percentage}%` }}
                                >
                                    {etat.percentage > 5 ? `${etat.percentage}%` : ''}
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card variant="white" className="p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <ShieldCheck size={18} className="text-brand" />
                            <h3 className="font-bold text-sm text-text-primary">Articles par Tranche d'Âge</h3>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {stats.repartitionAge.map(age => (
                                <div key={age.id} className="text-center group">
                                    <div className="aspect-[4/5] bg-text-primary/5 rounded-2xl flex flex-col items-center justify-center border border-white hover:bg-brand/5 transition-colors">
                                        <span className="text-lg font-black text-text-primary">{age.count}</span>
                                        <span className="text-[8px] font-bold text-brand uppercase">{age.id}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
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
