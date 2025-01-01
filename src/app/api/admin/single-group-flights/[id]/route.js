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
  try {
    const { id } = params;
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

    const updatedFlight = await prisma.SingleGroupFlight.update({
      where: { id: parseInt(id, 10) },
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
        meal:meal ,
        updated_at: new Date(),
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

// DELETE: Delete a SingleGroupFlight by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    await prisma.SingleGroupFlight.delete({
      where: { id: parseInt(id, 10) },
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
