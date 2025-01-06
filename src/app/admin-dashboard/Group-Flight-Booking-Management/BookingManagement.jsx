'use client';

import { toast, ToastContainer } from 'react-toastify';
import { useState, useEffect } from 'react';
import { EyeIcon, Loader, CheckCircle, XCircle } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';

const fetchBookings = async () => {
  const response = await fetch('/api/admin/group-flight-booking');
  if (!response.ok) {
    throw new Error('Failed to fetch bookings');
  }
  return response.json();
};

const updateBookingStatus = async (id, status) => {
  const response = await fetch(`/api/admin/group-flight-booking/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    throw new Error('Failed to update booking status');
  }
  return response.json();
};

export default function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchBookings()
      .then(setBookings)
      .catch((err) => toast.error(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    setFilteredBookings(
      bookings.filter(
        (booking) =>
          String(booking.agent_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
          String(booking.FlightDetails?.airline).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [bookings, searchTerm]);

  const handleAction = async (id, action) => {
    try {
      await updateBookingStatus(id, action);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: action } : b))
      );
      toast.success(`Booking ${action.toLowerCase()}ed`);
      setDialogOpen(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="p-6">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        {isLoading ? (
          <div className="flex justify-center">
            <Loader className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="overflow-auto max-h-[72vh]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No.</TableHead>
                  <TableHead>Agent Name</TableHead>
                  <TableHead>Airline</TableHead>
                  <TableHead>Fare</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking, index) => (
                  <TableRow key={booking.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{booking.Users?.name || 'N/A'}</TableCell>
                    <TableCell>{booking.FlightAirline?.name || 'N/A'}</TableCell>
                    <TableCell>{booking.SingleGroupFlight?.fare}</TableCell>
                    <TableCell>{booking.status}</TableCell>
                    <TableCell>
                      <Dialog open={dialogOpen} onOpenChange={setDialogOpen} className="">
                        <DialogTrigger asChild>
                          <Button variant="ghost">
                            <EyeIcon className="h-5 w-5 text-blue-600" />
                          </Button>
                        </DialogTrigger>

                        <DialogContent className="max-w-3xl p-6 bg-white rounded-md border shadow-lg">
                          <DialogTitle className="text-xl font-bold mb-4">Flight Details</DialogTitle>
                          <DialogDescription className="text-sm mb-4">
                            Here are the details for this flight booking.
                          </DialogDescription>
                          <div className="space-y-2">
                            <p><strong>Agent Name:</strong> {booking.Users?.name}  </p>
                            <p><strong>Business Name:</strong> {booking.Users?.bname} </p>
                            <p><strong>Airline:</strong> {booking.FlightAirline?.name}</p>
                            <Table className="w-full border-collapse border border-gray-300">
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="border border-gray-300 p-2">Flight No</TableHead>
                                  <TableHead className="border border-gray-300 p-2">Origin</TableHead>
                                  <TableHead className="border border-gray-300 p-2">Destination</TableHead>
                                  <TableHead className="border border-gray-300 p-2">Flight Date</TableHead>
                                  <TableHead className="border border-gray-300 p-2">Departure Time</TableHead>
                                  <TableHead className="border border-gray-300 p-2">Arrival Time</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {booking && (
                                  <>
                                    <TableRow>
                                      <TableCell className="border border-gray-300 p-2"> {booking.SingleGroupFlight?.flight_number || 'N/A'}
                                      </TableCell>
                                      <TableCell className="border border-gray-300 p-2"> {booking.SingleGroupFlight?.origin}
                                      </TableCell>
                                      <TableCell className="border border-gray-300 p-2"> {booking.SingleGroupFlight?.destination}
                                      </TableCell>
                                      <TableCell className="border border-gray-300 p-2"> {new Date(booking.SingleGroupFlight?.flight_date).toLocaleDateString() || 'N/A'}</TableCell>
                                      <TableCell className="border border-gray-300 p-2"> {new Date(booking.SingleGroupFlight?.dept_time).toLocaleTimeString() || 'N/A'}</TableCell>
                                      <TableCell className="border border-gray-300 p-2"> {new Date(booking.SingleGroupFlight?.arrival_time).toLocaleTimeString() || 'N/A'}</TableCell>
                                    </TableRow>
                                    {booking.FlightSector?.type === 'two-way' && (
                                      <TableRow>
                                        <TableCell className="border border-gray-300 p-2"> {booking.SingleGroupFlight?.flight_number2 || 'N/A'}
                                        </TableCell>
                                        <TableCell className="border border-gray-300 p-2"> {booking.SingleGroupFlight?.origin2}
                                        </TableCell>
                                        <TableCell className="border border-gray-300 p-2"> {booking.SingleGroupFlight?.destination2}
                                        </TableCell>
                                        <TableCell className="border border-gray-300 p-2"> {new Date(booking.SingleGroupFlight?.flight_date2).toLocaleDateString() || 'N/A'}</TableCell>
                                        <TableCell className="border border-gray-300 p-2"> {new Date(booking.SingleGroupFlight?.dept_time2).toLocaleTimeString() || 'N/A'}</TableCell>
                                        <TableCell className="border border-gray-300 p-2"> {new Date(booking.SingleGroupFlight?.arrival_time2).toLocaleTimeString() || 'N/A'}</TableCell>
                                      </TableRow>
                                    )}
                                  </>
                                )}

                              </TableBody>
                            </Table>
                            <p><strong>Flight Type:</strong> {booking.FlightSector?.type}</p>
                            <p><strong>Status:</strong> {booking.status}</p>
                            <p><strong>Fare:</strong> {booking.SingleGroupFlight?.fare}</p>
                            <div>
                              <strong>Passengers:</strong>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>No.</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Passport Id</TableHead>
                                    <TableHead>DOB</TableHead>
                                    <TableHead>DOE</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {booking.GroupPassengers?.map((p, index) => (
                                    <TableRow key={p.id}>
                                      <TableCell>{index + 1}</TableCell>
                                      <TableCell>{p.title + " " + p.givenname + " " + p.surname || 'N/A'}</TableCell>
                                      <TableCell>{p.type || 'N/A'}</TableCell>
                                      <TableCell>{p.passportid}</TableCell>
                                      <TableCell>{p.dob}</TableCell>
                                      <TableCell>{p.doe}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                              {/* {p.title} {p.givenname} {p.surname} ({p.type}) */}

                            </div>

                            <div className="mt-4">
                              <input type="file" className="block mb-3" />
                              {booking.status === 'Pending' && (
                                <div className="flex justify-end space-x-4 mt-4">
                                  <Button
                                    onClick={() => handleAction(booking.id, 'Approved')}
                                    className="bg-green-500 hover:bg-green-600"
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    onClick={() => handleAction(booking.id, 'Rejected')}
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    Reject
                                  </Button>

                                </div>
                              )}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
