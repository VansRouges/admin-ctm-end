import { useState } from "react"
import { type SupportTicket } from "@/app/actions/support"
import { PriorityBadge } from "./priority-badge"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AdminSupportRequestDetailsProps {
    request: SupportTicket | null
    isOpen: boolean
    onClose: () => void
    onStatusUpdate: (id: string, newStatus: SupportTicket['status']) => void
}

export function AdminSupportRequestDetails({
    request,
    isOpen,
    onClose,
    onStatusUpdate,
}: AdminSupportRequestDetailsProps) {
    const [isUpdating, setIsUpdating] = useState(false)
        
    if (!request) return null

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'open':
                return 'destructive'
            case 'in_progress':
                return 'secondary'
            case 'resolved':
                return 'default'
            case 'closed':
                return 'outline'
            default:
                return 'outline'
        }
    }

    const handleStatusChange = async (newStatus: SupportTicket['status']) => {
        setIsUpdating(true)
        await onStatusUpdate(request._id, newStatus)
        setIsUpdating(false)
    }

    const Content = (
        <div className="space-y-6">
            <div className="flex justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-white font-medium">Status:</span>
                    <Select 
                        value={request.status} 
                        onValueChange={handleStatusChange}
                        disabled={isUpdating}
                    >
                        <SelectTrigger className="w-[140px] bg-gray-800 border-gray-600 text-white">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                            <SelectItem value="open">
                                <Badge variant={getStatusBadgeVariant('open')}>Open</Badge>
                            </SelectItem>
                            <SelectItem value="in_progress">
                                <Badge variant={getStatusBadgeVariant('in_progress')}>In Progress</Badge>
                            </SelectItem>
                            <SelectItem value="resolved">
                                <Badge variant={getStatusBadgeVariant('resolved')}>Resolved</Badge>
                            </SelectItem>
                            <SelectItem value="closed">
                                <Badge variant={getStatusBadgeVariant('closed')}>Closed</Badge>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    {isUpdating && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-500"></div>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-white font-medium">Priority:</span>
                    <PriorityBadge priority={request.priority} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-sm text-gray-400 mb-1">Created:</p>
                    <p className="text-white">{new Date(request.createdAt).toLocaleString()}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400 mb-1">Updated:</p>
                    <p className="text-white">{new Date(request.updatedAt).toLocaleString()}</p>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <h3 className="font-semibold text-yellow-500 mb-2">User Information:</h3>
                    <div className="bg-gray-800 p-4 rounded-lg space-y-2">
                        <div>
                            <span className="text-gray-400">Full Name: </span>
                            <span className="text-white">{request.full_name}</span>
                        </div>
                        <div>
                            <span className="text-gray-400">Email: </span>
                            <span className="text-white">{request.email}</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold text-yellow-500 mb-2">Message:</h3>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <p className="text-white whitespace-pre-wrap">{request.message}</p>
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-700 max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-yellow-500 text-xl">{request.title}</DialogTitle>
                </DialogHeader>
                {Content}
            </DialogContent>
        </Dialog>
    )
}

