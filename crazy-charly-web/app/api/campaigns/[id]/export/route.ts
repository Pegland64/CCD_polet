import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/campaigns/[id]/export — Export CSV de la composition d'une campagne
// Format : score;prenom_abonne;id_article1;id_article2;...
export async function GET(
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

        const boxes = await prisma.box.findMany({
            where: { campagneId: id },
            include: {
                utilisateur: {
                    select: { prenom: true, nom: true, email: true },
                },
                articles: {
                    select: { id: true, designation: true, categorie: true, trancheAge: true, etat: true, prix: true, poids: true },
                },
            },
            orderBy: { score: 'desc' },
        });

        if (boxes.length === 0) {
            return NextResponse.json({ error: 'Aucune box composée pour cette campagne' }, { status: 404 });
        }

        // Format CSV : score;prenom;id_article1;id_article2;...
        const lignes: string[] = [];

        // En-tête
        lignes.push(`# Export campagne : ${campagne.nom}`);
        lignes.push(`# Score global : ${campagne.totalScore ?? 'N/A'}`);
        lignes.push(`# Poids max par box : ${campagne.poidsMax}g`);
        lignes.push(`# Nombre de boxes : ${boxes.length}`);
        lignes.push('');
        lignes.push('score;prenom_abonne;articles');

        for (const box of boxes) {
            const prenom = box.utilisateur.prenom ?? box.utilisateur.email;
            const articleIds = box.articles.map(a => a.id).join(';');
            lignes.push(`${box.score};${prenom};${articleIds}`);
        }

        const csvContent = lignes.join('\n');
        const filename = `campagne-${campagne.nom.replace(/\s+/g, '_')}-${id.slice(0, 8)}.csv`;

        return new NextResponse(csvContent, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        });
    } catch (error) {
        console.error('GET /api/campaigns/[id]/export', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
