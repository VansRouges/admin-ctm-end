"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Filter,
  User,
  StopCircle
} from "lucide-react"
import { toast } from "sonner"
import {
  getAllCopytradePurchases,
  updateCopytradePurchase,
  deleteCopytradePurchase,
  endCopytradePurchase,
  type CopytradePurchase,
} from "@/app/actions/copytrade-purchases"
import { useTransition } from "react"

interface CopytradePurchasesListProps {
  initialPurchases: CopytradePurchase[]
}

export function CopytradePurchasesList({ initialPurchases }: CopytradePurchasesListProps) {
  const router = useRouter()
  const [purchases, setPurchases] = useState<CopytradePurchase[]>(initialPurchases)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isPending, startTransition] = useTransition()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [purchaseToDelete, setPurchaseToDelete] = useState<CopytradePurchase | null>(null)
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [purchaseToApprove, setPurchaseToApprove] = useState<CopytradePurchase | null>(null)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [purchaseToReject, setPurchaseToReject] = useState<CopytradePurchase | null>(null)
  const [endTradeDialogOpen, setEndTradeDialogOpen] = useState(false)
  const [purchaseToEnd, setPurchaseToEnd] = useState<CopytradePurchase | null>(null)

  const handleFilterChange = useCallback(async (value: string) => {
    setStatusFilter(value)
    startTransition(async () => {
      try {
        const params = value !== 'all' ? { status: value as 'pending' | 'active' | 'completed' | 'cancelled' } : undefined
        const response = await getAllCopytradePurchases(params)
        if (response.success) {
          setPurchases(response.data || [])
        } else {
          toast.error('Failed to fetch purchases')
        }
      } catch (error) {
        console.error('Error fetching purchases:', error)
        toast.error('Failed to fetch purchases')
      }
    })
  }, [])

  const handleApprove = useCallback(async () => {
    if (!purchaseToApprove) return

    startTransition(async () => {
      try {
        const response = await updateCopytradePurchase(purchaseToApprove._id, {
          trade_status: 'active'
        })

        if (response.success) {
          toast.success('Purchase approved successfully')
          setApproveDialogOpen(false)
          setPurchaseToApprove(null)
          router.refresh()
        } else {
          toast.error(response.message || 'Failed to approve purchase')
        }
      } catch (error) {
        console.error('Error approving purchase:', error)
        toast.error('Failed to approve purchase')
      }
    })
  }, [purchaseToApprove, router])

  const handleReject = useCallback(async () => {
    if (!purchaseToReject) return

    startTransition(async () => {
      try {
        const response = await updateCopytradePurchase(purchaseToReject._id, {
          trade_status: 'cancelled'
        })

        if (response.success) {
          toast.success('Purchase rejected successfully')
          setRejectDialogOpen(false)
          setPurchaseToReject(null)
          router.refresh()
        } else {
          toast.error(response.message || 'Failed to reject purchase')
        }
      } catch (error) {
        console.error('Error rejecting purchase:', error)
        toast.error('Failed to reject purchase')
      }
    })
  }, [purchaseToReject, router])

  const handleDelete = useCallback(async () => {
    if (!purchaseToDelete) return

    startTransition(async () => {
      try {
        const response = await deleteCopytradePurchase(purchaseToDelete._id)

        if (response.success) {
          toast.success('Purchase deleted successfully')
          setDeleteDialogOpen(false)
          setPurchaseToDelete(null)
          router.refresh()
        } else {
          toast.error(response.message || 'Failed to delete purchase')
        }
      } catch (error) {
        console.error('Error deleting purchase:', error)
        toast.error('Failed to delete purchase')
      }
    })
  }, [purchaseToDelete, router])

  const handleEndTrade = useCallback(async () => {
    if (!purchaseToEnd) return

    startTransition(async () => {
      try {
        const response = await endCopytradePurchase(purchaseToEnd._id)

        if (response.success) {
          toast.success('Trade ended successfully')
          setEndTradeDialogOpen(false)
          setPurchaseToEnd(null)
          router.refresh()
        } else {
          toast.error(response.message || 'Failed to end trade')
        }
      } catch (error) {
        console.error('Error ending trade:', error)
        const errorMessage = error instanceof Error ? error.message : 'Failed to end trade'
        toast.error(errorMessage)
      }
    })
  }, [purchaseToEnd, router])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 text-white border-0">Active</Badge>
      case 'pending':
        return <Badge className="bg-yellow-500 text-white border-0">Pending</Badge>
      case 'completed':
        return <Badge className="bg-blue-500 text-white border-0">Completed</Badge>
      case 'cancelled':
        return <Badge className="bg-red-500 text-white border-0">Cancelled</Badge>
      default:
        return <Badge className="bg-gray-500 text-white border-0">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getUserEmail = (purchase: CopytradePurchase) => {
    if (purchase.userDetails?.email) return purchase.userDetails.email
    if (typeof purchase.user === 'string') return 'N/A'
    return purchase.user.email || 'N/A'
  }

  const getUserDisplay = (purchase: CopytradePurchase) => {
    // Prefer userDetails if available (new format with username, firstName, lastName)
    if (purchase.userDetails) {
      const { firstName, lastName, username } = purchase.userDetails
      if (firstName || lastName) {
        return `${firstName || ''} ${lastName || ''}`.trim() || username
      }
      return username
    }
    // Fallback to old format
    if (typeof purchase.user === 'string') return purchase.user
    return purchase.user.email || purchase.user._id
  }

  return (
    <>
      {/* Filters */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-yellow-500 flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300 text-sm mb-2 block">Status</Label>
              <Select value={statusFilter} onValueChange={handleFilterChange}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Purchases Table */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-yellow-500">All Copytrade Purchases</CardTitle>
          <CardDescription className="text-gray-300">
            Showing {purchases.length} purchase{purchases.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {purchases.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No copytrade purchases found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 hover:bg-gray-800/50">
                    <TableHead className="text-gray-300 font-semibold">User</TableHead>
                    <TableHead className="text-gray-300 font-semibold">Trade Title</TableHead>
                    <TableHead className="text-gray-300 font-semibold">Investment</TableHead>
                    <TableHead className="text-gray-300 font-semibold">Current Value</TableHead>
                    <TableHead className="text-gray-300 font-semibold">P/L</TableHead>
                    <TableHead className="text-gray-300 font-semibold">Status</TableHead>
                    <TableHead className="text-gray-300 font-semibold">Created</TableHead>
                    <TableHead className="text-gray-300 font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchases.map((purchase) => (
                    <TableRow
                      key={purchase._id}
                      className="border-gray-700 hover:bg-gray-800/30 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-white text-sm">{getUserDisplay(purchase)}</p>
                            <p className="text-xs text-gray-400">{getUserEmail(purchase)}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-white font-medium">
                        {purchase.trade_title}
                      </TableCell>
                      <TableCell className="text-white">
                        ${purchase.initial_investment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-white">
                        {purchase.trade_current_value != null ? (
                          `$${purchase.trade_current_value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        ) : (
                          <span className="text-gray-500">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {purchase.trade_profit_loss != null ? (
                          <span className={purchase.trade_profit_loss >= 0 ? 'text-green-500' : 'text-red-500'}>
                            {purchase.trade_profit_loss >= 0 ? '+' : ''}${purchase.trade_profit_loss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        ) : (
                          <span className="text-gray-500">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(purchase.trade_status)}
                      </TableCell>
                      <TableCell className="text-gray-400 text-sm whitespace-nowrap">
                        {formatDate(purchase.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {purchase.trade_status === 'pending' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setPurchaseToApprove(purchase)
                                  setApproveDialogOpen(true)
                                }}
                                disabled={isPending}
                                className="bg-green-500 hover:bg-green-600 text-white border-0"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setPurchaseToReject(purchase)
                                  setRejectDialogOpen(true)
                                }}
                                disabled={isPending}
                                className="bg-red-500 hover:bg-red-600 text-white border-0"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                          {purchase.trade_status === 'active' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setPurchaseToEnd(purchase)
                                setEndTradeDialogOpen(true)
                              }}
                              disabled={isPending}
                              className="bg-orange-500 hover:bg-orange-600 text-white border-0"
                            >
                              <StopCircle className="h-4 w-4 mr-1" />
                              End Trade
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setPurchaseToDelete(purchase)
                              setDeleteDialogOpen(true)
                            }}
                            disabled={isPending}
                            className="bg-red-500 hover:bg-red-600 text-white border-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approve Confirmation Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Approve Copytrade Purchase</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to approve this purchase? This will deduct the investment amount from the user&apos;s portfolio and activate the trade.
            </DialogDescription>
          </DialogHeader>
          {purchaseToApprove && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">User:</span>
                <span className="text-white">{getUserEmail(purchaseToApprove)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Trade:</span>
                <span className="text-white">{purchaseToApprove.trade_title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Investment:</span>
                <span className="text-white">${purchaseToApprove.initial_investment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleApprove}
              disabled={isPending}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              {isPending ? 'Approving...' : 'Approve'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Reject Copytrade Purchase</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to reject this purchase? This will cancel the trade request.
            </DialogDescription>
          </DialogHeader>
          {purchaseToReject && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">User:</span>
                <span className="text-white">{getUserEmail(purchaseToReject)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Trade:</span>
                <span className="text-white">{purchaseToReject.trade_title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Investment:</span>
                <span className="text-white">${purchaseToReject.initial_investment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              disabled={isPending}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isPending ? 'Rejecting...' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Copytrade Purchase</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this copytrade purchase? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {purchaseToDelete && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">User:</span>
                <span className="text-white">{getUserEmail(purchaseToDelete)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Trade:</span>
                <span className="text-white">{purchaseToDelete.trade_title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className="text-white">{purchaseToDelete.trade_status}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* End Trade Confirmation Dialog */}
      <Dialog open={endTradeDialogOpen} onOpenChange={setEndTradeDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">End Copytrade Purchase</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to end this active trade? This will calculate the final ROI based on the risk level, complete the trade, and add the final value to the user&apos;s account balance as USDT.
            </DialogDescription>
          </DialogHeader>
          {purchaseToEnd && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">User:</span>
                <span className="text-white">{getUserDisplay(purchaseToEnd)} ({getUserEmail(purchaseToEnd)})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Trade:</span>
                <span className="text-white">{purchaseToEnd.trade_title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Initial Investment:</span>
                <span className="text-white">${purchaseToEnd.initial_investment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Current Value:</span>
                <span className="text-white">
                  {purchaseToEnd.trade_current_value != null 
                    ? `$${purchaseToEnd.trade_current_value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    : 'N/A'}
                </span>
              </div>
              {purchaseToEnd.trade_roi_min != null && purchaseToEnd.trade_roi_max != null && (
                <div className="flex justify-between">
                  <span className="text-gray-400">ROI Range:</span>
                  <span className="text-white">{purchaseToEnd.trade_roi_min}% - {purchaseToEnd.trade_roi_max}%</span>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setEndTradeDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEndTrade}
              disabled={isPending}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isPending ? 'Ending Trade...' : 'End Trade'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

