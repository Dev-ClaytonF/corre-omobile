import { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useAccount } from 'wagmi';
import { supabase } from '../utils/supabase';
import { useNavigate } from 'react-router-dom';

interface TransactionStatus {
  id: string;
  status: 'pending' | 'paid' | 'failed';
  qr_code: string;
  value: number;
}

interface CustomerData {
  name: string;
  email: string;
  phone: string;
  cpf: string;
}

interface Timer {
  minutes: number;
  seconds: number;
}

interface ExchangeRates {
  usdValue: number | null;
  xstpQuantity: number | null;
  xstpPrice: number | null;
}

const BlankPage = () => {
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [manualWallet, setManualWallet] = useState('');
  const [showWalletWarning, setShowWalletWarning] = useState(false);
  const [isLoadingWallet, setIsLoadingWallet] = useState(false);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Modal de Notificação
  const NotificationModal = () => {
    if (!showNotification) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[60]">
        <div className="bg-black border border-purple-500/20 rounded-2xl p-6 max-w-md w-full mx-4">
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20">
              <p className="text-center text-yellow-500 text-sm">
                Integração em fase de adequação. Valor Máximo por compra R$150. Se necessario, faça mais de uma compra!
              </p>
            </div>
            <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/20">
              <p className="text-center text-purple-400 text-sm">
                Os Tokens serão enviados para sua wallet, dentro de "1 hora" em horário comercial. Motivo ADEQUAÇÃO de web3/web2
              </p>
            </div>
            <button
              onClick={() => setShowNotification(false)}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Entendi
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Wallet Warning Modal para Mobile
  const WalletWarningModal = () => {
    if (!showWalletWarning || !isMobile) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[60]">
        <div className="bg-black border border-yellow-500/20 rounded-2xl p-6 max-w-md w-full mx-4">
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20">
              <p className="text-center text-yellow-500 text-sm">
                Importante: Insira sua wallet manualmente e verifique cuidadosamente o endereço antes de prosseguir com a compra.
              </p>
            </div>
            <button
              onClick={() => setShowWalletWarning(false)}
              className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Entendi
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Efeito para verificar a conexão inicial
  useEffect(() => {
    console.log('Connection status:', {
      isConnected,
      address,
      isInitialLoad,
      isMobile
    });

    // Em dispositivos móveis, apenas mostra o aviso
    if (isMobile && !isConnected) {
      setShowWalletWarning(true);
      setIsInitialLoad(false);
      return;
    }

    // Em desktop, mantém o comportamento original
    if (!isMobile) {
      const timer = setTimeout(() => {
        setIsInitialLoad(false);
        if (!isConnected && !isInitialLoad) {
          console.log('Redirecting: Not connected after initial load');
          navigate('/presale');
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isConnected, address, navigate, isInitialLoad, isMobile]);

  // Listener para o evento de desconexão da wallet
  useEffect(() => {
    const handleWalletDisconnect = () => {
      console.log('Wallet disconnected event triggered');
      navigate('/presale');
    };

    window.addEventListener('walletDisconnected', handleWalletDisconnect);

    return () => {
      window.removeEventListener('walletDisconnected', handleWalletDisconnect);
    };
  }, [navigate]);

  const [amount, setAmount] = useState<string>('');
  const [transaction, setTransaction] = useState<TransactionStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isOpen, setIsOpen] = useState(true);
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: '',
    email: '',
    phone: '',
    cpf: ''
  });
  const [timer, setTimer] = useState<Timer>({ minutes: 5, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({
    usdValue: null,
    xstpQuantity: null,
    xstpPrice: null
  });
  const [referralCode, setReferralCode] = useState<string | null>(null);

  const handleCustomerDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Função para formatar CPF
  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  // Função para formatar telefone
  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const formatTime = (time: number) => time.toString().padStart(2, '0');

  useEffect(() => {
    if (transaction && !isExpired && transaction.status !== 'paid') {
      intervalRef.current = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer.minutes === 0 && prevTimer.seconds === 0) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setIsExpired(true);
            return prevTimer;
          }

          const newSeconds = prevTimer.seconds === 0 ? 59 : prevTimer.seconds - 1;
          const newMinutes = prevTimer.seconds === 0 ? prevTimer.minutes - 1 : prevTimer.minutes;

          return { minutes: newMinutes, seconds: newSeconds };
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [transaction, isExpired, transaction?.status]);

  // Função para buscar o preço do XSTP no Supabase
  const fetchXSTPPrice = async () => {
    try {
      const { data, error } = await supabase
        .from('sale_stages')
        .select('token_price')
        .eq('is_active', true)
        .single();

      if (error) throw error;
      
      if (data) {
        return data.token_price;
      }
      
      throw new Error('No active price found');
    } catch (error) {
      console.error('Error fetching XSTP price:', error);
      return null;
    }
  };

  // Função para buscar cotação do dólar
  const fetchUSDRate = async () => {
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      return data.rates.BRL;
    } catch (error) {
      console.error('Error fetching USD rate:', error);
      return null;
    }
  };

  // Efeito para atualizar valores quando o amount mudar
  useEffect(() => {
    const updateRates = async () => {
      if (amount && !isNaN(parseFloat(amount))) {
        const [usdRate, xstpPrice] = await Promise.all([
          fetchUSDRate(),
          fetchXSTPPrice()
        ]);

        if (usdRate && xstpPrice) {
          const amountInBRL = parseFloat(amount);
          const usdValue = amountInBRL / usdRate;
          const xstpQuantity = usdValue / xstpPrice;
          
          setExchangeRates({
            usdValue,
            xstpQuantity,
            xstpPrice
          });
        }
      } else {
        setExchangeRates({
          usdValue: null,
          xstpQuantity: null,
          xstpPrice: null
        });
      }
    };

    updateRates();
  }, [amount]);

  // Função para buscar o código de referral
  useEffect(() => {
    const fetchReferralCode = async () => {
      if (!address) return;

      try {
        const { data, error } = await supabase
          .from('wallets')
          .select('id, referral_used')
          .eq('wallet_address', address)
          .single();

        if (error) {
          console.error('Error fetching referral:', error);
          return;
        }

        if (data?.referral_used) {
          setReferralCode(data.referral_used);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchReferralCode();
  }, [address]);

  // Função para validar endereço de wallet
  const isValidWalletAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  // Função para obter o endereço da wallet (conectada ou manual)
  const getWalletAddress = () => {
    if (isMobile && !isConnected) {
      return manualWallet;
    }
    return address;
  };

  // Função para buscar o referral quando uma wallet válida é inserida manualmente
  const fetchReferralForManualWallet = async (walletAddress: string) => {
    if (!isValidWalletAddress(walletAddress)) return;
    
    setIsLoadingWallet(true);
    try {
      console.log('Buscando referral para wallet:', walletAddress);
      
      const { data, error } = await supabase
        .from('wallets')
        .select('referral_used')
        .eq('wallet_address', walletAddress.toLowerCase())
        .single();

      if (error) {
        console.error('Error fetching referral:', error);
        return;
      }

      console.log('Dados encontrados:', data);

      if (data?.referral_used) {
        console.log('Referral encontrado:', data.referral_used);
        setReferralCode(data.referral_used);
      } else {
        console.log('Nenhum referral encontrado');
        setReferralCode(null);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoadingWallet(false);
    }
  };

  // Modificar o input da wallet para incluir a busca de referral
  const handleManualWalletChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWalletAddress = e.target.value;
    setManualWallet(newWalletAddress);
    
    // Limpa o referral atual quando o endereço é alterado
    setReferralCode(null);
    
    // Se for um endereço válido, busca o referral
    if (isValidWalletAddress(newWalletAddress)) {
      await fetchReferralForManualWallet(newWalletAddress);
    }
  };

  const generatePix = async () => {
    const currentWalletAddress = getWalletAddress();

    if (!customerData.name || !customerData.email || !customerData.phone || !customerData.cpf || !currentWalletAddress) {
      setError('Please fill in all fields and provide a wallet address');
      return;
    }

    if (isMobile && !isConnected && !isValidWalletAddress(manualWallet)) {
      setError('Please enter a valid wallet address');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://api.pushinpay.com.br/api/pix/cashIn', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_PUSHINPAY_API_KEY}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          value: Math.round(parseFloat(amount) * 100),
          webhook_url: window.location.origin + '/webhook',
          description: `PIX Payment - ${customerData.name}`,
          external_id: Date.now().toString(),
          customer: {
            name: customerData.name,
            email: customerData.email,
            phone: customerData.phone,
            document: customerData.cpf.replace(/\D/g, ''),
            wallet: currentWalletAddress
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate PIX');
      }

      const data = await response.json();
      setTransaction({
        id: data.id,
        status: 'pending',
        qr_code: data.qr_code,
        value: parseFloat(amount)
      });

      // Inicia verificação do status
      checkIntervalRef.current = setInterval(async () => {
        try {
          const checkResponse = await fetch(`https://api.pushinpay.com.br/api/transactions/${data.id}`, {
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_PUSHINPAY_API_KEY}`,
              'Accept': 'application/json'
            }
          });

          if (!checkResponse.ok) {
            throw new Error('Failed to verify status');
          }

          const statusData = await checkResponse.json();
          if (statusData.status === 'paid') {
            setTransaction(prev => prev ? { ...prev, status: 'paid' } : null);
            setIsExpired(true);
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);

            try {
              // Salva a transação no Supabase
              const { error: transactionError } = await supabase
                .from('pix_transactions')
                .insert({
                  transaction_id: data.id,
                  name: customerData.name,
                  email: customerData.email,
                  cpf: customerData.cpf,
                  phone: customerData.phone,
                  wallet_address: currentWalletAddress,
                  amount_brl: parseFloat(amount),
                  amount_usd: exchangeRates.usdValue,
                  xstp_quantity: exchangeRates.xstpQuantity,
                  referral_code: referralCode,
                  created_at: new Date().toISOString(),
                  status: 'paid'
                });

              if (transactionError) throw transactionError;

              // Atualiza o raised_value na tabela sale_stages com o valor em USD
              const usdAmount = exchangeRates.usdValue;
              if (usdAmount) {
                const { data: activeStage, error: stageError } = await supabase
                  .from('sale_stages')
                  .select('raised_value')
                  .eq('is_active', true)
                  .single();

                if (stageError) throw stageError;

                if (activeStage) {
                  const newRaisedValue = (parseFloat(activeStage.raised_value || '0') + usdAmount).toFixed(2);
                  const { error: updateError } = await supabase
                    .from('sale_stages')
                    .update({ raised_value: newRaisedValue })
                    .eq('is_active', true);

                  if (updateError) throw updateError;
                }
              }

              // Se tem código de referral e está pago, processa o referral
              if (referralCode && exchangeRates.usdValue !== null) {
                try {
                  // Busca a wallet do referral
                  const { data: referrerData } = await supabase
                    .from('wallets')
                    .select('wallet_address')
                    .eq('referral_code', referralCode)
                    .single();

                  if (referrerData) {
                    // Calcula 5% do valor em USD
                    const referralEarnings = exchangeRates.usdValue * 0.05;

                    // Busca o valor pendente atual
                    const { data: currentPending } = await supabase
                      .from('pending_referral_earnings')
                      .select('pending_amount')
                      .eq('wallet_address', referrerData.wallet_address)
                      .single();

                    // Calcula o novo valor total
                    const currentAmount = currentPending ? parseFloat(currentPending.pending_amount) : 0;
                    const newTotalAmount = (currentAmount + referralEarnings).toFixed(2);

                    // Força a criação de um novo registro se não existir
                    const { error: pendingError } = await supabase
                      .from('pending_referral_earnings')
                      .upsert([{
                        wallet_address: referrerData.wallet_address,
                        pending_amount: newTotalAmount,
                        last_updated: new Date().toISOString()
                      }], {
                        onConflict: 'wallet_address'
                      });

                    if (pendingError) {
                      console.error('Error updating pending amount:', pendingError);
                      throw pendingError;
                    }

                    console.log('Referral earnings updated:', {
                      referralCode: referralCode,
                      earnings: referralEarnings,
                      newTotal: newTotalAmount,
                      walletAddress: referrerData.wallet_address
                    });
                  }
                } catch (error) {
                  console.error('Error processing referral:', error);
                }
              }
            } catch (error) {
              console.error('Erro ao processar pagamento:', error);
            }
          }
        } catch (err) {
          console.error('Erro ao verificar status:', err);
        }
      }, 5000);
    } catch (err) {
      setError('Erro ao gerar o PIX. Tente novamente.');
      console.error('Erro detalhado:', err);
    } finally {
      setLoading(false);
    }
  };

  // Função para fechar o modal e limpar os estados
  const handleClose = () => {
    setIsOpen(false);
    // Limpa os intervalos se existirem
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
    // Redireciona para a página anterior
    window.history.back();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-[40px] left-0 right-0 bottom-0 bg-black/80 overflow-auto flex items-center justify-center p-2">
      <div className="max-w-lg w-full bg-black border border-purple-500/20 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-white">Checkout</h1>
              <p className="text-zinc-400 text-xs mt-0.5">Complete your information to generate the PIX</p>
            </div>
            {referralCode && (
              <div className="text-right">
                <span className="text-xs text-gray-400">Active Code</span>
                <p className="text-sm text-purple-400 font-medium">{referralCode}</p>
              </div>
            )}
          </div>
        </div>

        {!transaction ? (
          // Formulário
          <div className="p-4 space-y-4">
            {/* Wallet */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                {isMobile && !isConnected ? 'Wallet Address' : 'Connected Wallet'}
              </label>
              {isMobile && !isConnected ? (
                <div className="relative">
                  <input
                    type="text"
                    value={manualWallet}
                    onChange={handleManualWalletChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500"
                    placeholder="Enter your wallet address (0x...)"
                  />
                  {isLoadingWallet && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-purple-500 border-t-transparent"></div>
                    </div>
                  )}
                  {manualWallet && !isValidWalletAddress(manualWallet) && (
                    <p className="text-red-400 text-xs mt-1">Please enter a valid wallet address</p>
                  )}
                </div>
              ) : (
                <div className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 break-all">
                  <p className="text-sm text-gray-300 font-mono">
                    {address || 'Wallet not connected'}
                  </p>
                </div>
              )}
            </div>

            {/* Dados Pessoais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={customerData.name}
                  onChange={handleCustomerDataChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">E-mail</label>
                <input
                  type="email"
                  name="email"
                  value={customerData.email}
                  onChange={handleCustomerDataChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={customerData.phone}
                  onChange={(e) => setCustomerData(prev => ({
                    ...prev,
                    phone: formatPhone(e.target.value)
                  }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500"
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">CPF</label>
                <input
                  type="text"
                  name="cpf"
                  value={customerData.cpf}
                  onChange={(e) => setCustomerData(prev => ({
                    ...prev,
                    cpf: formatCPF(e.target.value)
                  }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500"
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
              </div>
            </div>

            {/* Adicionar após o input do CPF e antes do Valor */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-start p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="ml-2">
                  <h4 className="text-xs font-medium text-yellow-500">Payment Attention</h4>
                  <p className="mt-0.5 text-xs text-yellow-400/80">
                    For your security, please make the PIX payment using the same bank account linked to the provided CPF.
                  </p>
                </div>
              </div>
            </div>

            {/* Valor */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Payment Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">R$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 pl-10 py-2.5 text-white focus:outline-none focus:border-purple-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="0,00"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Conversões */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Value in USD</label>
                  <div className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-sm text-gray-300">
                      {exchangeRates.usdValue 
                        ? `$ ${exchangeRates.usdValue.toFixed(2)}` 
                        : '$ 0.00'}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">XSTP Quantity</label>
                  <div className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-sm text-gray-300">
                      {exchangeRates.xstpQuantity 
                        ? `${exchangeRates.xstpQuantity.toFixed(2)} XSTP` 
                        : '0.00 XSTP'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Botão Gerar */}
            <button
              onClick={generatePix}
              disabled={loading || !amount || !customerData.name || !customerData.email || !customerData.phone || !customerData.cpf}
              className="w-full py-3 px-4 rounded-full font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating PIX...' : 'Generate PIX'}
            </button>
          </div>
        ) : (
          // Resultado do PIX
          <div className="p-4 space-y-4">
            {/* Timer */}
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">Time remaining for payment</p>
              <div className={`text-xl font-bold ${
                timer.minutes === 0 && timer.seconds <= 30 ? 'text-red-400' : 'text-white'
              }`}>
                {formatTime(timer.minutes)}:{formatTime(timer.seconds)}
              </div>
            </div>

            {/* QR Code */}
            <div className="bg-white p-4 rounded-lg flex justify-center">
              <QRCodeSVG
                value={transaction.qr_code}
                size={180}
                level="H"
                includeMargin={true}
                className="mx-auto"
              />
            </div>

            <div className="space-y-3">
              {/* Código PIX */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">PIX Code</label>
                <div className="flex">
                  <input
                    type="text"
                    readOnly
                    value={transaction.qr_code}
                    className="flex-1 p-3 rounded-l-lg bg-zinc-800 text-gray-300 text-sm border border-zinc-700"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(transaction.qr_code);
                      // Feedback visual de cópia
                      const button = document.activeElement as HTMLButtonElement;
                      if (button) {
                        const originalText = button.innerHTML;
                        button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>';
                        setTimeout(() => button.innerHTML = originalText, 2000);
                      }
                    }}
                    className="px-4 bg-zinc-700 rounded-r-lg hover:bg-zinc-600 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Status */}
              <div className="flex justify-between items-center p-3 bg-zinc-800 rounded-lg">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  transaction.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                  isExpired ? 'bg-red-500/20 text-red-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {transaction.status === 'paid' ? 'Paid' :
                   isExpired ? 'Expired' : 'Awaiting Payment'}
                </span>
                {transaction.status !== 'paid' && !isExpired && (
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {/* Automatic verification message */}
              {!isExpired && transaction.status !== 'paid' && (
                <div className="p-3 bg-zinc-800/50 rounded-lg flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-gray-400 text-sm">Verifying payment automatically...</span>
                </div>
              )}

              {/* Expiration message */}
              {isExpired && transaction.status !== 'paid' && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-sm">
                    The payment time has expired. Please generate a new PIX code.
                  </p>
                </div>
              )}

              {/* Success message */}
              {transaction.status === 'paid' && (
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-green-400 text-sm">
                      Payment confirmed successfully!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="p-3 mx-4 mb-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-xs">{error}</p>
          </div>
        )}
      </div>
      <NotificationModal />
      <WalletWarningModal />
    </div>
  );
};

export default BlankPage; 