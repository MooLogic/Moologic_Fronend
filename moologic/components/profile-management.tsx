"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { 
  AlertCircle,
  Camera, 
  Check, 
  Edit, 
  Key, 
  Lock, 
  Mail, 
  Save, 
  Shield, 
  User, 
  X 
} from "lucide-react"
import { useTheme } from "@/components/providers/theme-provider"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useSession, getSession } from "next-auth/react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  useCheckEmailVerificationQuery,
  useSendVerificationEmailMutation,
  useUpdateProfileMutation,
  useUpdateProfilePictureMutation,
  useChangePasswordMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
  useGetCurrentUserQuery,
} from "@/lib/service/userService"

const WORKER_ROLES = [
  { value: "farm_manager", label: "Farm Manager" },
  { value: "veterinarian", label: "Veterinarian" },
  { value: "herdsman", label: "Herdsman" },
  { value: "milking_operator", label: "Milking Operator" },
  { value: "general_worker", label: "General Worker" },
]

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  role: z.string(),
  language: z.string(),
  phone_number: z.string().optional(),
  worker_role: z.string().optional(),
  get_email_notifications: z.boolean(),
  get_push_notifications: z.boolean(),
  get_sms_notifications: z.boolean(),
  bio: z.string().optional(),
})

const passwordFormSchema = z
  .object({
    old_password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    new_password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  })

const resetPasswordFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
})

