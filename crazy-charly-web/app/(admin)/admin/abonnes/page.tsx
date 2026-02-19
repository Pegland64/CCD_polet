"use client";

import { useState } from "react";
import { Users, Search, ChevronLeft, ChevronRight, ListOrdered, Loader2, UserX, Plus } from "lucide-react";
import { TRANCHES_AGE, CATEGORY_LABELS } from "@/lib/constants";
import { PageHeader } from "@/components/ui/PageHeader";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SubscriberForm } from "@/components/SubscriberForm";
import { useApiData } from "@/hooks/useApiData";
import { Subscriber } from "@/lib/types";

export default function AbonnesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 8;

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingSubscriber, setEditingSubscriber] = useState<Subscriber | null>(null);

    const { data: subscribers, isLoading, refresh } = useApiData<Subscriber[]>({
        baseUrl: '/api/subscribers'
    });

    const filtered = (subscribers || []).filter(sub =>
        `${sub.prenom} ${sub.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.preferences.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const displayed = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const openForm = (sub: Subscriber | null = null) => {
        setEditingSubscriber(sub);
        setIsFormOpen(true);
    };

    return (
        <div className="font-sans min-h-screen bg-bg-primary pb-20">
            <PageHeader
                title="Abonnés"
                subtitle="Inscrits CCD 2026"
                badge={`${subscribers?.length || 0} total`}
                actions={
                    <Button variant="primary" size="sm" onClick={() => openForm()} icon={<Plus size={18} />}>
                        Nouveau
                    </Button>
                }
            >
                <Input
                    placeholder="Rechercher..."
                    icon={<Search size={18} />}
                    value={searchTerm}
                    className="!h-11 rounded-xl font-bold"
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                />
            </PageHeader>

            <div className="px-5 pt-6 space-y-3">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 size={32} className="text-brand animate-spin" />
                        <p className="text-text-primary/40 font-bold uppercase tracking-widest text-[10px]">Chargement...</p>
                    </div>
                ) : (
                    <>
                        {displayed.map((sub) => {
                            const prefs = sub.preferences.split(',').map(p => p.trim());
                            return (
                                <Card key={sub.id} variant="white" onClick={() => openForm(sub)} className="p-5 space-y-4 active:scale-[0.98] transition-all cursor-pointer hover:shadow-md">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center text-brand shrink-0">
                                            <Users size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-1">
                                                <h3 className="font-bold text-lg text-text-primary truncate tracking-tight">{sub.prenom} {sub.nom}</h3>
                                                <span className="text-brand text-[9px] font-black whitespace-nowrap px-2 py-0.5 bg-brand/5 rounded-full">
                                                    {TRANCHES_AGE.find(a => a.id === sub.trancheAgeEnfant)?.label || sub.trancheAgeEnfant}
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-text-primary/40 font-bold uppercase tracking-wider">{sub.email}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2 pt-3 border-t border-text-primary/5">
                                        <div className="flex items-center gap-2 mb-2">
                                            <ListOrdered size={12} className="text-brand" />
                                            <span className="text-[9px] font-black uppercase text-brand tracking-widest">Préférences prioritaires</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {prefs.map((pref, idx) => (
                                                <div key={pref} className={`px-2 py-1 rounded-md border text-[9px] font-bold flex items-center gap-1.5 ${idx < 3 ? 'bg-brand/5 border-brand/20 text-brand' : 'bg-bg-primary/50 border-text-primary/5 text-text-primary/40'}`}>
                                                    <span className="opacity-40">{idx + 1}.</span>
                                                    {CATEGORY_LABELS[pref] || pref}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}

                        {!filtered.length && (
                            <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                                <UserX size={40} className="text-text-primary/10" />
                                <p className="text-text-primary/30 italic text-sm">Aucun abonné correspondant</p>
                            </div>
                        )}

                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-4 py-4">
                                <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="w-10 h-10 rounded-xl bg-white/50 border border-white/60 disabled:opacity-20 flex items-center justify-center shadow-sm">
                                    <ChevronLeft size={20} />
                                </button>
                                <span className="text-[10px] font-black text-text-primary/40 uppercase tracking-widest tabular-nums">{currentPage} / {totalPages}</span>
                                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="w-10 h-10 rounded-xl bg-white/50 border border-white/60 disabled:opacity-20 flex items-center justify-center shadow-sm">
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {isFormOpen && (
                <SubscriberForm
                    subscriber={editingSubscriber}
                    onSuccess={() => refresh()}
                    onClose={() => setIsFormOpen(false)}
                />
            )}
        </div>
    );
}
