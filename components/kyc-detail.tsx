"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { User, Mail, Phone, Calendar, MapPin, FileText, CheckCircle, XCircle, ExternalLink } from "lucide-react"
import { toast } from "sonner"
import { updateKYCStatus, KYC } from "@/app/actions/kyc"

interface KYCDetailProps {
  kyc: KYC
}

export function KYCDetail({ kyc }: KYCDetailProps) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusUpdate = async (newStatus: 'approved' | 'rejected' | 'under_review' | 'pending') => {
    try {
      setIsUpdating(true)
      const result = await updateKYCStatus(kyc._id, newStatus)
      
      if (result.success) {
        toast.success(`KYC status updated to ${newStatus.replace('_', ' ')} successfully`)
        router.refresh()
      } else {
        toast.error(result.message || 'Failed to update KYC status')
      }
    } catch (error) {
      console.error('Error updating KYC status:', error)
      toast.error('An error occurred while updating KYC status')
    } finally {
      setIsUpdating(false)
    }
  }

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
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <>
      <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/dashboard/kyc">KYC Verifications</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{kyc.fullName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-6 p-6">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="container mx-auto py-6 space-y-6">
            {/* Header with Actions */}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-yellow-500">KYC Application</h1>
                <p className="text-gray-400 mt-2">Review and verify user identity</p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(kyc.status)}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              {kyc.status !== 'approved' && (
                <Button
                  onClick={() => handleStatusUpdate('approved')}
                  disabled={isUpdating}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {isUpdating ? 'Updating...' : 'Approve'}
                </Button>
              )}
              
              {kyc.status !== 'rejected' && (
                <Button
                  onClick={() => handleStatusUpdate('rejected')}
                  disabled={isUpdating}
                  variant="destructive"
                  className="bg-red-500 hover:bg-red-600"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  {isUpdating ? 'Updating...' : 'Reject'}
                </Button>
              )}
              
              {kyc.status !== 'under_review' && (
                <Button
                  onClick={() => handleStatusUpdate('under_review')}
                  disabled={isUpdating}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {isUpdating ? 'Updating...' : 'Under Review'}
                </Button>
              )}
              
              {kyc.status !== 'pending' && (
                <Button
                  onClick={() => handleStatusUpdate('pending')}
                  disabled={isUpdating}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  {isUpdating ? 'Updating...' : 'Back to Pending'}
                </Button>
              )}
            </div>

            {/* User Information */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-yellow-500 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  User Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <p className="text-gray-200 font-medium mt-1">
                        {kyc.userId?.firstName || 'N/A'} {kyc.userId?.lastName || 'N/A'}
                      </p>
                    <div>
                      <label className="text-gray-400 text-sm">Full Name (KYC)</label>
                      <p className="text-gray-200 font-medium mt-1">{kyc.fullName}</p>
                    </div>
                    <p className="text-gray-200">{kyc.userId?.email || 'N/A'}</p>
                    <div>
                      <label className="text-gray-400 text-sm">Phone Number</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <p className="text-gray-200">{kyc.phoneNumber}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Date of Birth</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <p className="text-gray-200">{new Date(kyc.dateOfBirth).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-400 text-sm">User Account</label>
                      <p className="text-gray-200 font-medium mt-1">
                        {kyc.userId.firstName} {kyc.userId.lastName}
                      </p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Email</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <p className="text-gray-200">{kyc.userId.email}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Submitted At</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <p className="text-gray-200">{formatDate(kyc.submittedAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-yellow-500 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Address Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-400 text-sm">Street Address</label>
                      <p className="text-gray-200 mt-1">{kyc.address.street}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">City</label>
                      <p className="text-gray-200 mt-1">{kyc.address.city}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Postal Code</label>
                      <p className="text-gray-200 mt-1">{kyc.address.postalCode}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-400 text-sm">State/Province</label>
                      <p className="text-gray-200 mt-1">{kyc.address.state}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Country</label>
                      <p className="text-gray-200 mt-1">{kyc.address.country}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-yellow-500 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Submitted Documents
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Click on a document link to view in a new tab
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Valid ID */}
                {kyc.documents.validId && (
                  <div className="space-y-2">
                    <label className="text-gray-400 text-sm font-medium">Valid ID</label>
                    <a 
                      href={kyc.documents.validId.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>View Document</span>
                    </a>
                  </div>
                )}

                {/* Passport */}
                {kyc.documents.passport && (
                  <div className="space-y-2">
                    <label className="text-gray-400 text-sm font-medium">Passport</label>
                    <a 
                      href={kyc.documents.passport.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>View Document</span>
                    </a>
                  </div>
                )}

                {/* Proof of Address */}
                {kyc.documents.proofOfAddress && (
                  <div className="space-y-2">
                    <label className="text-gray-400 text-sm font-medium">Proof of Address</label>
                    <a 
                      href={kyc.documents.proofOfAddress.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>View Document</span>
                    </a>
                  </div>
                )}

                {/* Selfie */}
                {kyc.documents.selfie && (
                  <div className="space-y-2">
                    <label className="text-gray-400 text-sm font-medium">Selfie</label>
                    <a 
                      href={kyc.documents.selfie.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>View Photo</span>
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Information */}
            {kyc.reviewedBy && (
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-yellow-500 flex items-center gap-2">
                    {kyc.status === 'approved' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    Review Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-gray-400 text-sm">Reviewed By</label>
                      <p className="text-gray-200 mt-1">{kyc.reviewedBy}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Reviewed At</label>
                      <p className="text-gray-200 mt-1">
                        {kyc.reviewedAt && formatDate(kyc.reviewedAt)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