export default function ProfileManagement() {
  const { theme } = useTheme()
  const { toast } = useToast()
  const { data: session, update: updateSession, status } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [profileImage, setProfileImage] = useState("/placeholder.svg?height=100&width=100")

  // Skip queries if not authenticated
  const skipQuery = !session?.user?.accessToken

  // RTK Query hooks with skip option
  const { data: currentUser, isLoading: isLoadingUser } = useGetCurrentUserQuery(undefined, {
    skip: skipQuery
  })
  const { data: emailVerificationData, refetch: refetchEmailVerification } = useCheckEmailVerificationQuery(undefined, {
    skip: skipQuery
  })
  const [sendVerificationEmail] = useSendVerificationEmailMutation()
  const [updateProfile] = useUpdateProfileMutation()
  const [updateProfilePicture] = useUpdateProfilePictureMutation()
  const [changePassword] = useChangePasswordMutation()
  const [requestPasswordReset] = useRequestPasswordResetMutation()

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      role: "user",
      language: "en",
      phone_number: "",
      worker_role: "",
      get_email_notifications: true,
      get_push_notifications: true,
      get_sms_notifications: false,
      bio: "",
    },
  })

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
  })

  const resetPasswordForm = useForm<z.infer<typeof resetPasswordFormSchema>>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      email: session?.user?.email || "",
    },
  })

  useEffect(() => {
    if (currentUser) {
      profileForm.reset({
        name: currentUser.full_name || "",
        username: currentUser.username || "",
        email: currentUser.email || "",
        role: currentUser.role || "user",
        language: currentUser.language || "en",
        phone_number: currentUser.phone_number || "",
        worker_role: currentUser.worker_role || "",
        get_email_notifications: currentUser.get_email_notifications,
        get_push_notifications: currentUser.get_push_notifications,
        get_sms_notifications: currentUser.get_sms_notifications,
        bio: currentUser.bio || "",
      })
      // Update to handle full URL for profile picture
      const profilePicUrl = currentUser.profile_picture
        ? currentUser.profile_picture.startsWith('http')
          ? currentUser.profile_picture
          : `${process.env.NEXT_PUBLIC_API_URL}${currentUser.profile_picture}`
        : "/placeholder.svg?height=100&width=100"
      setProfileImage(profilePicUrl)
    }
  }, [currentUser, profileForm])

  // Update loading state based on session status and user loading
  useEffect(() => {
    if (status === 'loading' || isLoadingUser) {
      setIsLoading(true)
    } else {
      setIsLoading(false)
    }
  }, [status, isLoadingUser])

  // Don't render until we have session data and user data
  if (status === 'loading' || isLoadingUser) {
    return <div>Loading...</div>
  }

  if (!session?.user) {
    return <div>Please sign in to access your profile</div>
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        setIsLoading(true)
        const formData = new FormData()
        formData.append('profile_picture', file)

        const result = await updateProfilePicture(formData).unwrap()
        setProfileImage(result.profile_picture_url)
        
        // Update session
        await updateSession({
          ...session,
          user: {
            ...session?.user,
            image: result.profile_picture_url,
          },
        })

        toast({
          title: "Success",
          description: "Profile picture updated successfully",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update profile picture",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const onProfileSubmit = async (data: z.infer<typeof profileFormSchema>) => {
    try {
      setIsLoading(true)
      const result = await updateProfile({
        name: data.name,
        username: data.username,
        email: data.email,
        phone_number: data.phone_number,
        bio: data.bio,
        language: data.language,
        worker_role: data.worker_role,
        get_email_notifications: data.get_email_notifications,
        get_push_notifications: data.get_push_notifications,
        get_sms_notifications: data.get_sms_notifications,
      }).unwrap()
      
      // Update session with new user data
      await updateSession({
        ...session,
        user: {
          ...session?.user,
          ...result.user,
        },
      })

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
      setIsEditing(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onPasswordSubmit = async (data: z.infer<typeof passwordFormSchema>) => {
    try {
      setIsLoading(true)
      await changePassword({
          old_password: data.old_password,
          new_password: data.new_password,
      }).unwrap()

      toast({
        title: "Success",
        description: "Password changed successfully",
      })
      passwordForm.reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change password",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onResetPasswordSubmit = async (data: z.infer<typeof resetPasswordFormSchema>) => {
    try {
      setIsLoading(true)
      await requestPasswordReset({ email: data.email }).unwrap()

      toast({
        title: "Success",
        description: "Password reset email sent",
      })
      resetPasswordForm.reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reset email",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendVerificationEmail = async () => {
    try {
      setIsLoading(true)
      await sendVerificationEmail().unwrap()
      await refetchEmailVerification()

      toast({
        title: "Success",
        description: "Verification email sent",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send verification email",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile Management</h1>
            <p className="text-muted-foreground">View and update your profile information and preferences</p>
          </div>
        </div>

        {!emailVerificationData?.is_verified && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Verify your email</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>Please verify your email address to access all features.</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSendVerificationEmail}
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send verification email"}
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="profile" className="w-full">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            {session.user.role === 'worker' && <TabsTrigger value="role">Worker Role</TabsTrigger>}
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader className="relative">
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <Avatar className="w-24 h-24 border-4 border-background">
                      <AvatarImage src={profileImage} alt="Profile" />
                      <AvatarFallback className="text-2xl">
                        {session.user.name?.substring(0, 2).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <label className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                        <Camera className="text-white h-6 w-6" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                          disabled={isLoading}
                        />
                      </label>
                    )}
                  </div>
                  <div className="mt-4 text-center">
                    <h2 className="text-xl font-semibold">{currentUser?.full_name || "User"}</h2>
                    <p className="text-sm text-muted-foreground">{currentUser?.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={emailVerificationData?.is_verified ? "default" : "secondary"} className={emailVerificationData?.is_verified ? "bg-green-500" : "bg-yellow-500"}>
                        {emailVerificationData?.is_verified ? "Verified" : "Unverified"}
                      </Badge>
                      <Badge variant="outline">{session.user.role}</Badge>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                </Button>
              </CardHeader>

              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={profileForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={!isEditing || isLoading}
                                placeholder="Enter your name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={!isEditing || isLoading}
                                placeholder="Enter your username"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                disabled={!isEditing || isLoading}
                                placeholder="Enter your email"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="phone_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={!isEditing || isLoading}
                                placeholder="Enter your phone number"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="language"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Language</FormLabel>
                            <Select
                              disabled={!isEditing || isLoading}
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a language" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="am">Amharic</SelectItem>
                                <SelectItem value="or">Oromiffa</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={profileForm.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <textarea
                              {...field}
                              className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              disabled={!isEditing || isLoading}
                              placeholder="Tell us about yourself"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Notification Preferences</h3>
                      <div className="grid gap-4">
                        <FormField
                          control={profileForm.control}
                          name="get_email_notifications"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                              <FormLabel>Email Notifications</FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  disabled={!isEditing || isLoading}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="get_push_notifications"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                              <FormLabel>Push Notifications</FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  disabled={!isEditing || isLoading}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="get_sms_notifications"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                              <FormLabel>SMS Notifications</FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  disabled={!isEditing || isLoading}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>

                  {isEditing && (
                    <CardFooter className="flex justify-end space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <span className="loading loading-spinner loading-sm mr-2"></span>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  )}
                </form>
              </Form>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    Change Password
                  </CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>

                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
                    <CardContent className="space-y-4">
                      <FormField
                        control={passwordForm.control}
                        name="old_password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="password"
                                disabled={isLoading}
                                placeholder="Enter your current password"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={passwordForm.control}
                        name="new_password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="password"
                                disabled={isLoading}
                                placeholder="Enter your new password"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={passwordForm.control}
                        name="confirm_password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="password"
                                disabled={isLoading}
                                placeholder="Confirm your new password"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>

                    <CardFooter>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <span className="loading loading-spinner loading-sm mr-2"></span>
                            Updating...
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4 mr-2" />
                            Update Password
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Email Verification
                  </CardTitle>
                  <CardDescription>
                    Verify your email address to access all features
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {emailVerificationData?.is_verified ? (
                        <Shield className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                      )}
                      <span>
                        {emailVerificationData?.is_verified
                          ? "Your email is verified"
                          : "Your email is not verified"}
                      </span>
                    </div>
                    {!emailVerificationData?.is_verified && (
                      <Button
                        variant="outline"
                        onClick={handleSendVerificationEmail}
                        disabled={isLoading}
                      >
                        {isLoading ? "Sending..." : "Send verification email"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    Reset Password
                  </CardTitle>
                  <CardDescription>
                    Request a password reset link via email
                  </CardDescription>
                </CardHeader>

                <Form {...resetPasswordForm}>
                  <form onSubmit={resetPasswordForm.handleSubmit(onResetPasswordSubmit)}>
                    <CardContent className="space-y-4">
                      <FormField
                        control={resetPasswordForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                disabled={isLoading}
                                placeholder="Enter your email address"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>

                    <CardFooter>
                      <Button type="submit" variant="outline" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <span className="loading loading-spinner loading-sm mr-2"></span>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Mail className="w-4 h-4 mr-2" />
                            Send Reset Link
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            </div>
          </TabsContent>

          {session.user.role === 'worker' && (
            <TabsContent value="role">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Worker Role
                  </CardTitle>
                  <CardDescription>
                    Select your specific role in the farm
                  </CardDescription>
                </CardHeader>

                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                    <CardContent>
                      <FormField
                        control={profileForm.control}
                        name="worker_role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select Role</FormLabel>
                            <Select
                              disabled={!isEditing || isLoading}
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {WORKER_ROLES.map((role) => (
                                  <SelectItem key={role.value} value={role.value}>
                                    {role.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>

                    {isEditing && (
                      <CardFooter>
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <span className="loading loading-spinner loading-sm mr-2"></span>
                              Updating...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Update Role
                            </>
                          )}
                        </Button>
                      </CardFooter>
                    )}
                  </form>
                </Form>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  )
}
