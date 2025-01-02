'use client';

import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PencilIcon, TrashIcon, PlusIcon, Loader } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

const fetchHotelBookings = async () => {
  const response = await fetch('/api/admin/hotel-booking-management');
  if (!response.ok) {
    throw new Error('Failed to fetch hotel bookings');
  }
  return response.json();
};

const fetchHotel = async () => {
  const response = await fetch('/api/admin/hotel-management');
  if (!response.ok) {
    throw new Error('Failed to fetch hotel');
  }
  return response.json();
};

const addHotelBooking = async (booking) => {
  const response = await fetch('/api/admin/hotel-booking-management', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(booking),
  });
  if (!response.ok) {
    throw new Error('Failed to add hotel booking');
  }
  return response.json();
};

const updateHotelBooking = async (booking) => {
  const response = await fetch(`/api/admin/hotel-booking-management/${booking.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(booking),
  });
  if (!response.ok) {
    throw new Error('Failed to update hotel booking');
  }
  return response.json();
};

const deleteHotelBooking = async (id) => {
  const response = await fetch(`/api/admin/hotel-booking-management/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    throw new Error('Failed to delete hotel booking');
  }
  return true;
};

export default function HotelBookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(null);
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    fetchHotelBookings()
      .then(setBookings)
      .catch((err) => toast.error(err.message))
      .finally(() => setIsLoading(false));

    fetchHotel()
      .then(setHotels)
      .catch((err) => toast.error(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const handleAddBooking = () => {
    setCurrentBooking(null);
    setIsModalOpen(true);
  };

  const handleUpdateBooking = (booking) => {
    setCurrentBooking(booking);
    setIsModalOpen(true);
  };

  const handleDeleteBooking = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      setLoadingAction(id);
      try {
        await deleteHotelBooking(id);
        const updatedBookings = await fetchHotelBookings();
        setBookings(updatedBookings);
        toast.success('Booking deleted successfully');
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoadingAction(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const bookingData = Object.fromEntries(formData.entries());
    setLoadingAction('form');

    try {
      if (currentBooking) {
        await updateHotelBooking({ ...currentBooking, ...bookingData });
        toast.success('Booking updated successfully');
      } else {
        await addHotelBooking(bookingData);
        toast.success('Booking added successfully');
      }
      const updatedBookings = await fetchHotelBookings();
      setBookings(updatedBookings);
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <Input
            type="text"
            placeholder="Search bookings..."
            className="pl-10 w-auto"
          />
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddBooking} className="bg-indigo-600">
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Booking
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl h-[500px]">
              <DialogHeader>
                <DialogTitle>{currentBooking ? 'Update Booking' : 'Add Booking'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label htmlFor="flightgroup_id" className="block text-sm font-medium">
                      Hotel
                    </label>
                    <select
                      name="hotel_id"
                      defaultValue={currentBooking?.hotel_id || ''}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select Hotel</option>
                      {hotels.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {['rooms', 'adults', 'childs'].map((field) => (
                    <div key={field}>
                      <label htmlFor={field} className="block text-sm font-medium">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <Input
                        type="number"
                        name={field}
                        defaultValue={currentBooking?.[field] || ''}
                      />
                    </div>
                  ))}
                  <div>
                    <label htmlFor="check_in_date" className="block text-sm font-medium">
                      Check-in Date
                    </label>
                    <Input
                      type="datetime-local"
                      name="check_in_date"
                      defaultValue={currentBooking?.check_in_date || ''}
                    />
                  </div>
                  <div>
                    <label htmlFor="check_out" className="block text-sm font-medium">
                      Check-out Date
                    </label>
                    <Input
                      type="datetime-local"
                      name="check_out"
                      defaultValue={currentBooking?.check_out || ''}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loadingAction === 'form'}>
                  {loadingAction === 'form' && <Loader className="mr-2 animate-spin" />}
                  {currentBooking ? 'Update' : 'Add'} Booking
                </Button>
              </form>
            </DialogContent>
          </Dialog>
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
                  <TableHead>Hotel</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Rooms</TableHead>
                  <TableHead>Adults</TableHead>
                  <TableHead>Children</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking, index) => (
                  <TableRow key={booking.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{booking.Hotel?.name}</TableCell>
                    <TableCell>{new Date(booking.check_in_date).toLocaleString()}</TableCell>
                    <TableCell>{new Date(booking.check_out).toLocaleString()}</TableCell>
                    <TableCell>{booking.rooms}</TableCell>
                    <TableCell>{booking.adults}</TableCell>
                    <TableCell>{booking.childs}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleUpdateBooking(booking)} variant="ghost">
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteBooking(booking.id)}
                        variant="ghost"
                        className="text-red-600"
                        disabled={loadingAction === booking.id}
                      >
                        {loadingAction === booking.id ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          <TrashIcon className="h-4 w-4" />
                        )}
                      </Button>
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
