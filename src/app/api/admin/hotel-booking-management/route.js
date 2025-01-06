import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Payload is:', body);
    const { hotel_id, check_in_date, check_out, rooms, adults, childs, infants, passengers } = body;

    // Validate required fields
    if (!hotel_id || !check_in_date || !check_out || !rooms ) {
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
        infants: parseInt(infants),
        childs: parseInt(childs),
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    const passengerPromises = passengers.map((passenger) =>
      prisma.Hoteliers.create({
          data: {
              hotel_booking_id: newBooking.id,
              givenname: passenger.givenName,
              surname: passenger.surname,
              title: passenger.title,
              type: passenger.type || "Adult",
              passportid: passenger.passport,
              dob: passenger.dob,
              doe: passenger.doe,
          },
      })
  );

  await Promise.all(passengerPromises);

  return NextResponse.json(
    { message: "Hotel Booking and passengers added successfully." },
    { status: 201 }
);
    
  } catch (error) {
    
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
          Hoteliers: true,
          Users:true

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
