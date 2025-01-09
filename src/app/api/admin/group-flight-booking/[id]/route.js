import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

export async function PUT(request,{params}) {
  const {id} = params;
  try {
    const body = await request.json();
    const { status , image } = body;

    if(status === 'Rejected'){
      const newBooking = await prisma.GroupFlightBookings.update({
        where:{id: parseInt(id)},
        data: {
          status,
          updated_at: new Date(),
        },
      });
  
      return NextResponse.json(newBooking);

    }

    console.log("Payload is ", body);

    // Fetch user's balance
    

    const booking = await prisma.GroupFlightBookings.findUnique({
      where: { id: parseInt(id) },
      include: { SingleGroupFlight: true },
    });

    // Check if user exists and balance is sufficient
    if (!booking) {
      return NextResponse.json(
        { message: 'Booking not found', status: false },
        { status: 404 }
      );
    }

    const user = await prisma.users.findUnique({
      where: { id: booking.agent_id },
    
    });

    // Check if user exists and balance is sufficient
    if (!user) {
      return NextResponse.json(
        { message: 'User not found', status: false },
        { status: 404 }
      );
    }
    if (user.balance < booking.price) {
        console.log("insufficient balance")
      return NextResponse.json(
        { message: 'Insufficient balance', status: false },
        { status: 400 }
      );
    }else{
      const newamount = user.balance - booking.price;
      const update = await prisma.users.update({
        where: { id: booking.agent_id },
        data:{
          balance: newamount>0 ? newamount : 0
        }
      });
      console.log("ledger is going to create",booking.agent_id,booking.price)

      const newrecord = await prisma.NewLedger.create({
        data: {
          agent_id: parseInt(booking.agent_id), // Correct user ID
          amount_in: parseFloat(0),
          amount_out: parseFloat(booking.price),
          balance: parseFloat(newamount>0 ? newamount : 0),
          description: 'Group Flight Booking is happened',
          type: 'group-flight-booking',
          flight_group_booking_id: parseInt(booking.id),
        },
      }).catch(error => {
        console.error("Error creating ledger record:", error);
        throw new Error("Failed to create ledger record");
      });

      if(newrecord){
        const notification = await prisma.Notifications.create({
          data: {
            user_id: parseInt(booking.agent_id), // Correct user ID
            message: "Your Group Flight booking has been approved",
            status: "sent"
          },
        }).catch(error => {
          console.error("Error creating ledger record:", error);
          throw new Error("Failed to create ledger record");
        });

        const newBooking = await prisma.GroupFlightBookings.update({
          where:{id: parseInt(id)},
          data: {
            status,
            attachment:image,
            updated_at: new Date(),
          },
        });
    
        return NextResponse.json(newBooking);
      }
    }

   
    
    
  } catch (error) {
    console.error('Error creating booking:', error.message);
    return NextResponse.json(
      {
        message: 'Failed to create booking',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// GET request to fetch all bookings
export async function GET(request,{params}) {
    const {id} = parseInt(params);
    console.log("id",id);
  try {
    const bookings = await prisma.ticketBookings.findMany({where:{
        user_id: id
    } }); // Corrected typo in `ticketBookings`
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error.message);
    return NextResponse.json(
      {
        message: 'Failed to fetch bookings',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request,{params}) {
  const {id} = params;
  console.log("id",id);
try {
  const bookings = await prisma.ticketBookings.delete({where:{
      booking_id: parseInt(id)
  } }); // Corrected typo in `ticketBookings`
  return NextResponse.json(bookings);
} catch (error) {
  console.error('Error delete bookings:', error.message);
  return NextResponse.json(
    {
      message: 'Failed to delete bookings',
      status: false,
      error: error.message,
    },
    { status: 500 }
  );
}
}
