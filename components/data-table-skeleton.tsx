import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function DataTableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header skeleton */}
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Skeleton className="h-8 w-32 bg-gray-700" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-32 bg-gray-700" />
          <Skeleton className="h-8 w-24 bg-gray-700" />
        </div>
      </div>

      {/* Table skeleton */}
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="w-8">
                <Skeleton className="h-4 w-4 bg-gray-700" />
              </TableHead>
              <TableHead className="w-8">
                <Skeleton className="h-4 w-4 bg-gray-700" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-16 bg-gray-700" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-20 bg-gray-700" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-16 bg-gray-700" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-20 bg-gray-700" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-24 bg-gray-700" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-16 bg-gray-700" />
              </TableHead>
              <TableHead className="w-8"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-4 bg-gray-700" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-4 bg-gray-700" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32 bg-gray-700" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24 bg-gray-700" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-16 rounded-full bg-gray-700" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20 bg-gray-700" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-28 bg-gray-700" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-16 rounded-full bg-gray-700" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-6 bg-gray-700" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between px-4">
        <Skeleton className="h-4 w-32 bg-gray-700" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20 bg-gray-700" />
          <Skeleton className="h-4 w-24 bg-gray-700" />
          <Skeleton className="h-8 w-8 bg-gray-700" />
          <Skeleton className="h-8 w-8 bg-gray-700" />
          <Skeleton className="h-8 w-8 bg-gray-700" />
          <Skeleton className="h-8 w-8 bg-gray-700" />
        </div>
      </div>
    </div>
  )
}