import React, { useState, useEffect } from 'react';
import { PageState, User, Order, Transaction, Service, Ticket, PaymentMethod } from './types';
import { DashboardLayout } from './components/DashboardLayout';
import { OrderForm } from './components/OrderForm';
import { Logo } from './components/Logo';
import { SUPPORT_PHONE, MOCK_SERVICES, OWNER_NAME } from './constants';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { 
  CheckCircle, 
  Shield, 
  CreditCard,
  MessageCircle,
  Zap,
  Globe,
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
  Banknote,
  Clock,
  User as UserIcon,
  Key,
  Eye,
  EyeOff,
  Edit,
  HelpCircle,
  ArrowRight,
  Mail,
  Star,
  TrendingUp,
  Lock,
  DollarSign,
  Rocket,
  Award,
  Headphones,
  Menu
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

// Admin Config
const ADMIN_EMAIL = "khanalroshan635@gmail.com";

// Default Payment Methods
const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'esewa', name: 'eSewa', type: 'Wallet', instructions: `Send to ${SUPPORT_PHONE}`, icon: 'wallet', color: 'green' },
  { id: 'khalti', name: 'Khalti', type: 'Wallet', instructions: `Send to ${SUPPORT_PHONE}`, icon: 'wallet', color: 'purple' }
];

