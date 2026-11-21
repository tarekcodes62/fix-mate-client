'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { authClient } from '@/lib/auth-client';
import { AdminTransaction, getAllTransactions } from '@/lib/api/admin';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function AdminTransactionsPage() {
  const { data: session } = authClient.useSession();

  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!session) return;

      try {
        setLoading(true);

        const tokenResult = await authClient.token();
        const token = tokenResult.data?.token;

        if (!token) {
          throw new Error('Authentication token not found');
        }

        const data = await getAllTransactions(token);
        setTransactions(data);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Failed to load transactions',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [session]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Transactions</h1>
        <p className="text-sm text-muted-foreground">
          View all successful payments made through FixMate.
        </p>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Technician</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Paid At</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Loading transactions...
                </TableCell>
              </TableRow>
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map(transaction => (
                <TableRow key={transaction._id}>
                  <TableCell className="max-w-36 truncate font-medium">
                    {transaction.transactionId}
                  </TableCell>

                  <TableCell>{transaction.serviceTitle}</TableCell>

                  <TableCell>
                    <p>{transaction.customerName}</p>
                    <p className="text-xs text-muted-foreground">
                      {transaction.customerEmail}
                    </p>
                  </TableCell>

                  <TableCell>
                    <p>{transaction.technicianName}</p>
                    <p className="text-xs text-muted-foreground">
                      {transaction.technicianEmail}
                    </p>
                  </TableCell>

                  <TableCell className="font-medium">
                    {transaction.currency.toUpperCase()} {transaction.amount}
                  </TableCell>

                  <TableCell>
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                      {transaction.paymentStatus}
                    </span>
                  </TableCell>

                  <TableCell>
                    {new Date(transaction.paidAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
