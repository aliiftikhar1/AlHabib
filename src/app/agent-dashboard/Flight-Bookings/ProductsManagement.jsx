'use client';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Loader } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Eye } from 'lucide-react';

export default function AllBookings() {
  const userid = useSelector((state) => state.user.id);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPassengers, setSelectedPassengers] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/user/fetchflightbookingofuser/${userid}`);
        if (!response.ok) throw new Error('Failed to fetch bookings.');
        const bookings = await response.json();
        setBookings(bookings);
      } catch (error) {
        toast.error(error.message || 'Error fetching bookings.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userid]);

  return (
    <div className="mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-6 text-center">My Flight Bookings</h2>

      {loading ? (
        <div className="flex justify-center items-center">
          <Loader className="animate-spin w-10 h-10 text-gray-600" />
        </div>
      ) : bookings.length > 0 ? (
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="border-b">
              {[
                'ID',
                'Airline',
                'Flight#',
                'Passengers',
                'Flight Date',
                'Origin',
                'Destination',
                'Type',
                // 'Meal',
                'Fare',
                'Attachment',
                'Status',
              ].map((header) => (
                <th key={header} className={`px-4 py-2 text-left font-medium ${(header==='Origin' || header=== 'Destination')&&'w-[120px]'}`}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b">
                <td className="px-4 py-2">{booking.id}</td>
                <td className="px-4 py-2">{booking.FlightDetails?.airline}</td>
                <td className="px-4 py-2">
                  {booking.FlightDetails?.SingleFlight?.map((flight, idx) => (
                    <div key={idx}>{flight.flight_number || 'N/A'}</div>
                  ))}
                </td>
                <td className="px-4 py-2  ">
                  <span className='flex justify-center  items-center gap-2'>  {booking.Passengers.length} <span> <Dialog>
                    <DialogTrigger asChild>
                    {booking.Passengers.length>0&& <Eye
                        className="w-5 h-5 cursor-pointer hover:text-blue-500"
                        onClick={() => setSelectedPassengers(booking.Passengers)}
                      />}
                     
                    </DialogTrigger>
                    <DialogContent className="border border-gray-400 max-w-xl">
                      <DialogTitle>Passenger Details</DialogTitle>
                      <div>
                        {selectedPassengers.map((passenger, idx) => (
                          <div key={idx} className="mb-2 border border-gray-500 p-2 rounded-xl">
                            <p>
                              <strong>Passenger No :</strong> {idx + 1}
                            </p>
                            <p>
                              <strong>Name:</strong> {passenger.title} {passenger.givenname} {passenger.surname}
                            </p>
                            <p>
                              <strong>Type:</strong> {passenger.type}
                            </p>
                            <p>
                              <strong>Passport ID:</strong> {passenger.passportid}
                            </p>
                            <p>
                              <strong>Date of Birth:</strong> {new Date(passenger.dob).toLocaleDateString()}
                            </p>
                            <p>
                              <strong>Date of Expiry:</strong> {new Date(passenger.doe).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog></span></span>
                
                 
                </td>
                <td className="px-4 py-2">
                  {booking.FlightDetails?.SingleFlight?.map((flight, idx) => (
                    <div key={idx}>{new Date(flight.flight_date).toLocaleDateString()}</div>
                  ))}
                </td>
                <td className="px-4 py-2">
                  {booking.FlightDetails?.SingleFlight?.map((flight, idx) => (
                    <div key={idx}>{flight.origin}</div>
                  ))}
                </td>
                <td className="px-4 py-2">
                  {booking.FlightDetails?.SingleFlight?.map((flight, idx) => (
                    <div key={idx}>{flight.destination}</div>
                  ))}
                </td>
                <td className="px-4 w-24 py-2">{booking.FlightDetails?.type}</td>
                {/* <td className="px-4 py-2">{booking.FlightDetails?.meal ? 'Yes' : 'No'}</td> */}
                <td className="px-4 py-2">{booking.FlightDetails?.fare}</td>
                <td className="px-4 py-2">{booking.FlightDetails?.attachment? <Eye/>: "No "}</td>
                <td className="px-4 py-2">{booking.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center">No bookings found</p>
      )}
    </div>
  );
}
