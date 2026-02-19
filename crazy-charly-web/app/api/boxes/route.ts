import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { campagneId, boxes } = body;

        if (!campagneId || !boxes || !Array.isArray(boxes)) {
            return NextResponse.json({ error: 'Format invalide' }, { status: 400 });
        }

        console.log(`Received ${boxes.length} boxes for campaign ${campagneId}`);

        const createdBoxes = [];

        // Use a transaction if possible, but prisma.$transaction is synchronous in scope
        // We'll just loop and create for now. Note: for large batches, createMany isn't great for relations unless we map IDs.
        // Box creation involves connecting usage.

        for (const boxData of boxes) {
            const { utilisateurId, articleIds, score, prixTotal, poidsTotal } = boxData;

            // Skip invalid data
            if (!utilisateurId || !Array.isArray(articleIds)) continue;

            const box = await prisma.box.create({
                data: {
                    campagneId,
                    utilisateurId,
                    score: Math.round(score), // Ensure integer
                    prixTotal: Math.round(prixTotal),
                    poidsTotal: Math.round(poidsTotal),
                    articles: {
                        connect: articleIds.map((id: string) => ({ id }))
                    }
                }
            });

            // Update article statuses to 'VALIDE' (Assuming they are now assigned)
            // Or should we use 'EN_ATTENTE'? The schema has 'statut'. Let's use VALIDE if the box is created.
            if (articleIds.length > 0) {
                await prisma.article.updateMany({
                    where: { id: { in: articleIds } },
                    data: {
                        statut: 'VALIDE',
                        boxId: box.id
                    }
                });
            }

            createdBoxes.push(box);
        }

        // Update campaign status to COMPOSEE if not already
        await prisma.campagne.update({
            where: { id: campagneId },
            data: {
                statut: 'COMPOSEE',
                totalScore: createdBoxes.reduce((acc, b) => acc + b.score, 0)
            }
        });

        return NextResponse.json({ success: true, count: createdBoxes.length });

    } catch (error) {
        console.error("Error creating boxes:", error);
        return NextResponse.json({ error: 'Internal Server Error', details: String(error) }, { status: 500 });
    }
}
