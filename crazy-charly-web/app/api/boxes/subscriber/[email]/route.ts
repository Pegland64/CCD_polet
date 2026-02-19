import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/boxes/subscriber/[email] — Consultation de la box VALIDÉE d'un abonné
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    const { email: rawEmail } = await params;
    const email = decodeURIComponent(rawEmail);

    const utilisateur = await prisma.utilisateur.findUnique({
      where: { email },
    });

    if (!utilisateur) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
    }

    // Seules les boxes des campagnes VALIDÉES sont visibles
    const boxes = await prisma.box.findMany({
      where: {
        utilisateurId: utilisateur.id,
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
      utilisateur: {
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
        trancheAgeEnfant: utilisateur.trancheAgeEnfant,
      },
      boxes,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
