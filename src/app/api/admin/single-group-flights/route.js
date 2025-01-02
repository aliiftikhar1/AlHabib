import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

// POST: Create a new SingleGroupFlight or multiple flights for "two-way"
export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Payload is ", body);
    const { flights, flightgroup_id, flightsector_id, flightairline_id } = body;

    const createdFlights = await Promise.all(
      flights.map((flight) =>
        prisma.SingleGroupFlight.create({
          data: {
            flightgroup_id: parseInt(flight.flightgroup_id),
            flightsector_id: parseInt(flight.flightsector_id),
            flightairline_id: parseInt(flight.flightairline_id),
            flight_number: parseInt(flight.flight_number),
            flight_date: new Date(flight.flight_date),
            origin: flight.origin,
            destination: flight.destination,
            dept_time: new Date(flight.dept_time),
            arrival_time: new Date(flight.arrival_time),
            baggage: flight.baggage,
            seats: parseInt(flight.seats),
            fare: parseInt(flight.fare),
            created_at: new Date(),
            updated_at: new Date(),
            meal:flight.meal || false,
          },
        })
      )
    );

    return NextResponse.json(createdFlights);
  } catch (error) {
    console.error('Error creating single group flights:', error.message);
    return NextResponse.json(
      {
        message: 'Failed to create single group flights',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// PUT: Update a single group flight


// GET: Fetch all SingleGroupFlights with FlightGroups
export async function GET() {
  try {
    const flights = await prisma.SingleGroupFlight.findMany({
      include: {
        FlightGroups: true,
        FlightSector: true,
        FlightAirline: true,
      },
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

