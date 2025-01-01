'use client';

import { toast, ToastContainer } from 'react-toastify';
import { useState, useEffect } from 'react';
import {
    PencilIcon,
    TrashIcon,
    PlusIcon,
} from '@heroicons/react/24/solid';
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
import { Loader } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

const fetchSingleGroupFlights = async () => {
    const response = await fetch('/api/admin/single-group-flights');
    if (!response.ok) {
        throw new Error('Failed to fetch single group flights');
    }
    return response.json();
};

const fetchGroup = async () => {
    const response = await fetch('/api/admin/flight-groups');
    if (!response.ok) {
        throw new Error('Failed to fetch flight groups');
    }
    return response.json();
};

const fetchSectors = async () => {
    const response = await fetch('/api/admin/flight-sectors');
    if (!response.ok) {
        throw new Error('Failed to fetch flight sectors');
    }
    return response.json();
};

const fetchAirlines = async () => {
    const response = await fetch('/api/admin/flight-airlines');
    if (!response.ok) {
        throw new Error('Failed to fetch flight airlines');
    }
    return response.json();
};

const addSingleGroupFlight = async (flight) => {
    const response = await fetch('/api/admin/single-group-flights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(flight),
    });
    if (!response.ok) {
        throw new Error('Failed to add single group flight');
    }
    return response.json();
};

const updateSingleGroupFlight = async (flight) => {
    const response = await fetch(`/api/admin/single-group-flights/${flight.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(flight),
    });
    if (!response.ok) {
        throw new Error('Failed to update single group flight');
    }
    return response.json();
};

const deleteSingleGroupFlight = async (id) => {
    const response = await fetch(`/api/admin/single-group-flights/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
        throw new Error('Failed to delete single group flight');
    }
    return true;
};

