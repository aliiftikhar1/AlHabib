import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

export async function PUT(request, { params }) {
  const {id} = await params;
  try {
    const body = await request.json();
    console.log("Payload is:", body);

    const { name, description, location, price, roomtype, availability } = body;
    // Validate required fields
    if (!name || !description || !location || !price || !roomtype || !availability) {
      return NextResponse.json(
        { message: 'Missing required fields', status: false },
        { status: 400 }
      );
    }


    // Construct the data object conditionally
    const updateData = {
      name,
      description,
      location,
      price: parseInt(price),
      roomtype: parseInt(roomtype),
      availability: (availability && availability === 'true') ? true : false,
      updated_at: new Date(),
    };

    // Update the package in the database
    const updatedhotel = await prisma.hotel.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    return NextResponse.json(updatedhotel);
  } catch (error) {
    console.error('Error updating hotel:', error.message);
    return NextResponse.json(
      {
        message: 'Failed to update hotel',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// GET request to fetch all hotel
export async function GET() {
  try {
    const hotel = await prisma.hotel.findMany();
    return NextResponse.json(hotel);
  } catch (error) {
    console.error('Error fetching hotel:', error.message);
    return NextResponse.json(
      {
        message: 'Failed to fetch hotel',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    // Check if the package exists
    const existinghotel= await prisma.hotel.findUnique({
      where: { id: parseInt(id, 10) }, // Ensure id is an integer
    });

    if (!existinghotel) {
      return NextResponse.json(
        {
          message: 'hotel not found',
          status: false,
        },
        { status: 404 }
      );
    }

    // Delete the package
    await prisma.hotel.delete({
      where: { id: parseInt(id, 10) },
    });

    return NextResponse.json(
      {
        message: 'hotel deleted successfully',
        status: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting hotel:', error.message);
    return NextResponse.json(
      {
        message: 'Failed to delete hotel',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}