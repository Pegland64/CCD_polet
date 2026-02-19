"use client";

import { useState } from "react";
import ArticleCard from "@/components/ArticleCard";
import { ArticleForm } from "@/components/ArticleForm";
import { Plus, ChevronLeft, ChevronRight, Search, Filter, RotateCcw, BoxSelect, Loader2 } from "lucide-react";
import { CATEGORIES, TRANCHES_AGE, ETATS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { useApiData } from "@/hooks/useApiData";
import { Article, Pagination } from "@/lib/types";

export default function CataloguePage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [filterAge, setFilterAge] = useState("");
    const [filterEtat, setFilterEtat] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState<Article | null>(null);

    const { data: result, isLoading, refresh } = useApiData<{ data: Article[], pagination: Pagination }>({
        baseUrl: '/api/articles',
        params: { page: currentPage }
    });

    const articles = result?.data || [];
    const pagination = result?.pagination;

    const filteredArticles = articles.filter(a => {
        const matchesSearch = a.designation.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !filterCategory || a.categorie === filterCategory;
        const matchesAge = !filterAge || a.trancheAge === filterAge;
        const matchesEtat = !filterEtat || a.etat === filterEtat;
        return matchesSearch && matchesCategory && matchesAge && matchesEtat;
    });

    const openForm = (article: Article | null = null) => {
        setEditingArticle(article);
        setIsFormOpen(true);
    };

    const resetFilters = () => {
        setFilterCategory("");
        setFilterAge("");
        setFilterEtat("");
        setSearchTerm("");
    };

    return (
        <div className="font-sans min-h-screen bg-bg-primary pb-20">
            <PageHeader
                title="Stock"
                subtitle="Catalogue des jouets"
                actions={
                    <Button variant="primary" size="sm" onClick={() => openForm()} icon={<Plus size={18} />}>
                        Ajouter
                    </Button>
                }
            >
                <div className="flex gap-2">
                    <Input
                        placeholder="Rechercher un jouet..."
                        icon={<Search size={18} />}
                        value={searchTerm}
                        className="!h-11 rounded-xl font-bold"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button
                        variant={showFilters ? "primary" : "white"}
                        className="!w-11 !h-11 !px-0 rounded-xl"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter size={20} />
                    </Button>
                </div>

                {showFilters && (
                    <Card variant="glass" className="!p-4 grid grid-cols-2 gap-3 mt-4 animate-in fade-in slide-in-from-top-4 duration-300">
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="h-10 px-3 rounded-xl bg-text-primary/5 text-xs font-bold outline-none border-none"
                        >
                            <option value="">Toutes catégories</option>
                            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                        </select>
                        <select
                            value={filterAge}
                            onChange={(e) => setFilterAge(e.target.value)}
                            className="h-10 px-3 rounded-xl bg-text-primary/5 text-xs font-bold outline-none border-none"
                        >
                            <option value="">Tous les âges</option>
                            {TRANCHES_AGE.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
                        </select>
                        <select
                            value={filterEtat}
                            onChange={(e) => setFilterEtat(e.target.value)}
                            className="h-10 px-3 rounded-xl bg-text-primary/5 text-xs font-bold outline-none border-none"
                        >
                            <option value="">Tous les états</option>
                            {ETATS.map(e => <option key={e.id} value={e.id}>{e.label}</option>)}
                        </select>
                        <Button variant="ghost" size="sm" className="h-10 rounded-xl" onClick={resetFilters}>
                            <RotateCcw size={14} className="mr-1" /> Reset
                        </Button>
                    </Card>
                )}
            </PageHeader>

            <div className="px-5 pt-6 space-y-6">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 size={32} className="text-brand animate-spin" />
                        <p className="text-text-primary/40 font-bold uppercase tracking-widest text-[10px]">Chargement...</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {filteredArticles.map(article => (
                                <div key={article.id} onClick={() => openForm(article)}>
                                    <ArticleCard {...article} />
                                </div>
                            ))}
                        </div>

                        {!filteredArticles.length && (
                            <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                                <BoxSelect size={40} className="text-text-primary/10" />
                                <p className="text-text-primary/30 italic text-sm">Aucun article trouvé</p>
                            </div>
                        )}

                        {pagination && pagination.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-4 py-4">
                                <Button variant="secondary" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>
                                    <ChevronLeft size={16} />
                                </Button>
                                <span className="text-[10px] font-black text-text-primary/40 uppercase tracking-widest tabular-nums">
                                    {currentPage} / {pagination.totalPages}
                                </span>
                                <Button variant="secondary" size="sm" disabled={currentPage === pagination.totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>
                                    <ChevronRight size={16} />
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {isFormOpen && (
                <ArticleForm
                    article={editingArticle}
                    onSuccess={() => refresh()}
                    onClose={() => setIsFormOpen(false)}
                />
            )}
        </div>
    );
}
