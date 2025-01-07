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
import { fetchHotelBookings, fetchHotel, addHotelBooking } from './api';
import BookingForm from './BookingForm';
import BookingDetails from './BookingDetails';
import { useSelector } from 'react-redux';

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
  const userid = useSelector((data)=>data.user.id)

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [bookingsData, hotelsData] = await Promise.all([
        fetchHotelBookings(userid),
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

  const handleSubmit = useCallback(async (bookingData) => {
    setLoadingAction('form');
    console.log("Booking data : ",bookingData);
    const updatedBooking = { ...bookingData, agent_id: userid }; 
    console.log("New Booking data with agent_id : ", updatedBooking);
    try {
        await addHotelBooking(updatedBooking);
        toast.success('Booking added successfully');
      setUpdateTrigger(prev => prev + 1);
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingAction(null);
    }
  }, [currentBooking]);


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
                          <DialogHeader>
                            <DialogTitle>Hotel Booking Details</DialogTitle>
                          </DialogHeader>
                          <BookingDetails
                            booking={selectedBooking}
                          />
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

