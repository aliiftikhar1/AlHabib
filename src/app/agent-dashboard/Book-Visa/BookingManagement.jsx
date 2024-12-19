'use client';

import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';

export default function AddBookingRequest() {
  const userid = useSelector((state) => state.user.id);

  const [formData, setFormData] = useState({
    user_id: userid,
    visa_id: '',
    total_amount: '',
    paid_amount: '',
    remaining_amount: '',
    payment_method: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [visa, setVisa] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedVisa, setSelectedVisa] = useState(null);

  // Fetch visa and bookings on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const visaResponse = await fetch('/api/admin/visa');
        const visaData = await visaResponse.json();
        setVisa(visaData);

        const bookingsResponse = await fetch(`/api/user/visa-booking/${userid}`);
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // Handle visa selection change
  const handleVisaChange = (e) => {
    const selectedVisaId = e.target.value;
    const selectedVisa = visa.find((pkg) => pkg.id === parseInt(selectedVisaId));

    setSelectedVisa(selectedVisa);
    setFormData({
      ...formData,
      visa_id: selectedVisaId,
      total_amount: selectedVisa ? selectedVisa.amount : '',
      paid_amount: selectedVisa ? selectedVisa.amount : '',
      remaining_amount: selectedVisa ? selectedVisa.amount : '',
    });
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission for new booking
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { ...formData, status: 'Pending' };

      const response = await fetch('/api/user/visa-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        // If response status is not okay, throw an error with the message
        throw new Error(data.message || 'Failed to submit booking request');
      }

      if (data.status === false && data.message === 'Insufficient balance') {
        // If the message from the API indicates insufficient balance, show error toast
        toast.error('Insufficient balance');
        return;
      }

      // Display the success message or any other returned message from the API
      toast.success(data.message || 'Booking request submitted successfully!');

      // Reset form data after successful submission
      setFormData({
        user_id: userid,
        visa_id: '',
        total_amount: '',
        paid_amount: '',
        remaining_amount: '',
        payment_method: '',
        notes: '',
      });
      setShowModal(false); // Close modal after submission
    } catch (err) {
      // Handle other errors (e.g., network errors)
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-6 text-center">Booking Requests</h2>

      {/* Show existing bookings in a table */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Your Bookings</h3>
        {bookings.length > 0 ? (
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left font-medium">Booking ID</th>
                <th className="px-4 py-2 text-left font-medium">Visa ID</th>
                <th className="px-4 py-2 text-left font-medium">Total Amount</th>
                <th className="px-4 py-2 text-left font-medium">Paid Amount</th>
                <th className="px-4 py-2 text-left font-medium">Remaining Amount</th>
                <th className="px-4 py-2 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.booking_id} className="border-b">
                  <td className="px-4 py-2">{booking.booking_id}</td>
                  <td className="px-4 py-2">{booking.visa_id}</td>
                  <td className="px-4 py-2">{booking.total_amount}</td>
                  <td className="px-4 py-2">{booking.paid_amount}</td>
                  <td className="px-4 py-2">{booking.remaining_amount}</td>
                  <td className="px-4 py-2">{booking.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No bookings found</p>
        )}
      </div>

      {/* Book Visa Button */}
      <Button onClick={() => setShowModal(true)} className="w-full mb-4">
        Book New Visa
      </Button>

      {/* Modal for new booking */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-2xl font-bold mb-4 text-center">Book a Visa</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Visa Selection */}
              <div>
                <label htmlFor="visa_id" className="block text-sm font-medium">
                  Visa
                </label>
                <select
                  name="visa_id"
                  value={formData.visa_id}
                  onChange={handleVisaChange}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Select a Visa</option>
                  {visa.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Total Amount */}
              <div>
                <label htmlFor="total_amount" className="block text-sm font-medium">
                  Total Amount
                </label>
                <Input
                  type="number"
                  name="total_amount"
                  value={formData.total_amount}
                  onChange={handleChange}
                  disabled
                  placeholder="Total Amount"
                  required
                />
              </div>

              {/* Paid Amount */}
              {/* <div>
                <label htmlFor="paid_amount" className="block text-sm font-medium">
                  Paid Amount
                </label>
                <Input
                  type="number"
                  name="paid_amount"
                  value={formData.paid_amount}
                  onChange={handleChange}
                  disabled
                  placeholder="Paid Amount"
                  required
                />
              </div>

              <div>
                <label htmlFor="remaining_amount" className="block text-sm font-medium">
                  Remaining Amount
                </label>
                <Input
                  type="number"
                  name="remaining_amount"
                  value={formData.remaining_amount}
                  onChange={handleChange}
                  disabled
                  placeholder="Remaining Amount"
                  required
                />
              </div> */}

              {/* Payment Method */}
              <div>
                <label htmlFor="payment_method" className="block text-sm font-medium">
                  Payment Method
                </label>
                <Input
                  type="text"
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleChange}
                  placeholder="Enter Payment Method"
                  required
                />
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium">
                  Additional Notes
                </label>
                <Input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Enter any notes"
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full mt-4" disabled={loading}>
                {loading ? (
                  <>
                    <Loader className="mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Booking'
                )}
              </Button>
            </form>

            <Button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full bg-gray-200 text-gray-700"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
