import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/subscribers — Liste de tous les utilisateurs (admin)
export async function GET() {
  try {
    const utilisateurs = await prisma.utilisateur.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        role: true,
        trancheAgeEnfant: true,
        preferencesCategories: true,
        createdAt: true,
      },
    });

    return NextResponse.json(utilisateurs);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST /api/subscribers — Inscription d'un utilisateur
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { authProviderId, nom, prenom, email, trancheAgeEnfant, preferencesCategories } = body;

    if (!authProviderId || !email) {
      return NextResponse.json(
        { error: 'Champs manquants : authProviderId et email sont requis' },
        { status: 400 }
      );
    }

    // Vérifier si l'email existe déjà
    const existing = await prisma.utilisateur.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: 'Un utilisateur avec cet email existe déjà' },
        { status: 409 }
      );
    }

    // preferencesCategories est stocké comme chaîne CSV ex: "SOC,FIG,EVL,CON,LIV,EXT"
    const preferencesStr = preferencesCategories
      ? Array.isArray(preferencesCategories)
        ? preferencesCategories.join(',')
        : String(preferencesCategories)
      : undefined;

    const utilisateur = await prisma.utilisateur.create({
      data: { authProviderId, nom, prenom, email, trancheAgeEnfant, preferencesCategories: preferencesStr },
    });

    return NextResponse.json(utilisateur, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
