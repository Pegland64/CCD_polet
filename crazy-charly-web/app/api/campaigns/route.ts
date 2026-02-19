import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/campaigns — Liste de toutes les campagnes (admin)
export async function GET() {
  try {
    const campagnes = await prisma.campagne.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { boxes: true } },
      },
    });

    return NextResponse.json(campagnes);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST /api/campaigns — Paramétrage d'une nouvelle campagne (admin)
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

    const campagne = await prisma.campagne.create({
      data: { nom, poidsMax: Number(poidsMax) },
    });

    return NextResponse.json(campagne, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
