import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/subscribers — Liste de tous les abonnés (admin)
export async function GET() {
  try {
    const abonnes = await prisma.abonne.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        trancheAgeEnfant: true,
        preferences: true,
        createdAt: true,
      },
    });

    return NextResponse.json(abonnes);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST /api/subscribers — Inscription d'un abonné
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nom, prenom, email, trancheAgeEnfant, preferences } = body;

    if (!nom || !prenom || !email || !trancheAgeEnfant || !preferences) {
      return NextResponse.json(
        { error: 'Champs manquants : nom, prenom, email, trancheAgeEnfant, preferences requis' },
        { status: 400 }
      );
    }

    // Vérifier si l'email existe déjà
    const existing = await prisma.abonne.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: 'Un abonné avec cet email existe déjà' },
        { status: 409 }
      );
    }

    // preferences est stocké comme chaîne CSV ex: "SOC,FIG,EVL,CON,LIV,EXT"
    const preferencesStr = Array.isArray(preferences)
      ? preferences.join(',')
      : String(preferences);

    const abonne = await prisma.abonne.create({
      data: { nom, prenom, email, trancheAgeEnfant, preferences: preferencesStr },
    });

    return NextResponse.json(abonne, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
