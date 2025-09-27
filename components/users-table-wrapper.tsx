import { Suspense } from 'react'
import { fetchUsers } from '@/app/actions/users'
import { UsersDataTable } from '@/components/users-data-table'
import { DataTableSkeleton } from '@/components/data-table-skeleton'

async function UsersTableData() {
  try {
    const usersData = await fetchUsers()
    
    if (!usersData.success) {
      throw new Error(usersData.message)
    }

    return <UsersDataTable data={usersData.data} />
  } catch (error) {
    console.error('Failed to fetch users:', error)
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-2">Failed to load users</h3>
          <p className="text-muted-foreground mb-4">
            There was an error loading the user data. Please try refreshing the page.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-app-gold-100 hover:bg-app-gold-200 text-black px-4 py-2 rounded-md"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }
}

export function UsersTableWrapper() {
  return (
    <Suspense fallback={<DataTableSkeleton />}>
      <UsersTableData />
    </Suspense>
  )
}