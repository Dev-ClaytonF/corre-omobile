import axios from 'axios';

// Cache para o preço do BNB para evitar múltiplas chamadas à API
let bnbPriceCache: { price: number; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export const getBNBPrice = async (): Promise<number> => {
  try {
    // Verifica se tem cache válido
    if (bnbPriceCache && Date.now() - bnbPriceCache.timestamp < CACHE_DURATION) {
      return bnbPriceCache.price;
    }

    // Busca preço atual do BNB na Binance
    const response = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT');
    const price = parseFloat(response.data.price);

    // Atualiza o cache
    bnbPriceCache = {
      price,
      timestamp: Date.now()
    };

    return price;
  } catch (error) {
    console.error('Error fetching BNB price:', error);
    return 0;
  }
};

export const calculateReferralEarnings = async (amount: string, currency: 'BNB' | 'USDT'): Promise<number> => {
  try {
    const numericAmount = parseFloat(amount);
    
    if (currency === 'USDT') {
      // Para USDT, simplesmente calcula 5%
      return numericAmount * 0.05;
    } else {
      // Para BNB, converte para USDT primeiro
      const bnbPrice = await getBNBPrice();
      const amountInUsdt = numericAmount * bnbPrice;
      return amountInUsdt * 0.05;
    }
  } catch (error) {
    console.error('Error calculating referral earnings:', error);
    return 0;
  }
}; 