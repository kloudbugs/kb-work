import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

type UserRegistration = {
  id: string;
  username: string;
  email: string;
  status: "pending" | "approved" | "denied";
  registeredAt: string;
  bitcoinAddress?: string;
};

export default function UserApprovalPanel() {
  const [selectedUser, setSelectedUser] = useState<UserRegistration | null>(null);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isDenyDialogOpen, setIsDenyDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch pending registrations
  const { data: registrations, isLoading } = useQuery({
    queryKey: ['/api/admin/pending-registrations'],
    queryFn: async () => {
      const response = await fetch('/api/admin/pending-registrations');
      if (!response.ok) {
        throw new Error('Failed to fetch pending registrations');
      }
      return response.json();
    },
  });

  // Approve user mutation
  const approveMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/admin/approve-user/${userId}`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to approve user');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "User Approved",
        description: `${selectedUser?.username} has been approved and can now access the platform.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pending-registrations'] });
      setIsApproveDialogOpen(false);
      setSelectedUser(null);
    },
    onError: (error) => {
      toast({
        title: "Approval Failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    },
  });

  // Deny user mutation
  const denyMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/admin/deny-user/${userId}`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to deny user');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "User Denied",
        description: `${selectedUser?.username}'s registration has been denied.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pending-registrations'] });
      setIsDenyDialogOpen(false);
      setSelectedUser(null);
    },
    onError: (error) => {
      toast({
        title: "Denial Failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    },
  });

  const handleApprove = () => {
    if (selectedUser) {
      approveMutation.mutate(selectedUser.id);
    }
  };

  const handleDeny = () => {
    if (selectedUser) {
      denyMutation.mutate(selectedUser.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">User Registration Approval</h2>
        <Button 
          variant="outline" 
          onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/admin/pending-registrations'] })}
          className="border-blue-500 text-blue-400 hover:bg-blue-900/20"
        >
          Refresh
        </Button>
      </div>
      
      <div className="rounded-md border border-gray-700 bg-gray-800">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <span className="ml-3 text-gray-300">Loading pending registrations...</span>
          </div>
        ) : registrations?.length === 0 ? (
          <div className="text-center p-8 text-gray-400">
            <User className="w-12 h-12 mx-auto text-gray-500 mb-3" />
            <p>No pending user registrations</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-gray-800/80">
                <TableHead className="text-gray-300">Username</TableHead>
                <TableHead className="text-gray-300">Email</TableHead>
                <TableHead className="text-gray-300">Bitcoin Address</TableHead>
                <TableHead className="text-gray-300">Registered At</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrations?.map((user: UserRegistration) => (
                <TableRow key={user.id} className="hover:bg-gray-700/30">
                  <TableCell className="font-medium text-white">{user.username}</TableCell>
                  <TableCell className="text-gray-300">{user.email}</TableCell>
                  <TableCell className="text-gray-300 font-mono text-xs">
                    {user.bitcoinAddress || <span className="text-gray-500 italic">Not provided</span>}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {new Date(user.registeredAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        user.status === 'pending' 
                          ? 'bg-amber-600/20 text-amber-300 hover:bg-amber-600/30' 
                          : user.status === 'approved' 
                            ? 'bg-green-600/20 text-green-300 hover:bg-green-600/30'
                            : 'bg-red-600/20 text-red-300 hover:bg-red-600/30'
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsApproveDialogOpen(true);
                        }}
                        disabled={user.status !== 'pending'}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsDenyDialogOpen(true);
                        }}
                        disabled={user.status !== 'pending'}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Deny
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Approve Confirmation Dialog */}
      <AlertDialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <AlertDialogContent className="bg-gray-900 border border-green-500/40">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Approve User</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Are you sure you want to approve <span className="text-green-400 font-semibold">{selectedUser?.username}</span>?
              This will grant them access to the platform and all its features.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 text-gray-300 hover:bg-gray-700">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-green-600 hover:bg-green-700"
              onClick={handleApprove}
              disabled={approveMutation.isPending}
            >
              {approveMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Approving...
                </>
              ) : (
                "Approve User"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Deny Confirmation Dialog */}
      <AlertDialog open={isDenyDialogOpen} onOpenChange={setIsDenyDialogOpen}>
        <AlertDialogContent className="bg-gray-900 border border-red-500/40">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Deny Registration</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Are you sure you want to deny <span className="text-red-400 font-semibold">{selectedUser?.username}</span>'s registration?
              This action will prevent them from accessing the platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 text-gray-300 hover:bg-gray-700">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeny}
              disabled={denyMutation.isPending}
            >
              {denyMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Denying...
                </>
              ) : (
                "Deny Registration"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}