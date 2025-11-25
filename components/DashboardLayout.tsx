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
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-slate-800">
        <Logo />
        {user.role === 'admin' && <span className="text-xs text-red-400 font-bold uppercase tracking-widest ml-1">Admin Mode</span>}
      </div>
      
      <div className="p-4">
        <div className="bg-slate-800 rounded-lg p-4 mb-6 border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
              {user.username[0].toUpperCase()}
            </div>
            <div>
              <div className="text-white font-medium">{user.username}</div>
              <div className="text-green-400 font-mono text-sm">Rs. {user.balance.toFixed(2)}</div>
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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-slate-800">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-900/20 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-slate-900 border-r border-slate-800 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 z-50 p-4 flex items-center justify-between">
        <Logo />
        <button onClick={() => setMobileMenuOpen(true)} className="text-white">
          <Menu />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative bg-slate-900 w-4/5 max-w-xs h-full shadow-2xl animate-in slide-in-from-left duration-200">
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 mt-16 md:mt-0 overflow-y-auto h-screen">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};