const App: React.FC = () => {
  const [page, setPage] = useState<PageState>(PageState.LANDING);
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('new-order');
  
  // App State (Persisted)
  const [orders, setOrders] = useState<Order[]>(() => loadState('orders', []));
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadState('transactions', []));
  const [services, setServices] = useState<Service[]>(() => loadState('services', MOCK_SERVICES));
  const [tickets, setTickets] = useState<Ticket[]>(() => loadState('tickets', []));
  const [usersDb, setUsersDb] = useState<User[]>(() => loadState('users_db', []));
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(() => loadState('payment_methods', DEFAULT_PAYMENT_METHODS));

  // Persist state changes
  useEffect(() => saveState('orders', orders), [orders]);
  useEffect(() => saveState('transactions', transactions), [transactions]);
  useEffect(() => saveState('services', services), [services]);
  useEffect(() => saveState('tickets', tickets), [tickets]);
  useEffect(() => saveState('users_db', usersDb), [usersDb]);
  useEffect(() => saveState('payment_methods', paymentMethods), [paymentMethods]);

  // Auth Inputs
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'reset'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Admin Inputs
  const [adminTab, setAdminTab] = useState<'payments' | 'orders' | 'services' | 'tickets' | 'users' | 'settings'>('payments');
  const [manualUser, setManualUser] = useState('');
  const [manualAmount, setManualAmount] = useState('');
  const [newPaymentName, setNewPaymentName] = useState('');
  const [newPaymentType, setNewPaymentType] = useState('Wallet');
  const [newPaymentInstr, setNewPaymentInstr] = useState('');
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
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string>(paymentMethods[0]?.id || '');

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

  // Ensure selected payment method exists
  useEffect(() => {
     if (paymentMethods.length > 0 && !paymentMethods.find(p => p.id === selectedPaymentMethodId)) {
        setSelectedPaymentMethodId(paymentMethods[0].id);
     }
  }, [paymentMethods]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Admin Credentials
    if (username === ADMIN_EMAIL && password === 'qawsedrftg@A1') {
       const adminUser: User = {
         id: 'admin-001',
         username: 'Admin Roshan',
         email: ADMIN_EMAIL,
         balance: 999999,
         role: 'admin'
       };
       setUser(adminUser);
       setPage(PageState.DASHBOARD);
       setActiveTab('admin');
       return;
    }

    // Check User in DB
    const foundUser = usersDb.find(u => (u.username === username || u.email === username) && u.password === password);
    
    if (foundUser) {
      const currentBalance = calculateUserBalance(foundUser.username);
      setUser({ ...foundUser, balance: currentBalance });
      setPage(PageState.DASHBOARD);
    } else {
        alert("Invalid Credentials. Please check username and password.");
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) { alert("Please fill all fields"); return; }
    
    if (usersDb.find(u => u.username === username)) {
        alert("Username already exists. Please login.");
        return;
    }

    const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        username: username,
        email: `${username}@example.com`,
        password: password, 
        balance: 0,
        role: 'user'
    };

    setUsersDb([...usersDb, newUser]);
    setUser(newUser);
    setPage(PageState.DASHBOARD);
    alert("Account created successfully!");
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !newPassword) { alert("Please enter username/email and new password"); return; }

    const userIndex = usersDb.findIndex(u => u.username === username || u.email === username);
    
    if (userIndex === -1) {
        alert("Account not found. Please check your username or email.");
        return;
    }

    const updatedUsers = [...usersDb];
    updatedUsers[userIndex] = { ...updatedUsers[userIndex], password: newPassword };
    setUsersDb(updatedUsers);
    
    setResetSuccess(true);
    setTimeout(() => {
        setResetSuccess(false);
        setAuthMode('login');
        setPassword('');
        setNewPassword('');
    }, 2000);
  };

  const handleGoogleSuccess = (credentialResponse: any) => {
    try {
      const decoded: any = jwtDecode(credentialResponse.credential);
      const { email, name, sub } = decoded;
      
      if (email === ADMIN_EMAIL) {
         const adminUser: User = {
            id: 'admin-google',
            username: 'Admin Roshan',
            email: email,
            balance: 999999,
            role: 'admin'
         };
         setUser(adminUser);
         setPage(PageState.DASHBOARD);
         setActiveTab('admin');
         return;
      }

      let existingUser = usersDb.find(u => u.email === email);

      if (!existingUser) {
         const newUser: User = {
            id: sub,
            username: name,
            email: email,
            password: 'google-login-user',
            balance: 0,
            role: 'user'
         };
         setUsersDb([...usersDb, newUser]);
         existingUser = newUser;
      }

      const currentBalance = calculateUserBalance(existingUser.username);
      setUser({ ...existingUser, balance: currentBalance });
      setPage(PageState.DASHBOARD);

    } catch (error) {
      console.error("Google Login Error", error);
      alert("Failed to login with Google.");
    }
  };

  const handleAdminResetUserPassword = (targetUsername: string) => {
     const newPass = prompt(`Enter new password for ${targetUsername}:`);
     if (!newPass) return;
     const userIndex = usersDb.findIndex(u => u.username === targetUsername);
     if (userIndex === -1) return;
     const updatedUsers = [...usersDb];
     updatedUsers[userIndex] = { ...updatedUsers[userIndex], password: newPass };
     setUsersDb(updatedUsers);
     alert(`Password for ${targetUsername} updated.`);
  };

  const handlePlaceOrder = (o: any) => { if(user) setOrders([{...o, id: Math.random().toString(36).substr(2,9), userId: user.id, username: user.username, status:'Pending', date: new Date().toISOString().split('T')[0]}, ...orders]); };
  const handleMassOrder = () => { if (!massOrderContent.trim()) return; const lines = massOrderContent.trim().split('\n'); let successfulOrders = 0; const newOrders: Order[] = []; let totalCharge = 0; lines.forEach((line) => { const parts = line.split('|').map(p => p.trim()); if (parts.length !== 3) return; const [svcId, link, qtyStr] = parts; const quantity = parseInt(qtyStr); const service = services.find(s => s.id === svcId); if (!service || isNaN(quantity) || quantity < service.min || quantity > service.max) return; const charge = (service.rate * quantity) / 1000; totalCharge += charge; newOrders.push({ id: Math.random().toString(36).substr(2, 9), userId: user!.id, username: user!.username, serviceId: service.id, serviceName: service.name, link: link, quantity: quantity, charge: charge, status: 'Pending', date: new Date().toISOString().split('T')[0] }); }); if (totalCharge > (user?.balance || 0)) { alert(`Insufficient funds.`); return; } if (newOrders.length > 0) { setOrders([...newOrders, ...orders]); successfulOrders = newOrders.length; } setMassOrderContent(''); alert(`Processed ${successfulOrders} orders.`); };
  
  const handleSubmitTransaction = (e: React.FormEvent) => { 
      e.preventDefault(); 
      if(!user || !depositAmount || !txnId) return;
      const method = paymentMethods.find(p => p.id === selectedPaymentMethodId);
      setTransactions([{id:Math.random().toString(36).substr(2,9), userId:user.id, username:user.username, amount:parseFloat(depositAmount), method: method ? method.name : 'Unknown', transactionId:txnId, status:'Pending', date: new Date().toISOString().split('T')[0]}, ...transactions]);
      setDepositAmount(''); setTxnId(''); alert('Submitted! Admin verifying.');
  };

  const handleApproveTransaction = (id: string) => setTransactions(transactions.map(t => t.id === id ? {...t, status:'Approved'} : t));
  const handleRejectTransaction = (id: string) => setTransactions(transactions.map(t => t.id === id ? {...t, status:'Rejected'} : t));
  const handleManualAddFunds = (e: React.FormEvent) => { e.preventDefault(); if(!manualUser || !manualAmount) return; setTransactions([{id:'ADM-'+Math.random().toString(36).substr(2,6), userId:manualUser, username:manualUser, amount:parseFloat(manualAmount), method:'eSewa', transactionId:'MANUAL', status:'Approved', date: new Date().toISOString().split('T')[0]}, ...transactions]); setManualUser(''); setManualAmount(''); alert('Funds added!'); };
  const handleUpdateOrderStatus = (id: string, s: any) => setOrders(orders.map(o => o.id === id ? {...o, status:s} : o));
  const handleAddService = (e: any) => { e.preventDefault(); if(!newServiceName) return; setServices([...services, {id: Math.random().toString(36).substr(2, 5), category: newServiceCategory, name: newServiceName, rate: parseFloat(newServiceRate), min: parseInt(newServiceMin) || 100, max: parseInt(newServiceMax) || 10000}]); setNewServiceName(''); alert('Service added!'); };
  const handleDeleteService = (id: string) => { if(confirm('Delete?')) setServices(services.filter(s => s.id !== id)); };
  const handleSyncProvider = async () => { setIsSyncing(true); setTimeout(() => {setIsSyncing(false); alert('Synced!');}, 1000); };
  const handleRefillOrder = (id: string) => { setOrders(orders.map(o => o.id === id ? {...o, refillStatus:'Pending'} : o)); alert('Refill requested'); };
  const handleSubmitTicket = (e: any) => { e.preventDefault(); if(!ticketSubject) return; setTickets([{id:Math.random().toString(36).substr(2,6).toUpperCase(), userId:user!.id, username:user!.username, subject:ticketSubject, message:ticketMessage, type:ticketType, status:'Open', date:new Date().toISOString().split('T')[0]}, ...tickets]); setTicketSubject(''); setTicketMessage(''); alert('Ticket created'); };
  const handleAddPaymentMethod = (e: React.FormEvent) => { e.preventDefault(); if (!newPaymentName || !newPaymentInstr) return; const newMethod: PaymentMethod = { id: 'pay-' + Math.random().toString(36).substr(2, 5), name: newPaymentName, type: newPaymentType, instructions: newPaymentInstr, icon: 'credit-card', color: 'blue' }; setPaymentMethods([...paymentMethods, newMethod]); setNewPaymentName(''); setNewPaymentInstr(''); alert('Payment Method Added'); };
  const handleDeletePaymentMethod = (id: string) => { if (confirm('Delete?')) setPaymentMethods(paymentMethods.filter(p => p.id !== id)); };

  // --- Views ---

  const renderLanding = () => (
    <div className="min-h-screen bg-[#242038] text-white font-sans overflow-hidden">
      {/* Navbar */}
      <nav className="w-full py-4 px-6 flex justify-between items-center max-w-7xl mx-auto h-[80px] z-50 relative bg-[#242038]/95 backdrop-blur-sm">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
           <Logo />
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
           <a href="#home" className="hover:text-white transition-colors">Home</a>
           <a href="#services" className="hover:text-white transition-colors">Services</a>
           <a href="#" className="hover:text-white transition-colors">Blog</a>
           <a href="#" className="hover:text-white transition-colors">Contact</a>
           
           {/* Navbar Auth Buttons */}
           <button 
             onClick={() => setAuthMode('login')} 
             className="hover:text-white transition-colors font-bold"
           >
             Sign In
           </button>
           <button 
             onClick={() => setAuthMode('signup')} 
             className="bg-[#1c4e80] hover:bg-[#163e66] px-5 py-2 rounded-md text-white font-bold transition-colors"
           >
             Sign Up
           </button>
        </div>
        
        <div className="md:hidden text-white">
           <Menu className="w-6 h-6" />
        </div>
      </nav>

      {/* Hero Section - Side by Side Layout */}
      <div id="home" className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden">
         
         <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-16 items-center relative z-10">
            
            {/* Left Content */}
            <div className="space-y-8 animate-in slide-in-from-left duration-700 order-2 lg:order-1 text-center lg:text-left">
               <div className="inline-block bg-white/10 text-white text-xs font-bold px-4 py-2 rounded-md w-fit mx-auto lg:mx-0">
                  #1 Smm Services Provider
               </div>

               <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1]">
                  Cheapest <br/>
                  <span className="text-[#4dabf7]">SMM Panel</span> <br/>
                  High Quality Services
               </h1>

               <p className="text-lg text-gray-400 max-w-lg leading-relaxed mx-auto lg:mx-0">
                  <strong className="text-white">{OWNER_NAME} Panel</strong> is providing High Quality Services in Cheap Price. 
                  The Best Indian Smm Panel in India.
               </p>

               {/* Action Buttons Side-by-Side */}
               <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <button 
                     onClick={() => setAuthMode('signup')} 
                     className="bg-[#1c4e80] hover:bg-[#163e66] text-white font-bold py-3.5 px-8 rounded-md shadow-xl transition-all flex items-center gap-2"
                  >
                     <UserIcon className="w-5 h-5" /> Sign Up Now
                  </button>
                  <button 
                     onClick={() => setAuthMode('login')} 
                     className="bg-transparent border border-white/20 hover:bg-white/10 text-white font-bold py-3.5 px-8 rounded-md transition-all flex items-center gap-2"
                  >
                     <Lock className="w-4 h-4" /> Sign In
                  </button>
               </div>

               {/* Trusted By Icons */}
               <div className="pt-8 border-t border-white/5">
                  <p className="text-xs font-bold text-gray-500 uppercase mb-4">Trusted By 10,000+ Resellers</p>
                  <div className="flex justify-center lg:justify-start gap-4 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                     <div className="bg-[#1877f2] p-2 rounded-lg"><Facebook className="w-5 h-5 text-white" /></div>
                     <div className="bg-black p-2 rounded-lg"><Music className="w-5 h-5 text-white" /></div>
                     <div className="bg-[#1da1f2] p-2 rounded-lg"><Twitter className="w-5 h-5 text-white" /></div>
                     <div className="bg-[#ff0000] p-2 rounded-lg"><Youtube className="w-5 h-5 text-white" /></div>
                  </div>
               </div>
            </div>

            {/* Right Auth Card */}
            <div className="flex justify-center lg:justify-end animate-in slide-in-from-right duration-700 order-1 lg:order-2">
               <div className="w-full max-w-[400px] bg-[#2d2845] border border-white/10 rounded-xl p-8 shadow-2xl relative z-10">
                  
                  {/* Header or Back Button for Reset */}
                  {authMode === 'reset' ? (
                     <div className="mb-6">
                       <button onClick={() => setAuthMode('login')} className="text-gray-400 hover:text-white flex items-center gap-1 text-sm mb-4">
                          <ChevronLeft className="w-4 h-4" /> Back
                       </button>
                       <h2 className="text-2xl font-bold text-white">Recovery</h2>
                       <p className="text-gray-400 text-sm">Reset your password</p>
                     </div>
                  ) : (
                     /* Tabs for Login/Signup */
                     <div className="flex bg-[#3b3655] p-1 rounded-lg mb-6">
                        <button 
                           onClick={() => setAuthMode('login')}
                           className={`flex-1 py-2.5 rounded-md text-sm font-bold transition-all ${authMode === 'login' ? 'bg-[#1c4e80] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                           Sign In
                        </button>
                        <button 
                           onClick={() => setAuthMode('signup')}
                           className={`flex-1 py-2.5 rounded-md text-sm font-bold transition-all ${authMode === 'signup' ? 'bg-[#1c4e80] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                           Sign Up
                        </button>
                     </div>
                  )}

                  {/* Reset Success Message */}
                  {resetSuccess && (
                     <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 text-xs text-center flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4" /> Password reset successfully!
                     </div>
                  )}

                  <form onSubmit={authMode === 'login' ? handleLogin : authMode === 'signup' ? handleSignup : handleResetPassword} className="space-y-4 relative z-10">
                     <div className="space-y-1">
                        <div className="relative group">
                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <UserIcon className="h-5 w-5 text-gray-500 group-focus-within:text-[#4dabf7] transition-colors" />
                           </div>
                           <input 
                              type="text" 
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              className="block w-full pl-10 bg-[#3b3655] border border-transparent focus:border-[#4dabf7] rounded-lg py-3 text-white placeholder-gray-400 focus:ring-0 outline-none transition-all text-sm"
                              placeholder={authMode === 'reset' ? "Username or Email" : "Username"}
                           />
                        </div>
                     </div>

                     {(authMode === 'login' || authMode === 'signup') && (
                        <div className="space-y-1">
                           <div className="relative group">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                 <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-[#4dabf7] transition-colors" />
                              </div>
                              <input 
                                 type="password" 
                                 value={password}
                                 onChange={(e) => setPassword(e.target.value)}
                                 className="block w-full pl-10 bg-[#3b3655] border border-transparent focus:border-[#4dabf7] rounded-lg py-3 text-white placeholder-gray-400 focus:ring-0 outline-none transition-all text-sm"
                                 placeholder="Password"
                              />
                           </div>
                           {authMode === 'login' && (
                              <div className="flex justify-between items-center pt-2 px-1">
                                 <div className="flex items-center gap-2">
                                    <input 
                                       type="checkbox" 
                                       id="remember" 
                                       checked={rememberMe}
                                       onChange={e => setRememberMe(e.target.checked)}
                                       className="rounded bg-[#3b3655] border-transparent text-[#1c4e80] focus:ring-0 w-4 h-4" 
                                    />
                                    <label htmlFor="remember" className="text-xs text-gray-400 font-bold cursor-pointer">Remember me</label>
                                 </div>
                                 <button type="button" onClick={() => setAuthMode('reset')} className="text-xs text-[#4dabf7] hover:text-blue-300 font-medium transition-colors">
                                    Forgot Password?
                                 </button>
                              </div>
                           )}
                        </div>
                     )}

                     {authMode === 'reset' && (
                        <div className="space-y-1">
                           <div className="relative group">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                 <Key className="h-5 w-5 text-gray-500 group-focus-within:text-[#4dabf7] transition-colors" />
                              </div>
                              <input 
                                 type="password" 
                                 value={newPassword}
                                 onChange={(e) => setNewPassword(e.target.value)}
                                 className="block w-full pl-10 bg-[#3b3655] border border-transparent focus:border-[#4dabf7] rounded-lg py-3 text-white placeholder-gray-400 focus:ring-0 outline-none transition-all text-sm"
                                 placeholder="Set new password"
                              />
                           </div>
                        </div>
                     )}

                     <button className="w-full bg-[#1c4e80] hover:bg-[#163e66] text-white font-bold py-3 rounded-lg shadow-lg transition-all text-base mt-2">
                        {authMode === 'login' ? 'Log In' : authMode === 'signup' ? 'Sign Up' : 'Reset Password'}
                     </button>
                  </form>

                  {authMode !== 'reset' && (
                     <div className="mt-6 relative z-10">
                        <div className="flex justify-center">
                           <GoogleLogin
                              onSuccess={handleGoogleSuccess}
                              onError={() => console.log('Login Failed')}
                              theme="filled_blue"
                              shape="rectangular"
                              width="300"
                              text={authMode === 'login' ? "signin_with" : "signup_with"}
                           />
                        </div>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>

      {/* Features Strip */}
      <div className="py-16 bg-[#16213e] border-y border-white/5">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
               <div className="flex items-start gap-4 p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-purple-500/30 transition-all">
                  <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400"><Rocket className="w-8 h-8" /></div>
                  <div>
                     <h3 className="text-lg font-bold text-white mb-2">Super Fast Delivery</h3>
                     <p className="text-sm text-gray-400">Our automated system processes orders instantly. No waiting time for your growth.</p>
                  </div>
               </div>
               <div className="flex items-start gap-4 p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all">
                  <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400"><Award className="w-8 h-8" /></div>
                  <div>
                     <h3 className="text-lg font-bold text-white mb-2">High Quality Services</h3>
                     <p className="text-sm text-gray-400">Premium accounts and real engagement to ensure the safety of your social profiles.</p>
                  </div>
               </div>
               <div className="flex items-start gap-4 p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-green-500/30 transition-all">
                  <div className="p-3 bg-green-500/10 rounded-xl text-green-400"><Headphones className="w-8 h-8" /></div>
                  <div>
                     <h3 className="text-lg font-bold text-white mb-2">24/7 Support</h3>
                     <p className="text-sm text-gray-400">Our dedicated support team is always online to help you via WhatsApp or Ticket.</p>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Footer */}
      <footer className="py-10 bg-[#1a1a2e] text-center border-t border-white/5">
         <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} {APP_NAME}. All Rights Reserved.
         </p>
      </footer>

      {/* Support Button */}
      <a href={`https://wa.me/${SUPPORT_PHONE}`} target="_blank" rel="noreferrer" className="fixed bottom-8 left-8 bg-green-500 hover:bg-green-400 text-white p-4 rounded-full shadow-lg shadow-green-500/30 transition-all hover:scale-110 z-50">
         <MessageCircle className="w-6 h-6" />
      </a>
    </div>
  );

  if (page === PageState.LANDING) return renderLanding();
  // Auth handled in Landing

  return (
    <DashboardLayout 
      user={user!} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      onLogout={() => { setUser(null); setPage(PageState.LANDING); setUsername(''); setPassword(''); }}
    >
      {activeTab === 'admin' && user?.role === 'admin' ? renderAdminDashboard() : (
         activeTab === 'new-order' ? <OrderForm balance={user?.balance || 0} onPlaceOrder={handlePlaceOrder} services={services} /> :
         activeTab === 'funds' ? renderFunds() :
         <div className="text-white p-6">Feature: {activeTab}</div>
      )}
    </DashboardLayout>
  );
};

export default App;
