'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CalendarDays, Clock, Users, Code, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type NavItem = {
  title: string
  href: string
  icon: React.ReactNode
}

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  
  const navItems: NavItem[] = [
    {
      title: 'Availability',
      href: '/dashboard/availability',
      icon: <CalendarDays className="h-5 w-5" />,
    },
    {
      title: 'Time Off',
      href: '/dashboard/time-off',
      icon: <Clock className="h-5 w-5" />,
    },
    {
      title: 'Appointments',
      href: '/dashboard/appointments',
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: 'Booking Widget',
      href: '/dashboard/widget',
      icon: <Code className="h-5 w-5" />,
    },
  ]

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error.message)
    } else {
      router.push('/login')
    }
  }

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <h1 className="text-lg font-semibold">SupaSched</h1>
      </div>
      <nav className="flex-1 overflow-auto py-4">
        <ul className="grid grid-flow-row gap-2 px-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link 
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  pathname === item.href 
                    ? "bg-accent text-accent-foreground" 
                    : "hover:bg-accent/50"
                )}
              >
                {item.icon}
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="border-t p-4">
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
} 