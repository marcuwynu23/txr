
'use client';

import { logout } from '@/actions/auth';
import { useAlert } from '@/components/ui/Alert';

export default function LogoutButton() {
  const { showConfirm } = useAlert();

  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault();
    showConfirm({
      title: 'Sign Out?',
      message: 'Are you sure you want to end your session?',
      type: 'warning',
      confirmText: 'Sign Out',
      onConfirm: async () => {
        await logout();
      }
    });
  };

  return (
    <form onSubmit={handleLogout}>
      <button 
        type="submit" 
        className="text-sm font-medium text-gray-400 hover:text-gray-700 transition-colors"
      >
        Sign out
      </button>
    </form>
  );
}
