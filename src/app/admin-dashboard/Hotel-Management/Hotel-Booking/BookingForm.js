import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { Loader } from 'lucide-react';

export default function BookingForm({ onSubmit, initialData, hotels, isLoading }) {
  const [adults, setAdults] = useState(initialData?.adults || 0);
  const [children, setChildren] = useState(initialData?.childs || 0);
  const [infants, setInfants] = useState(initialData?.infants || 0);
  const [passengers, setPassengers] = useState(initialData?.passengers || []);
  const [fieldsVisible, setFieldsVisible] = useState(false);

  const handleConfirm = (e) => {
    e.preventDefault();
    const newPassengers = [];

    for (let i = 0; i < adults; i++) {
      newPassengers.push({ type: "Adult", surname: "", givenName: "", title: "Mr/Mrs", passport: "", dob: "", doe: "" });
    }
    for (let i = 0; i < children; i++) {
      newPassengers.push({ type: "Child", surname: "", givenName: "", title: "CHD", passport: "", dob: "", doe: "" });
    }
    for (let i = 0; i < infants; i++) {
      newPassengers.push({ type: "Infant", surname: "", givenName: "", title: "INF", passport: "", dob: "", doe: "" });
    }

    setPassengers(newPassengers);
    setFieldsVisible(true);
  };

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index][field] = value;
    setPassengers(updatedPassengers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const bookingData = Object.fromEntries(formData.entries());

    bookingData.adults = adults;
    bookingData.childs = children;
    bookingData.infants = infants;
    bookingData.passengers = passengers;

    onSubmit(bookingData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4 mb-4">
        <div className='grid grid-cols-3 gap-4'>
          <div>
            <label htmlFor="hotel_id" className="block text-sm font-medium">
              Hotel
            </label>
            <select
              name="hotel_id"
              defaultValue={initialData?.hotel_id || ''}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Hotel</option>
              {hotels.map((hotel) => (
                <option key={hotel.id} value={hotel.id}>
                  {hotel.name}
                </option>
              ))}
            </select>
          </div>
          {['rooms', 'remarks'].map((field) => (
            <div key={field}>
              <label htmlFor={field} className="block text-sm font-medium">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <Input
                type={field === 'rooms' ? 'number' : 'text'}
                name={field}
                defaultValue={initialData?.[field] || ''}
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
              defaultValue={initialData?.check_in_date || ''}
            />
          </div>
          <div>
            <label htmlFor="check_out" className="block text-sm font-medium">
              Check-out Date
            </label>
            <Input
              type="datetime-local"
              name="check_out"
              defaultValue={initialData?.check_out || ''}
            />
          </div>
        </div>
        <div>
          <div className="grid grid-cols-4 gap-4 text-xl">
            <div>
              <Label className="text-lg font-bold">Adults</Label>
              <Input type="number" value={adults} onChange={(e) => setAdults(Number(e.target.value))} placeholder="0" className="border border-gray-600" />
            </div>
            <div>
              <Label className="text-lg font-bold">Children</Label>
              <Input type="number" value={children} onChange={(e) => setChildren(Number(e.target.value))} placeholder="0" className="border border-gray-600" />
            </div>
            <div>
              <Label className="text-lg font-bold">Infants</Label>
              <Input type="number" value={infants} onChange={(e) => setInfants(Number(e.target.value))} placeholder="0" className="border border-gray-600" />
            </div>
            <div className="flex flex-col justify-end">
              <Button type="button" onClick={handleConfirm}>Confirm</Button>
            </div>
          </div>
          {fieldsVisible && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Passenger Details</h3>
              {passengers.map((passenger, index) => (
                <div key={index}>
                  <Label className="text-lg font-bold">
                    {index + 1}. {passenger.type}
                  </Label>
                  <div className="grid grid-cols-6 gap-4 mb-4">
                    <div>
                      <Label>Surname</Label>
                      <Input
                        placeholder="Surname"
                        value={passenger.surname}
                        onChange={(e) => handlePassengerChange(index, "surname", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Given Name</Label>
                      <Input
                        placeholder="Given Name"
                        value={passenger.givenName}
                        onChange={(e) => handlePassengerChange(index, "givenName", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Title</Label>
                      <Input
                        placeholder="Title"
                        value={passenger.title}
                        disabled
                      />
                    </div>
                    <div>
                      <Label>Passport</Label>
                      <Input
                        placeholder="Passport"
                        value={passenger.passport}
                        onChange={(e) => handlePassengerChange(index, "passport", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Date of Birth (DOB)</Label>
                      <Input
                        type="date"
                        placeholder="DOB"
                        value={passenger.dob}
                        onChange={(e) => handlePassengerChange(index, "dob", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Date of Expiry (DOE)</Label>
                      <Input
                        type="date"
                        placeholder="DOE"
                        value={passenger.doe}
                        onChange={(e) => handlePassengerChange(index, "doe", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader className="mr-2 animate-spin" />}
        {initialData ? 'Update' : 'Add'} Booking
      </Button>
    </form>
  );
}

