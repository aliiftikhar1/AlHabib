import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, location, price, roomtype, availability } = body;

    // Validate required fields
    if (!name || !description || !location || !price || !roomtype || !availability) {
      return NextResponse.json(
        { message: 'Missing required fields', status: false },
        { status: 400 }
      );
    }

    const newHotel = await prisma.hotel.create({
      data: {
        name,
        description, 
        location, 
        price : parseInt(price), 
        roomtype : parseInt(roomtype), 
        availability: (availability && availability==='true' ) ? true : false,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    return NextResponse.json(newHotel);
  } catch (error) {
    console.error('Error creating hotel:', error.message);
    return NextResponse.json(
      {
        message: 'Failed to create hotel',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// GET request to fetch all packages
export async function GET() {
  try {
    const hotel = await prisma.hotel.findMany();
    return NextResponse.json(hotel);
  } catch (error) {
    console.error('Error fetching hotel:', error.message);
    return NextResponse.json(
      {
        message: 'Failed to fetch Hotel',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
