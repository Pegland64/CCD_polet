import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PATCH /api/campaigns/[id]/status — Met à jour le statut d'une campagne (ex: VALIDEE)
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { statut } = body;

        if (!statut) {
            return NextResponse.json({ error: 'Statut requis' }, { status: 400 });
        }

        const campagne = await prisma.campagne.findUnique({
            where: { id },
            include: { boxes: { include: { articles: true } } }
        });

        if (!campagne) {
            return NextResponse.json({ error: 'Campagne introuvable' }, { status: 404 });
        }

        // Si on valide la campagne, on doit marquer les articles comme VALIDE
        if (statut === 'VALIDEE' && campagne.statut !== 'VALIDEE') {
            const articleIds = campagne.boxes.flatMap(box => box.articles.map(a => a.id));

            await prisma.$transaction([
                prisma.article.updateMany({
                    where: { id: { in: articleIds } },
                    data: { statut: 'VALIDE' }
                }),
                prisma.campagne.update({
                    where: { id },
                    data: { statut: 'VALIDEE' }
                })
            ]);
        } else {
            await prisma.campagne.update({
                where: { id },
                data: { statut }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
