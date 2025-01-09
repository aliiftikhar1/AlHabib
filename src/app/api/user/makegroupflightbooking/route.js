import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const data = await request.json();

        console.log("Data received", data);

        // Destructure the expected fields
        const {
            flight_id,
            flightgroup_id,
            flightsector_id,
            flightairline_id,
            agent_id,
            agentRemarks,
            adults,
            children,
            infants,
            passengers,
        } = data;

        // Define required fields and check for missing ones
        const requiredFields = {
            flightgroup_id,
            flightsector_id,
            flightairline_id,
            flight_id,
            agent_id,
            agentRemarks,
            passengers,
        };

        const missingFields = Object.entries(requiredFields)
            .filter(([key, value]) => !value || (Array.isArray(value) && value.length === 0))
            .map(([key]) => key);

        if (missingFields.length > 0) {
            console.error("Missing fields:", missingFields.join(", "));
            return NextResponse.json(
                { message: `Invalid data. Missing fields: ${missingFields.join(", ")}` },
                { status: 400 }
            );
        }

        // Ensure flight_id contains fare information
        if (!flight_id || typeof flight_id.fare !== "number") {
            console.error("Invalid flight_id or fare is not a number");
            return NextResponse.json(
                { message: "Invalid flight data. Fare information is missing or incorrect." },
                { status: 400 }
            );
        }

        const flight = await prisma.singleGroupFlight.findUnique({
            where:{
                id:parseInt(flight_id)
            }
        })
        // Calculate total price
        const totalPrice = flight.fare * (adults + children + infants);

        // Create a FlightBooking record
        const newBooking = await prisma.GroupFlightBookings.create({
            data: {
                flightgroup_id: parseInt(flightgroup_id),
                flightsector_id: parseInt(flightsector_id),
                flightairline_id: parseInt(flightairline_id),
                flight_id: parseInt(flight_id),
                agent_id: parseInt(agent_id),
                children: children || 0,
                adults: adults || 0,
                price: totalPrice,
                infants: infants || 0,
                status: "Pending",
                remarks: agentRemarks || "",
            },
        });

        console.log("Booking created successfully:", newBooking);

        // Create Passengers linked to the new booking
        const passengerPromises = passengers.map((passenger) =>
            prisma.GroupPassengers.create({
                data: {
                    groupbooking_id: newBooking.id,
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
            { message: "Booking and passengers added successfully." },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error saving booking or passengers:", error);

        return NextResponse.json(
            { message: "An error occurred while saving the data.", error: error.message },
            { status: 500 }
        );
    }
}
