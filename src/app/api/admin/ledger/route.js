import prisma from '@/utils/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
   
    const ledgerEntries = await prisma.ledger.findMany({
      include: {
        Users: true,
      },
    });
    return NextResponse.json(ledgerEntries);
  } catch (error) {
    console.error('Error fetching ledger entries:', error);
    return NextResponse.json({
      message: 'Failed to fetch ledger entries',
      status: false,
      error: error.message,
    }, { status: 500 });
  }
}
