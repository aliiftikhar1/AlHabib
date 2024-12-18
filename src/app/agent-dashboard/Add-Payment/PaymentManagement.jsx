'use client';

import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';

export default function AddPaymentRequest() {
  const userid = useSelector((state) => state.user.id);

  const [formData, setFormData] = useState({
    userid: userid,
    transactionno: '',
    amount: '',
    img_url: '',
  });
  const [loading, setLoading] = useState(false);
  

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image upload and convert to base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, img_url: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        status: 'Pending', 
      };

      const response = await fetch('/api/user/payment-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to submit payment request');
      }

      toast.success('Payment request submitted successfully!');
      setFormData({ userid: userid, transactionno: '', amount: '', img_url: '' });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-6 text-center">Submit Payment Request</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* User ID */}
        <div>
          <label htmlFor="userid" className="block text-sm font-medium">
            User ID
          </label>
          <Input
            type="number"
            name="userid"
            value={userid}
            // onChange={handleChange}
            disabled
            placeholder="Enter your User ID"
            required
          />
        </div>

        {/* Transaction Number */}
        <div>
          <label htmlFor="transactionno" className="block text-sm font-medium">
            Transaction Number
          </label>
          <Input
            type="text"
            name="transactionno"
            value={formData.transactionno}
            onChange={handleChange}
            placeholder="Enter Transaction Number"
            required
          />
        </div>

        {/* Amount */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium">
            Amount
          </label>
          <Input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter Amount"
            step="0.01"
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="img_url" className="block text-sm font-medium">
            Upload Proof of Payment
          </label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          {formData.img_url && (
            <img
              src={formData.img_url}
              alt="Preview"
              className="mt-4 h-32 w-auto rounded-md shadow-md"
            />
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader className="mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Payment'
          )}
        </Button>
      </form>
    </div>
  );
}
