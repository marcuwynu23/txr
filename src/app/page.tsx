
import Link from 'next/link';
import { getSession } from '@/lib/session';

export default async function Home() {
  const session = await getSession();
  const isLoggedIn = !!session?.userId;

  return (
    <div className="flex flex-col min-h-[calc(100vh-140px)]"> 
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center space-y-8 py-20 bg-gradient-to-b from-white to-gray-50 rounded-3xl mb-12 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        
        <div className="space-y-4 max-w-3xl mx-auto px-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            The modern platform for <span className="text-indigo-600">Events</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Create, manage, and promote your events with ease. A powerful, developer-friendly ticketing system designed for communities.
            </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
            {isLoggedIn ? (
                <Link 
                href="/events" 
                className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                Browse Events
                </Link>
            ) : (
                <>
                    <Link 
                    href="/register" 
                    className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all"
                    >
                    Get Started Now
                    </Link>
                    <Link 
                    href="/login" 
                    className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-base font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-all"
                    >
                    Sign In
                    </Link>
                </>
            )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center px-4">
            <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all border border-gray-100">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Easy Ticketing</h3>
                <p className="mt-2 text-gray-500 leading-relaxed">Create free or paid tickets in seconds. Manage capacity and sales effortlessly.</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all border border-gray-100">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Community First</h3>
                <p className="mt-2 text-gray-500 leading-relaxed">Built for meetups, conferences, and parties. Connect with your attendees.</p>
            </div>
             <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all border border-gray-100">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mb-4">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">QR Check-in</h3>
                <p className="mt-2 text-gray-500 leading-relaxed">Validate tickets instantly with our secure QR code scanning system.</p>
            </div>
        </div>
      </section>
    </div>
  );
}
