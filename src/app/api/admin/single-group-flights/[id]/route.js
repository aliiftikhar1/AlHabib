import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

// GET: Fetch a SingleGroupFlight by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const flight = await prisma.SingleGroupFlight.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!flight) {
      return NextResponse.json(
        { message: 'Single group flight not found', status: false },
        { status: 404 }
      );
    }

    return NextResponse.json(flight);
  } catch (error) {
    console.error('Error fetching single group flight:', error.message);
    return NextResponse.json(
      {
        message: 'Failed to fetch single group flight',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// PUT: Update a SingleGroupFlight by ID
export async function PUT(request, { params }) {
  const { id } = params;

  try {
    const flight = await request.json();
    console.log('id:', id);
    console.log('body:', flight);
   

    const updatedFlight = await prisma.SingleGroupFlight.update({
      where: { id: parseInt(id) },
      data: {
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
            meal:flight.meal ,
      },
    });

    return NextResponse.json(updatedFlight);
  } catch (error) {
    console.error('Error updating single group flight:', error.message);
    return NextResponse.json(
      {
        message: 'Failed to update single group flight',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE: Delete a single group flight
export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    await prisma.SingleGroupFlight.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({
      message: 'Single group flight deleted successfully',
      status: true,
    });
  } catch (error) {
    console.error('Error deleting single group flight:', error.message);
    return NextResponse.json(
      {
        message: 'Failed to delete single group flight',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}