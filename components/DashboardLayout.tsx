import React, { useState } from 'react';
import { Logo } from './Logo';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  History, 
  Wallet, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  LifeBuoy,
  ShieldAlert,
  Layers,
  MessageSquare
} from 'lucide-react';
import { User } from '../types';

interface DashboardLayoutProps {
  user: User;
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  user, 
  children, 
  activeTab, 
  setActiveTab, 
  onLogout 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'new-order', label: 'New Order', icon: ShoppingBag },
    { id: 'mass-order', label: 'Mass Order', icon: Layers },
    { id: 'orders', label: 'Order History', icon: History },
    { id: 'services', label: 'Services', icon: LayoutDashboard },
    { id: 'funds', label: 'Add Funds (NPR)', icon: Wallet },
    { id: 'tickets', label: 'Support Tickets', icon: MessageSquare },
  ];

  if (user.role === 'admin') {
    navItems.push({ id: 'admin', label: 'Admin Panel', icon: ShieldAlert });
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-zinc-950">
      <div className="p-6 border-b border-zinc-800">
        <Logo />
        {user.role === 'admin' && <span className="text-xs text-red-500 font-bold uppercase tracking-widest ml-1 drop-shadow-sm">Admin Mode</span>}
      </div>
      
      <div className="p-4">
        <div className="bg-zinc-900 rounded-lg p-4 mb-6 border border-zinc-800 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-brand-900/20">
              {user.username[0].toUpperCase()}
            </div>
            <div>
              <div className="text-white font-medium">{user.username}</div>
              <div className="text-emerald-400 font-mono text-sm font-semibold">Rs. {user.balance.toFixed(2)}</div>
            </div>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-brand-600/10 text-brand-400 border border-brand-600/20' 
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-white hover:border-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-brand-400' : 'text-zinc-500'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-zinc-800">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-950/20 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black flex font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-zinc-950 border-r border-zinc-800 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-black/90 backdrop-blur-md border-b border-zinc-800 z-50 p-4 flex items-center justify-between">
        <Logo />
        <button onClick={() => setMobileMenuOpen(true)} className="text-white">
          <Menu />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative bg-zinc-950 w-4/5 max-w-xs h-full shadow-2xl border-r border-zinc-800 animate-in slide-in-from-left duration-200">
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 mt-16 md:mt-0 overflow-y-auto h-screen bg-black">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};