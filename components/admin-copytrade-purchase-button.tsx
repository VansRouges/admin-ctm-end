'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AdminCopytradePurchaseModal } from '@/components/admin-copytrade-purchase-modal'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function AdminCopytradePurchaseButton() {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)

  const handleSuccess = () => {
    router.refresh()
  }

  return (
    <>
      <Button
        onClick={() => setModalOpen(true)}
        className="bg-yellow-600 hover:bg-yellow-700 text-white"
      >
        <Plus className="mr-2 h-4 w-4" />
        Create Purchase
      </Button>

      <AdminCopytradePurchaseModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={handleSuccess}
      />
    </>
  )
}

