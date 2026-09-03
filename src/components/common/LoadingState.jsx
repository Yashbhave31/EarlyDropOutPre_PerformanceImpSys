import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = "Processing academic analytics..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mb-3" />
      <p className="text-xs font-medium text-slate-400">{message}</p>
    </div>
  );
}
