import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Subscriber } from '@/lib/types';

export async function GET() {
  try {
    const subscribers = await prisma.abonne.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(subscribers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Basic validation
    if (!data.email || !data.prenom || !data.nom) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const sub = await prisma.abonne.create({
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
    return NextResponse.json({ error: 'Failed to create subscriber' }, { status: 500 });
  }
}
