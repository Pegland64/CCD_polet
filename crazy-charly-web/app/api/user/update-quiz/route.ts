import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const session = await auth();

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    try {
        const { trancheAgeEnfant, preferencesCategories } = await req.json();

        const updatedUser = await prisma.utilisateur.update({
            where: { email: session.user.email },
            data: {
                trancheAgeEnfant,
                preferencesCategories,
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Erreur mise à jour utilisateur:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
