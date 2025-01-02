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

const fetchHotels = async () => {
  const response = await fetch('/api/admin/hotel-management');
  if (!response.ok) {
    throw new Error('Failed to fetch hotels');
  }
  return response.json();
};

const fetchRoomTypes = async () => {
  const response = await fetch('/api/admin/room-type-management');
  if (!response.ok) {
    throw new Error('Failed to fetch hotels');
  }
  return response.json();
};

const addHotel = async (hotel) => {
  const response = await fetch('/api/admin/hotel-management', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(hotel),
  });
  if (!response.ok) {
    throw new Error('Failed to add hotel');
  }
  return response.json();
};

const updateHotel = async (hotel) => {
  const response = await fetch(`/api/admin/hotel-management/${hotel.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(hotel),
  });
  if (!response.ok) {
    throw new Error('Failed to update hotel');
  }
  return response.json();
};

const deleteHotel = async (id) => {
  const response = await fetch(`/api/admin/hotel-management/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    throw new Error('Failed to delete hotel');
  }
  return true;
};

export default function HotelManagement() {
  const [hotels, setHotels] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentHotel, setCurrentHotel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(null);
  const [roomTypes, setRoomTypes] = useState([]);

  useEffect(() => {
    fetchHotels()
      .then(setHotels)
      .catch((err) => toast.error(err.message))
      .finally(() => setIsLoading(false));

    fetchRoomTypes()
      .then(setRoomTypes)
      .catch((err) => toast.error(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const handleAddHotel = () => {
    setCurrentHotel(null);
    setIsModalOpen(true);
  };

  const handleUpdateHotel = (hotel) => {
    setCurrentHotel(hotel);
    setIsModalOpen(true);
  };

  const handleDeleteHotel = async (id) => {
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      setLoadingAction(id);
      try {
        await deleteHotel(id);
        const updatedHotels = await fetchHotels();
        setHotels(updatedHotels);
        toast.success('Hotel deleted successfully');
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
    const hotelData = Object.fromEntries(formData.entries());
    setLoadingAction('form');

    try {
      if (currentHotel) {
        await updateHotel({ ...currentHotel, ...hotelData });
        toast.success('Hotel updated successfully');
      } else {
        await addHotel(hotelData);
        toast.success('Hotel added successfully');
      }
      const updatedHotels = await fetchHotels();
      setHotels(updatedHotels);
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
            placeholder="Search hotels..."
            className="pl-10 w-auto"
          />
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddHotel} className="bg-indigo-600">
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Hotel
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl h-[500px]">
              <DialogHeader>
                <DialogTitle>{currentHotel ? 'Update Hotel' : 'Add Hotel'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {['name', 'description', 'location', 'price'].map((field) => (
                    <div key={field}>
                      <label htmlFor={field} className="block text-sm font-medium">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <Input
                        type="text"
                        name={field}
                        defaultValue={currentHotel?.[field] || ''}
                      />
                    </div>
                  ))}
                  <div>
                    <label htmlFor="availability" className="block text-sm font-medium">
                      Availability
                    </label>
                    <select
                      name="availability"
                      defaultValue={currentHotel?.availability || 'true'}
                      className="w-full border p-2 rounded-md"
                    >
                      <option value="true">Available</option>
                      <option value="false">Unavailable</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="flightgroup_id" className="block text-sm font-medium">
                      Room Type
                    </label>
                    <select
                      name="roomtype"
                      defaultValue={currentHotel?.roomtype || ''}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select Room Type</option>
                      {roomTypes.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loadingAction === 'form'}>
                  {loadingAction === 'form' && <Loader className="mr-2 animate-spin" />}
                  {currentHotel ? 'Update' : 'Add'} Hotel
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
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hotels.map((hotel, index) => (
                  <TableRow key={hotel.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{hotel.name}</TableCell>
                    <TableCell>{hotel.description}</TableCell>
                    <TableCell>{hotel.price}</TableCell>
                    <TableCell>{hotel.availability ? 'Available' : 'Unavailable'}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleUpdateHotel(hotel)} variant="ghost">
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteHotel(hotel.id)}
                        variant="ghost"
                        className="text-red-600"
                        disabled={loadingAction === hotel.id}
                      >
                        {loadingAction === hotel.id ? (
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
