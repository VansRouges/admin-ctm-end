'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TrendingUp, Pencil } from "lucide-react"
import { useEffect, useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  updateUserFinancials,
  type UserFinancialSummary,
} from "@/app/actions/portfolio"

const MONEY_EPS = 0.01

function roundMoney(value: number) {
  return Math.round(value * 100) / 100
}

function formatUsd(value: number) {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function UserInvestmentSummaryCard(props: {
  userId: string
  totalInvestment: number
  accountBalance: number
  currentValue?: number
  lockedValue?: number
  lifetimeWithdrawals?: number
  roi: number
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [formError, setFormError] = useState<string | null>(null)

  const initialBalance = props.accountBalance ?? 0
  const initialLocked =
    props.lockedValue ?? Math.max(0, (props.currentValue ?? initialBalance) - initialBalance)
  const initialCurrent = props.currentValue ?? initialBalance + initialLocked

  const [displayBalance, setDisplayBalance] = useState(initialBalance)
  const [displayCurrent, setDisplayCurrent] = useState(initialCurrent)
  const [displayLocked, setDisplayLocked] = useState(initialLocked)
  const [displayRoi, setDisplayRoi] = useState(props.roi ?? 0)
  const [displayInvestment, setDisplayInvestment] = useState(props.totalInvestment ?? 0)
  const [displayWithdrawals, setDisplayWithdrawals] = useState(props.lifetimeWithdrawals ?? 0)

  const [accountBalance, setAccountBalance] = useState(initialBalance)
  const [currentValue, setCurrentValue] = useState(initialCurrent)
  const [lockedValue, setLockedValue] = useState(initialLocked)
  const [balanceDirty, setBalanceDirty] = useState(false)
  const [currentDirty, setCurrentDirty] = useState(false)

  useEffect(() => {
    setDisplayBalance(initialBalance)
    setDisplayCurrent(initialCurrent)
    setDisplayLocked(initialLocked)
    setDisplayRoi(props.roi ?? 0)
    setDisplayInvestment(props.totalInvestment ?? 0)
    setDisplayWithdrawals(props.lifetimeWithdrawals ?? 0)
  }, [
    initialBalance,
    initialCurrent,
    initialLocked,
    props.roi,
    props.totalInvestment,
    props.lifetimeWithdrawals,
  ])

  const net = useMemo(() => {
    return displayCurrent + displayWithdrawals - displayInvestment
  }, [displayCurrent, displayWithdrawals, displayInvestment])

  const applySummaryToForm = (summary: UserFinancialSummary) => {
    const balance = summary.accountBalance ?? 0
    const locked = summary.lockedValue ?? 0
    const current = summary.currentValue ?? balance + locked
    setAccountBalance(roundMoney(balance))
    setCurrentValue(roundMoney(current))
    setLockedValue(roundMoney(locked))
    setBalanceDirty(false)
    setCurrentDirty(false)
    setFormError(null)
  }

  const applySummaryToDisplay = (summary: UserFinancialSummary) => {
    setDisplayBalance(summary.accountBalance ?? 0)
    setDisplayCurrent(summary.currentValue ?? 0)
    setDisplayLocked(summary.lockedValue ?? 0)
    setDisplayRoi(summary.roi ?? 0)
    if (summary.totalInvestment !== undefined) {
      setDisplayInvestment(summary.totalInvestment)
    }
    if (summary.lifetimeWithdrawals !== undefined) {
      setDisplayWithdrawals(summary.lifetimeWithdrawals)
    }
  }

  const resetFormFromProps = () => {
    applySummaryToForm({
      totalInvestment: displayInvestment,
      accountBalance: displayBalance,
      lockedValue: displayLocked,
      currentValue: displayCurrent,
      lifetimeWithdrawals: displayWithdrawals,
      roi: displayRoi,
    })
  }

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (nextOpen) {
      setFormError(null)
      resetFormFromProps()
    } else {
      setFormError(null)
      setBalanceDirty(false)
      setCurrentDirty(false)
    }
  }

  const onAccountBalanceChange = (raw: string) => {
    const next = Number(raw)
    if (Number.isNaN(next)) return
    setAccountBalance(next)
    setBalanceDirty(true)
    setFormError(null)
    if (!currentDirty) {
      setCurrentValue(roundMoney(next + lockedValue))
    }
  }

  const onCurrentValueChange = (raw: string) => {
    const next = Number(raw)
    if (Number.isNaN(next)) return
    setCurrentValue(next)
    setCurrentDirty(true)
    setFormError(null)
    if (!balanceDirty) {
      setAccountBalance(roundMoney(Math.max(0, next - lockedValue)))
    }
  }

  const onSave = () => {
    startTransition(async () => {
      setFormError(null)

      const financialPayload: { accountBalance?: number; currentValue?: number } = {}
      if (balanceDirty) financialPayload.accountBalance = accountBalance
      if (currentDirty) financialPayload.currentValue = currentValue

      if (
        Object.keys(financialPayload).length === 0 &&
        (roundMoney(accountBalance) !== roundMoney(displayBalance) ||
          roundMoney(currentValue) !== roundMoney(displayCurrent))
      ) {
        financialPayload.accountBalance = accountBalance
      }

      if (Object.keys(financialPayload).length === 0) {
        setOpen(false)
        return
      }

      if (
        financialPayload.accountBalance !== undefined &&
        financialPayload.currentValue !== undefined
      ) {
        const expected = roundMoney(financialPayload.accountBalance + lockedValue)
        if (Math.abs(financialPayload.currentValue - expected) > MONEY_EPS) {
          const message =
            `currentValue must equal accountBalance + lockedValue (expected ${formatUsd(expected)}). ` +
            `Update accountBalance alone, or set currentValue to accountBalance + lockedValue.`
          setFormError(message)
          toast.error(message)
          return
        }
      }

      const financialResult = await updateUserFinancials(props.userId, financialPayload)
      if (!financialResult.success) {
        const message = financialResult.message || 'Failed to update financial metrics'
        setFormError(message)
        toast.error(message)
        return
      }

      if (financialResult.data) {
        applySummaryToForm(financialResult.data)
        applySummaryToDisplay(financialResult.data)
      }
      toast.success(financialResult.message || 'Financial metrics updated')
      setOpen(false)
      router.refresh()
    })
  }

  return (
    <Card className="bg-gray-900 border-gray-700 relative">
      <div className="absolute top-2 right-2 z-10">
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-300 hover:text-white"
              title="Edit account balance and current value"
            >
              <Pencil className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Edit Investment Summary</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="summaryAccountBalance" className="text-white">
                  Account Balance (available)
                </Label>
                <Input
                  id="summaryAccountBalance"
                  type="number"
                  min={0}
                  step="0.01"
                  value={accountBalance}
                  disabled={isPending}
                  onChange={(e) => onAccountBalanceChange(e.target.value)}
                  className="text-white"
                />
                <p className="text-xs text-gray-400">
                  Liquid value. Editing alone updates total equity to balance + locked.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="summaryCurrentValue" className="text-white">
                  Current Value (total equity)
                </Label>
                <Input
                  id="summaryCurrentValue"
                  type="number"
                  min={0}
                  step="0.01"
                  value={currentValue}
                  disabled={isPending}
                  onChange={(e) => onCurrentValueChange(e.target.value)}
                  className="text-white"
                />
                <p className="text-xs text-gray-400">
                  Editing alone sets available to current value − locked.
                </p>
              </div>
              <div className="space-y-2 md:col-span-2 rounded-md border border-gray-700 bg-gray-950/60 p-3">
                <p className="text-sm text-gray-300">
                  Locked value (read-only):{" "}
                  <span className="font-semibold text-yellow-500">{formatUsd(lockedValue)}</span>
                </p>
                <p className="text-xs text-gray-500">
                  currentValue = accountBalance + lockedValue. Expected equity:{" "}
                  {formatUsd(roundMoney(accountBalance + lockedValue))}.
                </p>
              </div>
              {formError && (
                <div className="md:col-span-2 rounded-md border border-red-700/60 bg-red-950/40 p-3">
                  <p className="text-sm text-red-300">{formError}</p>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setOpen(false)} disabled={isPending}>
                Cancel
              </Button>
              <Button onClick={onSave} disabled={isPending}>
                {isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
              {formatUsd(displayInvestment)}
            </p>
            <p className="text-xs text-gray-500">Lifetime deposits</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-gray-400 text-sm">Account Balance</p>
            <p className="text-2xl font-bold text-green-500">
              {formatUsd(displayBalance)}
            </p>
            <p className="text-xs text-gray-500">Available to spend</p>
          </div>

          <div className="space-y-2">
            <p className="text-gray-400 text-sm">Current Value</p>
            <p className="text-2xl font-bold text-yellow-500">
              {formatUsd(displayCurrent)}
            </p>
            <p className="text-xs text-gray-500">
              Locked in trades: {formatUsd(displayLocked)}
            </p>
          </div>
          
          <div className="space-y-2">
            <p className="text-gray-400 text-sm">Net Gain/Loss</p>
            <p className={`text-2xl font-bold ${net >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatUsd(net)}
            </p>
            <p className="text-xs text-gray-500">
              Includes withdrawals: {formatUsd(displayWithdrawals)}
            </p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Return on Investment (ROI)</span>
            <span className={`text-xl font-bold ${displayRoi >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {displayRoi.toFixed(2)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
