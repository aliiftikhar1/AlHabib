'use client';

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Fetch Ledger Entries from API
const fetchLedgerEntries = async () => {
  const response = await fetch('/api/admin/ledger');
  if (!response.ok) {
    throw new Error('Failed to fetch ledger entries');
  }
  return response.json();
};

export default function LedgerManagement() {
  const [ledgerEntries, setLedgerEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLedgerEntries()
      .then(setLedgerEntries)
      .catch((err) => toast.error(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  // Calculate total debit and credit
  const totalDebit = ledgerEntries.reduce((total, entry) => total + entry.debit, 0);
  const totalCredit = ledgerEntries.reduce((total, entry) => total + entry.credit, 0);

  return (
    <div>
      <ToastContainer />
      <div className="p-6">
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
                  <TableHead>User ID</TableHead>
                  <TableHead>User Name</TableHead>
                  <TableHead>Debit</TableHead>
                  <TableHead>Credit</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Transaction Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ledgerEntries.map((entry, index) => (
                  <TableRow key={entry.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{entry.userId}</TableCell>
                    <TableCell>{entry.Users?.name}</TableCell>
                    <TableCell>{entry.debit}</TableCell>
                    <TableCell>{entry.credit}</TableCell>
                    <TableCell>{entry.balance}</TableCell>
                    <TableCell>{entry.description}</TableCell>
                    <TableCell>{new Date(entry.transaction_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* Total Debit and Credit */}
            <div className="mt-4 flex justify-between items-center">
              <div className="text-lg font-medium">Total Debit: {totalDebit.toFixed(2)}</div>
              <div className="text-lg font-medium">Total Credit: {totalCredit.toFixed(2)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
