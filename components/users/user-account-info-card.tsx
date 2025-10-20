'use client'

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Activity, Calendar, Pencil } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function UserAccountInfoCard(props: {
  userId: string
  _id: string
  clerkId: string
  createdAt: string
  updatedAt: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <Card className="bg-gray-900 border-gray-700 relative">
      <div className="absolute top-2 right-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white" title="No editable fields">
              <Pencil className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Account Information</DialogTitle>
              <DialogDescription className="text-gray-400">
                These fields are read-only.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="_id" className="text-white">User ID</Label>
                <Input id="_id" className="text-white" value={props._id} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="createdAt" className="text-white">Account Created</Label>
                <Input id="createdAt" className="text-white" value={formatDate(props.createdAt)} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="updatedAt" className="text-white">Last Updated</Label>
                <Input id="updatedAt" className="text-white" value={formatDate(props.updatedAt)} readOnly />
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="secondary" onClick={() => setOpen(false)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <CardHeader>
        <CardTitle className="text-yellow-500 flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Account Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-gray-400 text-sm">User ID</p>
          <p className="text-white font-medium font-mono text-xs break-all">{props._id}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Account Created
          </p>
          <p className="text-white font-medium">{formatDate(props.createdAt)}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Last Updated
          </p>
          <p className="text-white font-medium">{formatDate(props.updatedAt)}</p>
        </div>
      </CardContent>
    </Card>
  )
}