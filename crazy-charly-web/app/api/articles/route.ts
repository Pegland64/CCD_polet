import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const PAGE_SIZE = 10;

// GET /api/articles — Catalogue des articles disponibles (paginé, 10/page)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where: { statut: 'DISPONIBLE' },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.article.count({ where: { statut: 'DISPONIBLE' } }),
    ]);

    return NextResponse.json({
      data: articles,
      pagination: {
        page,
        pageSize: PAGE_SIZE,
        total,
        totalPages: Math.ceil(total / PAGE_SIZE),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST /api/articles — Ajout d'un article (admin)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { designation, categorie, trancheAge, etat, prix, poids } = body;

    if (!designation || !categorie || !trancheAge || !etat || prix == null || poids == null) {
      return NextResponse.json(
        { error: 'Champs manquants : designation, categorie, trancheAge, etat, prix, poids requis' },
        { status: 400 }
      );
    }

    const article = await prisma.article.create({
      data: { designation, categorie, trancheAge, etat, prix: Number(prix), poids: Number(poids) },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
