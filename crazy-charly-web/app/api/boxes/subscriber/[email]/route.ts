import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/boxes/subscriber/[email] — Consultation de la box VALIDÉE d'un abonné
export async function GET(
  _req: NextRequest,
  { params }: { params: { email: string } }
) {
  try {
    const email = decodeURIComponent(params.email);

    const abonne = await prisma.abonne.findUnique({
      where: { email },
    });

    if (!abonne) {
      return NextResponse.json({ error: 'Abonné introuvable' }, { status: 404 });
    }

    // Seules les boxes des campagnes VALIDÉES sont visibles
    const boxes = await prisma.box.findMany({
      where: {
        abonneId: abonne.id,
        campagne: { statut: 'VALIDEE' },
      },
      include: {
        campagne: {
          select: { id: true, nom: true, createdAt: true },
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
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      abonne: {
        nom: abonne.nom,
        prenom: abonne.prenom,
        email: abonne.email,
        trancheAgeEnfant: abonne.trancheAgeEnfant,
      },
      boxes,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
