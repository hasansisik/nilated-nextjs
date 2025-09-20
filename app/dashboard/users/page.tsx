'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { 
  getAllUsers, 
  register, 
  editUser, 
  deleteUser 
} from "@/redux/actions/userActions";
import { AppDispatch, RootState } from "@/redux/store";
import {
  Plus,
  X,
  Loader2,
  UserCog,
  Trash2,
  Lock,
  AlertCircle,
  CheckCircle,
  Building,
  Pencil
} from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { User, UserRole } from "@/lib/types";
import { toast } from "sonner";

export default function UsersPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error, success, message, user: currentUser } = useSelector(
    (state: RootState) => state.user
  );
  
  // Form states
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("user");
  const [companyId, setCompanyId] = useState("");
  const [status, setStatus] = useState<string>("active");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch users
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  // Handle success or error message
  useEffect(() => {
    if (success && message) {
      setFormSuccess(message);
      setTimeout(() => setFormSuccess(null), 5000);
    }
    
    if (error) {
      setFormError(error);
      setTimeout(() => setFormError(null), 5000);
    }
  }, [success, message, error]);

  // Add new user handler
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    setIsSubmitting(true);
    
    if (password.length < 6) {
      setFormError("Password must be at least 6 characters");
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Use current user's company ID if not specified
      const userCompanyId = companyId || currentUser?.companyId;
      
      await dispatch(register({
        name,
        email,
        password,
        role,
        companyId: userCompanyId
      })).unwrap();
      
      setFormSuccess("User added successfully");
      
      // Reset form
      setName("");
      setEmail("");
      setPassword("");
      setRole("user");
      setCompanyId("");
      setAddUserDialogOpen(false);
    } catch (err: any) {
      setFormError(err || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit user handler
  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    setIsSubmitting(true);
    
    if (!selectedUser) {
      setFormError("No user selected");
      setIsSubmitting(false);
      return;
    }
    
    try {
      await dispatch(editUser({
        userId: selectedUser._id,
        name,
        email,
        role,
        status,
        companyId: companyId || selectedUser.companyId
      })).unwrap();
      
      setFormSuccess("User updated successfully");
      
      // Reset form
      setEditUserDialogOpen(false);
      setSelectedUser(null);
      
      // Refresh user list
      dispatch(getAllUsers());
    } catch (err: any) {
      setFormError(err || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Change password handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    setIsSubmitting(true);
    
    if (!selectedUser) {
      setFormError("No user selected");
      setIsSubmitting(false);
      return;
    }
    
    if (newPassword.length < 6) {
      setFormError("Password must be at least 6 characters");
      setIsSubmitting(false);
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setFormError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }
    
    try {
      await dispatch(editUser({
        userId: selectedUser._id,
        password: newPassword
      })).unwrap();
      
      setFormSuccess("Password changed successfully");
      
      // Reset form
      setNewPassword("");
      setConfirmPassword("");
      setChangePasswordDialogOpen(false);
      setSelectedUser(null);
    } catch (err: any) {
      setFormError(err || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete user handler
  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      await dispatch(deleteUser(userId)).unwrap();
      toast.success("User deleted successfully");
    } catch (err: any) {
      toast.error(err || "Failed to delete user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleBadgeStyles = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-destructive/20 text-destructive hover:bg-destructive/30';
      case 'editor':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      default:
        return 'bg-primary/20 text-primary hover:bg-primary/30';
    }
  };

  // Check if user is admin
  const isAdmin = currentUser?.role === 'admin';

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Users</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <>
            {formSuccess && (
              <Alert variant="default" className="mb-4 bg-green-50 text-green-800 border-green-300">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{formSuccess}</AlertDescription>
              </Alert>
            )}
            
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">User Management</h1>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboard/users/form')}
                >
                  <Building className="mr-2 h-4 w-4" />
                  Contact Forms
                </Button>
                {isAdmin && (
                  <Button 
                    onClick={() => {
                      setAddUserDialogOpen(true);
                      setFormError(null);
                      setFormSuccess(null);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New User
                  </Button>
                )}
              </div>
            </div>

            {currentUser && (
              <Alert className="mb-4">
                <Building className="h-4 w-4" />
                <AlertDescription>
                  You are managing users for company: <strong>{currentUser.companyId}</strong>
                </AlertDescription>
              </Alert>
            )}
            
            {/* Add User Dialog */}
            <Dialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>
                    Create a new user account with the required information.
                  </DialogDescription>
                </DialogHeader>
                {formError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handleAddUser}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="name" className="text-right text-sm font-medium">
                        Name
                      </label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="email" className="text-right text-sm font-medium">
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="password" className="text-right text-sm font-medium">
                        Password
                      </label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="col-span-3"
                        required
                        minLength={6}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="role" className="text-right text-sm font-medium">
                        Role
                      </label>
                      <Select
                        value={role}
                        onValueChange={(value) => setRole(value as UserRole)}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {isAdmin && (
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="companyId" className="text-right text-sm font-medium">
                          Company ID
                        </label>
                        <Input
                          id="companyId"
                          value={companyId}
                          onChange={(e) => setCompanyId(e.target.value)}
                          className="col-span-3"
                          placeholder={`Default: ${currentUser?.companyId}`}
                        />
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        'Add User'
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            
            {/* Edit User Dialog */}
            <Dialog open={editUserDialogOpen} onOpenChange={setEditUserDialogOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    Edit User: {selectedUser?.name}
                  </DialogTitle>
                  <DialogDescription>
                    Update the user account information.
                  </DialogDescription>
                </DialogHeader>
                {formError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handleEditUser}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="edit-name" className="text-right text-sm font-medium">
                        Name
                      </label>
                      <Input
                        id="edit-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="edit-email" className="text-right text-sm font-medium">
                        Email
                      </label>
                      <Input
                        id="edit-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="edit-role" className="text-right text-sm font-medium">
                        Role
                      </label>
                      <Select
                        value={role}
                        onValueChange={(value) => setRole(value as UserRole)}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="edit-status" className="text-right text-sm font-medium">
                        Status
                      </label>
                      <Select
                        value={status}
                        onValueChange={(value) => setStatus(value)}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {isAdmin && (
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="edit-companyId" className="text-right text-sm font-medium">
                          Company ID
                        </label>
                        <Input
                          id="edit-companyId"
                          value={companyId}
                          onChange={(e) => setCompanyId(e.target.value)}
                          className="col-span-3"
                          placeholder={`Current: ${selectedUser?.companyId || currentUser?.companyId}`}
                        />
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        'Update User'
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            
            {/* Change Password Dialog */}
            <Dialog open={changePasswordDialogOpen} onOpenChange={setChangePasswordDialogOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    Change Password for {selectedUser?.name}
                  </DialogTitle>
                  <DialogDescription>
                    Update the password for this user account.
                  </DialogDescription>
                </DialogHeader>
                {formError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handleChangePassword}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="new-password" className="text-right text-sm font-medium">
                        New Password
                      </label>
                      <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="col-span-3"
                        required
                        minLength={6}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="confirm-password" className="text-right text-sm font-medium">
                        Confirm
                      </label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="col-span-3"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        'Update Password'
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            
            {/* Users Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Company ID</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users && users.length > 0 ? (
                      users.map((user: any) => (
                        <TableRow key={user._id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{user.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{user.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{user.email}</TableCell>
                          <TableCell>
                            <Badge className={getRoleBadgeStyles(user.role)}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {user.companyId}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            {isAdmin && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedUser(user);
                                    // Populate form fields with user data
                                    setName(user.name || "");
                                    setEmail(user.email || "");
                                    setRole(user.role || "user");
                                    setStatus(user.status || "active");
                                    setCompanyId(user.companyId || "");
                                    setEditUserDialogOpen(true);
                                    setFormError(null);
                                    setFormSuccess(null);
                                  }}
                                  className="mr-1"
                                >
                                  <Pencil className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setChangePasswordDialogOpen(true);
                                    setFormError(null);
                                    setFormSuccess(null);
                                  }}
                                  className="mr-1"
                                >
                                  <Lock className="h-4 w-4 mr-1" />
                                  Password
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteUser(user._id)}
                                  className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                                  disabled={user._id === currentUser?._id}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </Button>
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                          No users found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </>
  );
}
