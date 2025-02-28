import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { useWallet } from '../contexts/WalletContext';
import { useNavigate } from 'react-router-dom';

interface WalletPaymentInfo {
  wallet_address: string;
  pending_amount: string;
  total_paid: string;
  last_payment_date: string | null;
}

interface PaymentHistory {
  id: number;
  wallet_address: string;
  amount: string;
  payment_date: string;
  admin_wallet: string;
}

interface WalletDetails {
  name: string | null;
  email: string | null;
}

interface TokenSalesTotal {
  total_tokens: string;
  total_usdt_value: string;
}

interface ManualSale {
  id: number;
  token_amount: string;
  usdt_value: string;
  admin_wallet: string;
  description: string;
  created_at: string;
}

// Adicionar novas interfaces para PIX Tokens
interface PixTokenPending {
  id: number;
  transaction_id: string;
  wallet_address: string;
  token_amount: string;
  amount_usd: string;
  created_at: string;
  status: string;
}

interface PixTokenPaid {
  id: number;
  transaction_id: string;
  wallet_address: string;
  token_amount: string;
  amount_usd: string;
  paid_at: string;
  admin_wallet: string;
}

interface PixTransaction {
  id: number;
  amount: string;
  status: string;
  created_at: string;
}

interface CryptoTransaction {
  id: number;
  amount: string;
  token: string;
  status: string;
  created_at: string;
}

