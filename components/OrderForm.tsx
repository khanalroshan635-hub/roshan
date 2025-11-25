import React, { useState, useMemo, useEffect } from 'react';
import { Service } from '../types';
import { ShoppingCart, Zap, Sparkles, Loader2, Clock } from 'lucide-react';
import { generateCaption } from '../services/geminiService';

interface OrderFormProps {
  balance: number;
  onPlaceOrder: (order: any) => void;
  services: Service[];
}

export const OrderForm: React.FC<OrderFormProps> = ({ balance, onPlaceOrder, services }) => {
  // Derive categories from the current services list
  const categories = useMemo(() => Array.from(new Set(services.map(s => s.category))), [services]);
  
  const [category, setCategory] = useState<string>('');
  const [serviceId, setServiceId] = useState<string>('');
  const [link, setLink] = useState('');
  const [quantity, setQuantity] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  
  // Drip Feed State
  const [dripFeedEnabled, setDripFeedEnabled] = useState(false);
  const [runs, setRuns] = useState<number>(2);
  const [interval, setInterval] = useState<number>(60);

  // AI State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [showAi, setShowAi] = useState(false);

  // Set default category on load or when services change
  useEffect(() => {
    if (categories.length > 0 && !category) {
      setCategory(categories[0]);
    }
  }, [categories, category]);

  // Set default service when category changes
  useEffect(() => {
    if (category) {
      const firstSvc = services.find(s => s.category === category);
      if (firstSvc) {
        setServiceId(firstSvc.id);
      }
    }
  }, [category, services]);

  const selectedService = useMemo(() => 
    services.find(s => s.id === serviceId) || services[0]
  , [serviceId, services]);

  const filteredServices = useMemo(() => 
    services.filter(s => s.category === category)
  , [category, services]);

  // Handle case where services might be empty initially
  if (!selectedService) {
    return <div className="text-white p-4">Loading services...</div>;
  }

  // Calculate Total Quantity based on Drip Feed
  const finalQuantity = dripFeedEnabled ? quantity * runs : quantity;
  const totalCharge = (selectedService.rate * finalQuantity) / 1000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity < selectedService.min || quantity > selectedService.max) {
      alert(`Quantity must be between ${selectedService.min} and ${selectedService.max}`);
      return;
    }
    
    // Drip Feed Validation
    if (dripFeedEnabled) {
       if (runs < 2) { alert('Runs must be at least 2'); return; }
       if (interval < 0) { alert('Interval cannot be negative'); return; }
       if (finalQuantity > selectedService.max * 5) { alert('Total quantity too high for drip feed'); return; } 
    }

    if (totalCharge > balance) {
      alert("Insufficient funds! Please add funds via eSewa/Khalti.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      onPlaceOrder({
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        link,
        quantity: finalQuantity, // Store total quantity
        charge: totalCharge,
        dripFeed: dripFeedEnabled ? {
            runs,
            interval,
            totalQuantity: finalQuantity
        } : undefined
      });
      setLoading(false);
      setLink('');
      setQuantity(0);
      setRuns(2);
      setDripFeedEnabled(false);
      alert('Order placed successfully!');
    }, 1000);
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt) return;
    setAiLoading(true);
    const result = await generateCaption(category.split(' ')[0], aiPrompt);
    setAiResult(result);
    setAiLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Order Form */}
      <div className="lg:col-span-2 bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-700 pb-4">
          <ShoppingCart className="text-blue-400" />
          <h2 className="text-xl font-bold text-white">New Order</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Category</label>
            <select 
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Service</label>
            <select 
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {filteredServices.map(svc => (
                <option key={svc.id} value={svc.id}>{svc.name}</option>
              ))}
            </select>
            {selectedService.description && (
              <p className="mt-2 text-xs text-blue-300 bg-blue-900/20 p-2 rounded border border-blue-900/50">
                <span className="font-bold">Info:</span> {selectedService.description}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Link</label>
            <input 
              type="text" 
              required
              placeholder="https://..."
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Quantity</label>
              <input 
                type="number" 
                required
                min={selectedService.min}
                max={selectedService.max}
                value={quantity || ''}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <p className="text-xs text-slate-500 mt-1">Min: {selectedService.min} | Max: {selectedService.max}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Total Charge</label>
              <div className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-green-400 font-bold font-mono">
                Rs. {totalCharge.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Drip Feed Section */}
          <div className="border border-slate-700 rounded-lg p-4 bg-slate-900/50">
             <div className="flex items-center gap-2 mb-4">
                <input 
                   type="checkbox" 
                   id="dripFeed"
                   checked={dripFeedEnabled}
                   onChange={(e) => setDripFeedEnabled(e.target.checked)}
                   className="w-5 h-5 accent-blue-600 rounded"
                />
                <label htmlFor="dripFeed" className="text-white font-bold text-sm cursor-pointer flex items-center gap-2">
                   <Clock className="w-4 h-4 text-orange-400" />
                   Enable Drip Feed
                </label>
             </div>

             {dripFeedEnabled && (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                   <div>
                      <label className="block text-xs text-slate-400 mb-1">Runs</label>
                      <input 
                        type="number"
                        min="2"
                        value={runs}
                        onChange={(e) => setRuns(parseInt(e.target.value) || 2)}
                        className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white text-sm"
                      />
                   </div>
                   <div>
                      <label className="block text-xs text-slate-400 mb-1">Interval (Minutes)</label>
                      <input 
                        type="number"
                        min="0"
                        value={interval}
                        onChange={(e) => setInterval(parseInt(e.target.value) || 60)}
                        className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white text-sm"
                      />
                   </div>
                   <div className="col-span-2 text-xs text-slate-400 italic">
                      Total Quantity: <span className="text-white font-bold">{finalQuantity}</span> (Quantity × Runs)
                   </div>
                </div>
             )}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-blue-900/50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Zap className="w-5 h-5 fill-current" />}
            {loading ? 'Processing...' : 'Submit Order'}
          </button>
        </form>
      </div>

      {/* AI Assistant Sidebar */}
      <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-700">
           <div className="flex items-center gap-2">
            <Sparkles className="text-purple-400" />
            <h3 className="font-bold text-white">Gemini Content AI</h3>
           </div>
           <button 
             onClick={() => setShowAi(!showAi)}
             className="text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded hover:bg-purple-900"
           >
             {showAi ? 'Reset' : 'New'}
           </button>
        </div>

        <div className="flex-1 flex flex-col">
          <p className="text-slate-400 text-sm mb-4">
            Need a caption for the link you are boosting? Let Google Gemini write it for you.
          </p>
          
          <textarea
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm focus:ring-2 focus:ring-purple-500 outline-none mb-3 resize-none h-24"
            placeholder="e.g. A photo of me hiking in the Alps at sunset..."
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
          />

          <button
            onClick={handleAiGenerate}
            disabled={aiLoading || !aiPrompt}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors mb-4 flex items-center justify-center gap-2"
          >
            {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Generate Caption
          </button>

          {aiResult && (
            <div className="flex-1 bg-slate-900 rounded-lg p-3 border border-slate-700 overflow-y-auto">
              <p className="text-slate-300 text-xs whitespace-pre-wrap font-mono leading-relaxed">
                {aiResult}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};