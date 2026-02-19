"use client";

import { useState } from "react";
import { History, Calendar, Loader2, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useApiData } from "@/hooks/useApiData";
import { Campaign } from "@/lib/types";

export default function CampagnesPage() {
    const { data: campaigns, isLoading } = useApiData<Campaign[]>({
        baseUrl: '/api/campaigns'
    });

    const getStatusVariant = (status: string) => {
        if (status === "VALIDEE") return "success";
        if (status === "COMPOSEE") return "brand";
        return "neutral";
    };

    return (
        <div className="font-sans min-h-screen bg-bg-primary pb-32">
            <PageHeader title="Historique" subtitle="Campagnes enregistrées" />

            <div className="px-5 pt-8 space-y-4">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 size={32} className="text-brand animate-spin" />
                        <p className="text-text-primary/40 font-bold uppercase tracking-widest text-[10px]">Chargement...</p>
                    </div>
                ) : (
                    <>
                        {(campaigns || []).map(camp => (
                            <Card key={camp.id} variant="white" className="p-5 transition-all group active:scale-[0.98] cursor-pointer">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
                                            <History size={18} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-lg text-text-primary leading-tight">{camp.nom}</h3>
                                                <Badge variant={getStatusVariant(camp.statut)} size="xs">{camp.statut}</Badge>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-text-primary/30 text-[10px] font-black uppercase mt-0.5">
                                                <Calendar size={10} />
                                                {new Date(camp.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-text-primary/5">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-text-primary/20 uppercase tracking-widest mb-1">Capacité Max</span>
                                        <span className="text-text-primary font-bold text-sm tracking-tight">{camp.poidsMax}g</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-text-primary/20 uppercase tracking-widest mb-1">Total Boxes</span>
                                        <span className="text-text-primary font-bold text-base">{camp._count?.boxes || 0}</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[9px] font-black uppercase tracking-widest mb-1 text-right text-brand/50">Score Global</span>
                                        <span className="text-brand font-black text-lg">{camp.totalScore !== null ? `${camp.totalScore}%` : '--'}</span>
                                    </div>
                                </div>
                            </Card>
                        ))}

                        {!campaigns?.length && (
                            <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                                <ShieldCheck size={40} className="text-text-primary/10" />
                                <p className="text-text-primary/30 italic text-sm">Aucune campagne enregistrée</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
