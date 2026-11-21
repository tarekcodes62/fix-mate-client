'use client';

import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { getAllUsers, updateUserRole } from '@/lib/api/admin';
import { toast } from 'sonner';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type AdminUser = {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'technician' | 'admin';
};

const ManageUsersPage = () => {
  const { data: session } = authClient.useSession();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const tokenResult = await authClient.token();

        if (!tokenResult.data?.token) {
          throw new Error('Failed to get token');
        }

        const data = await getAllUsers(tokenResult.data.token);
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchUsers();
    }
  }, [session]);

  const handleRoleChange = async (id: string, role: string) => {
    try {
      setUpdatingId(id);

      const tokenResult = await authClient.token();

      if (!tokenResult.data?.token) {
        throw new Error('Failed to get token');
      }

      await updateUserRole(id, role, tokenResult.data.token);

      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === id ? { ...user, role: role as AdminUser['role'] } : user,
        ),
      );

      toast.success('User role updated successfully');
    } catch (error) {
      console.error('Failed to update user role:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to update user role',
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div>
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <p className="text-muted-foreground">
          View users and manage their account roles.
        </p>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-xl border bg-card">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No users found.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.map(user => {
                const isCurrentUser = user.email === session?.user?.email;

                return (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">{user.name}</TableCell>

                    <TableCell>{user.email}</TableCell>

                    <TableCell>
                      <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize">
                        {user.role}
                      </span>
                    </TableCell>

                    <TableCell>
                      <select
                        value={user.role}
                        disabled={isCurrentUser || updatingId === user._id}
                        onChange={e =>
                          handleRoleChange(user._id, e.target.value)
                        }
                        className="h-9 rounded-md border border-input bg-background px-3 text-sm capitalize outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="customer">Customer</option>
                        <option value="technician">Technician</option>
                        <option value="admin">Admin</option>
                      </select>

                      {isCurrentUser && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Your account
                        </p>
                      )}

                      {updatingId === user._id && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Updating...
                        </p>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default ManageUsersPage;
