import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PATCH /api/boxes/[id] — Valider une box individuelle (admin, point 12)
// Une fois validée : la campagne passe en VALIDEE et les articles en VALIDE
export async function PATCH(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const box = await prisma.box.findUnique({
            where: { id },
            include: {
                articles: { select: { id: true } },
                campagne: { select: { id: true, statut: true, nom: true } },
            },
        });

        if (!box) {
            return NextResponse.json({ error: 'Box introuvable' }, { status: 404 });
        }

        if (box.campagne.statut === 'BROUILLON') {
            return NextResponse.json(
                { error: 'La campagne doit être en statut COMPOSEE pour valider les boxes' },
                { status: 409 }
            );
        }

        // Marquer les articles de la box comme VALIDE (retrait du stock disponible)
        if (box.articles.length > 0) {
            await prisma.article.updateMany({
                where: { id: { in: box.articles.map(a => a.id) } },
                data: { statut: 'VALIDE' },
            });
        }

        // Vérifier si toutes les boxes de la campagne sont maintenant validées
        //   Si oui, passer la campagne en VALIDEE
        const allBoxes = await prisma.box.findMany({
            where: { campagneId: box.campagneId },
            include: { articles: { select: { id: true, statut: true } } },
        });

        const allArticlesValide = allBoxes.every(b =>
            b.articles.every(a => a.statut === 'VALIDE')
        );

        if (allArticlesValide) {
            await prisma.campagne.update({
                where: { id: box.campagneId },
                data: { statut: 'VALIDEE' },
            });
        }

        return NextResponse.json({
            message: `Box validée — ${box.articles.length} article(s) marqué(s) VALIDE`,
            allValidated: allArticlesValide,
        });
    } catch (error) {
        console.error('PATCH /api/boxes/[id]', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// GET /api/boxes/[id] — Détail d'une box
export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const box = await prisma.box.findUnique({
            where: { id },
            include: {
                utilisateur: {
                    select: { id: true, nom: true, prenom: true, email: true, trancheAgeEnfant: true },
                },
                articles: {
                    select: {
                        id: true, designation: true, categorie: true,
                        trancheAge: true, etat: true, prix: true, poids: true, statut: true,
                    },
                },
                campagne: {
                    select: { id: true, nom: true, poidsMax: true, statut: true },
                },
            },
        });

        if (!box) {
            return NextResponse.json({ error: 'Box introuvable' }, { status: 404 });
        }

        return NextResponse.json(box);
    } catch (error) {
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
