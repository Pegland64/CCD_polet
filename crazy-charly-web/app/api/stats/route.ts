import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const [totalArticles, totalAbonnes, articles, campaigns] = await Promise.all([
            prisma.article.count(),
            prisma.utilisateur.count({ where: { role: 'abonne' } }),
            prisma.article.findMany({ select: { categorie: true, etat: true, trancheAge: true } }),
            prisma.campagne.findMany({ select: { totalScore: true }, where: { statut: { in: ['COMPOSEE', 'VALIDEE'] } } }),
        ]);

        // Calculate score mean
        const validatedCampaigns = campaigns.filter((c: { totalScore: number | null }) => c.totalScore !== null);
        const scoreMoyen = validatedCampaigns.length > 0
            ? Math.round(validatedCampaigns.reduce((acc: number, c: { totalScore: number | null }) => acc + (c.totalScore || 0), 0) / validatedCampaigns.length)
            : 0;

        // Build stats by category
        const catCounts: Record<string, number> = {};
        articles.forEach((a: { categorie: string }) => { catCounts[a.categorie] = (catCounts[a.categorie] || 0) + 1; });

        const stockParCategorie = Object.keys(catCounts).map(id => ({
            id,
            count: catCounts[id],
            color: getColorForCat(id)
        }));

        // Repartition Etat
        const etatCounts: Record<string, number> = {};
        articles.forEach((a: { etat: string }) => { etatCounts[a.etat] = (etatCounts[a.etat] || 0) + 1; });
        const total = articles.length || 1;
        const repartitionEtat = [
            { id: "N", label: "Neuf", percentage: Math.round(((etatCounts["N"] || 0) / total) * 100), color: "bg-brand" },
            { id: "TB", label: "Très Bon", percentage: Math.round(((etatCounts["TB"] || 0) / total) * 100), color: "bg-brand/60" },
            { id: "B", label: "Bon", percentage: Math.round(((etatCounts["B"] || 0) / total) * 100), color: "bg-brand/20" }
        ];

        // Repartition Age
        const ageCounts: Record<string, number> = {};
        articles.forEach((a: { trancheAge: string }) => { ageCounts[a.trancheAge] = (ageCounts[a.trancheAge] || 0) + 1; });
        const repartitionAge = ["BB", "PE", "EN", "AD"].map(id => ({
            id,
            count: ageCounts[id] || 0
        }));

        return NextResponse.json({
            totalArticles,
            totalAbonnes,
            scoreMoyen,
            stockParCategorie,
            repartitionEtat,
            repartitionAge
        });
    } catch (error) {
        console.error("Stats API Error:", error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

function getColorForCat(cat: string) {
    const colors: Record<string, string> = {
        SOC: "bg-blue-400",
        FIG: "bg-pink-400",
        CON: "bg-orange-400",
        EXT: "bg-green-400",
        EVL: "bg-indigo-400",
        LIV: "bg-yellow-400"
    };
    return colors[cat] || "bg-gray-400";
}
