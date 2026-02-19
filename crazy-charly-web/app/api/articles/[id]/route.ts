import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PATCH /api/articles/[id] — Mettre à jour un article
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { designation, categorie, trancheAge, etat, prix, poids, statut } = body;

        const article = await prisma.article.update({
            where: { id },
            data: {
                designation,
                categorie,
                trancheAge,
                etat,
                prix: prix != null ? Number(prix) : undefined,
                poids: poids != null ? Number(poids) : undefined,
                statut,
            },
        });

        return NextResponse.json(article);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// DELETE /api/articles/[id] — Supprimer un article
export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // On vérifie d'abord si l'article est utilisé dans une box
        const article = await prisma.article.findUnique({
            where: { id },
            select: { boxId: true }
        });

        if (article?.boxId) {
            return NextResponse.json({ error: "L'article ne peut pas être supprimé car il est lié à une box" }, { status: 400 });
        }

        await prisma.article.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
