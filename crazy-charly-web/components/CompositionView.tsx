"use client";

import { useState, useEffect } from "react";
import { Weight, Info, ArrowRight, ShieldCheck, AlertCircle, CheckCircle, Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { fetcher } from "@/lib/api";

export default function CompositionView() {
    const [isLoading, setIsLoading] = useState(false);
    const [campaignName, setCampaignName] = useState(`Session ${new Date().toLocaleDateString('fr-FR')}`);
    const [wMax, setWMax] = useState("2000");
    const [currentCampaignId, setCurrentCampaignId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [subscriberCount, setSubscriberCount] = useState<number | null>(null);

    useEffect(() => {
        // Fetch subscriber count to display recap
        fetcher<{ totalAbonnes: number }>('/api/stats').then(stats => {
            setSubscriberCount(stats.totalAbonnes);
        }).catch(err => console.error(err));
    }, []);

    const handleCreateCampaign = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const campaign = await fetcher<any>('/api/campaigns', {
                method: 'POST',
                body: JSON.stringify({ nom: campaignName, poidsMax: parseInt(wMax) })
            });
            setCurrentCampaignId(campaign.id);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (currentCampaignId) {
        return (
            <div className="space-y-6 animate-in fade-in duration-500 text-center py-10">
                <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center text-success mx-auto mb-4 shadow-xl shadow-success/10 border border-success/20">
                    <CheckCircle size={48} strokeWidth={2.5} />
                </div>
                <h2 className="text-3xl font-bold text-text-primary">Campagne Enregistrée !</h2>
                <p className="text-text-primary/60 max-w-md mx-auto">
                    La campagne a été créée avec succès en base de données. Elle est maintenant prête pour l'étape d'optimisation externe.
                </p>
                <div className="pt-6">
                    <Button variant="primary" size="xl" onClick={() => window.location.href = '/admin/campagnes'} className="shadow-lg shadow-brand/20">
                        Voir l'historique
                    </Button>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setCurrentCampaignId(null)} className="mt-4">
                    Créer une nouvelle session
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            {error && (
                <div className="p-4 rounded-2xl bg-danger/10 border border-danger/20 flex items-center gap-3 text-danger text-xs font-bold">
                    <AlertCircle size={18} /> {error}
                </div>
            )}

                <Card variant="white" className="p-6 flex flex-col justify-center items-center text-center space-y-2">
                    <div className="w-12 h-12 bg-text-primary/5 rounded-full flex items-center justify-center text-text-primary/40 mb-2">
                        <Users size={24} />
                    </div>
                    <span className="text-4xl font-black text-text-primary tabular-nums">
                        {subscriberCount !== null ? subscriberCount : '--'}
                    </span>
                    <p className="text-xs font-bold text-text-primary/40 uppercase tracking-widest">Abonnés concernés</p>
                </Card>

                <Card variant="glass" className="p-6 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center text-brand">
                            <Weight size={20} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase text-brand tracking-[0.2em] mb-0.5">Contraintes</p>
                            <h3 className="font-bold text-lg">Limite de Poids</h3>
                        </div>
                    </div>
                    <div className="relative">
                        <Input
                            type="number"
                            value={wMax}
                            onChange={e => setWMax(e.target.value)}
                            className="h-24 text-center text-5xl font-black !bg-text-primary/5 pr-12 tabular-nums"
                        />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-text-primary/20 font-black text-2xl">g</span>
                    </div>
                </Card>

            <div className="pt-4">
                <Button
                    variant="primary"
                    size="xl"
                    onClick={handleCreateCampaign}
                    disabled={isLoading}
                    className="w-full shadow-xl shadow-brand/20"
                    icon={isLoading ? <Loader2 className="animate-spin" /> : <ArrowRight size={20} />}
                >
                    {isLoading ? "Enregistrement..." : "Créer la Session"}
                </Button>
            </div>
        </div>
    );
}

function Loader2({ className, ...props }: any) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`animate-spin ${className}`}
            {...props}
        >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    )
}
