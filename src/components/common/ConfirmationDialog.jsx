import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

export default function ConfirmationDialog({ isOpen, onClose, onConfirm, title = "Confirm Action", message, confirmText = "Confirm", isDestructive = true }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-xl ${isDestructive ? 'bg-red-500/15 text-red-400' : 'bg-amber-500/15 text-amber-400'}`}>
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-slate-300 leading-relaxed">{message}</p>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-slate-800">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => { onConfirm(); onClose(); }}
          className={`px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-md transition-all ${
            isDestructive
              ? 'bg-red-600 hover:bg-red-500 shadow-red-600/25'
              : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/25'
          }`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}
