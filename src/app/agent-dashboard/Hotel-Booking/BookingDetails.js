import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader } from 'lucide-react';

export default function BookingDetails({ booking }) {
  if (!booking) return null;

  return (
    <div className='flex flex-col w-full'>
      <div className='mt-2'>
        <h2 className='text-xl font-bold'>Hotel Booking Details</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hotel</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Room Type</TableHead>
              <TableHead>Adults</TableHead>
              <TableHead>Children</TableHead>
              <TableHead>Infants</TableHead>
              <TableHead>Check-In</TableHead>
              <TableHead>Check-Out</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{booking.Hotel?.name}</TableCell>
              <TableCell>{booking.Users?.name}</TableCell>
              <TableCell>{booking.rooms}</TableCell>
              <TableCell className='capitalize'>{booking.RoomType?.title}</TableCell>
              <TableCell>{booking.adults}</TableCell>
              <TableCell>{booking.childs}</TableCell>
              <TableCell>{booking.infants}</TableCell>
              <TableCell>{new Date(booking.check_in_date).toLocaleString()}</TableCell>
              <TableCell>{new Date(booking.check_out).toLocaleString()}</TableCell>
              <TableCell>{booking.Hotel?.price}</TableCell>
              <TableCell>{booking.status}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div className='mt-2'>
        <h2 className='text-xl font-bold'>Hoteliers Details</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Passport Id</TableHead>
              <TableHead>DOB</TableHead>
              <TableHead>DOE</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {booking.Hoteliers?.map((Hotelier, index) => (
              <TableRow key={index}>
                <TableCell>{Hotelier.title} {Hotelier.givenname} {Hotelier.surname}</TableCell>
                <TableCell>{Hotelier.type}</TableCell>
                <TableCell>{Hotelier.passportid}</TableCell>
                <TableCell>{Hotelier.dob}</TableCell>
                <TableCell>{Hotelier.doe}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    
    </div>
  );
}

