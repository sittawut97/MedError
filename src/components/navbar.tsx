'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut, BarChart3, Upload } from 'lucide-react'

export function Navbar() {
  const router = useRouter()

  const handleLogout = () => {
    // Clear any auth tokens/session
    localStorage.removeItem('isLoggedIn')
    router.push('/login')
  }

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="w-full px-4">
        <div className="flex justify-between h-12">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard">
              <Button variant="ghost" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>
            </Link>
            <Link href="/upload">
              <Button variant="ghost" className="flex items-center space-x-2">
                <Upload className="h-4 w-4" />
                <span>Upload</span>
              </Button>
            </Link>
          </div>
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="flex items-center space-x-2 text-red-600 hover:text-red-800"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}