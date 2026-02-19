"use client";

import { useState } from "react";
import { CATEGORIES, TRANCHES_AGE, ETATS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Article } from "@/lib/types";
import { fetcher } from "@/lib/api";

interface ArticleFormProps {
    article?: Article | null;
    onSuccess: () => void;
    onClose: () => void;
}

export function ArticleForm({ article, onSuccess, onClose }: ArticleFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        designation: article?.designation || "",
        categorie: article?.categorie || CATEGORIES[0].id,
        trancheAge: article?.trancheAge || TRANCHES_AGE[0].id,
        etat: article?.etat || ETATS[0].id,
        prix: article?.prix?.toString() || "",
        poids: article?.poids?.toString() || ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const payload = {
                ...formData,
                prix: parseInt(formData.prix) || 0,
                poids: parseInt(formData.poids) || 0
            };

            const url = article ? `/api/articles/${article.id}` : '/api/articles';
            await fetcher(url, {
                method: article ? 'PATCH' : 'POST',
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
        if (!article || !confirm("Supprimer cet article ?")) return;
        setIsLoading(true);
        try {
            await fetcher(`/api/articles/${article.id}`, { method: 'DELETE' });
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
            <Card variant="white" className="relative w-full max-w-lg rounded-t-[2.5rem] shadow-2xl p-8 animate-in slide-in-from-bottom duration-300">
                <div className="w-10 h-1 bg-text-primary/10 rounded-full mx-auto mb-6" />
                <h3 className="font-bold text-2xl mb-6">{article ? 'Modifier' : 'Nouvel'} Article</h3>
                <form onSubmit={handleSubmit} className="space-y-4 pb-6">
                    <Input label="Nom du jouet" required value={formData.designation} onChange={e => setFormData({ ...formData, designation: e.target.value })} />

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase text-brand tracking-widest ml-1 opacity-70">Catégorie</label>
                            <select className="w-full h-12 px-4 rounded-xl bg-text-primary/5 border-none font-bold outline-none text-xs" value={formData.categorie} onChange={e => setFormData({ ...formData, categorie: e.target.value })}>
                                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase text-brand tracking-widest ml-1 opacity-70">Âge</label>
                            <select className="w-full h-12 px-4 rounded-xl bg-text-primary/5 border-none font-bold outline-none text-xs" value={formData.trancheAge} onChange={e => setFormData({ ...formData, trancheAge: e.target.value })}>
                                {TRANCHES_AGE.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <Input label="Prix emporté" type="number" required value={formData.prix} onChange={e => setFormData({ ...formData, prix: e.target.value })} />
                        <Input label="Poids (g)" type="number" required value={formData.poids} onChange={e => setFormData({ ...formData, poids: e.target.value })} />
                        <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase text-brand tracking-widest ml-1 opacity-70">État</label>
                            <select className="w-full h-12 px-4 rounded-xl bg-text-primary/5 border-none font-bold outline-none" value={formData.etat} onChange={e => setFormData({ ...formData, etat: e.target.value })}>
                                {ETATS.map(e => <option key={e.id} value={e.id}>{e.label}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                        {article && (
                            <Button type="button" variant="ghost" size="lg" disabled={isLoading} className="flex-1 !text-danger hover:!bg-danger/5" onClick={handleDelete}>
                                Supprimer
                            </Button>
                        )}
                        <Button type="submit" variant="primary" size="lg" disabled={isLoading} className={article ? "flex-[2]" : "w-full"}>
                            {article ? 'Mettre à jour' : 'Ajouter au Stock'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
