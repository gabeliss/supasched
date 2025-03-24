import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Sparkles, Users, CheckCircle, BellRing } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Header */}
      <header className="sticky top-0 z-10 w-full border-b bg-white shadow-sm">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <span className="text-primary font-bold text-2xl">SupaSched</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline" className="rounded-full px-4">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button className="rounded-full px-4">Sign Up</Button>
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <Badge variant="outline" className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-950 focus:ring-offset-2 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-50">
                    <Sparkles className="mr-1 h-3 w-3" /> Made for Therapists
                  </Badge>
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-gray-900 dark:text-white">
                    Scheduling Made <span className="text-blue-600 dark:text-blue-400">Simple</span> for Therapists
                  </h1>
                  <p className="max-w-[600px] text-gray-600 md:text-xl dark:text-gray-300">
                    Manage appointments, track availability, and give clients an easy way to book sessions, all in one place.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button size="lg" className="rounded-full text-base h-12 px-8 bg-blue-600 hover:bg-blue-700">Get Started</Button>
                  </Link>
                  <Link href="#features">
                    <Button size="lg" variant="outline" className="rounded-full text-base h-12 px-8">Learn More</Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-sm md:max-w-md overflow-hidden rounded-2xl border bg-white shadow-xl dark:border-gray-800 dark:bg-gray-950">
                  <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Your Schedule at a Glance</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Always know what's next in your day</p>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 dark:bg-blue-900/20 dark:border-blue-800">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-blue-600 mr-2" />
                          <span className="font-medium text-blue-900 dark:text-blue-300">Today's Schedule</span>
                        </div>
                        <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:bg-blue-900/20">
                          3 Sessions
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 transition-all hover:shadow-sm">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-gray-100">Client Session</h4>
                            <div className="flex items-center mt-1">
                              <Users className="h-3.5 w-3.5 text-gray-500 mr-1" />
                              <p className="text-sm text-gray-500">John D.</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center text-gray-900 dark:text-gray-100 font-medium">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              <span>10:00 AM</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">45 min</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 transition-all hover:shadow-sm">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-gray-100">Client Session</h4>
                            <div className="flex items-center mt-1">
                              <Users className="h-3.5 w-3.5 text-gray-500 mr-1" />
                              <p className="text-sm text-gray-500">Sarah M.</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center text-gray-900 dark:text-gray-100 font-medium">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              <span>2:30 PM</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">60 min</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-100 blur-3xl opacity-30 dark:bg-blue-900"></div>
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-blue-100 blur-3xl opacity-30 dark:bg-blue-900"></div>
        </section>
        
        {/* Features Section */}
        <section id="features" className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-gray-900 dark:text-white">Why Choose SupaSched</h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Built specifically for therapists with the features you need to streamline your practice
              </p>
            </div>
            
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-950">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-4 dark:bg-blue-900/20 dark:text-blue-400">
                  <Calendar className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Streamlined Scheduling</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Set your availability and let clients book appointments that work for both of you.
                </p>
              </div>
              
              <div className="relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-950">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-4 dark:bg-blue-900/20 dark:text-blue-400">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Client Management</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Keep track of client information, session notes, and booking history all in one place.
                </p>
              </div>
              
              <div className="relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-950">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-4 dark:bg-blue-900/20 dark:text-blue-400">
                  <BellRing className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Automated Reminders</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Reduce no-shows with automated email and SMS reminders for upcoming appointments.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="bg-blue-50 py-16 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-gray-900 dark:text-white">Loved by Therapists</h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Join hundreds of mental health professionals who have simplified their scheduling
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="rounded-full bg-blue-100 p-1 dark:bg-blue-800">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-sm font-medium">"Finally, software that understands therapists!"</div>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  SupaSched has transformed how I manage my practice. The streamlined scheduling has saved me hours each week.
                </p>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="font-medium text-gray-900 dark:text-white">Dr. Emily R.</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Clinical Psychologist</p>
                </div>
              </div>
              
              <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="rounded-full bg-blue-100 p-1 dark:bg-blue-800">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-sm font-medium">"My clients love the booking experience!"</div>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  The automated reminders have dramatically reduced my no-show rate, and clients appreciate the simplicity.
                </p>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="font-medium text-gray-900 dark:text-white">Michael T.</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Marriage & Family Therapist</p>
                </div>
              </div>
              
              <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800 md:col-span-2 lg:col-span-1">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="rounded-full bg-blue-100 p-1 dark:bg-blue-800">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-sm font-medium">"Worth every penny!"</div>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  I've tried many scheduling tools, but SupaSched is the only one designed with therapists in mind. The time I save pays for itself.
                </p>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="font-medium text-gray-900 dark:text-white">Sarah J.</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Licensed Counselor</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="relative overflow-hidden rounded-3xl bg-blue-600 px-6 py-16 sm:px-12 md:py-20 dark:bg-blue-900">
              <div className="relative z-10 max-w-lg mx-auto text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Ready to transform your practice?
                </h2>
                <p className="mt-4 text-lg text-blue-100">
                  Join SupaSched today and experience the difference that purpose-built scheduling can make.
                </p>
                <div className="mt-8">
                  <Link href="/signup">
                    <Button size="lg" className="rounded-full bg-white text-blue-600 hover:bg-blue-50 h-12 px-8">
                      Start Your Free Trial
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Background decoration */}
              <div className="absolute top-0 -right-40 h-[150%] w-[150%] translate-x-1/2 rounded-full bg-blue-500 opacity-20 blur-3xl"></div>
              <div className="absolute -bottom-40 -left-40 h-[150%] w-[150%] translate-x-1/2 rounded-full bg-blue-700 opacity-20 blur-3xl"></div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t bg-white py-8 dark:bg-gray-950">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm text-gray-500 md:text-left dark:text-gray-400">
            © 2023 SupaSched. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
              Privacy
            </Link>
            <Link href="/contact" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
} 