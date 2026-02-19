import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/campaigns/[id]/boxes — Affichage des box composées d'une campagne (admin)
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const campagne = await prisma.campagne.findUnique({
      where: { id: params.id },
    });

    if (!campagne) {
      return NextResponse.json({ error: 'Campagne introuvable' }, { status: 404 });
    }

    const boxes = await prisma.box.findMany({
      where: { campagneId: params.id },
      include: {
        abonne: {
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
          },
        },
      },
      orderBy: { createdAt: 'asc' },
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
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
