'use client'

import { Card, CardHeader, CardDescription, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, Activity, Shield } from "lucide-react"

function formatUsd(value: number) {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function UserStatsCards(props: {
  accountBalance?: number
  currentValue?: number
  lockedValue?: number
  totalInvestment?: number
  roi?: number
  kycStatus: boolean
}) {
  const accountBalance = props.accountBalance ?? 0
  const lockedValue =
    props.lockedValue ?? Math.max(0, (props.currentValue ?? accountBalance) - accountBalance)
  const currentValue = props.currentValue ?? accountBalance + lockedValue
  const totalInvestment = props.totalInvestment ?? 0
  const roi = props.roi ?? 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="pb-2">
          <CardDescription className="text-gray-300 flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Account Balance
          </CardDescription>
          <CardTitle className="text-2xl font-bold text-green-500">
            {formatUsd(accountBalance)}
          </CardTitle>
          <p className="text-xs text-gray-500 pt-1">
            Total equity: {formatUsd(currentValue)} · Locked: {formatUsd(lockedValue)}
          </p>
        </CardHeader>
      </Card>

      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="pb-2">
          <CardDescription className="text-gray-300 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Total Investment
          </CardDescription>
          <CardTitle className="text-2xl font-bold text-blue-500">
            {formatUsd(totalInvestment)}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="pb-2">
          <CardDescription className="text-gray-300 flex items-center gap-2">
            <Activity className="h-4 w-4" />
            ROI
          </CardDescription>
          <CardTitle className={`text-2xl font-bold ${roi >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {roi.toFixed(2)}%
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
  )
}
