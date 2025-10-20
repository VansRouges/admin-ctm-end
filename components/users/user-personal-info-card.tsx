'use client'

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Shield, Pencil } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useTransition } from "react"
import { updateUser } from "@/app/actions/users"
import { useRouter } from "next/navigation"

export function UserPersonalInfoCard(props: {
  userId: string
  firstName: string
  lastName: string
  username: string
  email: string
  role: string
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [firstName, setFirstName] = useState(props.firstName || "")
  const [lastName, setLastName] = useState(props.lastName || "")
  const [username, setUsername] = useState(props.username || "")
  const [email, setEmail] = useState(props.email || "")
  const [role, setRole] = useState(props.role || "")
  const [isPending, startTransition] = useTransition()

  const onSave = () => {
    startTransition(async () => {
      await updateUser(props.userId, { firstName, lastName, username, email, role })
      setOpen(false)
      router.refresh()
    })
  }

  return (
    <Card className="bg-gray-900 border-gray-700 relative">
      <div className="absolute top-2 right-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
              <Pencil className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Edit Personal Information</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-white">First Name</Label>
                <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-white">Last Name</Label>
                <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className="text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">Username</Label>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="text-white" readOnly />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="role" className="text-white">Role</Label>
                <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} className="text-white" readOnly />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={onSave} disabled={isPending}>{isPending ? "Saving..." : "Save"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <CardHeader>
        <CardTitle className="text-yellow-500 flex items-center gap-2">
          <User className="h-5 w-5" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400 text-sm">First Name</p>
            <p className="text-white font-medium">{props.firstName || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Last Name</p>
            <p className="text-white font-medium">{props.lastName || 'N/A'}</p>
          </div>
        </div>
        
        <div>
          <p className="text-gray-400 text-sm flex items-center gap-2">
            <User className="h-4 w-4" />
            Username
          </p>
          <p className="text-white font-medium">{props.username}</p>
        </div>
        
        <div>
          <p className="text-gray-400 text-sm flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </p>
          <p className="text-white font-medium">{props.email}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Role
          </p>
          <Badge variant="outline" className="text-white border-gray-600 mt-1">
            {props.role}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}