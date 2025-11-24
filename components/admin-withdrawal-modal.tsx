'use client'

import { useState, useEffect, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { createAdminWithdrawal, type AdminWithdrawalRequest } from '@/app/actions/admin-actions'
import { getCryptoOptions, type CryptoOption } from '@/app/actions/crypto'

interface AdminWithdrawalModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  onSuccess?: () => void
}

export function AdminWithdrawalModal({
  open,
  onOpenChange,
  userId,
  onSuccess,
}: AdminWithdrawalModalProps) {
  const [isPending, startTransition] = useTransition()
  const [cryptoOptions, setCryptoOptions] = useState<CryptoOption[]>([])
  const [loadingOptions, setLoadingOptions] = useState(false)
  const [formData, setFormData] = useState<AdminWithdrawalRequest>({
    userId,
    token_name: '',
    amount: 0,
    token_withdraw_address: '',
    autoApprove: false,
  })

  useEffect(() => {
    if (open) {
      loadCryptoOptions()
      // Reset form when modal opens
      setFormData({
        userId,
        token_name: '',
        amount: 0,
        token_withdraw_address: '',
        autoApprove: false,
      })
    }
  }, [open, userId])

  const loadCryptoOptions = async () => {
    setLoadingOptions(true)
    try {
      const response = await getCryptoOptions()
      if (response.success) {
        setCryptoOptions(response.data)
      } else {
        toast.error('Failed to load crypto options', {
          description: response.message || 'Could not fetch available tokens',
        })
      }
    } catch (error) {
      console.error('Error loading crypto options:', error)
      toast.error('Error loading crypto options')
    } finally {
      setLoadingOptions(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.token_name) {
      toast.error('Please select a token')
      return
    }

    if (formData.amount <= 0) {
      toast.error('Amount must be greater than 0')
      return
    }

    startTransition(async () => {
      try {
        const response = await createAdminWithdrawal(formData)

        if (response.success) {
          toast.success('Withdrawal created successfully', {
            description: response.message,
          })
          onOpenChange(false)
          if (onSuccess) {
            onSuccess()
          }
        } else {
          toast.error('Failed to create withdrawal', {
            description: response.message,
          })
        }
      } catch (error) {
        console.error('Error creating withdrawal:', error)
        toast.error('Error creating withdrawal', {
          description: error instanceof Error ? error.message : 'An unexpected error occurred',
        })
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Create Withdrawal</DialogTitle>
          <DialogDescription className="text-gray-400">
            Create a withdrawal on behalf of this user
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="token" className="text-white">
                Token
              </Label>
              <Select
                value={formData.token_name}
                onValueChange={(value) =>
                  setFormData({ ...formData, token_name: value })
                }
                disabled={loadingOptions || isPending}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder={loadingOptions ? 'Loading tokens...' : 'Select token'} />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {cryptoOptions.map((option) => (
                    <SelectItem
                      key={option._id}
                      value={option.token_symbol}
                      className="text-white focus:bg-gray-700"
                    >
                      {option.token_symbol} - {option.token_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-white">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.00000001"
                min="0"
                value={formData.amount || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amount: parseFloat(e.target.value) || 0,
                  })
                }
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="0.00"
                required
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-white">
                Withdrawal Address (Optional)
              </Label>
              <Input
                id="address"
                type="text"
                value={formData.token_withdraw_address || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    token_withdraw_address: e.target.value,
                  })
                }
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Enter withdrawal address"
                disabled={isPending}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="autoApprove"
                checked={formData.autoApprove}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, autoApprove: checked === true })
                }
                disabled={isPending}
              />
              <Label
                htmlFor="autoApprove"
                className="text-white text-sm font-normal cursor-pointer"
              >
                Auto-approve withdrawal (immediately deduct funds from user account)
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !formData.token_name}>
              {isPending ? 'Creating...' : 'Create Withdrawal'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