const Core = () => {
  const navigate = useNavigate();
  const { activeAccount } = useWallet();
  const [walletPayments, setWalletPayments] = useState<WalletPaymentInfo[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [totalPending, setTotalPending] = useState('0');
  const [totalPaid, setTotalPaid] = useState('0');
  const [isLoading, setIsLoading] = useState(true);
  const [searchWallet, setSearchWallet] = useState('');
  const [processingPayment, setProcessingPayment] = useState<string | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [walletDetails, setWalletDetails] = useState<WalletDetails | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'referrals' | 'manual-sales' | 'stages' | 'pix-transfers'>('referrals');
  // @ts-ignore
  const [tokenSalesTotal, setTokenSalesTotal] = useState<TokenSalesTotal>({ total_tokens: '0', total_usdt_value: '0' });
  const [manualSales, setManualSales] = useState<ManualSale[]>([]);
  const [newManualSale, setNewManualSale] = useState({
    tokenAmount: '',
    usdtValue: '',
    description: ''
  });
  const [showReferralHistory, setShowReferralHistory] = useState(false);
  const [showManualHistory, setShowManualHistory] = useState(false);
  const [currentPaymentPage, setCurrentPaymentPage] = useState(1);
  const [currentManualPage, setCurrentManualPage] = useState(1);
  const itemsPerPage = 10;
  const [stages, setStages] = useState<any[]>([]);
  const [activeStage, setActiveStage] = useState<any>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedStageNumber, setSelectedStageNumber] = useState<number | null>(null);
  const [isUpdatingStage, setIsUpdatingStage] = useState(false);
  const [pixTokensPending, setPixTokensPending] = useState<PixTokenPending[]>([]);
  const [pixTokensPaid, setPixTokensPaid] = useState<PixTokenPaid[]>([]);
  const [showPixHistory, setShowPixHistory] = useState(false);
  // @ts-ignore
  const [currentPixPage, setCurrentPixPage] = useState(1);
  const [processingTokenTransfer, setProcessingTokenTransfer] = useState<string | null>(null);
  // @ts-ignore
  const [pixTransactions, setPixTransactions] = useState<PixTransaction[]>([]);
  // @ts-ignore
  const [cryptoTransactions, setCryptoTransactions] = useState<CryptoTransaction[]>([]);
  // @ts-ignore
  const [loading, setLoading] = useState(true);
  // @ts-ignore
  const [currentCryptoPage, setCurrentCryptoPage] = useState(1);
  // @ts-ignore
  const [totalCryptoPages, setTotalCryptoPages] = useState(0);
  // @ts-ignore
  const [totalPixPages, setTotalPixPages] = useState(0);
  // @ts-ignore
  const [selectedTransaction, setSelectedTransaction] = useState<PixTransaction | null>(null);
  // @ts-ignore
  const [isModalOpen, setIsModalOpen] = useState(false);
  // @ts-ignore
  const [isMobile, setIsMobile] = useState(false);

  // Função para verificar se é dispositivo móvel
  const isMobileDevice = () => {
    return window.innerWidth <= 768;
  };

  useEffect(() => {
    // Verifica se é dispositivo móvel ao carregar e em redimensionamentos
    const checkDevice = () => {
      if (isMobileDevice()) {
        navigate('/');
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, [navigate]);

  // Se for dispositivo móvel, mostra mensagem antes do redirecionamento
  if (isMobileDevice()) {
    return (
      <div className="min-h-screen bg-black pt-24 px-4">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-xl font-bold text-white mb-4">Restricted Access</h1>
          <p className="text-gray-400 mb-4">The admin panel is only available on desktop.</p>
          <p className="text-gray-400">You will be redirected to the homepage.</p>
        </div>
      </div>
    );
  }

  // Função para formatar números grandes
  const formatLargeNumber = (num: string | number): string => {
    const value = typeof num === 'string' ? parseFloat(num) : num;
    const integerPart = Math.floor(value); // Remove apenas as casas decimais
    return integerPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Função para buscar dados
  const fetchData = async () => {
    try {
      // Busca todas as carteiras com valores pendentes
      const { data: pendingData } = await supabase
        .from('pending_referral_earnings')
        .select('*')
        .order('pending_amount', { ascending: false });

      // Busca histórico de pagamentos
      const { data: historyData } = await supabase
        .from('referral_payments')
        .select('*')
        .order('payment_date', { ascending: false });

      if (pendingData) {
        setWalletPayments(pendingData);
        const total = pendingData.reduce((sum, wallet) => 
          sum + parseFloat(wallet.pending_amount || '0'), 0);
        setTotalPending(total.toFixed(2));
      }

      if (historyData) {
        setPaymentHistory(historyData);
        const total = historyData.reduce((sum, payment) => 
          sum + parseFloat(payment.amount || '0'), 0);
        setTotalPaid(total.toFixed(2));
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para buscar detalhes da carteira
  const fetchWalletDetails = async (wallet: string) => {
    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('name, email')
        .eq('wallet_address', wallet)
        .single();

      if (error) throw error;

      setWalletDetails(data);
      setSelectedWallet(wallet);
      setShowDetailsModal(true);
    } catch (error) {
      console.error('Erro ao buscar detalhes da carteira:', error);
      alert('Erro ao buscar detalhes da carteira');
    }
  };

  // Função para marcar pagamento como realizado
  const handlePayment = async (wallet: string, amount: string) => {
    if (!activeAccount) return;
    if (processingPayment) return; // Previne múltiplos cliques
    if (parseFloat(amount) <= 0) {
      alert('Não é possível processar pagamento com valor zero ou negativo.');
      return;
    }

    // Confirmação antes de pagar
    if (!window.confirm(`Confirma the payment of $${amount} USDT to the wallet ${wallet}?`)) {
      return;
    }

    setProcessingPayment(wallet);

    try {
      // Verifica se ainda existe valor pendente
      const { data: currentPending } = await supabase
        .from('pending_referral_earnings')
        .select('pending_amount')
        .eq('wallet_address', wallet)
        .single();

      if (!currentPending || parseFloat(currentPending.pending_amount) <= 0) {
        alert('Esta carteira não possui valor pendente para pagamento.');
        return;
      }

      // 1. Registra o pagamento
      const { error: paymentError } = await supabase
        .from('referral_payments')
        .insert([{
          wallet_address: wallet,
          amount: amount,
          payment_date: new Date().toISOString(),
          admin_wallet: activeAccount.address
        }]);

      if (paymentError) throw paymentError;

      // 2. Zera o valor pendente
      const { error: updateError } = await supabase
        .from('pending_referral_earnings')
        .update({ pending_amount: '0.00' })
        .eq('wallet_address', wallet);

      if (updateError) throw updateError;

      // 3. Atualiza os dados
      await fetchData();
      alert('Pagamento processado com sucesso!');

    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setProcessingPayment(null);
    }
  };

  // Nova função para calcular totais
  const fetchTotalTokensSold = async () => {
    try {
      // Soma todas as vendas manuais de todos os estágios
      const { data: manualSales, error: manualError } = await supabase
        .from('manual_sales')
        .select('token_amount, usdt_value');

      if (manualError) throw manualError;

      const totals = {
        total_tokens: '0',
        total_usdt_value: '0'
      };

      if (manualSales) {
        totals.total_tokens = manualSales
          .reduce((sum, sale) => sum + parseFloat(sale.token_amount), 0)
          .toString();
        
        totals.total_usdt_value = manualSales
          .reduce((sum, sale) => sum + parseFloat(sale.usdt_value), 0)
          .toString();
      }

      setTokenSalesTotal(totals);
    } catch (error) {
      console.error('Erro ao calcular totais:', error);
    }
  };

  // Função para buscar vendas manuais
  const fetchManualSales = async () => {
    try {
      const { data, error } = await supabase
        .from('manual_sales')
        .select('*')
        .eq('stage_number', activeStage?.stage_number)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setManualSales(data);
      }
    } catch (error) {
      console.error('Erro ao buscar vendas manuais:', error);
    }
  };

  // Função para adicionar venda manual
  const handleAddManualSale = async () => {
    if (!activeAccount || !activeStage) {
      alert('Selecione um stage active before registering the sale.');
      return;
    }

    if (!newManualSale.usdtValue) {
      alert('Please fill in the USDT value.');
      return;
    }

    // Calcula o valor restante
    const valorRestante = Math.max(0, parseFloat(activeStage.target_value) - parseFloat(activeStage.raised_value || '0'));
    const valorDesejado = parseFloat(newManualSale.usdtValue);

    // Verifica se está próximo do limite (97% ou mais do target)
    const limiteParaTroca = parseFloat(activeStage.target_value) * 0.97;
    const valorAposVenda = parseFloat(activeStage.raised_value || '0') + valorDesejado;

    // Se o valor desejado exceder o restante
    if (valorDesejado > valorRestante) {
      alert(`The stage ${activeStage.stage_number} is close to the end!\nMaximum available for purchase: $${valorRestante.toFixed(2)} USDT`);
      return;
    }

    try {
      // Registra a venda
      const { error: manualSaleError } = await supabase
        .from('manual_sales')
        .insert([{
          token_amount: Math.floor(parseFloat(newManualSale.tokenAmount)).toString(),
          usdt_value: newManualSale.usdtValue,
          admin_wallet: activeAccount.address,
          description: newManualSale.description,
          stage_number: activeStage.stage_number
        }]);

      if (manualSaleError) throw manualSaleError;

      // Atualiza o raised_value do stage active
      const newRaisedValue = (
        parseFloat(activeStage.raised_value || '0') + 
        parseFloat(newManualSale.usdtValue)
      ).toString();

      const { error: updateError } = await supabase
        .from('sale_stages')
        .update({ raised_value: newRaisedValue })
        .eq('stage_number', activeStage.stage_number);

      if (updateError) throw updateError;

      // Verifica se precisa trocar de stage automaticamente
      if (valorAposVenda >= limiteParaTroca) {
        // Busca o próximo stage
        const { data: nextStage } = await supabase
          .from('sale_stages')
          .select('*')
          .eq('stage_number', activeStage.stage_number + 1)
          .single();

        if (nextStage) {
          // Desativa o stage atual
          await supabase
            .from('sale_stages')
            .update({ is_active: false })
            .eq('stage_number', activeStage.stage_number);

          // Ativa o próximo stage
          await supabase
            .from('sale_stages')
            .update({ is_active: true })
            .eq('stage_number', nextStage.stage_number);

          alert(`Stage ${activeStage.stage_number} completed! Automatically advancing to Stage ${nextStage.stage_number}`);
        }
      }

      // Limpa o formulário e atualiza os dados
      setNewManualSale({ tokenAmount: '', usdtValue: '', description: '' });
      await Promise.all([
        fetchStages(),
        fetchManualSales(),
        fetchTotalTokensSold()
      ]);
      alert('Manual sale registered successfully!');
    } catch (error) {
      console.error('Erro ao registrar venda manual:', error);
      alert('Erro ao registrar venda manual. Tente novamente.');
    }
  };

  // Funções para paginação
  const getPaymentHistoryItems = () => {
    const startIndex = (currentPaymentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return paymentHistory.slice(startIndex, endIndex);
  };

  const getManualSalesItems = () => {
    const startIndex = (currentManualPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return manualSales.slice(startIndex, endIndex);
  };

  const totalPaymentPages = Math.ceil(paymentHistory.length / itemsPerPage);
  const totalManualPages = Math.ceil(manualSales.length / itemsPerPage);

  // Adicione a função fetchStages
  const fetchStages = async () => {
    try {
      const { data, error } = await supabase
        .from('sale_stages')
        .select('*')
        .order('stage_number');

      if (error) throw error;
      setStages(data || []);

      // Buscar o stage active
      const activeStageData = data?.find(stage => stage.is_active);
      setActiveStage(activeStageData);
    } catch (error) {
      console.error('Erro ao buscar stages:', error);
    }
  };

  // Função para buscar tokens PIX pendentes e pagos
  const fetchPixTokens = async () => {
    try {
      const { data: pendingData, error: pendingError } = await supabase
        .from('pix_tokens_pending')
        .select('*')
        .order('created_at', { ascending: false });

      if (pendingError) throw pendingError;

      const { data: paidData, error: paidError } = await supabase
        .from('pix_tokens_paid')
        .select('*')
        .order('paid_at', { ascending: false });

      if (paidError) throw paidError;

      setPixTokensPending(pendingData || []);
      setPixTokensPaid(paidData || []);
    } catch (error) {
      console.error('Erro ao buscar tokens PIX:', error);
    }
  };

  // Função para processar transferência de tokens
  const handleTokenTransfer = async (pending: PixTokenPending) => {
    if (!activeAccount) return;
    if (processingTokenTransfer) return;

    if (!window.confirm(`Confirma the transfer of ${formatLargeNumber(pending.token_amount)} XSTP to the wallet ${pending.wallet_address}?`)) {
      return;
    }

    setProcessingTokenTransfer(pending.transaction_id);

    try {
      // 1. Inserir na tabela de tokens pagos
      const { error: insertError } = await supabase
        .from('pix_tokens_paid')
        .insert([{
          transaction_id: pending.transaction_id,
          wallet_address: pending.wallet_address,
          token_amount: pending.token_amount,
          amount_usd: pending.amount_usd,
          admin_wallet: activeAccount.address
        }]);

      if (insertError) throw insertError;

      // 2. Remover da tabela de pendentes
      const { error: deleteError } = await supabase
        .from('pix_tokens_pending')
        .delete()
        .eq('transaction_id', pending.transaction_id);

      if (deleteError) throw deleteError;

      // 3. Atualizar os dados
      await fetchPixTokens();
      alert('Transferência de tokens processada com sucesso!');

    } catch (error) {
      console.error('Erro ao processar transferência:', error);
      alert('Erro ao processar transferência. Tente novamente.');
    } finally {
      setProcessingTokenTransfer(null);
    }
  };

  // Atualize o useEffect
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchData(),
        fetchTotalTokensSold(),
        fetchManualSales(),
        fetchStages(),
        fetchPixTokens()
      ]);
      setIsLoading(false);
    };

    fetchAllData();
  }, []);

  // Adicione esta função junto com as outras funções
  const handleActivateStage = async (stageNumber: number) => {
    if (!activeAccount) return;
    
    setSelectedStageNumber(stageNumber);
    setShowConfirmModal(true);
  };

  // Adicione a função que realmente faz a ativação
  const confirmActivateStage = async () => {
    if (!selectedStageNumber) return;
    
    setIsUpdatingStage(true);
    try {
      // Primeiro, desativa todos os stages
      const { error: deactivateError } = await supabase
        .from('sale_stages')
        .update({ is_active: false })
        .eq('is_active', true);

      if (deactivateError) throw deactivateError;

      // Depois, ativa o stage selecionado mantendo o raised_value
      const { error: activateError } = await supabase
        .from('sale_stages')
        .update({ is_active: true })
        .eq('stage_number', selectedStageNumber);

      if (activateError) throw activateError;

      // Atualiza os dados
      await Promise.all([
        fetchStages(),
        fetchManualSales()
      ]);
      
      setShowConfirmModal(false);
      setShowSuccessModal(true);
      
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000);
    } catch (error) {
      console.error('Erro ao ativar stage:', error);
      setShowConfirmModal(false);
    } finally {
      setIsUpdatingStage(false);
    }
  };

  // Primeiro, adicione uma função para calcular os tokens
  const calculateTokens = (usdtValue: string): string => {
    if (!activeStage || !usdtValue || isNaN(parseFloat(usdtValue))) return '0';
    const calculated = Math.floor(parseFloat(usdtValue) / parseFloat(activeStage.token_price));
    return isNaN(calculated) ? '0' : calculated.toString();
  };

  if (!activeAccount) {
    return (
      <div className="min-h-screen bg-black pt-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Painel Administrativo</h1>
          <p className="text-white">Por favor, conecte sua carteira para acessar o painel.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black pt-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-white">Carregando dados...</p>
        </div>
      </div>
    );
  }

  const filteredWallets = walletPayments.filter(wallet => {
    // Verifica se tem valor pendente
    const hasPendingAmount = parseFloat(wallet.pending_amount) > 0;
    
    // Verifica se corresponde à busca
    const matchesSearch = wallet.wallet_address.toLowerCase().includes(searchWallet.toLowerCase());
    
    // Se tiver busca, mostra independente do valor
    if (searchWallet) {
      return matchesSearch;
    }
    
    // Se não tiver busca, só mostra se tiver valor pendente
    return hasPendingAmount;
  });

  return (
    <div className="min-h-screen bg-black pt-16 px-2 pb-6">
      <div className={`mx-auto ${activeTab === 'pix-transfers' ? 'max-w-7xl' : 'max-w-4xl'}`}>
        <h1 className="text-lg font-bold text-white mb-3 text-center">Painel Administrativo</h1>

        {/* Tabs de Navegação */}
        <div className="flex gap-1.5 mb-3">
          <button
            onClick={() => setActiveTab('referrals')}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === 'referrals'
                ? 'bg-purple-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            Sistema de Referral
          </button>
          <button
            onClick={() => setActiveTab('manual-sales')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              activeTab === 'manual-sales'
                ? 'bg-purple-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Gerenciamento
          </button>
          <button
            onClick={() => setActiveTab('stages')}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === 'stages'
                ? 'bg-purple-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            Stages
          </button>
          <button
            onClick={() => setActiveTab('pix-transfers')}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === 'pix-transfers'
                ? 'bg-purple-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            PIX Transfers
          </button>
        </div>

        {activeTab === 'referrals' ? (
          <>
            {/* Cards de Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 mb-3">
              <div className="bg-white/5 rounded-lg p-3">
                <h3 className="text-white text-xs mb-0.5">Total Pending</h3>
                <p className="text-lg font-bold text-yellow-500">${totalPending} USDT</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <h3 className="text-white text-xs mb-0.5">Total Paid</h3>
                <p className="text-lg font-bold text-green-500">${totalPaid} USDT</p>
              </div>
            </div>

            {/* Barra de Pesquisa */}
            <div className="mb-3">
              <input
                type="text"
                placeholder="Buscar carteira..."
                value={searchWallet}
                onChange={(e) => setSearchWallet(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Lista de Carteiras */}
            <div className="bg-white/5 rounded-lg p-3 mb-3">
              <h2 className="text-base font-bold text-white mb-2">Carteiras com Valores Pendentes</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400">
                      <th className="pb-2">Carteira</th>
                      <th className="pb-2">Valor Pendente</th>
                      <th className="pb-2">Detalhes</th>
                      <th className="pb-2">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWallets.map((wallet) => (
                      <tr key={wallet.wallet_address} className="text-white border-t border-white/10">
                        <td className="py-2">{wallet.wallet_address}</td>
                        <td className="py-2">${wallet.pending_amount} USDT</td>
                        <td className="py-2">
                          <button
                            onClick={() => fetchWalletDetails(wallet.wallet_address)}
                            className="text-purple-400 hover:text-purple-300 transition-colors"
                          >
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className="h-4 w-4" 
                              viewBox="0 0 20 20" 
                              fill="currentColor"
                            >
                              <path 
                                fillRule="evenodd" 
                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" 
                                clipRule="evenodd" 
                              />
                            </svg>
                          </button>
                        </td>
                        <td className="py-2">
                          <button
                            onClick={() => handlePayment(wallet.wallet_address, wallet.pending_amount)}
                            disabled={processingPayment === wallet.wallet_address || parseFloat(wallet.pending_amount) <= 0}
                            className={`
                              px-3 py-1 rounded text-xs font-semibold
                              ${processingPayment === wallet.wallet_address
                                ? 'bg-gray-500 cursor-not-allowed'
                                : parseFloat(wallet.pending_amount) <= 0
                                ? 'bg-gray-500 cursor-not-allowed'
                                : 'bg-green-500 hover:bg-green-600'
                              }
                            `}
                          >
                            {processingPayment === wallet.wallet_address ? 'Processando...' : 'Pagar'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Histórico de Pagamentos */}
            <div className="bg-white/5 rounded-lg p-3">
              <button
                onClick={() => setShowReferralHistory(!showReferralHistory)}
                className="w-full flex items-center justify-between text-base font-bold text-white mb-2"
              >
                <span>Histórico de Pagamentos</span>
                <svg
                  className={`w-5 h-5 transition-transform ${showReferralHistory ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showReferralHistory && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-400">
                        <th className="pb-2">Carteira</th>
                        <th className="pb-2">Valor Pago</th>
                        <th className="pb-2">Data do Pagamento</th>
                        <th className="pb-2">Detalhes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getPaymentHistoryItems().map((payment) => (
                        <tr key={payment.id} className="text-white border-t border-white/10">
                          <td className="py-2">{payment.wallet_address}</td>
                          <td className="py-2 text-green-500">${parseFloat(payment.amount).toFixed(2)} USDT</td>
                          <td className="py-2">{new Date(payment.payment_date).toLocaleString()}</td>
                          <td className="py-2">
                            <button
                              onClick={() => fetchWalletDetails(payment.wallet_address)}
                              className="text-purple-400 hover:text-purple-300 transition-colors"
                            >
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-4 w-4" 
                                viewBox="0 0 20 20" 
                                fill="currentColor"
                              >
                                <path 
                                  fillRule="evenodd" 
                                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" 
                                  clipRule="evenodd" 
                                />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Paginação do Histórico de Pagamentos */}
                  {totalPaymentPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-4 pb-2">
                      <button
                        onClick={() => setCurrentPaymentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPaymentPage === 1}
                        className={`px-3 py-1 rounded-lg text-xs ${
                          currentPaymentPage === 1
                            ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                            : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                        }`}
                      >
                        Previous
                      </button>
                      <span className="text-gray-400 text-xs">
                        Page {currentPaymentPage} of {totalPaymentPages}
                      </span>
                      <button
                        onClick={() => setCurrentPaymentPage(prev => Math.min(prev + 1, totalPaymentPages))}
                        disabled={currentPaymentPage === totalPaymentPages}
                        className={`px-3 py-1 rounded-lg text-xs ${
                          currentPaymentPage === totalPaymentPages
                            ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                            : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : activeTab === 'manual-sales' ? (
          <>
            {/* Cards de Estatísticas de Vendas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5 mb-3">
              <div className="bg-white/5 rounded-lg p-3">
                <h3 className="text-white text-xs mb-0.5">Total de Tokens Vendidos no Stage {activeStage?.stage_number}</h3>
                <p className="text-lg font-bold text-purple-500">
                  {activeStage 
                    ? formatLargeNumber(Math.floor(parseFloat(activeStage.raised_value || '0') / parseFloat(activeStage.token_price)).toString()) 
                    : '0'} XSTP
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <h3 className="text-white text-xs mb-0.5">Valor Arrecadado no Stage {activeStage?.stage_number}</h3>
                <p className="text-lg font-bold text-green-500">
                  ${formatLargeNumber(activeStage?.raised_value || '0')}
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <h3 className="text-white text-xs mb-0.5">Valor Restante para Concluir</h3>
                <p className="text-lg font-bold text-yellow-500">
                  ${activeStage 
                      ? formatLargeNumber(Math.max(0, parseFloat(activeStage.target_value) - parseFloat(activeStage.raised_value || '0')).toString())
                      : '0'}
                </p>
              </div>
            </div>

            {/* Formulário de Venda Manual */}
            <div className="bg-white/5 rounded-lg p-3 mb-3">
              <h2 className="text-base font-bold text-white mb-2">Gerenciamento de Vendas</h2>
              
              {/* Campo de USDT */}
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Valor em USDT
                </label>
                <input
                  type="number"
                  value={newManualSale.usdtValue}
                  onChange={(e) => {
                    const usdtValue = e.target.value;
                    setNewManualSale({
                      ...newManualSale,
                      usdtValue: usdtValue,
                      tokenAmount: calculateTokens(usdtValue)
                    });
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-purple-500"
                  placeholder="Ex: 100"
                />
              </div>

              {/* Mostra a quantidade de tokens calculada */}
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Quantidade de Tokens a Receber
                </label>
                <div className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-purple-500 font-semibold">
                  {newManualSale.tokenAmount && !isNaN(parseFloat(newManualSale.tokenAmount))
                    ? `${formatLargeNumber(newManualSale.tokenAmount)} XSTP`
                    : '0 XSTP'
                  }
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Preço atual: ${activeStage?.token_price} USDT por XSTP
                </p>
              </div>

              {/* Campo de descrição */}
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Descrição (opcional)
                </label>
                <input
                  type="text"
                  value={newManualSale.description}
                  onChange={(e) => setNewManualSale({...newManualSale, description: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-purple-500"
                  placeholder="Ex: Venda via PIX"
                />
              </div>

              <button
                onClick={handleAddManualSale}
                disabled={!activeStage || !newManualSale.usdtValue}
                className={`w-full ${
                  activeStage && newManualSale.usdtValue
                    ? 'bg-purple-500 hover:bg-purple-600' 
                    : 'bg-gray-500 cursor-not-allowed'
                } text-white rounded-lg py-1.5 text-sm font-semibold transition-colors`}
              >
                {activeStage 
                  ? 'Registrar Venda Manual' 
                  : 'Selecione um stage active'}
              </button>
            </div>

            {/* Histórico de Vendas Manuais */}
            <div className="bg-white/5 rounded-lg p-3">
              <button
                onClick={() => setShowManualHistory(!showManualHistory)}
                className="w-full flex items-center justify-between text-base font-bold text-white mb-2"
              >
                <span>Histórico de Gerenciamento</span>
                <svg
                  className={`w-5 h-5 transition-transform ${showManualHistory ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showManualHistory && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-400">
                        <th className="pb-2">Data</th>
                        <th className="pb-2">Tokens</th>
                        <th className="pb-2">Valor USDT</th>
                        <th className="pb-2">Descrição</th>
                        <th className="pb-2">Admin</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getManualSalesItems().map((sale) => (
                        <tr key={sale.id} className="text-white border-t border-white/10">
                          <td className="py-2">{new Date(sale.created_at).toLocaleString()}</td>
                          <td className="py-2">{formatLargeNumber(sale.token_amount)} XSTP</td>
                          <td className="py-2">${parseFloat(sale.usdt_value).toFixed(2)}</td>
                          <td className="py-2">{sale.description || '-'}</td>
                          <td className="py-2 text-xs">{sale.admin_wallet}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Paginação do Histórico de Vendas Manuais */}
                  {totalManualPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-4 pb-2">
                      <button
                        onClick={() => setCurrentManualPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentManualPage === 1}
                        className={`px-3 py-1 rounded-lg text-xs ${
                          currentManualPage === 1
                            ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                            : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                        }`}
                      >
                        Previous
                      </button>
                      <span className="text-gray-400 text-xs">
                        Page {currentManualPage} of {totalManualPages}
                      </span>
                      <button
                        onClick={() => setCurrentManualPage(prev => Math.min(prev + 1, totalManualPages))}
                        disabled={currentManualPage === totalManualPages}
                        className={`px-3 py-1 rounded-lg text-xs ${
                          currentManualPage === totalManualPages
                            ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                            : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : activeTab === 'stages' ? (
          <>
            {/* Stage Ativo */}
            <div className="bg-white/5 rounded-lg p-3 mb-3">
              <h2 className="text-base font-bold text-white mb-2">Stage Ativo</h2>
              {activeStage ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-white">Stage {activeStage.stage_number}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-400">Preço do Token</p>
                      <p className="text-white">${activeStage.token_price} USDT</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Total de Tokens</p>
                      <p className="text-white">{formatLargeNumber(activeStage.total_tokens)} XSTP</p>
                    </div>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-400">Contrato BNB</p>
                    <p className="text-white break-all">{activeStage.bnb_contract}</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-400">Contrato USDT</p>
                    <p className="text-white break-all">{activeStage.usdt_contract}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-400">Meta</p>
                      <p className="text-white">${activeStage.target_value.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Arrecadado</p>
                      <p className="text-green-500">
                        ${parseFloat(activeStage.raised_value || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">Nenhum stage active</p>
              )}
            </div>

            {/* Lista de Stages */}
            <div className="bg-white/5 rounded-lg p-3">
              <h2 className="text-base font-bold text-white mb-2">Todos os Stages</h2>
              <div className="grid gap-2">
                {stages.map((stage) => (
                  <div
                    key={stage.stage_number}
                    className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="text-white">Stage {stage.stage_number}</p>
                      <div className="flex gap-4 text-sm text-gray-400">
                        <p>${stage.token_price} USDT</p>
                        <p>Meta: ${stage.target_value.toLocaleString()}</p>
                        {stage.is_active && (
                          <p className="text-green-500">
                            Arrecadado: ${parseFloat(stage.raised_value || 0).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleActivateStage(stage.stage_number)}
                      disabled={stage.is_active || isUpdatingStage}
                      className={`px-3 py-1 rounded text-xs font-semibold ${
                        stage.is_active
                          ? 'bg-green-500 cursor-not-allowed'
                          : isUpdatingStage
                          ? 'bg-purple-300 cursor-wait'
                          : 'bg-purple-500 hover:bg-purple-600'
                      }`}
                    >
                      {stage.is_active 
                        ? 'Ativo' 
                        : isUpdatingStage 
                        ? 'Atualizando...' 
                        : 'Ativar'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Lista de Tokens Pendentes */}
            <div className="bg-white/5 rounded-lg p-3 mb-3">
              <h2 className="text-base font-bold text-white mb-2">Tokens Pendentes de Transferência</h2>
              <div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400">
                      <th className="pb-2 pr-8">Data</th>
                      <th className="pb-2 pr-8">Carteira</th>
                      <th className="pb-2 pr-8">Tokens</th>
                      <th className="pb-2 pr-8">Valor USD</th>
                      <th className="pb-2">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pixTokensPending.map((pending) => (
                      <tr key={pending.id} className="text-white border-t border-white/10">
                        <td className="py-2.5 pr-8">{new Date(pending.created_at).toLocaleString()}</td>
                        <td className="py-2.5 pr-8 break-all">{pending.wallet_address}</td>
                        <td className="py-2.5 pr-8">{formatLargeNumber(pending.token_amount)} XSTP</td>
                        <td className="py-2.5 pr-8">${parseFloat(pending.amount_usd).toFixed(2)}</td>
                        <td className="py-2.5">
                          <button
                            onClick={() => handleTokenTransfer(pending)}
                            disabled={processingTokenTransfer === pending.transaction_id}
                            className={`
                              px-3 py-1 rounded text-xs font-semibold min-w-[90px]
                              ${processingTokenTransfer === pending.transaction_id
                                ? 'bg-gray-500 cursor-not-allowed'
                                : 'bg-green-500 hover:bg-green-600'
                              }
                            `}
                          >
                            {processingTokenTransfer === pending.transaction_id ? 'Processando...' : 'Transferir'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Histórico de Transferências */}
            <div className="bg-white/5 rounded-lg p-3">
              <button
                onClick={() => setShowPixHistory(!showPixHistory)}
                className="w-full flex items-center justify-between text-base font-bold text-white mb-2"
              >
                <span>Histórico de Transferências</span>
                <svg
                  className={`w-5 h-5 transition-transform ${showPixHistory ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showPixHistory && (
                <div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-400">
                        <th className="pb-2 pr-8">Data</th>
                        <th className="pb-2 pr-8">Carteira</th>
                        <th className="pb-2 pr-8">Tokens</th>
                        <th className="pb-2 pr-8">Valor USD</th>
                        <th className="pb-2">Admin</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pixTokensPaid.map((paid) => (
                        <tr key={paid.id} className="text-white border-t border-white/10">
                          <td className="py-2.5 pr-8">{new Date(paid.paid_at).toLocaleString()}</td>
                          <td className="py-2.5 pr-8 break-all">{paid.wallet_address}</td>
                          <td className="py-2.5 pr-8">{formatLargeNumber(paid.token_amount)} XSTP</td>
                          <td className="py-2.5 pr-8">${parseFloat(paid.amount_usd).toFixed(2)}</td>
                          <td className="py-2.5 break-all text-xs">{paid.admin_wallet}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* Modal de Detalhes */}
        {showDetailsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-stone-900 rounded-lg p-3 max-w-sm w-full mx-4">
              <h3 className="text-base font-bold text-white mb-2">Wallet Details</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-gray-400 text-xs">Wallet</p>
                  <p className="text-white text-sm">{selectedWallet}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Name</p>
                  <p className="text-white text-sm">{walletDetails?.name || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Email</p>
                  <p className="text-white text-sm">{walletDetails?.email || 'Not provided'}</p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-lg py-1.5 text-sm font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Confirmação */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-stone-900 border border-purple-500/20 rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4 text-center">
                Confirmar Ativação
              </h3>
              <p className="text-gray-300 text-center mb-6">
                Deseja ativar o Stage {selectedStageNumber}?
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmActivateStage}
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Sucesso */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-stone-900 border border-green-500/20 rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-white text-lg font-semibold text-center">
                  Stage {selectedStageNumber} activated successfully!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Core;