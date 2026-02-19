import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Génère le CSV au format attendu par le service d'optimisation
function genererCSV(
  articles: { id: string; designation: string; categorie: string; trancheAge: string; etat: string; prix: number; poids: number }[],
  utilisateurs: { id: string; prenom: string | null; trancheAgeEnfant: string | null; preferencesCategories: string | null }[],
  poidsMax: number
): string {
  const lignes: string[] = [];

  // Section articles
  lignes.push('articles');
  for (const a of articles) {
    lignes.push(`${a.id};${a.designation};${a.categorie};${a.trancheAge};${a.etat};${a.prix};${a.poids}`);
  }

  lignes.push('');

  // Section abonnes
  lignes.push('abonnes');
  for (const s of utilisateurs) {
    // preferencesCategories est stocké "SOC,FIG,EVL,CON,LIV,EXT" — on garde tel quel
    lignes.push(`${s.id};${s.prenom};${s.trancheAgeEnfant};${s.preferencesCategories}`);
  }

  lignes.push('');

  // Section parametres
  lignes.push('parametres');
  lignes.push(String(poidsMax));

  return lignes.join('\n');
}

// POST /api/campaigns/[id]/compose — Génère le CSV et l'envoie au service d'optimisation
export async function POST(
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

    if (campagne.statut !== 'BROUILLON') {
      return NextResponse.json(
        { error: 'La composition ne peut être lancée que sur une campagne en statut BROUILLON' },
        { status: 409 }
      );
    }

    // Récupérer les articles DISPONIBLES et les utilisateurs
    const [articles, utilisateurs] = await Promise.all([
      prisma.article.findMany({
        where: { statut: 'DISPONIBLE' },
        select: { id: true, designation: true, categorie: true, trancheAge: true, etat: true, prix: true, poids: true },
      }),
      prisma.utilisateur.findMany({
        select: { id: true, prenom: true, trancheAgeEnfant: true, preferencesCategories: true },
      }),
    ]);

    // Générer le CSV au format attendu par l'algorithme d'optimisation
    const csv = genererCSV(articles, utilisateurs, campagne.poidsMax);

    // TODO: envoyer le CSV au service d'optimisation
    // const optimisationUrl = process.env.OPTIMISATION_URL ?? 'http://localhost:8000/optimize';
    // const result = await fetch(optimisationUrl, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'text/plain' },
    //   body: csv,
    // });
    // const composition = await result.text(); // CSV de retour avec les box

    // Retourner le CSV généré (en attendant le service d'optimisation)
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="campagne-${id}.csv"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
