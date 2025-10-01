"use client"
import { useState, useEffect } from "react"
import { getSupportTickets, updateSupportTicketStatus, deleteSupportTicket, type SupportTicket } from "@/app/actions/support"
import { PriorityBadge } from "./priority-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminSupportRequestDetails } from "./support-request-details"
import { DataTableSkeleton } from "@/components/data-table-skeleton"
import { toast } from "sonner"
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react"

interface AdminSupportRequestListProps {
    initialData: SupportTicket[]
}

export function AdminSupportRequestList({ initialData }: AdminSupportRequestListProps) {
    const [requests, setRequests] = useState<SupportTicket[]>(initialData)
    const [selectedRequest, setSelectedRequest] = useState<SupportTicket | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isUpdating, setIsUpdating] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState<string | null>(null)
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(10)
    
    // Calculate pagination
    const totalPages = Math.ceil(requests.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentRequests = requests.slice(startIndex, endIndex)

    const fetchRequests = async () => {
        setIsLoading(true)
        try {
            const response = await getSupportTickets()
            if (response.success) {
                setRequests(response.data)
            } else {
                toast.error("Failed to fetch support tickets")
            }
        } catch (error) {
            console.error("Error fetching support tickets:", error)
            toast.error("Error fetching support tickets")
        } finally {
            setIsLoading(false)
        }
    }

    const handleRequestClick = (request: SupportTicket) => {
        setSelectedRequest(request)
    }

    const handleStatusChange = async (id: string, newStatus: SupportTicket['status']) => {
        setIsUpdating(id)
        try {
            const response = await updateSupportTicketStatus(id, { status: newStatus })
            if (response.success) {
                setRequests((prevRequests) =>
                    prevRequests.map((request) =>
                        request._id === id
                            ? { ...request, status: newStatus, updatedAt: new Date().toISOString() }
                            : request
                    )
                )
                toast.success("Support ticket updated successfully!")
                
                // Update selected request if it's the one being updated
                if (selectedRequest?._id === id) {
                    setSelectedRequest({ ...selectedRequest, status: newStatus, updatedAt: new Date().toISOString() })
                }
            } else {
                toast.error("Failed to update ticket status: " + response.message)
            }
        } catch (error) {
            console.error("Error updating support ticket:", error)
            toast.error("Error updating support ticket")
        } finally {
            setIsUpdating(null)
        }
    }

    const handleDelete = async (id: string) => {
        setIsDeleting(id)
        try {
            const response = await deleteSupportTicket(id)
            if (response.success) {
                setRequests((prevRequests) => prevRequests.filter((request) => request._id !== id))
                toast.success("Support ticket deleted successfully!")
                
                // Close details modal if the deleted request is selected
                if (selectedRequest?._id === id) {
                    setSelectedRequest(null)
                }
                
                // Adjust current page if necessary
                const newTotalPages = Math.ceil((requests.length - 1) / itemsPerPage)
                if (currentPage > newTotalPages && newTotalPages > 0) {
                    setCurrentPage(newTotalPages)
                }
            } else {
                toast.error("Failed to delete ticket: " + response.message)
            }
        } catch (error) {
            console.error("Error deleting support ticket:", error)
            toast.error("Error deleting support ticket")
        } finally {
            setIsDeleting(null)
        }
    }

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

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'in_progress':
                return 'In Progress'
            case 'open':
                return 'Open'
            case 'resolved':
                return 'Resolved'
            case 'closed':
                return 'Closed'
            default:
                return status
        }
    }

    if (isLoading) {
        return <DataTableSkeleton />
    }

    return (
        <>
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-yellow-500">Support Tickets</h2>
                
                {requests.length === 0 ? (
                    <div className="flex items-center justify-center h-64">
                        <p className="text-gray-400">No support tickets found.</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-y-auto max-h-[600px]">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-gray-700 hover:bg-gray-800/50">
                                        <TableHead className="text-gray-300 font-semibold">Title</TableHead>
                                        <TableHead className="text-gray-300 font-semibold">Status</TableHead>
                                        <TableHead className="text-gray-300 font-semibold">Priority</TableHead>
                                        <TableHead className="text-gray-300 font-semibold">User</TableHead>
                                        <TableHead className="text-gray-300 font-semibold hidden md:table-cell">Created</TableHead>
                                        <TableHead className="text-gray-300 font-semibold hidden md:table-cell">Updated</TableHead>
                                        <TableHead className="text-gray-300 font-semibold">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {currentRequests.map((request) => (
                                        <TableRow 
                                            key={request._id} 
                                            className="border-gray-700 hover:bg-gray-800/30 transition-colors cursor-pointer"
                                        >
                                            <TableCell 
                                                className="font-medium text-gray-200" 
                                                onClick={() => handleRequestClick(request)}
                                            >
                                                {request.title.length > 30 ? `${request.title.substring(0, 30)}...` : request.title}
                                            </TableCell>
                                            <TableCell>
                                                <Select 
                                                    value={request.status} 
                                                    onValueChange={(newStatus: SupportTicket['status']) => handleStatusChange(request._id, newStatus)}
                                                    disabled={isUpdating === request._id}
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
                                                {isUpdating === request._id && (
                                                    <div className="ml-2 inline-block">
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-500"></div>
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <PriorityBadge priority={request.priority} />
                                            </TableCell>
                                            <TableCell className="text-gray-200">{request.full_name}</TableCell>
                                            <TableCell className="text-gray-200 hidden md:table-cell">
                                                {new Date(request.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-gray-200 hidden md:table-cell">
                                                {new Date(request.updatedAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDelete(request._id)}
                                                    disabled={isDeleting === request._id}
                                                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                                >
                                                    {isDeleting === request._id ? (
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                                    ) : (
                                                        <Trash2 className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between px-2">
                                <div className="text-sm text-gray-400">
                                    Showing {startIndex + 1} to {Math.min(endIndex, requests.length)} of {requests.length} entries
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Previous
                                    </Button>
                                    <span className="text-sm text-gray-400">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            <AdminSupportRequestDetails
                request={selectedRequest}
                isOpen={!!selectedRequest}
                onClose={() => setSelectedRequest(null)}
                onStatusUpdate={handleStatusChange}
            />
        </>
    )
}

