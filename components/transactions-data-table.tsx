"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { 
  IconChevronDown, 
  IconDotsVertical, 
  IconEye, 
  IconCheck,
  IconX,
  IconFilter,
  IconDownload,
  IconSearch,
  IconLoader2,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Transaction, updateTransactionStatus } from "@/app/actions/transactions"
import { toast } from "sonner"
import { TransactionDetailsModal } from "@/components/transaction-details-modal"

interface TransactionsDataTableProps {
  data: Transaction[]
  title: string
  onTransactionUpdate?: () => void
}

function TransactionActions({ 
  transaction, 
  onUpdate 
}: { 
  transaction: Transaction; 
  onUpdate?: () => void 
}) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [actionType, setActionType] = React.useState<'approve' | 'reject' | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  const handleStatusUpdate = async (status: 'approved' | 'rejected' | 'pending') => {
    if (isLoading) return
    
    setIsLoading(true)
    setActionType(status === 'approved' ? 'approve' : 'reject')
    
    try {
      const result = await updateTransactionStatus(
        transaction._id,
        transaction.type,
        status
      )
      
      if (result.success) {
        toast.success(result.message)
        onUpdate?.()
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

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
            disabled={isLoading}
          >
            {isLoading ? (
              <IconLoader2 className="h-4 w-4 animate-spin" />
            ) : (
              <IconDotsVertical />
            )}
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={() => setIsModalOpen(true)}>
            <IconEye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          {transaction.status === 'pending' && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleStatusUpdate('approved')}
                disabled={isLoading}
              >
                {isLoading && actionType === 'approve' ? (
                  <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <IconCheck className="mr-2 h-4 w-4" />
                )}
                Approve
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleStatusUpdate('rejected')}
                disabled={isLoading}
                className="text-red-600 focus:text-red-600"
              >
                {isLoading && actionType === 'reject' ? (
                  <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <IconX className="mr-2 h-4 w-4" />
                )}
                Reject
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <TransactionDetailsModal
        transaction={transaction}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTransactionUpdate={onUpdate}
      />
    </>
  )
}

const createColumns = (onTransactionUpdate?: () => void): ColumnDef<Transaction>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "_id",
    header: "Transaction ID",
    cell: ({ row }) => (
      <div className="font-mono text-white text-sm">
        {row.original._id.slice(-8).toUpperCase()}
      </div>
    ),
  },
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => (
      <div className="text-white font-mono text-sm">
        {row.original.user.slice(-8).toUpperCase()}
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium text-white">
        {row.original.amount} {row.original.token_name}
      </div>
    ),
  },
  {
    accessorKey: "token_name",
    header: "Method",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-1.5">
        {row.original.token_name}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <div className="text-white text-sm">
        {new Date(row.original.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>
    ),
  },
  {
    accessorKey: "token_deposit_address",
    header: "Reference",
    cell: ({ row }) => {
      const address = row.original.token_deposit_address || row.original.token_withdraw_address;
      return (
        <div className="font-mono text-white text-sm">
          {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'N/A'}
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge 
          variant={status === 'approved' ? 'default' : status === 'pending' ? 'secondary' : 'destructive'} 
          className={
            status === 'approved' ? 'bg-green-600 text-white' : 
            status === 'pending' ? 'bg-orange-600 text-white' : 
            'bg-red-600 text-white'
          }
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <TransactionActions 
        transaction={row.original}
        onUpdate={onTransactionUpdate}
      />
    ),
  },
]

export function TransactionsDataTable({ data, title, onTransactionUpdate }: TransactionsDataTableProps) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  // Create columns with the update callback
  const columns = React.useMemo(() => createColumns(onTransactionUpdate), [onTransactionUpdate])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search transactions..."
              value={(table.getColumn("_id")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("_id")?.setFilterValue(event.target.value)
              }
              className="pl-10 max-w-sm"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            <IconFilter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm" variant="outline">
            <IconDownload className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border px-4 lg:px-6">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-white">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-white">
                  No {title.toLowerCase()} found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-4 lg:px-6">
        <div className="text-app-gold-100 hidden flex-1 text-sm lg:flex">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium text-white">
              Rows per page
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium text-white">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              className="hidden h-8 w-8 p-0 lg:flex bg-app-gold-100 hover:bg-app-gold-200 text-black"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <IconChevronDown className="rotate-90" />
            </Button>
            <Button
              className="size-8 bg-app-gold-100 hover:bg-app-gold-200 text-black"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <IconChevronDown className="rotate-90" />
            </Button>
            <Button
              className="size-8 bg-app-gold-100 hover:bg-app-gold-200 text-black"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <IconChevronDown className="-rotate-90" />
            </Button>
            <Button
              className="hidden size-8 lg:flex bg-app-gold-100 hover:bg-app-gold-200 text-black"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <IconChevronDown className="-rotate-90" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}