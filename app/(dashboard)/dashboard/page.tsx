import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarDays, Clock, Users, Code } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  // Dashboard feature cards for quick navigation
  const features = [
    {
      title: 'Manage Availability',
      description: 'Set your working hours and recurring schedules.',
      icon: <CalendarDays className="h-6 w-6 text-primary" />,
      href: '/dashboard/availability',
    },
    {
      title: 'Schedule Time Off',
      description: 'Block personal time, vacations, and breaks.',
      icon: <Clock className="h-6 w-6 text-primary" />,
      href: '/dashboard/time-off',
    },
    {
      title: 'Manage Appointments',
      description: 'View, create, and manage client appointments.',
      icon: <Users className="h-6 w-6 text-primary" />,
      href: '/dashboard/appointments',
    },
    {
      title: 'Booking Widget',
      description: 'Get your embed code for client booking.',
      icon: <Code className="h-6 w-6 text-primary" />,
      href: '/dashboard/widget',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome to SupaSched</h1>
        <p className="text-muted-foreground mt-2">
          Your all-in-one scheduling platform for therapy appointments.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <Link key={feature.href} href={feature.href}>
            <Card className="h-full cursor-pointer hover:bg-muted/50 transition-colors">
              <CardHeader>
                <div className="mb-2">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
} 