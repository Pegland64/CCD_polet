import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    try {
        const boxes = await prisma.box.findMany({
            where: {
                utilisateur: { email: session.user.email }
            },
            include: {
                articles: true,
                campagne: {
                    select: {
                        nom: true,
                        statut: true,
                        createdAt: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(boxes);
    } catch (error) {
        console.error("Erreur récup boxes:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
