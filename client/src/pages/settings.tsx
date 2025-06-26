import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, X, Receipt, Gift, CreditCard } from "lucide-react";

export default function Settings() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    practiceName: "",
    specialty: "",
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Populate form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        practiceName: user.practiceName || "",
        specialty: user.specialty || "",
      });
    }
  }, [user]);

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await apiRequest("PUT", "/api/user/profile", formData);
      toast({
        title: "Profile Updated",
        description: "Your account information has been saved successfully.",
      });
    } catch (error) {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      
      toast({
        title: "Save Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation do not match.",
        variant: "destructive",
      });
      return;
    }

    setIsChangingPassword(true);

    try {
      await apiRequest("PUT", "/api/user/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });
      
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      
      toast({
        title: "Password Change Failed",
        description: "Failed to change password. Please check your current password.",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleUpgrade = () => {
    window.location.href = "/subscribe";
  };

  const handleManageBilling = () => {
    // In a real app, this would redirect to Stripe customer portal
    toast({
      title: "Coming Soon",
      description: "Billing management will be available soon.",
    });
  };

  if (isLoading || !isAuthenticated) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-montserrat font-bold text-slate-blue mb-2">Settings & Billing</h2>
          <p className="text-muted-foreground">Manage your account and subscription</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Account Settings */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="border-b border pb-4 mb-6">
                  <h3 className="text-lg font-montserrat font-semibold text-slate-blue">Account Information</h3>
                </div>
                
                <form onSubmit={handleSaveAccount} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-sm font-medium text-muted-foreground">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-sm font-medium text-muted-foreground">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1"
                      disabled
                    />
                    <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="practiceName" className="text-sm font-medium text-muted-foreground">
                      Practice Name
                    </Label>
                    <Input
                      id="practiceName"
                      value={formData.practiceName}
                      onChange={(e) => setFormData({ ...formData, practiceName: e.target.value })}
                      className="mt-1"
                      placeholder="Your clinic or practice name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="specialty" className="text-sm font-medium text-muted-foreground">
                      Specialty
                    </Label>
                    <Select 
                      value={formData.specialty} 
                      onValueChange={(value) => setFormData({ ...formData, specialty: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select your specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gastroenterology">Gastroenterology</SelectItem>
                        <SelectItem value="orthopedics">Orthopedics</SelectItem>
                        <SelectItem value="endocrinology">Endocrinology</SelectItem>
                        <SelectItem value="pain-management">Pain Management</SelectItem>
                        <SelectItem value="cardiology">Cardiology</SelectItem>
                        <SelectItem value="dermatology">Dermatology</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit"
                      disabled={isSaving}
                      className="bg-emerald-green text-white hover:bg-emerald-green/90"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Password Change */}
            <Card>
              <CardContent className="p-6">
                <div className="border-b border pb-4 mb-6">
                  <h3 className="text-lg font-montserrat font-semibold text-slate-blue">Change Password</h3>
                </div>
                
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword" className="text-sm font-medium text-muted-foreground">
                      Current Password
                    </Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="newPassword" className="text-sm font-medium text-muted-foreground">
                      New Password
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-muted-foreground">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit"
                      disabled={isChangingPassword}
                      className="bg-deep-navy text-primary-foreground hover:bg-deep-navy/90"
                    >
                      {isChangingPassword ? "Updating..." : "Update Password"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Subscription Info */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="border-b border pb-4 mb-6">
                  <h3 className="text-lg font-montserrat font-semibold text-slate-blue">Current Plan</h3>
                </div>
                
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    {user?.subscriptionStatus === 'free' ? (
                      <Gift className="w-8 h-8 text-blue-600" />
                    ) : (
                      <CreditCard className="w-8 h-8 text-emerald-600" />
                    )}
                  </div>
                  <h4 className="text-xl font-montserrat font-bold text-slate-blue">
                    {user?.subscriptionStatus === 'free' ? 'Free Plan' : 'Pro Plan'}
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    {user?.subscriptionStatus === 'free' ? '1 workflow per month' : 'Unlimited workflows'}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Workflows Used</span>
                    <span className="font-medium text-slate-blue">
                      {user?.workflowsUsedThisMonth || 0} / {user?.subscriptionStatus === 'free' ? '1' : '∞'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">AI Analysis</span>
                    <CheckCircle className="w-4 h-4 text-emerald-green" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">PDF Export</span>
                    {user?.subscriptionStatus === 'free' ? (
                      <X className="w-4 h-4 text-red-500" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-emerald-green" />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Priority Support</span>
                    {user?.subscriptionStatus === 'free' ? (
                      <X className="w-4 h-4 text-red-500" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-emerald-green" />
                    )}
                  </div>
                </div>

                {user?.subscriptionStatus === 'free' ? (
                  <Button 
                    onClick={handleUpgrade}
                    className="w-full bg-emerald-green text-white hover:bg-emerald-green/90 mb-4"
                  >
                    Upgrade to Pro - $49/month
                  </Button>
                ) : (
                  <Button 
                    onClick={handleManageBilling}
                    variant="outline"
                    className="w-full mb-4"
                  >
                    Manage Billing
                  </Button>
                )}

                <div className="text-center">
                  <a href="/pricing" className="text-sm text-muted-foreground hover:text-slate-blue">
                    View all plans
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Billing History */}
            <Card>
              <CardContent className="p-6">
                <div className="border-b border pb-4 mb-6">
                  <h3 className="text-lg font-montserrat font-semibold text-slate-blue">Billing History</h3>
                </div>
                
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                    <Receipt className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {user?.subscriptionStatus === 'free' ? 'No billing history yet' : 'Billing history will appear here'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
