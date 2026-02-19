import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Subscriber } from '@/lib/types';

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

    // Map for frontend compatibility
    const mapped = utilisateurs.map(u => ({
      ...u,
      preferences: u.preferencesCategories || ""
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
  }
}

// POST /api/subscribers — Inscription d'un utilisateur
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { authProviderId, nom, prenom, email, trancheAgeEnfant, preferencesCategories, preferences } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Le champ email est requis' },
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

    // On accepte 'preferences' (du formulaire admin) ou 'preferencesCategories'
    const rawPrefs = preferences || preferencesCategories;
    const preferencesStr = rawPrefs
      ? Array.isArray(rawPrefs)
        ? rawPrefs.join(',')
        : String(rawPrefs)
      : "";

    const utilisateur = await prisma.utilisateur.create({
      data: {
        authProviderId: authProviderId || `manual_${Date.now()}`,
        nom,
        prenom,
        email,
        trancheAgeEnfant,
        preferencesCategories: preferencesStr
      },
    });

    return NextResponse.json(utilisateur, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create subscriber' }, { status: 500 });
  }
}
