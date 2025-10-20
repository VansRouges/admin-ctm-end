"use client"

import { useEffect, useState } from 'react'
import { fetchUsers } from '@/app/actions/users'
import { UsersDataTable } from '@/components/users-data-table'
import { DataTableSkeleton } from '@/components/data-table-skeleton'
import type { User } from '@/app/actions/users'

export function UsersTableWrapper() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadUsers = async () => {
    try {
      setLoading(true)
      const usersData = await fetchUsers()
      
      if (!usersData.success) {
        throw new Error(usersData.message)
      }

      setUsers(usersData.data)
    } catch (err) {
      console.error('Failed to fetch users:', err)
      setError(err instanceof Error ? err.message : 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const refreshUsers = () => {
    loadUsers()
  }

  if (loading) {
    return <DataTableSkeleton />
  }

  if (error) {
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

  return <UsersDataTable data={users} onRefresh={refreshUsers} />
}