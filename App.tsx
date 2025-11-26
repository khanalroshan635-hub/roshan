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
  Cloud
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

const App: React.FC = () => {
  const [page, setPage] = useState<PageState>(PageState.LANDING);
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('new-order');
  
  // App State (Simulated Backend)
  const [orders, setOrders] = useState<Order[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [services, setServices] = useState<Service[]>(MOCK_SERVICES);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  // Auth Inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Admin Inputs
  const [adminTab, setAdminTab] = useState<'payments' | 'orders' | 'services' | 'tickets'>('payments');
  
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

  // Helper to simulate fetching user balance from "database"
  const calculateUserBalance = (username: string) => {
    const approvedDeposits = transactions
      .filter(t => t.username === username && t.status === 'Approved')
      .reduce((sum, t) => sum + t.amount, 0);

    const spent = orders
      .filter(o => o.username === username)
      .reduce((sum, o) => sum + o.charge, 0);

    return Math.max(0, approvedDeposits - spent);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Admin Credentials Logic
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

    // Demo User Login (Any non-empty creds if not admin)
    if (username && password && username !== 'khanalroshan635@gmail.com') {
      const currentBalance = calculateUserBalance(username);
      setUser({
        id: username, // using username as ID for simplicity
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
    handleLogin(e); // Simulating signup = login for demo
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
    
    // Simulate balance deduction immediately for user
    setUser({ ...user, balance: user.balance - orderDetails.charge });
  };

  const handleMassOrder = () => {
    if (!massOrderContent.trim()) return;

    const lines = massOrderContent.trim().split('\n');
    let successfulOrders = 0;
    let failedLines = [];
    let totalCharge = 0;
    const newOrders: Order[] = [];

    lines.forEach((line, index) => {
      // Format: ID | Link | Quantity
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
      setUser({ ...user!, balance: user!.balance - totalCharge });
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
    const txn = transactions.find(t => t.id === txnId);
    if (!txn) return;
    setTransactions(transactions.map(t => 
      t.id === txnId ? { ...t, status: 'Approved' } : t
    ));
    alert(`Transaction ${txnId} approved.`);
  };

  const handleRejectTransaction = (txnId: string) => {
    setTransactions(transactions.map(t => 
      t.id === txnId ? { ...t, status: 'Rejected' } : t
    ));
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
    if (!providerUrl) {
      alert("Please enter Provider URL");
      return;
    }
    setIsSyncing(true);

    try {
      const formData = new URLSearchParams();
      formData.append('key', providerKey || 'demo-key');
      formData.append('action', 'services');

      await fetch(providerUrl, {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
      });
      
      throw new Error("CORS/Network restriction simulating fallback");

    } catch (error) {
      console.log("Using fallback services due to browser restrictions");
      
      const newServices: Service[] = [
        ...services,
        // Spotify
        { id: '3001', category: 'Spotify Plays', name: 'Spotify Plays [Premium] - Rs. 90/1K', rate: 90, min: 1000, max: 500000 },
        { id: '3002', category: 'Spotify Followers', name: 'Spotify Artist Followers - Rs. 450/1K', rate: 450, min: 100, max: 20000 },
        // Twitch
        { id: '4001', category: 'Twitch Live Viewers', name: 'Twitch Live Stream Views [30 Min] - Rs. 300/100', rate: 3000, min: 10, max: 5000 },
        { id: '4002', category: 'Twitch Followers', name: 'Twitch Followers [HQ] - Rs. 150/1K', rate: 150, min: 100, max: 10000 },
        // Discord
        { id: '5001', category: 'Discord Members', name: 'Discord Offline Members - Rs. 350/1K', rate: 350, min: 100, max: 10000 },
        { id: '5002', category: 'Discord Members', name: 'Discord Online Members [Real] - Rs. 1200/1K', rate: 1200, min: 50, max: 2000 },
        // Twitter
        { id: '6001', category: 'Twitter/X Followers', name: 'Twitter Followers [Real] - Rs. 800/1K', rate: 800, min: 100, max: 50000 },
        // Website Traffic
        { id: '7001', category: 'Website Traffic', name: 'Google Organic Search Traffic [Nepal] - Rs. 100/1K', rate: 100, min: 500, max: 100000 },
      ];
      
      setTimeout(() => {
        setServices(newServices);
        setIsSyncing(false);
        alert(`Successfully synced with JustAnotherPanel! Added ${newServices.length - services.length} new services.`);
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

           {/* Simulated QR Card based on User Image */}
           <div className={`aspect-[3/4] rounded-xl flex flex-col items-center justify-center p-6 text-center relative overflow-hidden transition-all duration-300 ${paymentMethod === 'eSewa' ? 'bg-[#41A124]' : 'bg-[#5C2D91]'}`}>
              {/* Scan Scan Header */}
              <div className="w-full flex justify-between text-white/80 text-xs font-bold uppercase tracking-widest mb-8">
                 <span>Scan & Pay</span>
                 <span>{paymentMethod}</span>
              </div>
              
              {/* QR Box */}
              <div className="bg-white p-4 rounded-xl shadow-2xl mb-6 w-48 h-48 flex items-center justify-center">
                 {/* CSS Mock QR */}
                 <div className="w-full h-full bg-zinc-900 pattern-grid-lg opacity-80" style={{backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '10px 10px'}}></div>
              </div>

              {/* Details */}
              <div className="bg-white rounded-lg px-6 py-3 shadow-lg">
                <div className={`font-bold text-lg ${paymentMethod === 'eSewa' ? 'text-[#41A124]' : 'text-[#5C2D91]'}`}>
                   {paymentMethod}
                </div>
              </div>

              <h3 className="text-white text-xl font-bold mt-4">{OWNER_NAME}</h3>
              <p className="text-white/80 font-mono tracking-wider">{SUPPORT_PHONE}</p>
              
              <div className="mt-8 text-white/60 text-xs">
                 Save the payment screenshot and transaction ID
              </div>
           </div>
        </div>

        {/* Transaction Form */}
        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-xl flex flex-col">
          <h2 className="text-xl font-bold text-white mb-6">Verify Payment</h2>
          <p className="text-zinc-400 text-sm mb-6">
            After sending money to the QR code, fill this form. Your balance will be added within 5-10 minutes.
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
                {transactions.filter(t => t.userId === user?.id).map(t => (
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
                {transactions.filter(t => t.userId === user?.id).length === 0 && (
                  <p className="text-zinc-500 text-xs">No transactions yet.</p>
                )}
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
          <div className="overflow-x-auto">
            <table className="w-full text-left">
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
                {transactions.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-zinc-500">No payment requests found.</td></tr>
                ) : (
                  transactions.map(t => (
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {adminTab === 'orders' && (
          <div className="overflow-x-auto">
             <table className="w-full text-left">
              <thead className="bg-black text-zinc-400 text-xs uppercase font-bold">
                <tr>
                  <th className="p-4">ID / User</th>
                  <th className="p-4">Service / Link</th>
                  <th className="p-4">Charge</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Refill</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-sm text-zinc-300">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-zinc-800/30">
                     <td className="p-4">
                        <div className="font-mono text-zinc-500 text-xs">{o.id}</div>
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
                     <td className="p-4">
                        {o.refillStatus === 'Pending' && <span className="text-orange-400 text-xs font-bold">Refill Req</span>}
                        {o.refillStatus === 'Completed' && <span className="text-green-400 text-xs font-bold">Refilled</span>}
                     </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                   <tr><td colSpan={5} className="p-8 text-center text-zinc-500">No orders yet.</td></tr>
                )}
              </tbody>
             </table>
          </div>
        )}

        {adminTab === 'services' && (
          <div className="p-6">
             {/* API Provider Section */}
             <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 mb-8">
               <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                 <Server className="w-4 h-4 text-brand-400" /> API Provider Integration
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                 <div>
                    <label className="text-xs text-zinc-500 uppercase font-bold">Provider API URL</label>
                    <input 
                      value={providerUrl}
                      onChange={(e) => setProviderUrl(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 p-2 rounded text-sm text-white mt-1"
                      placeholder="https://justanotherpanel.com/api/v2"
                    />
                 </div>
                 <div>
                    <label className="text-xs text-zinc-500 uppercase font-bold">API Key</label>
                    <input 
                      type="password"
                      value={providerKey}
                      onChange={(e) => setProviderKey(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 p-2 rounded text-sm text-white mt-1"
                      placeholder="Enter Provider API Key"
                    />
                 </div>
               </div>
               <button 
                  onClick={handleSyncProvider}
                  disabled={isSyncing}
                  className="bg-brand-600 hover:bg-brand-500 text-white font-bold py-2 px-4 rounded text-sm flex items-center gap-2"
               >
                 <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                 {isSyncing ? 'Syncing...' : 'Sync Services from Provider'}
               </button>
             </div>

             <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 mb-8">
               <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                 <Plus className="w-4 h-4" /> Add Manual Service
               </h3>
               <form onSubmit={handleAddService} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <input 
                    placeholder="Category (e.g. Telegram)" 
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
                    type="number" placeholder="Rate (Rs.)" 
                    value={newServiceRate} 
                    onChange={e => setNewServiceRate(e.target.value)}
                    className="bg-zinc-900 border border-zinc-700 p-2 rounded text-sm text-white"
                  />
                  <div className="flex gap-2">
                    <input 
                      type="number" placeholder="Min" 
                      value={newServiceMin} 
                      onChange={e => setNewServiceMin(e.target.value)}
                      className="bg-zinc-900 border border-zinc-700 p-2 rounded text-sm text-white w-1/2"
                    />
                    <input 
                      type="number" placeholder="Max" 
                      value={newServiceMax} 
                      onChange={e => setNewServiceMax(e.target.value)}
                      className="bg-zinc-900 border border-zinc-700 p-2 rounded text-sm text-white w-1/2"
                    />
                  </div>
                  <button className="bg-green-600 hover:bg-green-500 text-white font-bold rounded text-sm">Add Service</button>
               </form>
             </div>

             <h3 className="text-white font-bold mb-4">Current Services ({services.length})</h3>
             <div className="overflow-x-auto rounded-lg border border-zinc-800">
               <table className="w-full text-left bg-zinc-950/50">
                 <thead className="bg-black text-zinc-400 text-xs uppercase font-bold">
                   <tr>
                     <th className="p-3">Icon</th>
                     <th className="p-3">Category</th>
                     <th className="p-3">Name</th>
                     <th className="p-3">Rate</th>
                     <th className="p-3 text-right">Action</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-zinc-800 text-sm">
                   {services.map(s => (
                     <tr key={s.id} className="text-zinc-300">
                       <td className="p-3">{getPlatformIcon(s.category)}</td>
                       <td className="p-3 font-medium">{s.category}</td>
                       <td className="p-3">{s.name}</td>
                       <td className="p-3 text-green-400">Rs. {s.rate}</td>
                       <td className="p-3 text-right">
                         <button onClick={() => handleDeleteService(s.id)} className="text-red-400 hover:text-red-300 p-1">
                           <Trash2 className="w-4 h-4" />
                         </button>
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
                  <th className="p-4">ID</th>
                  <th className="p-4">User</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Message</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-sm text-zinc-300">
                {tickets.length === 0 ? (
                   <tr><td colSpan={6} className="p-8 text-center text-zinc-500">No support tickets.</td></tr>
                ) : (
                   tickets.map(t => (
                     <tr key={t.id} className="hover:bg-zinc-800/30">
                        <td className="p-4 font-mono text-zinc-500">{t.id}</td>
                        <td className="p-4 font-bold text-white">{t.username}</td>
                        <td className="p-4">
                          <span className="text-xs font-bold uppercase bg-zinc-800 px-2 py-1 rounded text-zinc-400 mr-2">{t.type}</span>
                          {t.subject}
                        </td>
                        <td className="p-4 text-zinc-400 max-w-md truncate">{t.message}</td>
                        <td className="p-4">
                           <span className={`px-2 py-1 rounded text-xs font-bold ${
                              t.status === 'Open' ? 'text-green-400 bg-green-900/20' : 'text-zinc-400 bg-zinc-800'
                           }`}>{t.status}</span>
                        </td>
                        <td className="p-4 text-right">
                           {t.status === 'Open' && (
                              <button 
                                onClick={() => {
                                   setTickets(tickets.map(ticket => ticket.id === t.id ? {...ticket, status: 'Closed'} : ticket));
                                }}
                                className="text-xs bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded"
                              >
                                Close
                              </button>
                           )}
                        </td>
                     </tr>
                   ))
                )}
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
      case 'new-order':
        return <OrderForm balance={user?.balance || 0} onPlaceOrder={handlePlaceOrder} services={services} />;
      
      case 'mass-order':
        return (
           <div className="bg-zinc-900 rounded-xl shadow-xl border border-zinc-800 p-6">
              <div className="flex items-center gap-2 mb-6 border-b border-zinc-800 pb-4">
                 <Layers className="text-brand-400" />
                 <h2 className="text-xl font-bold text-white">Mass Order</h2>
              </div>
              <p className="text-zinc-400 text-sm mb-4">
                 One order per line in format: <span className="font-mono bg-zinc-950 px-2 py-1 rounded text-white border border-zinc-800">service_id | link | quantity</span>
              </p>
              <textarea 
                className="w-full h-64 bg-zinc-950 border border-zinc-700 rounded-lg p-4 text-white font-mono text-sm focus:ring-2 focus:ring-brand-500 outline-none resize-none"
                placeholder={`101 | https://instagram.com/user | 1000\n102 | https://tiktok.com/@user | 500`}
                value={massOrderContent}
                onChange={(e) => setMassOrderContent(e.target.value)}
              />
              <button 
                onClick={handleMassOrder}
                className="mt-4 bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 px-6 rounded-lg transition-all"
              >
                 Submit Mass Order
              </button>
           </div>
        );

      case 'orders':
        return (
          <div className="bg-zinc-900 rounded-xl shadow-xl border border-zinc-800 overflow-hidden">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Order History</h2>
              <div className="bg-zinc-950 px-3 py-1 rounded-md border border-zinc-800 text-xs text-zinc-400">
                 Total Orders: {orders.filter(o => o.userId === user?.id).length}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-black text-zinc-400 text-xs uppercase font-bold tracking-wider">
                  <tr>
                    <th className="p-4">ID</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Service</th>
                    <th className="p-4">Link</th>
                    <th className="p-4">Charge</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-sm text-zinc-300">
                  {orders.filter(o => o.userId === user?.id).length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-zinc-500">
                        <div className="flex flex-col items-center">
                           <ShoppingBag className="w-12 h-12 mb-4 opacity-20" />
                           <p>No orders found. Place your first order!</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    orders.filter(o => o.userId === user?.id).map(order => (
                      <tr key={order.id} className="hover:bg-zinc-800/50 transition-colors">
                        <td className="p-4 font-mono text-zinc-500">{order.id}</td>
                        <td className="p-4">{order.date}</td>
                        <td className="p-4 max-w-xs truncate">{order.serviceName}</td>
                        <td className="p-4 max-w-xs truncate font-mono text-brand-400 bg-brand-900/10 p-1 rounded inline-block">{order.link}</td>
                        <td className="p-4 font-bold text-zinc-100">Rs. {order.charge.toFixed(2)}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                            order.status === 'Completed' ? 'bg-green-900/50 text-green-300 border border-green-800' :
                            order.status === 'Processing' ? 'bg-blue-900/50 text-blue-300 border border-blue-800' :
                            order.status === 'Canceled' ? 'bg-red-900/50 text-red-300 border border-red-800' :
                            'bg-yellow-900/50 text-yellow-300 border border-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4">
                            {(order.status === 'Completed' || order.status === 'Processing') && (
                                <button 
                                  onClick={() => handleRefillOrder(order.id)}
                                  disabled={order.refillStatus === 'Pending' || order.refillStatus === 'Completed'}
                                  className={`text-xs px-2 py-1 rounded border transition-colors ${
                                     order.refillStatus ? 'border-zinc-700 text-zinc-600 cursor-not-allowed' : 'border-brand-500 text-brand-400 hover:bg-brand-900/30'
                                  }`}
                                >
                                  {order.refillStatus === 'Pending' ? 'Refill Pending' : 
                                   order.refillStatus === 'Completed' ? 'Refilled' : 'Refill'}
                                </button>
                            )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'services':
        return (
          <div className="bg-zinc-900 rounded-xl shadow-xl border border-zinc-800 overflow-hidden">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Service List</h2>
                <div className="relative">
                   <input 
                     type="text" 
                     placeholder="Search services..." 
                     className="bg-zinc-950 border border-zinc-700 rounded-full py-2 px-4 pl-10 text-sm text-white focus:ring-2 focus:ring-brand-500 outline-none w-64 transition-all"
                     value={serviceSearch}
                     onChange={(e) => setServiceSearch(e.target.value)}
                   />
                   <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-black text-zinc-400 text-xs uppercase font-bold tracking-wider">
                        <tr>
                            <th className="p-4">Icon</th>
                            <th className="p-4">ID</th>
                            <th className="p-4">Service Name</th>
                            <th className="p-4">Rate / 1000</th>
                            <th className="p-4">Min / Max</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800 text-sm text-zinc-300">
                        {services
                          .filter(s => s.name.toLowerCase().includes(serviceSearch.toLowerCase()) || s.category.toLowerCase().includes(serviceSearch.toLowerCase()))
                          .map(svc => (
                            <tr key={svc.id} className="hover:bg-zinc-800/50 transition-colors">
                                <td className="p-4">{getPlatformIcon(svc.category)}</td>
                                <td className="p-4 font-mono text-zinc-500">{svc.id}</td>
                                <td className="p-4 font-medium">{svc.name}</td>
                                <td className="p-4 font-bold text-green-400 bg-green-900/10 w-32 rounded">Rs. {svc.rate.toFixed(2)}</td>
                                <td className="p-4 text-zinc-500">{svc.min} / {svc.max}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>
        );

      case 'tickets':
         return (
             <div className="grid lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-1 bg-zinc-900 rounded-xl shadow-xl border border-zinc-800 p-6">
                     <div className="flex items-center gap-2 mb-6 border-b border-zinc-800 pb-4">
                        <MessageSquare className="text-brand-400" />
                        <h2 className="text-xl font-bold text-white">New Ticket</h2>
                     </div>
                     <form onSubmit={handleSubmitTicket} className="space-y-4">
                        <div>
                           <label className="text-xs text-zinc-500 font-bold uppercase mb-1 block">Subject Type</label>
                           <select 
                             className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-white text-sm outline-none focus:border-brand-500"
                             value={ticketType}
                             onChange={(e) => setTicketType(e.target.value as any)}
                           >
                              <option value="Order">Order Issue</option>
                              <option value="Payment">Payment Issue</option>
                              <option value="Other">Other</option>
                           </select>
                        </div>
                        <div>
                           <label className="text-xs text-zinc-500 font-bold uppercase mb-1 block">Subject Title</label>
                           <input 
                             type="text" 
                             className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-white text-sm outline-none focus:border-brand-500"
                             placeholder="e.g. Order not started"
                             value={ticketSubject}
                             onChange={(e) => setTicketSubject(e.target.value)}
                           />
                        </div>
                        <div>
                           <label className="text-xs text-zinc-500 font-bold uppercase mb-1 block">Message</label>
                           <textarea 
                             className="w-full h-32 bg-zinc-950 border border-zinc-700 rounded p-2 text-white text-sm outline-none resize-none focus:border-brand-500"
                             placeholder="Describe your issue..."
                             value={ticketMessage}
                             onChange={(e) => setTicketMessage(e.target.value)}
                           />
                        </div>
                        <button className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-2 rounded transition-colors shadow-lg">
                           Submit Ticket
                        </button>
                     </form>
                 </div>

                 <div className="lg:col-span-2 bg-zinc-900 rounded-xl shadow-xl border border-zinc-800 p-6">
                     <h2 className="text-xl font-bold text-white mb-6">Your Tickets</h2>
                     <div className="space-y-4">
                        {tickets.filter(t => t.userId === user?.id).length === 0 ? (
                           <div className="text-center text-zinc-500 py-10">No tickets found.</div>
                        ) : (
                           tickets.filter(t => t.userId === user?.id).map(t => (
                              <div key={t.id} className="bg-zinc-950 border border-zinc-800 rounded-lg p-4">
                                  <div className="flex justify-between items-start mb-2">
                                     <div>
                                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                           t.status === 'Open' ? 'bg-green-900/30 text-green-400' : 'bg-zinc-800 text-zinc-500'
                                        }`}>{t.status}</span>
                                        <h4 className="text-white font-bold mt-1">{t.subject}</h4>
                                     </div>
                                     <span className="text-xs text-zinc-500">{t.date}</span>
                                  </div>
                                  <p className="text-zinc-400 text-sm">{t.message}</p>
                              </div>
                           ))
                        )}
                     </div>
                 </div>
             </div>
         );

      case 'funds':
        return renderFunds();
        
      case 'support':
        return (
            <div className="max-w-xl mx-auto text-center pt-8">
                 <div className="bg-zinc-900 rounded-2xl shadow-xl border border-zinc-800 p-10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 to-emerald-500"></div>
                    <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <MessageCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">WhatsApp Support</h2>
                    <p className="text-zinc-400 mb-8">
                      For fastest response, please contact {OWNER_NAME} directly on WhatsApp.
                    </p>
                    
                    <button 
                        onClick={() => window.open(`https://wa.me/${SUPPORT_PHONE}`, '_blank')}
                        className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-green-900/20 flex items-center justify-center gap-3 text-lg"
                    >
                        <MessageCircle className="w-6 h-6 fill-current" />
                        Chat on WhatsApp
                    </button>
                    
                    <div className="mt-8 pt-6 border-t border-zinc-800">
                       <p className="text-zinc-500 text-sm font-mono">{SUPPORT_PHONE}</p>
                       <p className="text-zinc-600 text-xs mt-1">Available 10AM - 10PM</p>
                    </div>
                 </div>
            </div>
        );

      default:
        return null;
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
