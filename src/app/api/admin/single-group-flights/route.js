import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

// POST: Create a new SingleGroupFlight
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      flightgroup_id,
      flightsector_id,
      flightairline_id,
      flight_number,
      flight_date,
      origin,
      destination,
      dept_time,
      arrival_time,
      baggage,
      seats,
      fare,
      meal,
    } = body;

    const newFlight = await prisma.SingleGroupFlight.create({
      data: {
        flightgroup_id:parseInt(flightgroup_id),
        flightsector_id:parseInt(flightsector_id),
        flightairline_id:parseInt(flightairline_id),
        flight_number: parseInt(flight_number),
        flight_date: new Date(flight_date) || new Date(),
        origin,
        destination,
        dept_time: new Date(dept_time)  || new Date(),
        arrival_time:  new Date(arrival_time)  || new Date(),
        baggage,
        seats:parseInt(seats),
        fare:parseInt(fare),
        meal:meal ? meal : false,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    return NextResponse.json(newFlight);
  } catch (error) {
    console.error('Error creating single group flight:', error.message);
    return NextResponse.json(
      {
        message: 'Failed to create single group flight',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// GET: Fetch all SingleGroupFlights
export async function GET() {
  try {
    const flights = await prisma.SingleGroupFlight.findMany({
      include:{
        FlightGroups:true
      }
    });
    return NextResponse.json(flights);
  } catch (error) {
    console.error('Error fetching single group flights:', error.message);
    return NextResponse.json(
      {
        message: 'Failed to fetch single group flights',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
