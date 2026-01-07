
'use client';

import { getUserProfile, updateProfile } from '@/actions/auth';
import { useActionState, useEffect, useState } from 'react';

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [state, action, isPending] = useActionState(updateProfile, null);

    useEffect(() => {
        getUserProfile().then(setUser);
    }, []);

    if (!user) return <div className="animate-pulse">Loading profile...</div>;

    return (
        <div className="max-w-4xl mx-auto py-10">
            <div className="flex items-start gap-8">
                {/* Sidebar Navigation - GitLab Style */}
                <div className="w-64 space-y-1">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-3">User Settings</h2>
                    <button className="w-full text-left px-3 py-2 text-sm font-medium rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                        Profile
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100 transition-colors">
                        Account
                    </button>
                     <button className="w-full text-left px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100 transition-colors">
                        Security
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h1 className="text-xl font-bold text-gray-900">Public Profile</h1>
                        <p className="text-sm text-gray-500">Update your personal information and how it appears to others.</p>
                    </div>

                    <form action={action} className="p-6 space-y-6">
                        {state?.success && (
                            <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
                                {state.success}
                            </div>
                        )}
                        {state?.error && (
                            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                                {state.error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    defaultValue={user.name}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    defaultValue={user.email}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
                                <input 
                                    type="password" 
                                    name="password" 
                                    placeholder="Leave blank to keep current"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                                />
                                <p className="mt-1 text-xs text-gray-500 italic">Minimum 6 characters if updating.</p>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100 flex justify-end">
                            <button 
                                type="submit"
                                disabled={isPending}
                                className="bg-indigo-600 text-white px-6 py-2 rounded-md font-semibold text-sm hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {isPending ? 'Saving...' : 'Save changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
