"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileCheck, Eye, ChevronLeft, ChevronRight, Filter } from "lucide-react"
import { KYC } from "@/app/actions/kyc"

interface KYCListProps {
  initialData: KYC[]
  initialTotalRecords: number
  initialTotalPages: number
  initialCurrentPage: number
}

export function KYCList({ initialData, initialTotalRecords, initialTotalPages, initialCurrentPage }: KYCListProps) {
  const router = useRouter()
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(initialCurrentPage)

  const handleFilterChange = useCallback((value: string) => {
    setStatusFilter(value)
    setCurrentPage(1)
    
    // Build query string
    const params = new URLSearchParams()
    if (value !== 'all') params.append('status', value)
    params.append('page', '1')
    
    // Update URL without page reload
    router.push(`/dashboard/kyc?${params.toString()}`)
  }, [router])

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage)
    
    // Build query string
    const params = new URLSearchParams()
    if (statusFilter !== 'all') params.append('status', statusFilter)
    params.append('page', newPage.toString())
    
    // Update URL without page reload
    router.push(`/dashboard/kyc?${params.toString()}`)
  }, [router, statusFilter])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500 text-white border-0">Approved</Badge>
      case 'rejected':
        return <Badge className="bg-red-500 text-white border-0">Rejected</Badge>
      case 'under_review':
        return <Badge className="bg-blue-500 text-white border-0">Under Review</Badge>
      case 'pending':
        return <Badge className="bg-yellow-500 text-white border-0">Pending</Badge>
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
              <label className="text-gray-300 text-sm mb-2 block">Status</label>
              <Select value={statusFilter} onValueChange={handleFilterChange}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KYC Table */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-yellow-500">KYC Applications</CardTitle>
          <CardDescription className="text-gray-300">
            Showing {initialData.length} of {initialTotalRecords} applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {initialData.length === 0 ? (
            <div className="text-center py-12">
              <FileCheck className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No KYC applications found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700 hover:bg-gray-800/50">
                      <TableHead className="text-gray-300 font-semibold">User</TableHead>
                      <TableHead className="text-gray-300 font-semibold">Full Name</TableHead>
                      <TableHead className="text-gray-300 font-semibold">Phone</TableHead>
                      <TableHead className="text-gray-300 font-semibold">Location</TableHead>
                      <TableHead className="text-gray-300 font-semibold">Documents</TableHead>
                      <TableHead className="text-gray-300 font-semibold">Status</TableHead>
                      <TableHead className="text-gray-300 font-semibold">Submitted</TableHead>
                      <TableHead className="text-gray-300 font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {initialData.map((kyc) => (
                      <TableRow 
                        key={kyc._id}
                        className="border-gray-700 hover:bg-gray-800/30 transition-colors"
                      >
                        <TableCell>
                          <div className="space-y-1">
                            <p className="text-gray-200 font-medium text-sm">
                              {kyc.userId?.firstName || 'N/A'} {kyc.userId?.lastName || 'N/A'}
                            </p>
                            <p className="text-xs text-gray-400 truncate max-w-[150px]">
                              {kyc.userId?.email || 'N/A'}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-200">
                          {kyc.fullName}
                        </TableCell>
                        <TableCell className="text-gray-200 text-sm">
                          {kyc.phoneNumber}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="text-gray-200 text-sm">
                              {kyc.address.city}, {kyc.address.state}
                            </p>
                            <p className="text-xs text-gray-400">
                              {kyc.address.country}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-blue-500 text-white border-0">
                            {kyc.documentCount || Object.keys(kyc.documents).length} Docs
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(kyc.status)}
                        </TableCell>
                        <TableCell className="text-gray-400 text-sm whitespace-nowrap">
                          {formatDate(kyc.submittedAt)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/dashboard/kyc/${kyc._id}`)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-black border-0"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {initialTotalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-gray-400 text-sm">
                    Page {currentPage} of {initialTotalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(Math.min(initialTotalPages, currentPage + 1))}
                      disabled={currentPage === initialTotalPages}
                      className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </>
  )
}
