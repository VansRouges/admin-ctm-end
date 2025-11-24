'use client'

import { Card, CardHeader, CardDescription, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { DollarSign, TrendingUp, Activity, Shield, Pencil } from "lucide-react"
import { useState, useTransition } from "react"
import { updateUser } from "@/app/actions/users"
import { useRouter } from "next/navigation"

export function UserStatsCards(props: {
  userId: string
  accountBalance?: number
  totalInvestment?: number
  roi?: number
  kycStatus: boolean
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const displayValue = props.accountBalance ?? 0
  const displayInvestment = props.totalInvestment ?? 0
  const displayRoi = props.roi ?? 0
  const [accountBalance, setAccountBalance] = useState<number>(displayValue)
  const [totalInvestment, setTotalInvestment] = useState<number>(displayInvestment)
  const [roi, setRoi] = useState<number>(displayRoi)
  const [kycStatus, setKycStatus] = useState<boolean>(props.kycStatus)
  const [isPending, startTransition] = useTransition()

  const onSave = () => {
    startTransition(async () => {
      await updateUser(props.userId, { accountBalance, totalInvestment, roi, kycStatus })
      setOpen(false)
      router.refresh()
    })
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="pb-2">
            <CardDescription className="text-gray-300 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Account Balance
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-green-500">
              ${displayValue.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="pb-2">
            <CardDescription className="text-gray-300 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Total Investment
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-blue-500">
              ${displayInvestment.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="pb-2">
            <CardDescription className="text-gray-300 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              ROI
            </CardDescription>
            <CardTitle className={`text-2xl font-bold ${displayRoi >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {displayRoi.toFixed(2)}%
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="pb-2">
            <CardDescription className="text-gray-300 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              KYC Status
            </CardDescription>
            <CardTitle className="text-lg font-bold">
              <Badge 
                variant={props.kycStatus ? "default" : "secondary"} 
                className={props.kycStatus ? "bg-green-500 text-white border-0" : "bg-red-500 text-white border-0"}
              >
                {props.kycStatus ? "Verified" : "Pending"}
              </Badge>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="absolute -top-4 right-0">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
              <Pencil className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Edit Stats</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accountBalance" className="text-white">Account Balance</Label>
                <Input id="accountBalance" type="number" value={accountBalance} onChange={(e) => setAccountBalance(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalInvestment" className="text-white">Total Investment</Label>
                <Input id="totalInvestment" type="number" value={totalInvestment} onChange={(e) => setTotalInvestment(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roi" className="text-white">ROI (%)</Label>
                <Input id="roi" type="number" step="0.01" value={roi} onChange={(e) => setRoi(Number(e.target.value))} />
              </div>
              <div className="space-y-2 flex items-center gap-2">
                <Checkbox id="kycStatus" checked={kycStatus} onCheckedChange={(v) => setKycStatus(Boolean(v))} />
                <Label htmlFor="kycStatus" className="text-white">KYC Verified</Label>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={onSave} disabled={isPending}>{isPending ? "Saving..." : "Save"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}