'use client'

import { Card, CardHeader, CardDescription, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DollarSign, TrendingUp, Activity, Shield, Pencil } from "lucide-react"
import { useEffect, useState, useTransition } from "react"
import { updateUser } from "@/app/actions/users"
import {
  getUserFinancialSummary,
  updateUserFinancials,
  type UserFinancialSummary,
} from "@/app/actions/portfolio"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const MONEY_EPS = 0.01

function roundMoney(value: number) {
  return Math.round(value * 100) / 100
}

export function UserStatsCards(props: {
  userId: string
  accountBalance?: number
  currentValue?: number
  lockedValue?: number
  totalInvestment?: number
  roi?: number
  kycStatus: boolean
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [isLoadingSummary, setIsLoadingSummary] = useState(false)

  const initialBalance = props.accountBalance ?? 0
  const initialLocked = props.lockedValue ?? Math.max(0, (props.currentValue ?? initialBalance) - initialBalance)
  const initialCurrent = props.currentValue ?? initialBalance + initialLocked
  const initialInvestment = props.totalInvestment ?? 0
  const initialRoi = props.roi ?? 0

  const [displayBalance, setDisplayBalance] = useState(initialBalance)
  const [displayCurrent, setDisplayCurrent] = useState(initialCurrent)
  const [displayLocked, setDisplayLocked] = useState(initialLocked)
  const [displayRoi, setDisplayRoi] = useState(initialRoi)
  const [displayInvestment, setDisplayInvestment] = useState(initialInvestment)

  const [accountBalance, setAccountBalance] = useState(initialBalance)
  const [currentValue, setCurrentValue] = useState(initialCurrent)
  const [lockedValue, setLockedValue] = useState(initialLocked)
  const [totalInvestment, setTotalInvestment] = useState(initialInvestment)
  const [balanceDirty, setBalanceDirty] = useState(false)
  const [currentDirty, setCurrentDirty] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    setDisplayBalance(initialBalance)
    setDisplayCurrent(initialCurrent)
    setDisplayLocked(initialLocked)
    setDisplayRoi(initialRoi)
    setDisplayInvestment(initialInvestment)
  }, [initialBalance, initialCurrent, initialLocked, initialRoi, initialInvestment])

  const applySummaryToForm = (summary: UserFinancialSummary) => {
    const balance = summary.accountBalance ?? 0
    const locked = summary.lockedValue ?? 0
    const current = summary.currentValue ?? balance + locked
    setAccountBalance(roundMoney(balance))
    setCurrentValue(roundMoney(current))
    setLockedValue(roundMoney(locked))
    setTotalInvestment(summary.totalInvestment ?? displayInvestment)
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
  }

  const loadFinancialSummary = async () => {
    setIsLoadingSummary(true)
    setFormError(null)
    try {
      const result = await getUserFinancialSummary(props.userId)
      if (result.success && result.data) {
        applySummaryToForm(result.data)
        applySummaryToDisplay(result.data)
      } else {
        applySummaryToForm({
          totalInvestment: displayInvestment,
          accountBalance: displayBalance,
          lockedValue: displayLocked,
          currentValue: displayCurrent,
          lifetimeWithdrawals: 0,
          roi: displayRoi,
        })
        if (result.message) {
          toast.error(result.message)
        }
      }
    } finally {
      setIsLoadingSummary(false)
    }
  }

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (nextOpen) {
      void loadFinancialSummary()
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
    // Common path: editing available alone updates total equity preview to balance + locked
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
    // Editing equity alone sets available preview to currentValue - locked
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

      // If neither financial field was touched but values differ from display, treat balance as edited
      if (
        Object.keys(financialPayload).length === 0 &&
        (roundMoney(accountBalance) !== roundMoney(displayBalance) ||
          roundMoney(currentValue) !== roundMoney(displayCurrent))
      ) {
        financialPayload.accountBalance = accountBalance
      }

      if (
        financialPayload.accountBalance !== undefined &&
        financialPayload.currentValue !== undefined
      ) {
        const expected = roundMoney(financialPayload.accountBalance + lockedValue)
        if (Math.abs(financialPayload.currentValue - expected) > MONEY_EPS) {
          const message =
            `currentValue must equal accountBalance + lockedValue (expected $${expected.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}). ` +
            `Update accountBalance alone, or set currentValue to accountBalance + lockedValue.`
          setFormError(message)
          toast.error(message)
          return
        }
      }

      if (Object.keys(financialPayload).length > 0) {
        const financialResult = await updateUserFinancials(props.userId, financialPayload)
        if (!financialResult.success) {
          if (
            financialResult.error === 'CURRENT_VALUE_LOCKED_MISMATCH' &&
            financialResult.errorData?.expectedCurrentValue !== undefined
          ) {
            const expected = financialResult.errorData.expectedCurrentValue
            const message =
              financialResult.message ||
              `currentValue must equal accountBalance + lockedValue. Expected $${Number(expected).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`
            setFormError(message)
            toast.error(message)
            return
          }
          if (financialResult.error === 'CURRENT_VALUE_BELOW_LOCKED') {
            const locked = financialResult.errorData?.lockedValue ?? lockedValue
            const message =
              financialResult.message ||
              `currentValue cannot be less than locked capital ($${Number(locked).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}).`
            setFormError(message)
            toast.error(message)
            return
          }
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
      }

      if (roundMoney(totalInvestment) !== roundMoney(displayInvestment)) {
        await updateUser(props.userId, { totalInvestment })
        setDisplayInvestment(totalInvestment)
      }

      setOpen(false)
      router.refresh()
    })
  }

  const formatUsd = (value: number) =>
    `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

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
              {formatUsd(displayBalance)}
            </CardTitle>
            <p className="text-xs text-gray-500 pt-1">
              Total equity: {formatUsd(displayCurrent)} · Locked: {formatUsd(displayLocked)}
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
              {formatUsd(displayInvestment)}
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
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
              <Pencil className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Edit Financial Stats</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accountBalance" className="text-white">
                  Account Balance (available)
                </Label>
                <Input
                  id="accountBalance"
                  type="number"
                  min={0}
                  step="0.01"
                  value={accountBalance}
                  disabled={isLoadingSummary || isPending}
                  onChange={(e) => onAccountBalanceChange(e.target.value)}
                  className="text-white"
                />
                <p className="text-xs text-gray-400">
                  Liquid portfolio value. Editing this alone updates total equity to balance + locked.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentValue" className="text-white">
                  Current Value (total equity)
                </Label>
                <Input
                  id="currentValue"
                  type="number"
                  min={0}
                  step="0.01"
                  value={currentValue}
                  disabled={isLoadingSummary || isPending}
                  onChange={(e) => onCurrentValueChange(e.target.value)}
                  className="text-white"
                />
                <p className="text-xs text-gray-400">
                  Editing this alone sets available to current value − locked.
                </p>
              </div>
              <div className="space-y-2 md:col-span-2 rounded-md border border-gray-700 bg-gray-950/60 p-3">
                <p className="text-sm text-gray-300">
                  Locked value (read-only):{" "}
                  <span className="font-semibold text-yellow-500">{formatUsd(lockedValue)}</span>
                </p>
                <p className="text-xs text-gray-500">
                  Capital locked in active copytrades and stocks. currentValue = accountBalance + lockedValue.
                  Expected equity for this available balance:{" "}
                  {formatUsd(roundMoney(accountBalance + lockedValue))}.
                </p>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="totalInvestment" className="text-white">Total Investment</Label>
                <Input
                  id="totalInvestment"
                  type="number"
                  min={0}
                  step="0.01"
                  value={totalInvestment}
                  disabled={isPending}
                  onChange={(e) => setTotalInvestment(Number(e.target.value))}
                  className="text-white"
                />
              </div>
              {formError && (
                <div className="md:col-span-2 rounded-md border border-red-700/60 bg-red-950/40 p-3">
                  <p className="text-sm text-red-300">{formError}</p>
                </div>
              )}
              <div className="space-y-2 md:col-span-2">
                <p className="text-sm text-gray-400">
                  KYC status can only be changed from the KYC review page. ROI is recalculated from equity metrics.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setOpen(false)} disabled={isPending}>
                Cancel
              </Button>
              <Button onClick={onSave} disabled={isPending || isLoadingSummary}>
                {isPending ? "Saving..." : isLoadingSummary ? "Loading..." : "Save"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
