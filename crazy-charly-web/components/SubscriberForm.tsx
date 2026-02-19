"use client";

import { useState } from "react";
import { CATEGORIES, TRANCHES_AGE, CATEGORY_LABELS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Subscriber } from "@/lib/types";
import { fetcher } from "@/lib/api";
import { GripVertical, X } from "lucide-react";

interface SubscriberFormProps {
    subscriber?: Subscriber | null;
    onSuccess: () => void;
    onClose: () => void;
}

export function SubscriberForm({ subscriber, onSuccess, onClose }: SubscriberFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        prenom: subscriber?.prenom || "",
        nom: subscriber?.nom || "",
        email: subscriber?.email || "",
        trancheAgeEnfant: subscriber?.trancheAgeEnfant || TRANCHES_AGE[1].id, // Default to PE
        preferences: subscriber ? subscriber.preferences.split(',') : CATEGORIES.map(c => c.id)
    });

    const movePref = (index: number, direction: 'up' | 'down') => {
        const newPrefs = [...formData.preferences];
        if (direction === 'up' && index > 0) {
            [newPrefs[index], newPrefs[index - 1]] = [newPrefs[index - 1], newPrefs[index]];
        } else if (direction === 'down' && index < newPrefs.length - 1) {
            [newPrefs[index], newPrefs[index + 1]] = [newPrefs[index + 1], newPrefs[index]];
        }
        setFormData({ ...formData, preferences: newPrefs });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const payload = {
                ...formData,
                preferences: formData.preferences.join(',')
            };

            const url = subscriber ? `/api/subscribers/${subscriber.id}` : '/api/subscribers';
            await fetcher(url, {
                method: subscriber ? 'PATCH' : 'POST',
                body: JSON.stringify(payload)
            });

            onSuccess();
            onClose();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!subscriber || !confirm("Supprimer cet abonné ?")) return;
        setIsLoading(true);
        try {
            await fetcher(`/api/subscribers/${subscriber.id}`, { method: 'DELETE' });
            onSuccess();
            onClose();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4">
            <div className="fixed inset-0 bg-text-primary/50 backdrop-blur-sm" onClick={onClose} />
            <Card variant="white" className="relative w-full max-w-lg rounded-t-[2.5rem] shadow-2xl p-8 animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto">
                <div className="w-10 h-1 bg-text-primary/10 rounded-full mx-auto mb-6 shrink-0" />
                <h3 className="font-bold text-2xl mb-6">{subscriber ? 'Modifier' : 'Nouveau'} Abonné</h3>

                <form onSubmit={handleSubmit} className="space-y-4 pb-6">
                    <div className="grid grid-cols-2 gap-3">
                        <Input label="Prénom" required value={formData.prenom} onChange={e => setFormData({ ...formData, prenom: e.target.value })} />
                        <Input label="Nom" required value={formData.nom} onChange={e => setFormData({ ...formData, nom: e.target.value })} />
                    </div>

                    <Input label="Email" type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />

                    <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-brand tracking-widest ml-1 opacity-70">Tranche d'âge Enfant</label>
                        <select
                            className="w-full h-12 px-4 rounded-xl bg-text-primary/5 border-none font-bold outline-none"
                            value={formData.trancheAgeEnfant}
                            onChange={e => setFormData({ ...formData, trancheAgeEnfant: e.target.value })}
                        >
                            {TRANCHES_AGE.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
                        </select>
                    </div>

                    <div className="pt-2">
                        <label className="text-[9px] font-black uppercase text-brand tracking-widest ml-1 opacity-70 mb-2 block">
                            Ordre de Préférence (1er au 6ème)
                        </label>
                        <div className="space-y-2">
                            {formData.preferences.map((p, idx) => (
                                <div key={p} className="flex items-center gap-3 p-3 rounded-xl bg-bg-primary border border-text-primary/5">
                                    <div className="text-[10px] font-black text-brand bg-brand/10 w-6 h-6 rounded flex items-center justify-center">
                                        {idx + 1}
                                    </div>
                                    <span className="flex-1 font-bold text-sm text-text-primary">
                                        {CATEGORY_LABELS[p] || p}
                                    </span>
                                    <div className="flex gap-1">
                                        <button
                                            type="button"
                                            disabled={idx === 0}
                                            onClick={() => movePref(idx, 'up')}
                                            className="w-8 h-8 rounded-lg bg-text-primary/5 hover:bg-brand/10 hover:text-brand flex items-center justify-center disabled:opacity-20"
                                        >
                                            ▲
                                        </button>
                                        <button
                                            type="button"
                                            disabled={idx === formData.preferences.length - 1}
                                            onClick={() => movePref(idx, 'down')}
                                            className="w-8 h-8 rounded-lg bg-text-primary/5 hover:bg-brand/10 hover:text-brand flex items-center justify-center disabled:opacity-20"
                                        >
                                            ▼
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                        {subscriber && (
                            <Button type="button" variant="ghost" size="lg" disabled={isLoading} className="flex-1 !text-danger hover:!bg-danger/5" onClick={handleDelete}>
                                Supprimer
                            </Button>
                        )}
                        <Button type="submit" variant="primary" size="lg" disabled={isLoading} className={subscriber ? "flex-[2]" : "w-full"}>
                            {subscriber ? 'Mettre à jour' : 'Inscrire'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
