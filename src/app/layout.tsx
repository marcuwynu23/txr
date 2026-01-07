import CreateEventModal from '@/components/events/CreateEventModal';
import { getSession } from '@/lib/session';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'txr - Event Management',
  description: 'GitLab-inspired Event Management System',
};

import { AlertProvider } from '@/components/ui/Alert';

import LogoutButton from '@/components/auth/LogoutButton';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const isLoggedIn = !!session?.userId;
  const isAdmin = session?.role === 'admin';

  return (
    <html lang="en">
      <body className={inter.className}>
        <AlertProvider>
          <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
          <header className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <div className="w-full px-4 sm:px-6 h-16 flex items-center justify-between">
              <div className="flex items-center gap-8">
                <Link href="/" className="flex items-center gap-2 group">
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black transform group-hover:rotate-6 transition-transform">
                    T
                  </div>
                  <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                    txr
                  </span>
                </Link>
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500">
                  {isLoggedIn && (
                    isAdmin ? <>
                    <Link href="/events" className="hover:text-indigo-600 transition-colors py-2">
                         Events
                      </Link>
                      <Link href="/tickets" className="hover:text-indigo-600 transition-colors py-2">
                        Tickets
                      </Link></> : <>
                        <Link href="/events" className="hover:text-indigo-600 transition-colors py-2">
                        Browse Events
                      </Link>
                      <Link href="/tickets" className="hover:text-indigo-600 transition-colors py-2">
                        My Tickets
                      </Link>
                    </>
                 
                  )}
                  {isAdmin && (
                    <Link href="/admin" className="hover:text-indigo-600 transition-colors py-2">
                      Dashboard
                    </Link>
                  )}
                </nav>
              </div>
              <div className="flex items-center gap-3">
                {isLoggedIn ? (
                  <div className="flex items-center gap-4">
                    {isAdmin && (
                        <CreateEventModal />
                    )}
                    <Link href="/profile" className="text-sm font-medium text-gray-500 hover:text-gray-900 px-2 py-1 transition-colors">
                      Profile
                    </Link>
                    <LogoutButton />
                  </div>
                ) : (
                  <>
                    <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4">
                      Sign in
                    </Link>
                    <Link href="/register" className="text-sm font-medium bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 shadow-sm transition-all active:scale-95">
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </header>
          <main className="flex-1 w-full px-4 sm:px-6 py-8">
            {children}
          </main>
          <footer className="border-t border-gray-200 bg-white py-6">
            <div className="w-full px-4 sm:px-6 text-center text-sm text-gray-500">
              © {new Date().getFullYear()} txr. Event Management System.
            </div>
          </footer>
        </div>
        </AlertProvider>
      </body>
    </html>
  );
}
