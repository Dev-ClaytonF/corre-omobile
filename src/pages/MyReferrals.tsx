import { useEffect, useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { supabase } from '../utils/supabase';
import { Link } from 'react-router-dom';
import { Purchase } from '../types/purchase';
import axios from 'axios';

// Cache para o preço do BNB
let bnbPriceCache: { price: number; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

const getBNBPrice = async (): Promise<number> => {
  try {
    if (bnbPriceCache && Date.now() - bnbPriceCache.timestamp < CACHE_DURATION) {
      return bnbPriceCache.price;
    }

    const response = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT');
    const price = parseFloat(response.data.price);

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

interface ReferralData {
  referralCode: string | null;
  totalReferrals: number;
  totalEarnings: number;
  pendingAmount: string;
  paidAmount: string;
  referralList: {
    address: string;
    hash: string;
    amount: string;
    currency: 'BNB' | 'USDT' | 'BRL';
    token_amount: string;
    date: string;
    status: 'pending' | 'completed';
    earnings: number;
    isPaid: boolean;
  }[];
}

const MyReferrals = () => {
  const { activeAccount } = useWallet();
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bnbPrice, setBnbPrice] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Função para atualizar a comissão no Supabase
  const updateReferralEarnings = async (purchase: Purchase) => {
    try {
      const amount = parseFloat(purchase.amount);
      let earnings = 0;

      if (purchase.currency === 'USDT') {
        earnings = amount * 0.05; // 5% do valor em USDT
      } else if (purchase.currency === 'BNB' && bnbPrice > 0) {
        const amountInUsdt = amount * bnbPrice;
        earnings = amountInUsdt * 0.05; // 5% do valor em USDT
      }

      const { error } = await supabase
        .from('purchases')
        .update({ referral_earnings: earnings.toFixed(2) })
        .eq('hash', purchase.hash);

      if (error) {
        console.error('Error updating commission:', error);
      }
    } catch (error) {
    console.error('Error calculating/updating commission:', error);
    }
  };

  useEffect(() => {
    const fetchBNBPrice = async () => {
      const price = await getBNBPrice();
      setBnbPrice(price);
    };

    fetchBNBPrice();
  }, []);

  useEffect(() => {
    const fetchReferralData = async () => {
      if (!activeAccount) {
        setIsLoading(false);
        return;
      }

      try {
        // Busca o código de referral da wallet
        const { data: walletData } = await supabase
          .from('wallets')
          .select('referral_code')
          .eq('wallet_address', activeAccount.address)
          .single();

        // Se não existe código de referral, retorna cedo
        if (!walletData?.referral_code) {
          setReferralData({
            referralCode: null,
            totalReferrals: 0,
            totalEarnings: 0,
            pendingAmount: '0.00',
            paidAmount: '0.00',
            referralList: []
          });
          setIsLoading(false);
          return;
        }

        // Busca o valor pendente de pagamento
        const { data: pendingData } = await supabase
          .from('pending_referral_earnings')
          .select('pending_amount')
          .eq('wallet_address', activeAccount.address)
          .single();

        // Busca o total já pago da tabela referral_payments
        const { data: paymentsData } = await supabase
          .from('referral_payments')
          .select('amount')
          .eq('wallet_address', activeAccount.address);

        // Busca todas as compras que usaram este código de referral
        const [{ data: purchasesData }, { data: pixData }] = await Promise.all([
          supabase
            .from('purchases')
            .select('*')
            .eq('referral_code', walletData.referral_code)
            .order('created_at', { ascending: false }),
          supabase
            .from('pix_transactions')
            .select('*')
            .eq('referral_code', walletData.referral_code)
            .eq('status', 'paid')
            .order('created_at', { ascending: false })
        ]);

        // Para cada compra, verifica e atualiza a comissão se necessário
        if (purchasesData) {
          for (const purchase of purchasesData) {
            if (!purchase.referral_earnings) {
              await updateReferralEarnings(purchase);
            }
          }
        }

        // Calcula os ganhos para cada referral (incluindo PIX)
        const referralList = [
          ...(purchasesData || []).map((purchase: Purchase) => {
            const earnings = purchase.referral_earnings ? parseFloat(purchase.referral_earnings) : 0;
            const isPaid = earnings > 0 && paymentsData?.some(payment => 
              parseFloat(payment.amount) > 0
            ) || false;

            return {
              address: purchase.buyer_wallet,
              hash: purchase.hash,
              amount: purchase.amount.toString(),
              currency: purchase.currency as 'BNB' | 'USDT',
              token_amount: purchase.token_amount.toString(),
              date: purchase.created_at || '',
              status: purchase.status as 'pending' | 'completed',
              earnings,
              isPaid
            };
          }),
          ...(pixData || []).map((pix: any) => {
            const earnings = parseFloat(pix.amount_usd) * 0.05; // 5% do valor em USD
            const isPaid = earnings > 0 && paymentsData?.some(payment => 
              parseFloat(payment.amount) > 0
            ) || false;

            return {
              address: pix.wallet_address,
              hash: pix.transaction_id,
              amount: pix.amount_brl.toString(),
              currency: 'BRL' as const,
              token_amount: pix.xstp_quantity.toString(),
              date: pix.created_at || '',
              status: 'completed' as const,
              earnings,
              isPaid
            };
          })
        ];

        const totalReferrals = referralList.length;
        const totalEarnings = referralList.reduce((total, ref) => total + ref.earnings, 0);

        setReferralData({
          referralCode: walletData.referral_code,
          totalReferrals,
          totalEarnings,
          pendingAmount: pendingData?.pending_amount || '0.00',
          paidAmount: paymentsData ? paymentsData.reduce((sum, payment) => sum + parseFloat(payment.amount), 0).toFixed(2) : '0.00',
          referralList
        });
      } catch (error) {
        console.error('Erro ao buscar dados de referral:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReferralData();
  }, [activeAccount, bnbPrice]);

  // Função para calcular o total de páginas
  const totalPages = referralData ? Math.ceil(referralData.referralList.length / itemsPerPage) : 0;

  // Função para obter os itens da página atual
  const getCurrentPageItems = () => {
    if (!referralData) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return referralData.referralList.slice(startIndex, endIndex);
  };

  if (!activeAccount) {
    return (
      <div className="min-h-screen bg-black pt-20 px-3">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-white mb-2">My Referrals</h1>
          <p className="text-white text-sm">Please connect your wallet to view your referrals.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black pt-20 px-3">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-white text-sm">Loading referrals data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-20 px-3">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-4 text-center">My Referrals</h1>

        {!referralData?.referralCode ? (
          <div className="text-center py-8 bg-white/5 rounded-xl border border-white/10">
            <h3 className="text-base font-medium text-gray-300 mb-2">You don't have a referral code yet</h3>
            <p className="text-sm text-gray-400 mb-4">Create your referral code to start earning rewards!</p>
            <Link 
              to="/presale"
              className="inline-flex items-center px-4 py-2 rounded-full text-sm text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-all duration-200"
            >
              Create Referral Code
            </Link>
          </div>
        ) : (
          <>
            {/* Cards de Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-4">
              <div className="bg-white/5 rounded-lg p-3">
                <h3 className="text-white text-xs mb-1">Your Referral Code</h3>
                <p className="text-xl font-bold text-purple-500">{referralData.referralCode}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <h3 className="text-white text-xs mb-1">Total Referrals</h3>
                <p className="text-xl font-bold text-purple-500">{referralData.totalReferrals}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <h3 className="text-white text-xs mb-1">Total Earnings</h3>
                <p className="text-xl font-bold text-purple-500">${referralData.totalEarnings.toFixed(2)} USDT</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <h3 className="text-white text-xs mb-1">Pending Payment</h3>
                <p className="text-xl font-bold text-yellow-500">${referralData.pendingAmount} USDT</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <h3 className="text-white text-xs mb-1">Total Paid</h3>
                <p className="text-xl font-bold text-green-500">${referralData.paidAmount} USDT</p>
              </div>
            </div>

            {/* Lista de Indicações */}
            <div className="bg-white/5 rounded-xl p-4">
              <h2 className="text-lg font-bold text-white mb-3">Referrals History</h2>
              
              {/* Tabela para Desktop */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400 text-xs">
                      <th className="pb-3">Address</th>
                      <th className="pb-3">Value</th>
                      <th className="pb-3">Tokens</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Hash</th>
                      <th className="pb-3">Earnings (5%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getCurrentPageItems().map((referral, index) => (
                      <tr key={index} className="text-white border-t border-white/10 text-sm">
                        <td className="py-2">{referral.address.slice(0, 6)}...{referral.address.slice(-4)}</td>
                        <td className="py-2">{referral.amount} {referral.currency}</td>
                        <td className="py-2">{referral.token_amount} XSTP</td>
                        <td className="py-2">{new Date(referral.date).toLocaleDateString()}</td>
                        <td className="py-2">
                          <a
                            href={`https://bscscan.com/tx/${referral.hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-400 hover:text-purple-300"
                          >
                            Ver BSCScan
                          </a>
                        </td>
                        <td className="py-2 text-green-500">${referral.earnings.toFixed(2)} USDT</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Paginação Desktop */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-4 pb-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-lg text-xs ${
                        currentPage === 1
                          ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                          : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                      }`}
                    >
                      Anterior
                    </button>
                    <span className="text-gray-400 text-xs">
                      Página {currentPage} de {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded-lg text-xs ${
                        currentPage === totalPages
                          ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                          : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                      }`}
                    >
                      Próxima
                    </button>
                  </div>
                )}
              </div>

              {/* Layout de Cards para Mobile */}
              <div className="md:hidden space-y-2">
                {getCurrentPageItems().map((referral, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-3 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-xs">Endereço:</span>
                      <span className="text-white text-xs">{referral.address.slice(0, 6)}...{referral.address.slice(-4)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-xs">Valor:</span>
                      <span className="text-white text-xs">{referral.amount} {referral.currency}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-xs">Tokens:</span>
                      <span className="text-white text-xs">{referral.token_amount} XSTP</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-xs">Data:</span>
                      <span className="text-white text-xs">{new Date(referral.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-xs">Ganhos:</span>
                      <span className="text-green-500 text-xs">${referral.earnings.toFixed(2)} USDT</span>
                    </div>
                    <div className="pt-1.5">
                      <a
                        href={`https://bscscan.com/tx/${referral.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 text-xs flex items-center justify-center w-full bg-purple-500/10 rounded-lg py-1.5"
                      >
                        Ver no BSCScan
                      </a>
                    </div>
                  </div>
                ))}

                {/* Paginação Mobile */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-4">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-lg text-xs ${
                        currentPage === 1
                          ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                          : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                      }`}
                    >
                      Anterior
                    </button>
                    <span className="text-gray-400 text-xs">
                      {currentPage}/{totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded-lg text-xs ${
                        currentPage === totalPages
                          ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                          : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                      }`}
                    >
                      Próxima
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyReferrals; 