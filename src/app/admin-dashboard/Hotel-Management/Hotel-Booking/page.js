'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
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
import { PencilIcon, TrashIcon, PlusIcon, Loader, Eye } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';
import { fetchHotelBookings, fetchHotel, addHotelBooking, updateHotelBooking, deleteHotelBooking } from './api';
import BookingForm from './BookingForm';
import BookingDetails from './BookingDetails';

export default function HotelBookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiLoading, setApiLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [bookingsData, hotelsData] = await Promise.all([
        fetchHotelBookings(),
        fetchHotel()
      ]);
      setBookings(bookingsData);
      setHotels(hotelsData);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, updateTrigger]);

  const handleAddBooking = () => {
    setCurrentBooking(null);
    setIsModalOpen(true);
  };

  const handleViewBooking = useCallback((booking) => {
    setSelectedBooking(booking);
    setIsViewModalOpen(true);
  }, []);

  const handleUpdateBooking = useCallback((booking) => {
    setCurrentBooking(booking);
    setIsModalOpen(true);
  }, []);

  const handleDeleteBooking = useCallback(async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      setLoadingAction(id);
      try {
        await deleteHotelBooking(id);
        setUpdateTrigger(prev => prev + 1);
        toast.success('Booking deleted successfully');
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoadingAction(null);
      }
    }
  }, []);

 
  const handleSubmit = useCallback(async (bookingData) => {
    setLoadingAction('form');
    const updatedBooking = { ...bookingData, agent_id: 8 }; 
    try {
      if (currentBooking) {
        await updateHotelBooking({ ...currentBooking, ...updatedBooking });
        toast.success('Booking updated successfully');
      } else {
        await addHotelBooking(updatedBooking);
        toast.success('Booking added successfully');
      }
      setUpdateTrigger(prev => prev + 1);
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingAction(null);
    }
  }, [currentBooking]);

  const handleStatusUpdateBooking = useCallback(async (status, booking) => {
    setApiLoading(true);
    try {
      const response = await fetch(
        `/api/admin/hotel-booking-management/booking-${status}/${booking.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingid: booking.id, status: status === 'approve' ? "Approved" : "Rejected" }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to ${status} booking`);
      }
      setIsViewModalOpen(false)
      toast.success(data.message || `Booking successfully ${status}d`);
      setUpdateTrigger(prev => prev + 1);
    } catch (error) {
      console.error(error);
      toast.error(`An unexpected error occurred while ${status}ing the booking`);
    } finally {
      setApiLoading(false);
    }
  }, []);

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
            <DialogContent className="max-w-7xl h-auto max-h-[90vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>{currentBooking ? 'Update Booking' : 'Add Booking'}</DialogTitle>
              </DialogHeader>
              <BookingForm
                onSubmit={handleSubmit}
                initialData={currentBooking}
                hotels={hotels}
                isLoading={loadingAction === 'form'}
              />
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
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
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
                    <TableCell>{booking.Hotel?.price}</TableCell>
                    <TableCell>{booking.status}</TableCell>
                    <TableCell>
                      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                        <DialogTrigger asChild>
                          <Button onClick={() => handleViewBooking(booking)} className="bg-indigo-600">
                            <Eye className="h-5 w-5 mr-2" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-7xl h-auto max-h-[90vh] overflow-auto">
                          <BookingDetails
                            booking={selectedBooking}
                            onApprove={() => handleStatusUpdateBooking('approve', selectedBooking)}
                            onReject={() => handleStatusUpdateBooking('reject', selectedBooking)}
                            isLoading={apiLoading}
                          />
                        </DialogContent>
                      </Dialog>
                      {/* <Button onClick={() => handleUpdateBooking(booking)} variant="ghost">
                        <PencilIcon className="h-4 w-4" />
                      </Button> */}
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

