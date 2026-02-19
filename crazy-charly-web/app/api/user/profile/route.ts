import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    try {
        const user = await prisma.utilisateur.findUnique({
            where: { email: session.user.email },
            select: {
                id: true,
                nom: true,
                prenom: true,
                email: true,
                role: true,
                trancheAgeEnfant: true,
                preferencesCategories: true,
            },
        });
        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { trancheAgeEnfant, preferencesCategories } = body;

        const updatedUser = await prisma.utilisateur.update({
            where: { email: session.user.email },
            data: {
                trancheAgeEnfant,
                preferencesCategories,
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
