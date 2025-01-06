import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
    const { id } = params;

    try {
        const { bookingid, status } = await request.json();
        console.log("Booking ID and status:", bookingid, status);

        // Find the hotel booking with related data
        const booking = await prisma.hotelBooking.findUnique({
            where: { id: parseInt(id, 10) },
            include: {
                Hotel: true,
                Users: true,
            },
        });

        if (!booking) {
            return NextResponse.json(
                { message: "Booking not found", status: false },
                { status: 404 }
            );
        }

        // Update the booking status
        const updatedData = await prisma.hotelBooking.update({
            where: { id: parseInt(id, 10) },
            data: { status },
        });

        if (updatedData) {
            // Retrieve the user related to the booking
            const user = await prisma.users.findUnique({
                where: { id: booking.agent_id },
            });

            if (!user) {
                return NextResponse.json(
                    { message: "User not found", status: false },
                    { status: 404 }
                );
            }

            if (user.balance < booking.Hotel?.price) {
                console.log("Insufficient balance");
                return NextResponse.json(
                    { message: "Insufficient balance", status: false },
                    { status: 400 }
                );
            } else {
                // Deduct amount from user's balance
                const newBalance = user.balance - booking.Hotel?.price;

                await prisma.users.update({
                    where: { id: booking.agent_id },
                    data: { balance: Math.max(newBalance, 0) },
                });

                console.log("Ledger entry creation", booking.agent_id, booking.Hotel?.price);

                // Create a new ledger record
                await prisma.NewLedger.create({
                    data: {
                        agent_id: booking.agent_id,
                        amount_in: 0,
                        amount_out: booking.Hotel?.price,
                        balance: Math.max(newBalance, 0),
                        description: "Hotel Booking is completed",
                        type: "hotel-booking",
                        hotel_booking_id: booking.id,
                    },
                });

                return NextResponse.json(
                    { message: "Successfully updated", status: true },
                    { status: 200 }
                );
            }
        }
    } catch (error) {
        console.error("Error occurred while updating data:", error);
        return NextResponse.json(
            { message: "Error occurred", error: error.message },
            { status: 500 }
        );
    }
}
