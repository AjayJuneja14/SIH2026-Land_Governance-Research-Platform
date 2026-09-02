export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string | Date): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch (e) {
    return String(dateString);
  }
}

export function calculatePriceBreakdown(farmerPrice: number) {
  // Fair pricing model:
  // Farmer Price = listed base price (e.g. ₹30)
  // Direct platform handling & quality inspection fee = ~10% (e.g. ₹3)
  // Buyer Direct Price = Farmer Price + Handling Fee = ~₹33
  // Traditional Retail / Middleman Mandi markup = ~1.6x to 1.8x of farmer price = ~₹50-55
  const platformFee = Math.round(farmerPrice * 0.08 * 10) / 10;
  const directConsumerPrice = farmerPrice + platformFee;
  const traditionalRetailPrice = Math.round(farmerPrice * 1.65);
  const buyerSavings = traditionalRetailPrice - directConsumerPrice;
  const farmerHigherSharePercent = 35; // % higher realization compared to traditional mandi agents

  return {
    farmerPrice,
    platformFee,
    directConsumerPrice,
    traditionalRetailPrice,
    buyerSavings: Math.max(0, buyerSavings),
    farmerHigherSharePercent,
  };
}

export function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'AVAILABLE':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'SOLD':
      return 'bg-gray-100 text-gray-700 border-gray-300';
    case 'RESERVED':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'PENDING':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'CONFIRMED':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'PICKED_UP':
      return 'bg-purple-100 text-purple-800 border-purple-300';
    case 'DELIVERED':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800 border-red-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
}
