import React from 'react';
import { Zap } from 'lucide-react';
import { APP_NAME } from '../constants';

export const Logo = () => (
  <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter text-white">
    <div className="bg-gradient-to-tr from-blue-600 to-purple-600 p-2 rounded-lg">
      <Zap className="w-6 h-6 text-white" />
    </div>
    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
      {APP_NAME}
    </span>
  </div>
);