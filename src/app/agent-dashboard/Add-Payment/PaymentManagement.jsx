'use client';

import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';

export default function AddPaymentRequest() {
  const userid = useSelector((state) => state.user.id);
  const userbalance = useSelector((state) => state.user.balance);

  const [formData, setFormData] = useState({
    userid: userid,
    transactionno: '',
    amount: '',
    img_url: '',
  });
  const [loading, setLoading] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [fetchingHistory, setFetchingHistory] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [fetchingAccounts, setFetchingAccounts] = useState(false);

  // Fetch payment request history
  const fetchPaymentHistory = async () => {
    setFetchingHistory(true);
    try {
      const response = await fetch(`/api/user/payment-request/${userid}`);
      if (!response.ok) {
        throw new Error('Failed to fetch payment history');
      }

      const data = await response.json();
      setPaymentHistory(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setFetchingHistory(false);
    }
  };

  // Fetch bank accounts
  const fetchBankAccounts = async () => {
    setFetchingAccounts(true);
    try {
      const response = await fetch('/api/admin/bank-account', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bank accounts');
      }

      const data = await response.json();
      setBankAccounts(data);
      setShowModal(true);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setFetchingAccounts(false);
    }
  };

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
      fetchPaymentHistory(); // Refresh the payment history after submission
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentHistory(); // Fetch payment history when the component mounts
  }, [userid]);

  return (
    <> <p className="w-48 mt-4 absolute z-0 top-[60px] right-[250px] text-lg px-4 py-1 rounded-full border-gray-600  border font-bold">Balance : {userbalance}</p>
     <Button
    className="w-48 mt-4 absolute z-0 top-[60px] right-[30px]"
    onClick={fetchBankAccounts}
    disabled={fetchingAccounts}
  >
    {fetchingAccounts ? (
      <>
        <Loader className="mr-2 animate-spin" />
        Fetching Accounts...
      </>
    ) : (
      'Show Bank Accounts'
    )}
  </Button>
    <div className="w-full  mx-auto p-0 bg-white  mt-16 flex space-x-8">
      <ToastContainer />
      
      {/* Payment Request Form */}
      <div className="max-w-sm  w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Submit Payment Request</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="userid" className="block text-sm font-medium">
              User ID
            </label>
            <Input
              type="number"
              name="userid"
              value={userid}
              disabled
              placeholder="Enter your User ID"
              required
            />
          </div>

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

          {/* Button to fetch and show bank accounts */}
         
        </form>
      </div>

      {/* <div className=' bg-transparent w-2 border-r mr-2'></div> */}

      {/* Payment History Table */}
      <div className="w-1/2">
        <h3 className="text-xl font-bold mb-4">Payment History</h3>
        {fetchingHistory ? (
          <div className="flex justify-center items-center">
            <Loader className="animate-spin" />
          </div>
        ) : (
          <table className="w-full table-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b text-left">Trnx No.</th>
                <th className="px-4 py-2 border-b text-left">Amount</th>
                <th className="px-4 py-2 border-b text-left">Status</th>
                <th className="px-4 py-2 border-b text-left">Created At</th>
                <th className="px-4 py-2 border-b text-left">Updated At</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-4 py-2 border-b">{payment.transactionno}</td>
                  <td className="px-4 py-2 border-b">{payment.amount}</td>
                  <td className="px-4 py-2 border-b">{payment.status}</td>
                  <td className="px-4 py-2 border-b text-xs">{Date(payment.created_at)}</td>
                  <td className="px-4 py-2 border-b text-xs">{Date(payment.updated_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal for displaying bank accounts */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <h3 className="text-xl font-bold mb-2">Bank Accounts</h3>
            <p className="mb-4">You can send payment to these bank accounts</p>
            <ul className="space-y-2">
              {bankAccounts.map((account) => (
                <li
                  key={account.id}
                  className="p-4 border rounded-md flex justify-between"
                >
                  <div>
                    <p className="font-semibold text-xl">{account.bank_title}</p>
                    <p>{account.account_title}</p>
                  </div>
                  <p className="font-mono text-xl">{account.account_no}</p>
                </li>
              ))}
            </ul>
            <Button className="mt-4 w-full" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
