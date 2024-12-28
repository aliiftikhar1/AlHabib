'use client'

import { useEffect, useState } from "react"
import { useParams } from "next/navigation";
import { format } from 'date-fns';
import { Table, TableBody, TableHeader, TableCell, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
export default function BookingForm() {
    const params = useParams()
    const { id } = params;
    const [flightdata, setFlightdata] = useState('')
    async function fetchflight() {
        const response = await fetch(`/api/admin/fetchflights/${id}`);
        const result = await response.json();
        setFlightdata(result.data);
    }
    useEffect(() => {
        fetchflight();
    }, [id])
    return (
        <div className="flex flex-col bg-[#f1f6f9] w-full h-full rounded">
            <div className="flex flex-col m-2">
                <div><h1 className="text-3xl text-left font-bold ">New Booking</h1></div>
                <div className="p-4 border rounded-lg bg-white mt-4">
                    <div className="w-full"><h2 className="text-xl pb-2 font-[600]">Flight Information</h2></div>
                    <div>
                        <Table>
                            <TableHeader className="bg-blue-400 text-white">
                                <TableRow>
                                    <TableCell>Airline</TableCell>
                                    <TableCell>Airline SN</TableCell>
                                    <TableCell>Meal</TableCell>
                                    <TableCell>Type</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>{flightdata.airline}</TableCell>
                                    <TableCell>{flightdata.airline_sn}</TableCell>
                                    <TableCell>{flightdata.meal ? "Yes" : "No"}</TableCell>
                                    <TableCell>{flightdata.type}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <Table>
                            <TableHeader className="bg-blue-400 text-white ">
                                <TableRow>
                                    <TableCell>Flight No.</TableCell>
                                    <TableCell>Flight Date</TableCell>
                                    <TableCell>Origin</TableCell>
                                    <TableCell>Destination</TableCell>
                                    <TableCell>Departure</TableCell>
                                    <TableCell>Arrival</TableCell>
                                    <TableCell>Baggage</TableCell>
                                    <TableCell>Seats</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {flightdata.SingleFlight?.map((flight, index) => {
                                    return (
                                        <TableRow key={index}>
                                            <TableCell>{flight.flight_number}</TableCell>
                                            <TableCell>{format(new Date(flight.flight_date), 'MMMM do yyyy')}</TableCell>
                                            <TableCell>{flight.origin}</TableCell>
                                            <TableCell>{flight.destination}</TableCell>
                                            <TableCell>{format(new Date(flight.dept_time), 'h:mm a')}</TableCell>
                                            <TableCell>{format(new Date(flight.arrival_time), 'h:mm a')}</TableCell>
                                            <TableCell>{flight.baggage}</TableCell>
                                            <TableCell>{flight.seats}</TableCell>


                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <div className="p-4 border rounded-lg bg-white mt-4">
                    <div className="w-full"><h2 className="text-xl pb-2 font-[600]">Agency Information</h2></div>
                    <div className="grid grid-cols-3 gap-4 text-xl ">
                        <div className="bg-gray-200/80 rounded-lg p-4">
                            <h3 className="font-bold">Agency Name</h3>
                            <span>AlHabib Travels Agency</span>

                        </div>
                        <div className="bg-gray-200/80 rounded-lg p-4">
                            <h3 className="font-bold">Email Address</h3>
                            <span>alijanali0091@gmail.com</span>

                        </div>
                        <div className="bg-gray-200/80 rounded-lg p-4">
                            <h3 className="font-bold">Mobile Number</h3>
                            <span>03353959273</span>
                        </div>
                    </div>
                    <div className="mt-2">
                        <Label className="text-lg font-bold">Agent Remarks</Label>
                        <Input type='text' className="border border-gray-600"/>
                        </div>
                </div>
            </div>
        </div>
    )
}