import { CATEGORY_LABELS } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

import { Article } from "@/lib/types";

type ArticleCardProps = Pick<Article, "designation" | "categorie" | "trancheAge" | "etat" | "poids" | "prix">;

export default function ArticleCard({
    designation,
    categorie,
    trancheAge,
    prix,
}: ArticleCardProps) {
    const categoryImages: Record<string, string> = {
        "SOC": "https://images.unsplash.com/photo-1610890716171-6b1bb71ff1d7?w=200&h=200&fit=crop",
        "FIG": "https://images.unsplash.com/photo-1558229828-568ebec279fc?w=200&h=200&fit=crop",
        "CON": "https://images.unsplash.com/photo-1560343060-c140a58e9206?w=200&h=200&fit=crop",
        "EXT": "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=200&h=200&fit=crop",
        "EVL": "https://images.unsplash.com/photo-1559440666-ac333ba8575a?w=200&h=200&fit=crop",
        "LIV": "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=200&h=200&fit=crop",
    };

    const imageUrl = categoryImages[categorie] || "https://images.unsplash.com/photo-1531746790731-6c087fecd05a?w=200&h=200&fit=crop";

    return (
        <Card variant="glass" className="p-3 flex gap-4 items-center transition-all active-scale cursor-pointer">
            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/60 shadow-inner">
                <img
                    src={imageUrl}
                    alt={designation}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-text-primary text-base leading-tight truncate pr-2">
                        {designation}
                    </h3>
                    <span className="text-brand font-bold text-xs shrink-0">{prix}€</span>
                </div>

                <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                    <Badge variant="brand">{CATEGORY_LABELS[categorie] || categorie}</Badge>
                    <Badge variant="neutral">{trancheAge}</Badge>
                </div>
            </div>
        </Card>
    );
}
