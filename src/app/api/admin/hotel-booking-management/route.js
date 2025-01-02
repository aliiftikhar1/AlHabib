import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Payload is:', body);
    const { hotel_id, check_in_date, check_out, rooms, adults, childs } = body;

    // Validate required fields
    if (!hotel_id || !check_in_date || !check_out || !rooms || !adults || !childs) {
      return NextResponse.json(
        { message: 'Missing required fields', status: false },
        { status: 400 }
      );
    }

    const newBooking = await prisma.HotelBooking.create({
      data: {
        hotel_id: parseInt(hotel_id),
        check_in_date: new Date(check_in_date),
        check_out : new Date(check_out),
        rooms: parseInt(rooms),
        adults: parseInt(adults),
        childs: parseInt(childs),
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    return NextResponse.json(newBooking);
  } catch (error) {
    console.error('Error creating hotel booking:', error.message);
    return NextResponse.json(
      {
        message: 'Failed to create hotel booking',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// GET request to fetch all hotel bookings
export async function GET() {
  try {
    const hotelBookings = await prisma.HotelBooking.findMany(
      {
        include: {
          Hotel: true,
        },
      }
    );
    return NextResponse.json(hotelBookings);
  } catch (error) {
    console.error('Error fetching hotel bookings:', error.message);
    return NextResponse.json(
      {
        message: 'Failed to fetch hotel bookings',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
