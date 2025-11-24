'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { TrendingUp, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useMemo } from "react"

export function UserInvestmentSummaryCard(props: {
  totalInvestment: number
  accountBalance: number
  roi: number
}) {
  const [openDisabledTip, setOpenDisabledTip] = useState(false)
  const net = useMemo(() => {
    const balance = props.accountBalance ?? 0
    const investment = props.totalInvestment ?? 0
    return balance - investment
  }, [props.accountBalance, props.totalInvestment])

  return (
    <Card className="bg-gray-900 border-gray-700 relative">
      <div className="absolute top-2 right-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-300 hover:text-white"
          title="Edit values in the Stats section"
          onClick={() => setOpenDisabledTip((v) => !v)}
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
          Overview of user&#39;s investment performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <p className="text-gray-400 text-sm">Total Investment</p>
            <p className="text-2xl font-bold text-blue-500">${(props.totalInvestment ?? 0).toLocaleString()}</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-gray-400 text-sm">Account Balance</p>
            <p className="text-2xl font-bold text-green-500">${(props.accountBalance ?? 0).toLocaleString()}</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-gray-400 text-sm">Net Gain/Loss</p>
            <p className={`text-2xl font-bold ${net >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ${net.toLocaleString()}
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