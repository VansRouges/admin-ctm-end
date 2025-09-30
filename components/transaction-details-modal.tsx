"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  IconLoader2,
  IconClock,
  IconCheck,
  IconX,
  IconArrowDownRight,
  IconArrowUpRight,
  IconCalendar,
  IconUser,
  IconCoin,
  IconHash,
  IconMapPin
} from "@tabler/icons-react"
import { Transaction, updateTransactionStatus } from "@/app/actions/transactions"
import { toast } from "sonner"

interface TransactionDetailsModalProps {
  transaction: Transaction | null
  isOpen: boolean
  onClose: () => void
  onTransactionUpdate?: () => void
}

export function TransactionDetailsModal({
  transaction,
  isOpen,
  onClose,
  onTransactionUpdate
}: TransactionDetailsModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [actionType, setActionType] = useState<string | null>(null)

  if (!transaction) return null

  const handleStatusUpdate = async (newStatus: 'pending' | 'approved' | 'rejected') => {
    if (isLoading) return
    
    setIsLoading(true)
    setActionType(newStatus)
    
    try {
      const result = await updateTransactionStatus(
        transaction._id,
        transaction.type,
        newStatus
      )
      
      if (result.success) {
        toast.success(result.message)
        onTransactionUpdate?.()
        onClose()
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error('Transaction update error:', error)
      toast.error('Failed to update transaction status')
    } finally {
      setIsLoading(false)
      setActionType(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      approved: { className: 'bg-green-600 text-white', icon: IconCheck },
      pending: { className: 'bg-orange-600 text-white', icon: IconClock },
      rejected: { className: 'bg-red-600 text-white', icon: IconX }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig]
    const IconComponent = config.icon
    
    return (
      <Badge className={config.className}>
        <IconComponent className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getActionButtons = () => {
    const { status } = transaction
    
    if (status === 'approved') {
      return (
        <>
          <Button
            variant="outline"
            onClick={() => handleStatusUpdate('pending')}
            disabled={isLoading}
            className="border-app-gold-100 text-app-gold-100 hover:bg-app-gold-100/10"
          >
            {isLoading && actionType === 'pending' ? (
              <IconLoader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <IconClock className="w-4 h-4 mr-2" />
            )}
            Make Pending
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleStatusUpdate('rejected')}
            disabled={isLoading}
          >
            {isLoading && actionType === 'rejected' ? (
              <IconLoader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <IconX className="w-4 h-4 mr-2" />
            )}
            Reject
          </Button>
        </>
      )
    }
    
    if (status === 'rejected') {
      return (
        <>
          <Button
            variant="outline"
            onClick={() => handleStatusUpdate('pending')}
            disabled={isLoading}
            className="border-app-gold-100 text-app-gold-100 hover:bg-app-gold-100/10"
          >
            {isLoading && actionType === 'pending' ? (
              <IconLoader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <IconClock className="w-4 h-4 mr-2" />
            )}
            Make Pending
          </Button>
          <Button
            onClick={() => handleStatusUpdate('approved')}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isLoading && actionType === 'approved' ? (
              <IconLoader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <IconCheck className="w-4 h-4 mr-2" />
            )}
            Approve
          </Button>
        </>
      )
    }
    
    // For pending transactions, show approve and reject buttons
    return (
      <>
        <Button
          onClick={() => handleStatusUpdate('approved')}
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          {isLoading && actionType === 'approved' ? (
            <IconLoader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <IconCheck className="w-4 h-4 mr-2" />
          )}
          Approve
        </Button>
        <Button
          variant="destructive"
          onClick={() => handleStatusUpdate('rejected')}
          disabled={isLoading}
        >
          {isLoading && actionType === 'rejected' ? (
            <IconLoader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <IconX className="w-4 h-4 mr-2" />
          )}
          Reject
        </Button>
      </>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatAddress = (address?: string) => {
    if (!address) return 'N/A'
    return `${address.slice(0, 8)}...${address.slice(-6)}`
  }

  const TypeIcon = transaction.type === 'deposit' ? IconArrowDownRight : IconArrowUpRight

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl  border-app-gold-100 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <TypeIcon className="w-5 h-5 text-app-gold-100" />
            Transaction Details
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            View and manage transaction #{transaction._id.slice(-8).toUpperCase()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Type Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TypeIcon className="w-6 h-6 text-app-gold-100" />
              <div>
                <p className="font-medium text-lg">
                  {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                </p>
                <p className="text-sm text-muted-foreground">Transaction Type</p>
              </div>
            </div>
            {getStatusBadge(transaction.status)}
          </div>

          <Separator className="bg-gray-700" />

          {/* Transaction Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Amount */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <IconCoin className="w-4 h-4 text-app-gold-100" />
                <p className="text-sm font-medium text-muted-foreground">Amount</p>
              </div>
              <p className="text-lg font-semibold text-white">
                {transaction.amount} {transaction.token_name}
              </p>
            </div>

            {/* User ID */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <IconUser className="w-4 h-4 text-app-gold-100" />
                <p className="text-sm font-medium text-muted-foreground">User ID</p>
              </div>
              <p className="text-sm font-mono text-white">
                {transaction.user.slice(-12).toUpperCase()}
              </p>
            </div>

            {/* Transaction ID */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <IconHash className="w-4 h-4 text-app-gold-100" />
                <p className="text-sm font-medium text-muted-foreground">Transaction ID</p>
              </div>
              <p className="text-sm font-mono text-white">
                {transaction._id.slice(-12).toUpperCase()}
              </p>
            </div>

            {/* Created Date */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <IconCalendar className="w-4 h-4 text-app-gold-100" />
                <p className="text-sm font-medium text-muted-foreground">Created</p>
              </div>
              <p className="text-sm text-white">
                {formatDate(transaction.createdAt)}
              </p>
            </div>

            {/* Updated Date */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <IconCalendar className="w-4 h-4 text-app-gold-100" />
                <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
              </div>
              <p className="text-sm text-white">
                {formatDate(transaction.updatedAt)}
              </p>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <IconMapPin className="w-4 h-4 text-app-gold-100" />
                <p className="text-sm font-medium text-muted-foreground">
                  {transaction.type === 'deposit' ? 'Deposit' : 'Withdraw'} Address
                </p>
              </div>
              <p className="text-sm font-mono text-white">
                {formatAddress(
                  transaction.type === 'deposit' 
                    ? transaction.token_deposit_address 
                    : transaction.token_withdraw_address
                )}
              </p>
            </div>
          </div>

          <Separator className="bg-gray-700" />

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Is Deposit</p>
              <Badge variant={transaction.isDeposit ? "default" : "secondary"}>
                {transaction.isDeposit ? "Yes" : "No"}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Is Withdraw</p>
              <Badge variant={transaction.isWithdraw ? "default" : "secondary"}>
                {transaction.isWithdraw ? "Yes" : "No"}
              </Badge>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 pt-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Close
          </Button>
          <div className="flex gap-2">
            {getActionButtons()}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}