
"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Camera, Check, Edit, Key, Lock, Save, User, X } from "lucide-react"
import { useTheme } from "@/components/providers/theme-provider"
import type { RootState, AppDispatch } from "@/redux/store"
import { editProfile, changePassword } from "@/redux/features/auth/authSlice"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useSession } from "next-auth/react"

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }).optional(),
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  role: z.string().optional(),
  language: z.string().optional(),
  phone_number: z.string().optional(),
  worker_role: z.string().optional(),
  get_email_notifications: z.boolean().optional(),
  get_push_notifications: z.boolean().optional(),
  get_sms_notifications: z.boolean().optional(),
  profile_picture: z.string().optional(),
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

const ProfileManagement: React.FC = () => {
  const { theme } = useTheme()
  const { toast } = useToast()
  const dispatch = useDispatch<AppDispatch>()
  const { data: session } = useSession()
  const user = session?.user
  const loading = useSelector((state: RootState) => state.auth.loading)

  const [isEditing, setIsEditing] = useState(false)
  const [profileImage, setProfileImage] = useState(user?.profile_picture || "/placeholder.svg?height=100&width=100")

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      role: "",
      language: "en",
      phone_number: "",
      worker_role: "",
      get_email_notifications: true,
      get_push_notifications: true,
      get_sms_notifications: false,
      profile_picture: "/placeholder.svg?height=100&width=100",
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

  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.name || "",
        username: user.username || user.name || "",
        email: user.email || "",
        role: user.role || "farm_owner",
        language: user.language || "en",
        phone_number: user.phone_number || "",
        worker_role: user.worker_role || "",
        get_email_notifications: user.get_email_notifications ?? true,
        get_push_notifications: user.get_push_notifications ?? true,
        get_sms_notifications: user.get_sms_notifications ?? false,
        profile_picture: user.profile_picture || "/placeholder.svg?height=100&width=100",
        bio: user.bio || "",
      })
      setProfileImage(user.profile_picture || "/placeholder.svg?height=100&width=100")
    }
  }, [user, profileForm])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setProfileImage(base64String)
        profileForm.setValue("profile_picture", base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const onProfileSubmit = async (data: z.infer<typeof profileFormSchema>) => {
    try {
      await dispatch(editProfile(data)).unwrap()
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
        duration: 3000,
      })
      setIsEditing(false)
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error || "An error occurred while updating your profile.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const onPasswordSubmit = async (data: z.infer<typeof passwordFormSchema>) => {
    try {
      await dispatch(
        changePassword({
          old_password: data.old_password,
          new_password: data.new_password,
        }),
      ).unwrap()
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
        duration: 3000,
      })
      passwordForm.reset()
    } catch (error: any) {
      toast({
        title: "Password change failed",
        description: error || "An error occurred while changing your password.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  if (!user) {
    return <div>Loading...</div>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader className="relative">
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <Avatar className="w-24 h-24 border-4 border-background">
                    <AvatarImage src={profileImage} alt="Profile" />
                    <AvatarFallback className="text-2xl">
                      {user.username?.substring(0, 2).toUpperCase() || "U"}
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
                      />
                    </label>
                  )}
                </div>
                <CardTitle className="mt-4 text-center">{user.name || user.username}</CardTitle>
                <CardDescription className="text-center">{user.role || "Farm Owner"}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 opacity-70" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center">
                  <Lock className="h-4 w-4 mr-2 opacity-70" />
                  <span className="text-sm">Last login: Today, 10:30 AM</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? (
                  <>
                    <X className="mr-2 h-4 w-4" /> Cancel Editing
                  </>
                ) : (
                  <>
                    <Edit className="mr-2 h-4 w-4" /> Edit Profile
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <div className="md:col-span-2">
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="w-full">
                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="personal">Personal Info</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="preferences">Preferences</TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal">
                    <Card>
                      <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Update your personal details and contact information</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={profileForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Full Name</FormLabel>
                                  <FormControl>
                                    <Input type="text" disabled={!isEditing} {...field} />
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
                                    <Input type="text" disabled={!isEditing} {...field} />
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
                                    <Input type="email" disabled={!isEditing} {...field} />
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
                                    <Input type="tel" disabled={!isEditing} {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={profileForm.control}
                              name="role"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Role</FormLabel>
                                  <FormControl>
                                    <Input type="text" disabled={!isEditing} {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={profileForm.control}
                              name="worker_role"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Worker Role</FormLabel>
                                  <FormControl>
                                    <Input type="text" disabled={!isEditing} {...field} />
                                  </FormControl>
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
                                    className={`w-full min-h-[100px] rounded-md border p-3 ${
                                      theme === "dark"
                                        ? "bg-gray-800 border-gray-700 text-gray-100"
                                        : "bg-white border-gray-300 text-gray-900"
                                    }`}
                                    disabled={!isEditing}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                      <CardFooter>
                        {isEditing && (
                          <Button type="submit" disabled={loading}>
                            {loading ? (
                              <>
                                <svg
                                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  />
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  />
                                </svg>
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="mr-2 h-4 w-4" /> Save Changes
                              </>
                            )}
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  </TabsContent>

                  <TabsContent value="security">
                    <Card>
                      <CardHeader>
                        <CardTitle>Security Settings</CardTitle>
                        <CardDescription>Manage your password and account security</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Form {...passwordForm}>
                          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                            <FormField
                              control={passwordForm.control}
                              name="old_password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Current Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" {...field} />
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
                                    <Input type="password" {...field} />
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
                                    <Input type="password" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button type="submit" disabled={loading}>
                              {loading ? (
                                <>
                                  <svg
                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    />
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                  </svg>
                                  Changing Password...
                                </>
                              ) : (
                                <>
                                  <Key className="mr-2 h-4 w-4" /> Change Password
                                </>
                              )}
                            </Button>
                          </form>
                        </Form>

                        <div className="pt-6 border-t mt-6">
                          <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Two-factor authentication</p>
                              <p className="text-sm text-muted-foreground">
                                Add an extra layer of security to your account
                              </p>
                            </div>
                            <Button variant="outline">Setup 2FA</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="preferences">
                    <Card>
                      <CardHeader>
                        <CardTitle>Notification Preferences</CardTitle>
                        <CardDescription>Manage how you receive notifications and alerts</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-4">
                          <FormField
                            control={profileForm.control}
                            name="get_email_notifications"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-between">
                                <div>
                                  <FormLabel>Email Notifications</FormLabel>
                                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={!isEditing}
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
                                <div>
                                  <FormLabel>Push Notifications</FormLabel>
                                  <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={!isEditing}
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
                                <div>
                                  <FormLabel>SMS Notifications</FormLabel>
                                  <p className="text-sm text-muted-foreground">Receive notifications via text message</p>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={!isEditing}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="pt-6 border-t">
                          <h3 className="text-lg font-medium mb-4">Language & Region</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={profileForm.control}
                              name="language"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Language</FormLabel>
                                  <FormControl>
                                    <select
                                      className={`w-full rounded-md border p-2 ${
                                        theme === "dark"
                                          ? "bg-gray-800 border-gray-700 text-gray-100"
                                          : "bg-white border-gray-300 text-gray-900"
                                      }`}
                                      disabled={!isEditing}
                                      {...field}
                                    >
                                      <option value="en">English</option>
                                      <option value="es">Spanish</option>
                                      <option value="fr">French</option>
                                      <option value="de">German</option>
                                      <option value="am">Amharic</option>
                                    </select>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="space-y-2">
                              <Label htmlFor="timezone">Timezone</Label>
                              <select
                                id="timezone"
                                className={`w-full rounded-md border p-2 ${
                                  theme === "dark"
                                    ? "bg-gray-800 border-gray-700 text-gray-100"
                                    : "bg-white border-gray-300 text-gray-900"
                                }`}
                                disabled={!isEditing}
                              >
                                <option value="utc">UTC (GMT+0)</option>
                                <option value="est">Eastern Time (GMT-5)</option>
                                <option value="cst">Central Time (GMT-6)</option>
                                <option value="pst">Pacific Time (GMT-8)</option>
                                <option value="eat">East Africa Time (GMT+3)</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end">
                        {isEditing && (
                          <Button type="submit" disabled={loading}>
                            {loading ? (
                              <>
                                <svg
                                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  />
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  />
                                </svg>
                                Saving...
                              </>
                            ) : (
                              <>
                                <Check className="mr-2 h-4 w-4" /> Save Preferences
                              </>
                            )}
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  </TabsContent>
                </Tabs>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileManagement
