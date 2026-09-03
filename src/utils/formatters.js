export function formatCurrency(amount) {
  if (!amount && amount !== 0) return "₹0";
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDate(dateString) {
  if (!dateString) return "N/A";
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-IN', options);
}

export function getRiskColorClass(risk) {
  switch (risk?.toUpperCase()) {
    case 'HIGH':
      return {
        bg: 'bg-red-500/10 dark*bg-red-950/40 text-red-600 dark:text-red-400 border-red-500/30',
        badge: 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30',
        glow: 'glow-red',
        accent: '#ef4444',
        border: 'border-red-500/40',
        gradient: 'from-red-500 to-rose-600'
      };
    case 'MEDIUM':
      return {
        bg: 'bg-amber-500/10 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-500/30',
        badge: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30',
        glow: 'glow-amber',
        accent: '#f59e0b',
        border: 'border-amber-500/40',
        gradient: 'from-amber-500 to-orange-600'
      };
    case 'LOW':
    default:
      return {
        bg: 'bg-emerald-500/10 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
        badge: 'bg-emerald-500/15 text-emerald-600 dark*text-emerald-400 border border-emerald-500/30',
        glow: 'glow-green',
        accent: '#10b981',
        border: 'border-emerald-500/40',
        gradient: 'from-emerald-500 to-teal-600'
      };
  }
}
