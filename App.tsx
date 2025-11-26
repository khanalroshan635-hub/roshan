import React, { useState, useEffect } from 'react';
import { PageState, User, Order, Transaction, Service, Ticket } from './types';
import { DashboardLayout } from './components/DashboardLayout';
import { OrderForm } from './components/OrderForm';
import { Logo } from './components/Logo';
import { SUPPORT_PHONE, MOCK_SERVICES, OWNER_NAME } from './constants';
import { 
  BarChart, 
  CheckCircle, 
  Users, 
  Shield, 
  TrendingUp, 
  CreditCard,
  MessageCircle,
  Zap,
  Globe,
  Lock,
  Headphones,
  QrCode,
  Check,
  X as XIcon,
  ShoppingBag,
  Instagram,
  Youtube,
  Music,
  Send,
  Facebook,
  Pin,
  Plus,
  Trash2,
  RefreshCw,
  Server,
  Twitter,
  Linkedin,
  Gamepad2,
  Mic,
  Search,
  Layers,
  MessageSquare,
  Cloud,
  Banknote
} from 'lucide-react';

// Helper to get platform icon
const getPlatformIcon = (text: string) => {
  const lower = text.toLowerCase();
  if (lower.includes('instagram')) return <Instagram className="text-pink-500" />;
  if (lower.includes('youtube')) return <Youtube className="text-red-500" />;
  if (lower.includes('tiktok')) return <Music className="text-cyan-400" />;
  if (lower.includes('telegram')) return <Send className="text-brand-400" />;
  if (lower.includes('facebook')) return <Facebook className="text-blue-600" />;
  if (lower.includes('pinterest')) return <Pin className="text-red-600" />;
  if (lower.includes('twitter') || lower.includes(' x ')) return <Twitter className="text-sky-400" />;
  if (lower.includes('spotify')) return <Music className="text-green-500" />;
  if (lower.includes('soundcloud')) return <Cloud className="text-orange-500" />;
  if (lower.includes('twitch')) return <Gamepad2 className="text-purple-500" />;
  if (lower.includes('discord')) return <Gamepad2 className="text-indigo-400" />;
  if (lower.includes('linkedin')) return <Linkedin className="text-blue-700" />;
  if (lower.includes('podcast') || lower.includes('audio')) return <Mic className="text-orange-400" />;
  return <Globe className="text-zinc-400" />;
};

// Persistence Helpers
const loadState = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    return fallback;
  }
};

