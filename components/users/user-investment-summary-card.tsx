'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { TrendingUp, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMemo } from "react"

export function UserInvestmentSummaryCard(props: {
  totalInvestment: number
  accountBalance: number
  currentValue?: number
  lifetimeWithdrawals?: number
  roi: number
}) {
  const currentValue = props.currentValue ?? props.accountBalance ?? 0
  const lockedValue = useMemo(() => {
    return Math.max(0, currentValue - (props.accountBalance ?? 0))
  }, [currentValue, props.accountBalance])

  const net = useMemo(() => {
    const investment = props.totalInvestment ?? 0
    const withdrawals = props.lifetimeWithdrawals ?? 0
    return currentValue + withdrawals - investment
  }, [currentValue, props.lifetimeWithdrawals, props.totalInvestment])

  const formatUsd = (value: number) =>
    `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  return (
    <Card className="bg-gray-900 border-gray-700 relative">
      <div className="absolute top-2 right-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-300 hover:text-white"
          title="Edit values in the Stats section"
        >
          <Pencil className="h-5 w-5" />
        </Button>
      </div>
      <CardHeader>
        <CardTitle className="text-yellow-500 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Investment Summary
        </CardTitle>
        <CardDescription className="text-gray-300">
          Lifetime deposits, available balance, and total equity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <p className="text-gray-400 text-sm">Total Investment</p>
            <p className="text-2xl font-bold text-blue-500">
              {formatUsd(props.totalInvestment ?? 0)}
            </p>
            <p className="text-xs text-gray-500">Lifetime deposits</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-gray-400 text-sm">Account Balance</p>
            <p className="text-2xl font-bold text-green-500">
              {formatUsd(props.accountBalance ?? 0)}
            </p>
            <p className="text-xs text-gray-500">Available to spend</p>
          </div>

          <div className="space-y-2">
            <p className="text-gray-400 text-sm">Current Value</p>
            <p className="text-2xl font-bold text-yellow-500">
              {formatUsd(currentValue)}
            </p>
            <p className="text-xs text-gray-500">
              Locked in trades: {formatUsd(lockedValue)}
            </p>
          </div>
          
          <div className="space-y-2">
            <p className="text-gray-400 text-sm">Net Gain/Loss</p>
            <p className={`text-2xl font-bold ${net >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatUsd(net)}
            </p>
            <p className="text-xs text-gray-500">
              Includes withdrawals: {formatUsd(props.lifetimeWithdrawals ?? 0)}
            </p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Return on Investment (ROI)</span>
            <span className={`text-xl font-bold ${(props.roi ?? 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {(props.roi ?? 0).toFixed(2)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
