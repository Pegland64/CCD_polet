import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const data = await req.json();

        const sub = await prisma.abonne.update({
            where: { id },
            data: {
                prenom: data.prenom,
                nom: data.nom,
                email: data.email,
                trancheAgeEnfant: data.trancheAgeEnfant,
                preferences: data.preferences
            }
        });

        return NextResponse.json(sub);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update subscriber' }, { status: 500 });
    }
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.abonne.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete subscriber' }, { status: 500 });
    }
}