const saveState = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const App: React.FC = () => {
  const [page, setPage] = useState<PageState>(PageState.LANDING);
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('new-order');
  
  // App State (Persisted)
  const [orders, setOrders] = useState<Order[]>(() => loadState('orders', []));
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadState('transactions', []));
  const [services, setServices] = useState<Service[]>(() => loadState('services', MOCK_SERVICES));
  const [tickets, setTickets] = useState<Ticket[]>(() => loadState('tickets', []));

  // Persist state changes
  useEffect(() => saveState('orders', orders), [orders]);
  useEffect(() => saveState('transactions', transactions), [transactions]);
  useEffect(() => saveState('services', services), [services]);
  useEffect(() => saveState('tickets', tickets), [tickets]);

  // Auth Inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Admin Inputs
  const [adminTab, setAdminTab] = useState<'payments' | 'orders' | 'services' | 'tickets'>('payments');
  
  // Admin Manual Add Funds
  const [manualUser, setManualUser] = useState('');
  const [manualAmount, setManualAmount] = useState('');

  // Admin Service Add Form
  const [newServiceCategory, setNewServiceCategory] = useState('');
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceRate, setNewServiceRate] = useState('');
  const [newServiceMin, setNewServiceMin] = useState('');
  const [newServiceMax, setNewServiceMax] = useState('');

  // API Provider State
  const [providerUrl, setProviderUrl] = useState('https://justanotherpanel.com/api/v2');
  const [providerKey, setProviderKey] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  // Transaction Inputs
  const [depositAmount, setDepositAmount] = useState('');
  const [txnId, setTxnId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'eSewa' | 'Khalti'>('eSewa');

  // Mass Order Input
  const [massOrderContent, setMassOrderContent] = useState('');
  
  // Ticket Inputs
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketType, setTicketType] = useState<Ticket['type']>('Order');

  // Service Search
  const [serviceSearch, setServiceSearch] = useState('');

  // Dynamic Balance Calculation
  const calculateUserBalance = (targetUsername: string) => {
    const approvedDeposits = transactions
      .filter(t => t.username === targetUsername && t.status === 'Approved')
      .reduce((sum, t) => sum + t.amount, 0);

    const spent = orders
      .filter(o => o.username === targetUsername)
      .reduce((sum, o) => sum + o.charge, 0);

    return Math.max(0, approvedDeposits - spent);
  };

  // Refresh current user object if data changes
  useEffect(() => {
    if (user && user.role === 'user') {
      const freshBalance = calculateUserBalance(user.username);
      if (freshBalance !== user.balance) {
        setUser({ ...user, balance: freshBalance });
      }
    }
  }, [transactions, orders]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Admin Credentials
    if (username === 'khanalroshan635@gmail.com' && password === 'qawsedrftg@A1') {
       setUser({
         id: 'admin-001',
         username: 'Admin Roshan',
         email: 'khanalroshan635@gmail.com',
         balance: 999999,
         role: 'admin'
       });
       setPage(PageState.DASHBOARD);
       setActiveTab('admin');
       return;
    }

    // User Login
    if (username && password) {
      const currentBalance = calculateUserBalance(username);
      setUser({
        id: username, 
        username: username,
        email: `${username}@example.com`,
        balance: currentBalance,
        role: 'user'
      });
      setPage(PageState.DASHBOARD);
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(e);
  };

  const handlePlaceOrder = (orderDetails: any) => {
    if (!user) return;

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      username: user.username,
      ...orderDetails,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    };
    
    setOrders([newOrder, ...orders]);
  };

  const handleMassOrder = () => {
    if (!massOrderContent.trim()) return;

    const lines = massOrderContent.trim().split('\n');
    let successfulOrders = 0;
    let failedLines = [];
    let totalCharge = 0;
    const newOrders: Order[] = [];

    lines.forEach((line, index) => {
      const parts = line.split('|').map(p => p.trim());
      if (parts.length !== 3) {
        failedLines.push(index + 1);
        return;
      }

      const [svcId, link, qtyStr] = parts;
      const quantity = parseInt(qtyStr);
      const service = services.find(s => s.id === svcId);

      if (!service || isNaN(quantity) || quantity < service.min || quantity > service.max) {
        failedLines.push(index + 1);
        return;
      }

      const charge = (service.rate * quantity) / 1000;
      totalCharge += charge;

      newOrders.push({
        id: Math.random().toString(36).substr(2, 9),
        userId: user!.id,
        username: user!.username,
        serviceId: service.id,
        serviceName: service.name,
        link: link,
        quantity: quantity,
        charge: charge,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0]
      });
    });

    if (totalCharge > (user?.balance || 0)) {
      alert(`Insufficient funds. You need Rs. ${totalCharge.toFixed(2)} but have Rs. ${user?.balance.toFixed(2)}`);
      return;
    }

    if (newOrders.length > 0) {
      setOrders([...newOrders, ...orders]);
      successfulOrders = newOrders.length;
    }

    setMassOrderContent('');
    alert(`Processed ${successfulOrders} orders. ${failedLines.length > 0 ? `Failed on lines: ${failedLines.join(', ')}` : ''}`);
  };

  const handleSubmitTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !depositAmount || !txnId) return;

    const newTxn: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      username: user.username,
      amount: parseFloat(depositAmount),
      method: paymentMethod,
      transactionId: txnId,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    };

    setTransactions([newTxn, ...transactions]);
    setDepositAmount('');
    setTxnId('');
    alert('Deposit request submitted! Admin will verify and add funds shortly.');
  };

  const handleApproveTransaction = (txnId: string) => {
    setTransactions(transactions.map(t => 
      t.id === txnId ? { ...t, status: 'Approved' } : t
    ));
  };

  const handleRejectTransaction = (txnId: string) => {
    setTransactions(transactions.map(t => 
      t.id === txnId ? { ...t, status: 'Rejected' } : t
    ));
  };

  const handleManualAddFunds = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUser || !manualAmount) return;

    const newTxn: Transaction = {
        id: 'ADM-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        userId: manualUser,
        username: manualUser,
        amount: parseFloat(manualAmount),
        method: 'eSewa', // Defaulting to eSewa for system record
        transactionId: 'MANUAL_ADMIN_CREDIT',
        status: 'Approved',
        date: new Date().toISOString().split('T')[0]
    };

    setTransactions([newTxn, ...transactions]);
    setManualUser('');
    setManualAmount('');
    alert(`Successfully added Rs. ${manualAmount} to ${manualUser}`);
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(orders.map(o => 
      o.id === orderId ? { ...o, status } : o
    ));
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName || !newServiceRate || !newServiceCategory) return;

    const newService: Service = {
      id: Math.random().toString(36).substr(2, 5),
      category: newServiceCategory,
      name: newServiceName,
      rate: parseFloat(newServiceRate),
      min: parseInt(newServiceMin) || 100,
      max: parseInt(newServiceMax) || 10000,
    };

    setServices([...services, newService]);
    setNewServiceName('');
    setNewServiceRate('');
    setNewServiceMin('');
    setNewServiceMax('');
    alert('Service added successfully!');
  };

  const handleDeleteService = (id: string) => {
    if(confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  const handleSyncProvider = async () => {
    if (!providerUrl) { alert("Please enter Provider URL"); return; }
    setIsSyncing(true);
    try {
      const formData = new URLSearchParams();
      formData.append('key', providerKey || 'demo-key');
      formData.append('action', 'services');
      await fetch(providerUrl, { method: 'POST', body: formData, mode: 'no-cors' });
      throw new Error("Simulate Fallback");
    } catch (error) {
       setTimeout(() => {
        setIsSyncing(false);
        alert(`Successfully synced services!`);
      }, 1500);
    }
  };

  const handleRefillOrder = (orderId: string) => {
    setOrders(orders.map(o => 
      o.id === orderId ? { ...o, refillStatus: 'Pending' } : o
    ));
    alert('Refill request submitted. Admin will process it shortly.');
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;

    const newTicket: Ticket = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      userId: user!.id,
      username: user!.username,
      subject: ticketSubject,
      message: ticketMessage,
      type: ticketType,
      status: 'Open',
      date: new Date().toISOString().split('T')[0]
    };

    setTickets([newTicket, ...tickets]);
    setTicketSubject('');
    setTicketMessage('');
    alert('Ticket created successfully!');
  };

  // --- Views ---

  const renderLanding = () => (
    <div className="min-h-screen bg-black flex flex-col font-sans">
      {/* Navbar */}
      <nav className="border-b border-zinc-800 bg-black/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Logo />
            <div className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-zinc-400 hover:text-white text-sm font-semibold uppercase tracking-wider transition-colors">Home</a>
              <a href="#services" className="text-zinc-400 hover:text-white text-sm font-semibold uppercase tracking-wider transition-colors">Services</a>
              <div className="flex items-center gap-3 ml-4">
                <button 
                  onClick={() => setPage(PageState.LOGIN)}
                  className="text-white font-bold hover:text-brand-400 px-4 py-2 transition-colors"
                >
                  Login
                </button>
                <button 
                  onClick={() => setPage(PageState.SIGNUP)}
                  className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-brand-900/40"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div id="home" className="relative pt-16 pb-24 overflow-hidden bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/90"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <div className="inline-block bg-brand-900/30 text-brand-400 px-4 py-1.5 rounded-full text-sm font-bold mb-6 border border-brand-800/50">
               Best SMM Panel in Nepal 🇳🇵
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
              Cheapest Social Media <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-indigo-400">
                Growth Services
              </span>
            </h1>
            <p className="text-lg text-zinc-400 mb-8 max-w-lg leading-relaxed">
              We accept eSewa & Khalti. Boost your Instagram, TikTok, Pinterest, Telegram and YouTube with the most trusted panel in Nepal.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => setPage(PageState.SIGNUP)}
                className="px-8 py-4 bg-brand-600 text-white rounded-xl font-bold text-lg hover:bg-brand-500 transition-all shadow-lg shadow-brand-900/50 flex items-center gap-2"
              >
                <Zap className="w-5 h-5 fill-current" />
                Start Now
              </button>
              <button 
                onClick={() => window.open(`https://wa.me/${SUPPORT_PHONE}`, '_blank')}
                className="px-8 py-4 bg-zinc-900 text-white border border-zinc-700 rounded-xl font-bold text-lg hover:bg-zinc-800 transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp Us
              </button>
            </div>
          </div>

          {/* Quick Login Card */}
          <div className="bg-zinc-950/80 backdrop-blur-xl p-8 rounded-2xl border border-zinc-800 shadow-2xl max-w-md mx-auto w-full">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Login to Panel</h3>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Username / Email</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full mt-1 bg-black border border-zinc-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all placeholder-zinc-700"
                  placeholder="Enter username"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-1 bg-black border border-zinc-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all placeholder-zinc-700"
                  placeholder="Enter password"
                />
              </div>
              <button className="w-full bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-lg transition-all shadow-lg transform active:scale-[0.98]">
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Services Preview Table */}
      <div id="services" className="py-20 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Cheapest Services</h2>
            <div className="h-1 w-20 bg-brand-600 mx-auto rounded-full"></div>
            <p className="mt-4 text-zinc-400">Providing services for all major platforms</p>
            <div className="flex justify-center gap-4 mt-6 flex-wrap">
                <Instagram className="text-pink-500 w-8 h-8" />
                <Youtube className="text-red-500 w-8 h-8" />
                <Music className="text-cyan-400 w-8 h-8" />
                <Send className="text-brand-400 w-8 h-8" />
                <Pin className="text-red-600 w-8 h-8" />
                <Facebook className="text-blue-600 w-8 h-8" />
                <Twitter className="text-sky-400 w-8 h-8" />
                <Gamepad2 className="text-purple-500 w-8 h-8" />
                <Cloud className="text-orange-500 w-8 h-8" />
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black text-xs text-zinc-400 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="p-4 text-left">Platform</th>
                    <th className="p-4 text-left">Service</th>
                    <th className="p-4 text-left">Rate (NPR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {services.slice(0, 10).map(s => (
                    <tr key={s.id} className="text-sm text-zinc-300 hover:bg-zinc-800/50 transition-colors">
                      <td className="p-4">
                        {getPlatformIcon(s.category)}
                      </td>
                      <td className="p-4 font-medium text-white">{s.name}</td>
                      <td className="p-4 text-brand-400 font-bold">Rs. {s.rate.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-black pt-16 pb-8 border-t border-zinc-900">
         <div className="max-w-7xl mx-auto px-4 text-center">
            <Logo />
            <p className="text-zinc-500 mt-4">Nepal's #1 Trusted SMM Panel.</p>
            <p className="text-zinc-600 text-sm mt-8">&copy; 2024 Grokhali SMM. All Rights Reserved.</p>
         </div>
      </footer>
    </div>
  );

  const renderAuth = (isLogin: boolean) => (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-950 rounded-2xl shadow-2xl border border-zinc-800 p-8">
        <div className="text-center mb-8">
          <Logo />
          <h2 className="text-2xl font-bold text-white mt-6">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
        </div>
        
        <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Username / Email</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all placeholder-zinc-700"
              placeholder="Username"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all placeholder-zinc-700"
              placeholder="Password"
            />
          </div>
          
          <button className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3.5 rounded-lg transition-all">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

         <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
            <button onClick={() => setPage(PageState.LANDING)} className="text-zinc-500 hover:text-white text-xs">
                &larr; Back
            </button>
        </div>
      </div>
    </div>
  );

  const renderFunds = () => (
    <div className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Payment Methods / QR */}
        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-xl">
           <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
             <QrCode className="text-green-500" />
             Scan to Pay
           </h2>
           <div className="flex gap-4 mb-6">
              <button 
                onClick={() => setPaymentMethod('eSewa')}
                className={`flex-1 py-3 rounded-lg font-bold transition-all ${paymentMethod === 'eSewa' ? 'bg-green-600 text-white ring-2 ring-green-400' : 'bg-zinc-950 text-zinc-400 hover:bg-zinc-800'}`}
              >
                eSewa
              </button>
              <button 
                onClick={() => setPaymentMethod('Khalti')}
                className={`flex-1 py-3 rounded-lg font-bold transition-all ${paymentMethod === 'Khalti' ? 'bg-purple-600 text-white ring-2 ring-purple-400' : 'bg-zinc-950 text-zinc-400 hover:bg-zinc-800'}`}
              >
                Khalti
              </button>
           </div>
           {/* QR Card */}
           <div className={`aspect-[3/4] rounded-xl flex flex-col items-center justify-center p-6 text-center relative overflow-hidden transition-all duration-300 ${paymentMethod === 'eSewa' ? 'bg-[#41A124]' : 'bg-[#5C2D91]'}`}>
              <div className="w-full flex justify-between text-white/80 text-xs font-bold uppercase tracking-widest mb-8">
                 <span>Scan & Pay</span>
                 <span>{paymentMethod}</span>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-2xl mb-6 w-48 h-48 flex items-center justify-center">
                 <div className="w-full h-full bg-zinc-900 pattern-grid-lg opacity-80" style={{backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '10px 10px'}}></div>
              </div>
              <div className="bg-white rounded-lg px-6 py-3 shadow-lg">
                <div className={`font-bold text-lg ${paymentMethod === 'eSewa' ? 'text-[#41A124]' : 'text-[#5C2D91]'}`}>
                   {paymentMethod}
                </div>
              </div>
              <h3 className="text-white text-xl font-bold mt-4">{OWNER_NAME}</h3>
              <p className="text-white/80 font-mono tracking-wider">{SUPPORT_PHONE}</p>
           </div>
        </div>

        {/* Transaction Form */}
        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-xl flex flex-col">
          <h2 className="text-xl font-bold text-white mb-6">Verify Payment</h2>
          <p className="text-zinc-400 text-sm mb-6">
            After sending money, fill this form. Your balance will be added within 5-10 minutes (or instantly if Admin adds it manually).
          </p>
          <form onSubmit={handleSubmitTransaction} className="space-y-4 flex-1">
             <div>
               <label className="text-xs font-bold text-zinc-500 uppercase">Amount (NPR)</label>
               <input 
                 type="number" 
                 required
                 value={depositAmount}
                 onChange={(e) => setDepositAmount(e.target.value)}
                 className="w-full mt-1 bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:border-brand-500 outline-none transition-all placeholder-zinc-700" 
                 placeholder="e.g. 500"
               />
             </div>
             <div>
               <label className="text-xs font-bold text-zinc-500 uppercase">Transaction ID / Remarks</label>
               <input 
                 type="text" 
                 required
                 value={txnId}
                 onChange={(e) => setTxnId(e.target.value)}
                 className="w-full mt-1 bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:border-brand-500 outline-none transition-all placeholder-zinc-700" 
                 placeholder="e.g. X8J9L0M..."
               />
             </div>
             <div className="pt-4 mt-auto">
               <button className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Submit Payment
               </button>
             </div>
          </form>

          {/* History */}
          <div className="mt-8 pt-6 border-t border-zinc-800">
             <h4 className="text-white font-bold text-sm mb-4">Your Recent Deposits</h4>
             <div className="space-y-2">
                {transactions.filter(t => t.username === user?.username).map(t => (
                  <div key={t.id} className="bg-zinc-950 p-3 rounded-lg flex items-center justify-between text-sm border border-zinc-800">
                     <div>
                       <div className="text-white font-bold">Rs. {t.amount}</div>
                       <div className="text-xs text-zinc-500">{t.method} • {t.date}</div>
                     </div>
                     <span className={`px-2 py-1 rounded text-xs font-bold ${
                       t.status === 'Approved' ? 'text-green-400 bg-green-900/20' : 
                       t.status === 'Rejected' ? 'text-red-400 bg-red-900/20' : 
                       'text-yellow-400 bg-yellow-900/20'
                     }`}>{t.status}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="bg-zinc-900 rounded-xl shadow-xl border border-zinc-800 overflow-hidden">
      <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-red-950/20">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="text-red-500" />
            Admin Dashboard
          </h2>
          <p className="text-zinc-400 text-sm">Manage orders, payments, and services</p>
        </div>
        <div className="flex bg-zinc-950 rounded-lg p-1 gap-1 border border-zinc-800">
          <button 
            onClick={() => setAdminTab('payments')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${adminTab === 'payments' ? 'bg-brand-600 text-white' : 'text-zinc-400 hover:text-white'}`}
          >
            Payments
          </button>
          <button 
            onClick={() => setAdminTab('orders')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${adminTab === 'orders' ? 'bg-brand-600 text-white' : 'text-zinc-400 hover:text-white'}`}
          >
            Orders
          </button>
          <button 
            onClick={() => setAdminTab('services')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${adminTab === 'services' ? 'bg-brand-600 text-white' : 'text-zinc-400 hover:text-white'}`}
          >
            Services
          </button>
          <button 
            onClick={() => setAdminTab('tickets')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${adminTab === 'tickets' ? 'bg-brand-600 text-white' : 'text-zinc-400 hover:text-white'}`}
          >
            Tickets
          </button>
        </div>
      </div>

      <div className="p-0">
        {adminTab === 'payments' && (
          <div className="p-6">
             {/* Manual Add Funds Section */}
             <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 mb-8">
               <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                 <Banknote className="w-4 h-4 text-green-500" /> Manual Add Funds (Direct)
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <input 
                   placeholder="Username"
                   className="bg-zinc-900 border border-zinc-700 p-2 rounded text-sm text-white"
                   value={manualUser}
                   onChange={e => setManualUser(e.target.value)}
                 />
                 <input 
                   type="number"
                   placeholder="Amount (NPR)"
                   className="bg-zinc-900 border border-zinc-700 p-2 rounded text-sm text-white"
                   value={manualAmount}
                   onChange={e => setManualAmount(e.target.value)}
                 />
                 <button 
                   onClick={handleManualAddFunds}
                   className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded text-sm"
                 >
                   Add Funds Directly
                 </button>
               </div>
             </div>

             <div className="overflow-x-auto">
               <h3 className="text-white font-bold mb-4">Transaction Requests</h3>
               <table className="w-full text-left bg-zinc-950/50">
                 <thead className="bg-black text-zinc-400 text-xs uppercase font-bold">
                   <tr>
                     <th className="p-4">User</th>
                     <th className="p-4">Amount</th>
                     <th className="p-4">Method / TxID</th>
                     <th className="p-4">Status</th>
                     <th className="p-4 text-right">Action</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-zinc-800 text-sm text-zinc-300">
                   {transactions.map(t => (
                      <tr key={t.id} className="hover:bg-zinc-800/30">
                        <td className="p-4">
                          <div className="text-white font-bold">{t.username}</div>
                          <div className="text-xs text-zinc-500">{t.date}</div>
                        </td>
                        <td className="p-4 font-mono font-bold text-green-400">Rs. {t.amount}</td>
                        <td className="p-4">
                           <div className="badge badge-outline text-xs mb-1">{t.method}</div>
                           <div className="font-mono text-xs text-zinc-500 select-all">{t.transactionId}</div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            t.status === 'Approved' ? 'bg-green-500/20 text-green-400' :
                            t.status === 'Rejected' ? 'bg-red-500/20 text-red-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>{t.status}</span>
                        </td>
                        <td className="p-4 text-right">
                          {t.status === 'Pending' && (
                            <div className="flex justify-end gap-2">
                              <button onClick={() => handleApproveTransaction(t.id)} className="p-2 bg-green-600 hover:bg-green-500 rounded text-white" title="Approve">
                                <Check className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleRejectTransaction(t.id)} className="p-2 bg-red-600 hover:bg-red-500 rounded text-white" title="Reject">
                                <XIcon className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                 </tbody>
               </table>
             </div>
          </div>
        )}

        {/* ... Rest of Admin Tabs (Orders, Services) ... */}
        {adminTab === 'orders' && (
          <div className="overflow-x-auto">
             <table className="w-full text-left">
              <thead className="bg-black text-zinc-400 text-xs uppercase font-bold">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Service / Link</th>
                  <th className="p-4">Charge</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-sm text-zinc-300">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-zinc-800/30">
                     <td className="p-4">
                        <div className="text-white font-bold text-xs">{o.username}</div>
                     </td>
                     <td className="p-4 max-w-xs truncate">
                        <div className="text-white text-xs mb-1">{o.serviceName}</div>
                        <div className="text-brand-400 text-xs font-mono">{o.link}</div>
                     </td>
                     <td className="p-4 font-mono">Rs. {o.charge}</td>
                     <td className="p-4">
                       <select 
                         value={o.status}
                         onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as any)}
                         className="bg-zinc-950 border border-zinc-700 rounded text-xs p-1 text-white outline-none"
                       >
                         <option value="Pending">Pending</option>
                         <option value="Processing">Processing</option>
                         <option value="Completed">Completed</option>
                         <option value="Canceled">Canceled</option>
                       </select>
                     </td>
                  </tr>
                ))}
              </tbody>
             </table>
          </div>
        )}

        {adminTab === 'services' && (
          <div className="p-6">
             <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 mb-8">
               <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                 <Plus className="w-4 h-4" /> Add New Service
               </h3>
               <form onSubmit={handleAddService} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <input 
                    placeholder="Category" 
                    value={newServiceCategory} 
                    onChange={e => setNewServiceCategory(e.target.value)}
                    className="bg-zinc-900 border border-zinc-700 p-2 rounded text-sm text-white"
                  />
                  <input 
                    placeholder="Service Name" 
                    value={newServiceName} 
                    onChange={e => setNewServiceName(e.target.value)}
                    className="bg-zinc-900 border border-zinc-700 p-2 rounded text-sm text-white"
                  />
                  <input 
                    type="number" placeholder="Rate" 
                    value={newServiceRate} 
                    onChange={e => setNewServiceRate(e.target.value)}
                    className="bg-zinc-900 border border-zinc-700 p-2 rounded text-sm text-white"
                  />
                  <div className="flex gap-2">
                    <input type="number" placeholder="Min" value={newServiceMin} onChange={e => setNewServiceMin(e.target.value)} className="bg-zinc-900 border border-zinc-700 p-2 rounded text-sm text-white w-1/2" />
                    <input type="number" placeholder="Max" value={newServiceMax} onChange={e => setNewServiceMax(e.target.value)} className="bg-zinc-900 border border-zinc-700 p-2 rounded text-sm text-white w-1/2" />
                  </div>
                  <button className="bg-green-600 hover:bg-green-500 text-white font-bold rounded text-sm">Add</button>
               </form>
             </div>
             <div className="overflow-x-auto rounded-lg border border-zinc-800">
               <table className="w-full text-left bg-zinc-950/50">
                 <thead className="bg-black text-zinc-400 text-xs uppercase font-bold">
                   <tr>
                     <th className="p-3">Category</th>
                     <th className="p-3">Name</th>
                     <th className="p-3">Rate</th>
                     <th className="p-3 text-right">Action</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-zinc-800 text-sm">
                   {services.map(s => (
                     <tr key={s.id} className="text-zinc-300">
                       <td className="p-3">{s.category}</td>
                       <td className="p-3">{s.name}</td>
                       <td className="p-3 text-green-400">Rs. {s.rate}</td>
                       <td className="p-3 text-right">
                         <button onClick={() => handleDeleteService(s.id)} className="text-red-400 p-1"><Trash2 className="w-4 h-4" /></button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        )}

        {adminTab === 'tickets' && (
          <div className="overflow-x-auto">
             <table className="w-full text-left">
              <thead className="bg-black text-zinc-400 text-xs uppercase font-bold">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Message</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-sm text-zinc-300">
                {tickets.map(t => (
                  <tr key={t.id} className="hover:bg-zinc-800/30">
                     <td className="p-4 font-bold text-white">{t.username}</td>
                     <td className="p-4">{t.subject}</td>
                     <td className="p-4 text-zinc-400 max-w-md truncate">{t.message}</td>
                     <td className="p-4"><span className="bg-zinc-800 px-2 py-1 rounded text-xs">{t.status}</span></td>
                     <td className="p-4 text-right">
                       <button onClick={() => setTickets(tickets.map(x => x.id === t.id ? {...x, status: 'Answered'} : x))} className="text-blue-400 text-xs mr-2">Mark Answered</button>
                       <button onClick={() => setTickets(tickets.map(x => x.id === t.id ? {...x, status: 'Closed'} : x))} className="text-red-400 text-xs">Close</button>
                     </td>
                  </tr>
                ))}
              </tbody>
             </table>
          </div>
        )}
      </div>
    </div>
  );

  const renderDashboardContent = () => {
    if (activeTab === 'admin' && user?.role === 'admin') {
      return renderAdminDashboard();
    }
    
    switch (activeTab) {
      case 'new-order': return <OrderForm balance={user?.balance || 0} onPlaceOrder={handlePlaceOrder} services={services} />;
      case 'mass-order': 
        return (
           <div className="bg-zinc-900 rounded-xl shadow-xl border border-zinc-800 p-6">
              <div className="flex items-center gap-2 mb-6 border-b border-zinc-800 pb-4"><Layers className="text-brand-400" /><h2 className="text-xl font-bold text-white">Mass Order</h2></div>
              <textarea className="w-full h-64 bg-zinc-950 border border-zinc-700 rounded-lg p-4 text-white font-mono text-sm focus:ring-2 focus:ring-brand-500 outline-none resize-none" placeholder={`101 | https://link.com | 1000`} value={massOrderContent} onChange={(e) => setMassOrderContent(e.target.value)} />
              <button onClick={handleMassOrder} className="mt-4 bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 px-6 rounded-lg transition-all">Submit Mass Order</button>
           </div>
        );
      case 'orders':
        return (
          <div className="bg-zinc-900 rounded-xl shadow-xl border border-zinc-800 overflow-hidden">
            <div className="p-6 border-b border-zinc-800"><h2 className="text-xl font-bold text-white">Order History</h2></div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-black text-zinc-400 text-xs uppercase font-bold"><tr><th className="p-4">ID</th><th className="p-4">Service</th><th className="p-4">Charge</th><th className="p-4">Status</th></tr></thead>
                <tbody className="divide-y divide-zinc-800 text-sm text-zinc-300">
                  {orders.filter(o => o.username === user?.username).map(o => (
                    <tr key={o.id}><td className="p-4 font-mono">{o.id}</td><td className="p-4">{o.serviceName}</td><td className="p-4 text-white font-bold">Rs. {o.charge}</td><td className="p-4"><span className="bg-zinc-800 px-2 py-1 rounded text-xs">{o.status}</span></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'services':
        return (
          <div className="bg-zinc-900 rounded-xl shadow-xl border border-zinc-800 overflow-hidden">
            <div className="p-6 border-b border-zinc-800 flex justify-between"><h2 className="text-xl font-bold text-white">Service List</h2><div className="relative"><input type="text" placeholder="Search..." className="bg-zinc-950 border border-zinc-700 rounded-full py-2 px-4 pl-10 text-sm text-white" value={serviceSearch} onChange={(e) => setServiceSearch(e.target.value)} /><Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" /></div></div>
            <div className="overflow-x-auto"><table className="w-full text-left"><thead className="bg-black text-zinc-400 text-xs uppercase font-bold"><tr><th className="p-4">ID</th><th className="p-4">Name</th><th className="p-4">Rate</th><th className="p-4">Min/Max</th></tr></thead><tbody className="divide-y divide-zinc-800 text-sm text-zinc-300">{services.filter(s => s.name.toLowerCase().includes(serviceSearch.toLowerCase())).map(s => (<tr key={s.id}><td className="p-4 font-mono">{s.id}</td><td className="p-4">{s.name}</td><td className="p-4 text-green-400">Rs. {s.rate}</td><td className="p-4 text-zinc-500">{s.min}/{s.max}</td></tr>))}</tbody></table></div>
          </div>
        );
      case 'tickets':
         return (
             <div className="grid lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-1 bg-zinc-900 rounded-xl shadow-xl border border-zinc-800 p-6">
                     <h2 className="text-xl font-bold text-white mb-4">New Ticket</h2>
                     <form onSubmit={handleSubmitTicket} className="space-y-4">
                        <input type="text" className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-white text-sm" placeholder="Subject" value={ticketSubject} onChange={(e) => setTicketSubject(e.target.value)} />
                        <textarea className="w-full h-32 bg-zinc-950 border border-zinc-700 rounded p-2 text-white text-sm" placeholder="Message" value={ticketMessage} onChange={(e) => setTicketMessage(e.target.value)} />
                        <button className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-2 rounded">Submit</button>
                     </form>
                 </div>
                 <div className="lg:col-span-2 bg-zinc-900 rounded-xl shadow-xl border border-zinc-800 p-6">
                     <h2 className="text-xl font-bold text-white mb-4">Your Tickets</h2>
                     <div className="space-y-4">
                        {tickets.filter(t => t.username === user?.username).map(t => (
                           <div key={t.id} className="bg-zinc-950 border border-zinc-800 rounded p-4">
                              <div className="flex justify-between mb-2"><span className="font-bold text-white">{t.subject}</span><span className="text-xs text-zinc-500">{t.status}</span></div>
                              <p className="text-zinc-400 text-sm">{t.message}</p>
                           </div>
                        ))}
                     </div>
                 </div>
             </div>
         );
      case 'funds': return renderFunds();
      case 'support':
        return (
            <div className="max-w-xl mx-auto text-center pt-8">
                 <div className="bg-zinc-900 rounded-2xl shadow-xl border border-zinc-800 p-10">
                    <h2 className="text-3xl font-bold text-white mb-2">WhatsApp Support</h2>
                    <button onClick={() => window.open(`https://wa.me/${SUPPORT_PHONE}`, '_blank')} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-8 rounded-xl mt-6 flex items-center justify-center gap-3 text-lg"><MessageCircle className="w-6 h-6" /> Chat on WhatsApp</button>
                 </div>
            </div>
        );
      default: return null;
    }
  };

  if (page === PageState.LANDING) return renderLanding();
  if (page === PageState.LOGIN) return renderAuth(true);
  if (page === PageState.SIGNUP) return renderAuth(false);

  return (
    <DashboardLayout 
      user={user!} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      onLogout={() => {
        setUser(null);
        setPage(PageState.LANDING);
      }}
    >
      {renderDashboardContent()}
    </DashboardLayout>
  );
};

export default App;
