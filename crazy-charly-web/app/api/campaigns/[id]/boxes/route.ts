import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/campaigns/[id]/boxes — Affichage des box composées (point 11)
// Retourne toutes les boxes avec leurs articles, scores, poids/prix total
// et inclut le statut de chaque article pour détecter les boxes déjà validées
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const campagne = await prisma.campagne.findUnique({
      where: { id },
    });

    if (!campagne) {
      return NextResponse.json({ error: 'Campagne introuvable' }, { status: 404 });
    }

    const boxes = await prisma.box.findMany({
      where: { campagneId: id },
      include: {
        utilisateur: {
          select: { id: true, nom: true, prenom: true, email: true, trancheAgeEnfant: true },
        },
        articles: {
          select: {
            id: true,
            designation: true,
            categorie: true,
            trancheAge: true,
            etat: true,
            prix: true,
            poids: true,
            statut: true,   // ← nécessaire pour détecter si la box est déjà validée (point 12)
          },
        },
      },
      orderBy: { score: 'desc' }, // trié par score décroissant (meilleur en premier)
    });

    return NextResponse.json({
      campagne: {
        id: campagne.id,
        nom: campagne.nom,
        poidsMax: campagne.poidsMax,
        statut: campagne.statut,
        totalScore: campagne.totalScore,
      },
      boxes,
    });
  } catch (error) {
    console.error('GET /api/campaigns/[id]/boxes', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
