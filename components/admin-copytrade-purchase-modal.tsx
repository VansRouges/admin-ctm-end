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
import { createAdminCopytradePurchase, type AdminCopytradePurchaseRequest } from '@/app/actions/admin-actions'
import { getCopyTradeOptions, type CopyTradeOption } from '@/app/actions/copytrade'

interface AdminCopytradePurchaseModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId?: string
  onSuccess?: () => void
}

export function AdminCopytradePurchaseModal({
  open,
  onOpenChange,
  userId,
  onSuccess,
}: AdminCopytradePurchaseModalProps) {
  const [isPending, startTransition] = useTransition()
  const [copytradeOptions, setCopytradeOptions] = useState<CopyTradeOption[]>([])
  const [loadingOptions, setLoadingOptions] = useState(false)
  const [selectedOption, setSelectedOption] = useState<CopyTradeOption | null>(null)
  const [formData, setFormData] = useState<AdminCopytradePurchaseRequest>({
    userId: userId || '',
    copytradeOptionId: '',
    initial_investment: 0,
    autoApprove: false,
  })

  useEffect(() => {
    if (open) {
      loadCopytradeOptions()
      // Reset form when modal opens
      setFormData({
        userId: userId || '',
        copytradeOptionId: '',
        initial_investment: 0,
        autoApprove: false,
      })
      setSelectedOption(null)
    }
  }, [open, userId])

  const loadCopytradeOptions = async () => {
    setLoadingOptions(true)
    try {
      const response = await getCopyTradeOptions()
      if (response.success) {
        setCopytradeOptions(response.data)
      } else {
        toast.error('Failed to load copytrade options', {
          description: response.message || 'Could not fetch available copytrade options',
        })
      }
    } catch (error) {
      console.error('Error loading copytrade options:', error)
      toast.error('Error loading copytrade options')
    } finally {
      setLoadingOptions(false)
    }
  }

  const handleOptionChange = (optionId: string) => {
    const option = copytradeOptions.find((opt) => opt._id === optionId)
    setSelectedOption(option || null)
    setFormData({
      ...formData,
      copytradeOptionId: optionId,
      initial_investment: option?.trade_min || 0,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.userId) {
      toast.error('User ID is required')
      return
    }

    if (!formData.copytradeOptionId) {
      toast.error('Please select a copytrade option')
      return
    }

    if (!selectedOption) {
      toast.error('Please select a valid copytrade option')
      return
    }

    if (formData.initial_investment < selectedOption.trade_min) {
      toast.error(`Minimum investment is $${selectedOption.trade_min}`)
      return
    }

    if (formData.initial_investment > selectedOption.trade_max) {
      toast.error(`Maximum investment is $${selectedOption.trade_max}`)
      return
    }

    if (formData.initial_investment <= 0) {
      toast.error('Investment amount must be greater than 0')
      return
    }

    startTransition(async () => {
      try {
        const response = await createAdminCopytradePurchase(formData)

        if (response.success) {
          toast.success('Copytrade purchase created successfully', {
            description: response.message,
          })
          onOpenChange(false)
          if (onSuccess) {
            onSuccess()
          }
        } else {
          toast.error('Failed to create copytrade purchase', {
            description: response.message,
          })
        }
      } catch (error) {
        console.error('Error creating copytrade purchase:', error)
        toast.error('Error creating copytrade purchase', {
          description: error instanceof Error ? error.message : 'An unexpected error occurred',
        })
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Create Copytrade Purchase</DialogTitle>
          <DialogDescription className="text-gray-400">
            Create a copytrade purchase on behalf of a user
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {!userId && (
              <div className="space-y-2">
                <Label htmlFor="userId" className="text-white">
                  User ID
                </Label>
                <Input
                  id="userId"
                  type="text"
                  value={formData.userId}
                  onChange={(e) =>
                    setFormData({ ...formData, userId: e.target.value })
                  }
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Enter user ID"
                  required
                  disabled={isPending}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="copytradeOption" className="text-white">
                Copytrade Option
              </Label>
              <Select
                value={formData.copytradeOptionId}
                onValueChange={handleOptionChange}
                disabled={loadingOptions || isPending}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder={loadingOptions ? 'Loading options...' : 'Select copytrade option'} />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {copytradeOptions.map((option) => (
                    <SelectItem
                      key={option._id}
                      value={option._id}
                      className="text-white focus:bg-gray-700"
                    >
                      {option.trade_title} ({option.trade_risk} risk)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedOption && (
              <div className="p-3 bg-gray-800 rounded-md space-y-1 text-sm">
                <p className="text-gray-300">
                  <span className="text-gray-400">Min:</span> ${selectedOption.trade_min.toLocaleString()}
                </p>
                <p className="text-gray-300">
                  <span className="text-gray-400">Max:</span> ${selectedOption.trade_max.toLocaleString()}
                </p>
                <p className="text-gray-300">
                  <span className="text-gray-400">ROI:</span> {selectedOption.trade_roi_min}% - {selectedOption.trade_roi_max}%
                </p>
                <p className="text-gray-300">
                  <span className="text-gray-400">Duration:</span> {selectedOption.trade_duration} days
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="investment" className="text-white">
                Initial Investment (USD)
              </Label>
              <Input
                id="investment"
                type="number"
                step="0.01"
                min={selectedOption?.trade_min || 0}
                max={selectedOption?.trade_max || undefined}
                value={formData.initial_investment || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    initial_investment: parseFloat(e.target.value) || 0,
                  })
                }
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="0.00"
                required
                disabled={isPending || !selectedOption}
              />
              {selectedOption && (
                <p className="text-xs text-gray-400">
                  Range: ${selectedOption.trade_min.toLocaleString()} - ${selectedOption.trade_max.toLocaleString()}
                </p>
              )}
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
                Auto-approve purchase (immediately start trading and deduct funds)
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
            <Button type="submit" disabled={isPending || !formData.copytradeOptionId || !formData.userId}>
              {isPending ? 'Creating...' : 'Create Purchase'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

