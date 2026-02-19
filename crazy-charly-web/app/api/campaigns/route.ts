import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/campaigns — Liste de toutes les campagnes avec données de synthèse (point 15)
export async function GET() {
  try {
    const campagnes = await prisma.campagne.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { boxes: true } },
        boxes: {
          select: {
            score: true,
            articles: {
              select: { id: true, statut: true },
            },
          },
        },
      },
    });

    // Calculer les données de synthèse pour chaque campagne (point 15)
    const campagnesAvecStats = campagnes.map(camp => {
      const totalArticlesDistribues = camp.boxes.reduce(
        (sum, box) => sum + box.articles.filter(a => a.statut === 'VALIDE').length,
        0
      );
      // Pour COMPOSEE, on compte tous les articles (pas encore VALIDE)
      const totalArticlesConcernes = camp.boxes.reduce(
        (sum, box) => sum + box.articles.length,
        0
      );
      const scoreMoyen = camp.boxes.length > 0
        ? Math.round(camp.boxes.reduce((sum, b) => sum + b.score, 0) / camp.boxes.length)
        : null;

      return {
        id: camp.id,
        nom: camp.nom,
        createdAt: camp.createdAt,
        poidsMax: camp.poidsMax,
        statut: camp.statut,
        totalScore: camp.totalScore,
        _count: camp._count,
        // Données de synthèse pour l'historique global
        totalArticlesConcernes,
        totalArticlesDistribues,
        scoreMoyen,
      };
    });

    return NextResponse.json(campagnesAvecStats);
  } catch (error) {
    console.error('GET /api/campaigns', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST /api/campaigns — Paramétrage d'une nouvelle campagne (point 9)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nom, poidsMax } = body;

    if (!nom || poidsMax == null) {
      return NextResponse.json(
        { error: 'Champs manquants : nom et poidsMax (en grammes) requis' },
        { status: 400 }
      );
    }

    if (Number(poidsMax) <= 0) {
      return NextResponse.json(
        { error: 'poidsMax doit être un entier positif (en grammes)' },
        { status: 400 }
      );
    }

    // Vérifier qu'il n'y a pas déjà une campagne BROUILLON en cours
    const campagneEnCours = await prisma.campagne.findFirst({
      where: { statut: 'BROUILLON' },
    });

    if (campagneEnCours) {
      return NextResponse.json(
        { error: `Une composition est déjà en cours (campagne "${campagneEnCours.nom}"). Attendez qu'elle soit terminée.` },
        { status: 409 }
      );
    }

    // Création de la campagne en statut BROUILLON
    //   l'algorithme d'optimisation la détecte automatiquement dans les 10 secondes
    const campagne = await prisma.campagne.create({
      data: { nom, poidsMax: Number(poidsMax) },
    });

    return NextResponse.json(campagne, { status: 201 });
  } catch (error) {
    console.error('POST /api/campaigns', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