export default function SingleGroupFlightManagement() {
    const [flights, setFlights] = useState([]);
    const [filteredFlights, setFilteredFlights] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentFlight, setCurrentFlight] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingAction, setLoadingAction] = useState(null);
    const [groups, setGroups] = useState([]);
    const [sectors, setSectors] = useState([]);
    const [airlines, setAirlines] = useState([]);

    useEffect(() => {
        fetchSingleGroupFlights()
            .then((data) => {
                setFlights(data);
                setFilteredFlights(data);
            })
            .catch((err) => toast.error(err.message))
            .finally(() => setIsLoading(false));

        fetchGroup()
            .then(setGroups)
            .catch((err) => toast.error(err.message))
            .finally(() => setIsLoading(false));

        fetchSectors()
            .then(setSectors)
            .catch((err) => toast.error(err.message))
            .finally(() => setIsLoading(false));

        fetchAirlines()
            .then(setAirlines)
            .catch((err) => toast.error(err.message))
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        const filtered = flights.filter((flight) => {
            return (
                flight.flight_number == searchQuery ||
                flight.FlightGroups?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                flight.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
                flight.destination.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
        setFilteredFlights(filtered);
    }, [searchQuery, flights]);

    const handleAddFlight = () => {
        setCurrentFlight(null);
        setIsModalOpen(true);
    };

    const handleUpdateFlight = (flight) => {
        setCurrentFlight(flight);
        setIsModalOpen(true);
    };

    const handleDeleteFlight = async (id) => {
        if (window.confirm('Are you sure you want to delete this flight?')) {
            setLoadingAction(id);
            try {
                await deleteSingleGroupFlight(id);
                const updatedFlights = await fetchSingleGroupFlights();
                setFlights(updatedFlights);
                setFilteredFlights(updatedFlights);
                toast.success('Flight deleted successfully');
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
        const flightData = Object.fromEntries(formData.entries());

        setLoadingAction('form');
        try {
            if (currentFlight) {
                await updateSingleGroupFlight({ ...currentFlight, ...flightData });
                toast.success('Flight updated successfully');
            } else {
                await addSingleGroupFlight(flightData);
                toast.success('Flight added successfully');
            }
            const updatedFlights = await fetchSingleGroupFlights();
            setFlights(updatedFlights);
            setFilteredFlights(updatedFlights);
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
                <div className="mb-6 flex justify-end items-center">
                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={handleAddFlight} className="bg-indigo-600">
                                <PlusIcon className="h-5 w-5 mr-2" />
                                Add Flight
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl h-[500px]">
                            <DialogHeader>
                                <DialogTitle>{currentFlight ? 'Update Flight' : 'Add Flight'}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    {['flight_number', 'origin', 'destination', 'baggage', 'seats', 'fare'].map((field) => (
                                        <div key={field}>
                                            <label htmlFor={field} className="block text-sm font-medium">
                                                {field.charAt(0).toUpperCase() + field.slice(1)}
                                            </label>
                                            <Input
                                                type={field === 'seats' || field === 'fare' ? 'number' : 'text'}
                                                name={field}
                                                defaultValue={currentFlight?.[field] || ''}
                                            />
                                        </div>
                                    ))}
                                    {['flight_date', 'dept_time', 'arrival_time'].map((field) => (
                                        <div key={field}>
                                            <label htmlFor={field} className="block text-sm font-medium">
                                                {field.replace('_', ' ').toUpperCase()}
                                            </label>
                                            <Input
                                                type="datetime-local"
                                                name={field}
                                                defaultValue={currentFlight?.[field] && !isNaN(new Date(currentFlight[field]).getTime())
                                                    ? new Date(currentFlight[field]).toISOString().slice(0, 16)
                                                    : ''
                                                }
                                            />
                                        </div>
                                    ))}

                                    <div>
                                        <label htmlFor="flightgroup_id" className="block text-sm font-medium">
                                            Flight Group
                                        </label>
                                        <select
                                            name="flightgroup_id"
                                            defaultValue={currentFlight?.flightgroup_id || ''}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                        >
                                            <option value="">Select Flight Group</option>
                                            {groups.map((group) => (
                                                <option key={group.id} value={group.id}>
                                                    {group.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="flightsector_id" className="block text-sm font-medium">
                                            Flight Sector
                                        </label>
                                        <select
                                            name="flightsector_id"
                                            defaultValue={currentFlight?.flightsector_id || ''}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                        >
                                            <option value="">Select Flight Sector</option>
                                            {sectors.map((sector) => (
                                                <option key={sector.id} value={sector.id}>
                                                    {sector.to + ' - ' + sector.from + (sector.to2? ' - ' + sector.to2:'')}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="flightairline_id" className="block text-sm font-medium">
                                            Flight Airline
                                        </label>
                                        <select
                                            name="flightairline_id"
                                            defaultValue={currentFlight?.flightairline_id || ''}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                        >
                                            <option value="">Select Flight Airline</option>
                                            {airlines.map((airline) => (
                                                <option key={airline.id} value={airline.id}>
                                                    {airline.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <Button type="submit" className="w-full" disabled={loadingAction === 'form'}>
                                    {loadingAction === 'form' && <Loader className="mr-2 animate-spin" />}
                                    {currentFlight ? 'Update' : 'Add'} Flight
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="mb-4">
                    <Input
                        type="text"
                        placeholder="Search by Flight Number, Origin, or Destination"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full max-w-xs"
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
                                    <TableHead>Flight Group</TableHead>
                                    <TableHead>Flight Number</TableHead>
                                    <TableHead>Origin</TableHead>
                                    <TableHead>Destination</TableHead>
                                    <TableHead>Baggage</TableHead>
                                    <TableHead>Seats</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredFlights.map((flight, index) => (
                                    <TableRow key={flight.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{flight.FlightGroups?.title}</TableCell>
                                        <TableCell>{flight.flight_number}</TableCell>
                                        <TableCell>{flight.origin}</TableCell>
                                        <TableCell>{flight.destination}</TableCell>
                                        <TableCell>{flight.baggage}</TableCell>
                                        <TableCell>{flight.seats}</TableCell>
                                        <TableCell>
                                            <Button onClick={() => handleUpdateFlight(flight)} variant="ghost">
                                                <PencilIcon className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                onClick={() => handleDeleteFlight(flight.id)}
                                                variant="ghost"
                                                className="text-red-600"
                                                disabled={loadingAction === flight.id}
                                            >
                                                {loadingAction === flight.id ? (
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
