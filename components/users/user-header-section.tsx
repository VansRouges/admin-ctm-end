'use client'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useState, useTransition } from "react"
import { Pencil } from "lucide-react"
import { updateUser } from "@/app/actions/users"
import { useRouter } from "next/navigation"

export function UserHeaderSection(props: {
  userId: string
  displayName: string
  accountStatus: boolean
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [accountStatus, setAccountStatus] = useState(props.accountStatus)
  const [isPending, startTransition] = useTransition()

  const onSave = () => {
    startTransition(async () => {
      await updateUser(props.userId, { accountStatus })
      setOpen(false)
      router.refresh()
    })
  }

  return (
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-3xl font-bold text-yellow-500">
          {props.displayName}
        </h1>
        <p className="text-gray-400 mt-2">Detailed user information and account status</p>
      </div>

      <div className="flex items-center gap-3">
        <Badge 
          variant={props.accountStatus ? "default" : "secondary"} 
          className={props.accountStatus ? "bg-green-500 text-white border-0 text-lg px-4 py-1" : "bg-red-500 text-white border-0 text-lg px-4 py-1"}
        >
          {props.accountStatus ? "Active" : "Inactive"}
        </Badge>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
              <Pencil className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Edit Account Status</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Checkbox id="accountStatus" checked={accountStatus} onCheckedChange={(v) => setAccountStatus(Boolean(v))} />
                <Label htmlFor="accountStatus" className="text-white">Active</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={onSave} disabled={isPending}>
                  {isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}