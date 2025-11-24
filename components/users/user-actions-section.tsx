'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AdminDepositModal } from '@/components/admin-deposit-modal'
import { AdminWithdrawalModal } from '@/components/admin-withdrawal-modal'
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface UserActionsSectionProps {
  userId: string
}

export function UserActionsSection({ userId }: UserActionsSectionProps) {
  const router = useRouter()
  const [depositModalOpen, setDepositModalOpen] = useState(false)
  const [withdrawalModalOpen, setWithdrawalModalOpen] = useState(false)

  const handleSuccess = () => {
    router.refresh()
  }

  return (
    <>
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-yellow-500">User Actions</CardTitle>
          <CardDescription className="text-gray-400">
            Create deposits or withdrawals on behalf of this user
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              onClick={() => setDepositModalOpen(true)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <ArrowDownCircle className="mr-2 h-4 w-4" />
              Create Deposit
            </Button>
            <Button
              onClick={() => setWithdrawalModalOpen(true)}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              <ArrowUpCircle className="mr-2 h-4 w-4" />
              Create Withdrawal
            </Button>
          </div>
        </CardContent>
      </Card>

      <AdminDepositModal
        open={depositModalOpen}
        onOpenChange={setDepositModalOpen}
        userId={userId}
        onSuccess={handleSuccess}
      />

      <AdminWithdrawalModal
        open={withdrawalModalOpen}
        onOpenChange={setWithdrawalModalOpen}
        userId={userId}
        onSuccess={handleSuccess}
      />
    </>
  )
}

