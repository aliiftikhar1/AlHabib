'use client';

import { toast, ToastContainer } from 'react-toastify';
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PencilIcon, TrashIcon, PlusIcon, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';

const fetchPaymentRequests = async () => {
  const response = await fetch('/api/admin/payment-request');
  if (!response.ok) {
    throw new Error('Failed to fetch payment requests');
  }
  return response.json();
};

export default function PaymentRequestManagement() {
  const [paymentRequests, setPaymentRequests] = useState([]);
  const [filteredPaymentRequests, setFilteredPaymentRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [paymentImage, setPaymentImage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogMode, setDialogMode] = useState(null); // 'view', 'add', 'edit'
  const [formData, setFormData] = useState({
    userid: '',
    transactionno: '',
    amount: '',
    img_url: '',
    status: 'Pending',
    verified_by:'',
  });
  const username = useSelector((state) => state.user.username);

  useEffect(() => {
    fetchPaymentRequests()
      .then((data) => {
        setPaymentRequests(data);
        setFilteredPaymentRequests(data); // Set filtered data initially
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    setFilteredPaymentRequests(
      paymentRequests.filter((req) =>
        [req.userid, req.transactionno]
          .join(' ')
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    );
  }, [paymentRequests, searchTerm]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        setPaymentImage(imageData);
        setFormData((prev) => ({ ...prev, img_url: imageData }));
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleApprove = async () => {
    try {
      const payload = {
        ...selectedRequest,
        status: 'Approved',
        verified_by: username,
      };

      const response = await fetch(`/api/admin/payment-request/approve/${selectedRequest.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || 'Payment request approved successfully!');
        setDialogMode(null);

        // Optimistically update the payment request status in the state
        setPaymentRequests((prev) =>
          prev.map((req) =>
            req.id === selectedRequest.id ? { ...req, status: 'Approved' } : req
          )
        );
      } else {
        toast.error(result.message || 'Failed to approve payment request.');
      }
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };

  const handleReject = async () => {
    try {
      const payload = { ...selectedRequest, status: 'Rejected', verified_by: username };
      const response = await fetch(
        `/api/admin/payment-request/reject/${selectedRequest.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error('Failed to reject payment request.');

      toast.success('Payment request rejected successfully!');
      setDialogMode(null);

      // Optimistically update the payment request status in the state
      setPaymentRequests((prev) =>
        prev.map((req) =>
          req.id === selectedRequest.id ? { ...req, status: 'Rejected' } : req
        )
      );
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleAction = async () => {
    try {
      const payload = { ...formData, verified_by: username };
      const response = await fetch(
        `/api/admin/payment-request/${dialogMode === 'edit' ? formData.id : ''}`,
        {
          method: dialogMode === 'add' ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) throw new Error('Failed to submit payment request');

      toast.success(
        `Payment request ${dialogMode === 'add' ? 'added' : 'updated'} successfully!`
      );
      setDialogMode(null);
      setFormData({ userid: '', transactionno: '', amount: '', img_url: '', status: 'Pending' });

      // Optimistically update the payment request in the state
      if (dialogMode === 'edit') {
        setPaymentRequests((prev) =>
          prev.map((req) =>
            req.id === formData.id ? { ...req, ...formData } : req
          )
        );
      } else {
        setPaymentRequests((prev) => [payload, ...prev]);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/admin/payment-request/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete payment request');

      toast.success('Payment request deleted successfully!');

      // Optimistically remove the payment request from the state
      setPaymentRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <Input
            type="text"
            placeholder="Search payment requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-auto"
          />
          {/* <Button onClick={() => setDialogMode('add')} className="bg-blue-600">
            <PlusIcon className="h-4 w-4 mr-2" /> Add Request
          </Button> */}
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
                  <TableHead>UserId</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Transaction No</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPaymentRequests.map((req, index) => (
                  <TableRow key={req.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{req.userid}</TableCell>
                    <TableCell>
                      {req.img_url ? (
                        <img
                          src={decodeURIComponent(req.img_url)}
                          className="w-12 h-12"
                          alt="Payment"
                        />
                      ) : (
                        <img
                          src="/logo/logo1.jpg"
                          className="w-24 h-24"
                          alt="Default"
                        />
                      )}
                    </TableCell>
                    <TableCell>{req.transactionno}</TableCell>
                    <TableCell>{req.amount}</TableCell>
                    <TableCell>{req.status}</TableCell>
                    <TableCell className="flex space-x-2">
                      <Button
                        onClick={() => {
                          setSelectedRequest(req);
                          setDialogMode('view');
                        }}
                        variant="ghost"
                        className="text-indigo-600"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {/* <Button
                        onClick={() => {
                          setFormData(req);
                          setDialogMode('edit');
                        }}
                        variant="ghost"
                        className="text-yellow-600"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button> */}
                      <Button
                        onClick={() => handleDelete(req.id)}
                        variant="ghost"
                        className="text-red-600"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Dialog open={!!dialogMode} onOpenChange={() => setDialogMode(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'view' && 'Payment Request Details'}
              {dialogMode === 'add' && 'Add Payment Request'}
              {dialogMode === 'edit' && 'Edit Payment Request'}
            </DialogTitle>
          </DialogHeader>
          {dialogMode === 'view' && selectedRequest && (
            <>
              <div className="space-y-4">
                <div>
                  <strong>UserId:</strong> {selectedRequest.userid}
                </div>
                <div>
                  <strong>Transaction No:</strong> {selectedRequest.transactionno}
                </div>
                <div>
                  <strong>Amount:</strong> {selectedRequest.amount}
                </div>
                <div>
                  <strong>Status:</strong> {selectedRequest.status}
                </div>
                <img
                  src={decodeURIComponent(selectedRequest.img_url)}
                  alt="Payment"
                  className="w-full h-40 object-cover"
                />
              </div>
              <div className="mt-4 flex space-x-4">
                {selectedRequest.status === 'Pending' && (
                  <>
                    <Button onClick={handleApprove}>Approve</Button>
                    <Button onClick={handleReject} className="bg-red-600">
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </>
          )}
          {dialogMode === 'add' || dialogMode === 'edit' ? (
            <div className="space-y-4">
              <Input
                label="UserId"
                name="userid"
                value={formData.userid}
                onChange={handleInputChange}
              />
              <Input
                label="Transaction No"
                name="transactionno"
                value={formData.transactionno}
                onChange={handleInputChange}
              />
              <Input
                label="Amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
              />
              <div>
                <input
                  type="file"
                  accept="image/*"
                  name="img_url"
                  onChange={handleImageChange}
                  className="mt-2"
                />
              </div>
              <div className="mt-4">
                <Button onClick={handleAction} className="w-full bg-green-600">
                  {dialogMode === 'edit' ? 'Update' : 'Add'}
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
