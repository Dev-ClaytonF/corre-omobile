import { useState, useEffect } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { ethers } from 'ethers';
import { savePurchaseWithReferral, updateRaisedValue } from '../utils/supabase';
import {
    USDT_TOKEN_ADDRESS,
    BNB_CONTRACT_ABI,
    USDT_CONTRACT_ABI,
    USDT_TOKEN_ABI,
    fetchActiveStage,
    initializeWebSocket
} from '../config/contracts';
import { useNavigate } from 'react-router-dom';
import { IMAGES } from '../config/images';

declare global {
    interface Window {
        ethereum: any;
    }
}

interface BuyTokenModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type TransactionStatus = 'idle' | 'waiting_approval' | 'pending' | 'confirming' | 'success' | 'error';

const BuyTokenModal = ({ isOpen, onClose }: BuyTokenModalProps) => {
    const activeAccount = useActiveAccount();
    const [paymentMethod, setPaymentMethod] = useState<'BNB' | 'USDT'>('BNB');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [activeStage, setActiveStage] = useState<any>(null);
    const [bnbPrice, setBnbPrice] = useState<number>(0);
    const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>('idle');
    const [statusMessage, setStatusMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Carrega o estágio inicial
        const loadActiveStage = async () => {
            const stage = await fetchActiveStage();
            if (stage) {
                setActiveStage(stage);
            }
        };
        
        loadActiveStage();

        // Inicia o websocket
        const cleanup = initializeWebSocket((stage) => {
            if (stage) {
                setActiveStage(stage);
            }
        });

        // Limpa o websocket quando o componente é desmontado
        return cleanup;
    }, []);

    useEffect(() => {
        const fetchBnbPrice = async () => {
            try {
                const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT');
                const data = await response.json();
                setBnbPrice(parseFloat(data.price));
            } catch (error) {
                console.error('Error fetching BNB price:', error);
                setBnbPrice(300);
            }
        };

        fetchBnbPrice();
        const interval = setInterval(fetchBnbPrice, 30000);
        return () => clearInterval(interval);
    }, []);

    const calculateBnbRate = () => {
        if (!bnbPrice || !activeStage) return 0;
        return activeStage.token_price / bnbPrice;
    };

    const calculateTokens = () => {
        if (!amount || !activeStage) return '0';
        let calculatedTokens: number;
        if (paymentMethod === 'BNB') {
            const amountInUsdt = parseFloat(amount) * bnbPrice;
            calculatedTokens = amountInUsdt / activeStage.token_price;

            // Aplica a taxa de 2.01% APENAS para BNB
            const fee = 2.01 / 100;
            calculatedTokens = calculatedTokens * (1 - fee);
        } else {
            calculatedTokens = parseFloat(amount) / activeStage.token_price;
        }

        return calculatedTokens.toLocaleString('en-US', { maximumFractionDigits: 1 });
    };

    // Função para verificar se a compra excede o limite do estágio
    const checkStageLimits = (amountInUsdt: number): boolean => {
        if (!activeStage) return false;
        
        const currentRaised = parseFloat(activeStage.raised_value);
        const targetValue = parseFloat(activeStage.target_value);
        const remainingValue = targetValue - currentRaised;
        
        return amountInUsdt <= remainingValue;
    };

    // Função para formatar números grandes
    const formatLargeNumber = (num: string | number): string => {
        const value = typeof num === 'string' ? parseFloat(num) : num;
        const integerPart = Math.floor(value); // Remove apenas as casas decimais
        return integerPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const getPriceInfo = () => {
        if (paymentMethod === 'BNB') {
            return `1 XSTP = ${calculateBnbRate().toFixed(8)} BNB (${activeStage.token_price} USDT)`;
        }
        return `1 XSTP = ${activeStage.token_price} USDT`;
    };

    // Função para aprovar gastos de USDT
    const approveUSDT = async (amount: string) => {
        if (!activeAccount || !window.ethereum || !activeStage) return;

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const usdtContract = new ethers.Contract(
                USDT_TOKEN_ADDRESS,
                USDT_TOKEN_ABI,
                signer
            );

            const valueInWei = ethers.parseUnits(amount, 18);

            // Limpa o endereço removendo espaços e caracteres especiais
            const cleanContractAddress = activeStage.usdt_contract.trim();

            const tx = await usdtContract.approve(
                cleanContractAddress,
                valueInWei
            );

            return tx.hash;
        } catch (error: any) {
            console.error('Error approving USDT:', error);
            const errorMessage = error.message?.toLowerCase() || '';
            const errorReason = (error.reason || '').toLowerCase();
            
            if (error.code === 4001 || 
                error.code === 'ACTION_REJECTED' || 
                errorMessage.includes('user rejected') ||
                errorMessage.includes('user denied') ||
                errorMessage.includes('denied transaction') ||
                errorMessage.includes('rejected by') ||
                errorMessage.includes('rejection') ||
                errorMessage.includes('cancelled') ||
                errorMessage.includes('metamask tx signature: user denied') ||
                errorMessage.includes('transaction was rejected') ||
                errorReason.includes('rejected') ||
                errorReason.includes('denied')) {
                updateStatus('error', 'Transaction rejected by user');
                return false;
            }
            
            if (errorMessage.includes('insufficient funds') || 
                errorMessage.includes('insufficient balance') ||
                errorMessage.includes('exceeds balance')) {
                updateStatus('error', 'You do not have enough balance to cover the transaction');
            } else if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
                updateStatus('error', 'Error: High gas fee. Please try again later.');
            } else if (error.code === 'CALL_EXCEPTION' && !errorMessage.includes('transfer amount exceeds balance')) {
                updateStatus('error', 'Error buying with USDT. Please verify if you have enough USDT and if approval was done correctly.');
            } else {
                updateStatus('error', 'An error occurred while processing your purchase. Please try again.');
            }
            return false;
        }
    };

    // Função para comprar com USDT
    const buyWithUSDT = async () => {
        if (!activeAccount || !window.ethereum || !activeStage) return;

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const cleanContractAddress = activeStage.usdt_contract.trim();

            const contract = new ethers.Contract(
                cleanContractAddress,
                USDT_CONTRACT_ABI,
                signer
            );

            const tokenAmount = calculateTokens();
            const cleanAmount = tokenAmount.replace(/,/g, '');
            const wholeNumber = ethers.parseUnits(cleanAmount, 18);

            console.log('Token amount to be sent:', wholeNumber.toString());

            // Adiciona um pequeno delay antes de enviar a transação
            await new Promise(resolve => setTimeout(resolve, 2000));

            try {
                const tx = await contract.buyTokens(
                    wholeNumber,
                    { gasLimit: 200000 } // Definindo um gasLimit explícito
                );

                if (tx && tx.hash) {
                    try {
                        console.log('Saving USDT purchase:', {
                            wallet: activeAccount.address,
                            hash: tx.hash,
                            amount,
                            tokens: tokenAmount.toString()
                        });

                        await savePurchaseWithReferral(
                            activeAccount.address,
                            tx.hash,
                            amount,
                            'USDT',
                            tokenAmount.toString()
                        );

                        // Após a compra ser bem-sucedida
                        await updateRaisedValue(amount);
                    } catch (saveError) {
                        console.error('Failed to save USDT purchase:', saveError);
                    }
                }

                return tx.hash;
            } catch (txError: any) {
                console.error('Transaction error:', txError);
                
                // Tratamento específico para o erro de transação pendente
                if (txError.message?.includes('Request of type') && 
                    txError.message?.includes('already pending')) {
                    updateStatus('error', 'There is a pending transaction. Please wait for completion or reject the previous transaction in MetaMask.');
                    return false;
                }

                // Outros erros comuns
                if (txError.code === 'UNPREDICTABLE_GAS_LIMIT') {
                    updateStatus('error', 'Error estimating gas. Please try again in a few moments.');
                } else if (txError.message?.includes('insufficient funds')) {
                    updateStatus('error', 'Insufficient balance to complete the transaction.');
                } else {
                    updateStatus('error', 'Transaction error. Please try again.');
                }
                return false;
            }
        } catch (error: any) {
            console.error('Error in buyWithUSDT:', error);
            
            // Tratamento de erros gerais
            if (error.code === 4001 || error.message?.includes('user rejected')) {
                    updateStatus('error', 'Transaction rejected by user');
                } else {
                    updateStatus('error', 'Error processing purchase. Please try again in a few moments.');
            }
            return false;
        }
    };

    // Função para comprar com BNB
    const buyWithBNB = async (amount: string) => {
        if (!activeAccount || !window.ethereum || !activeStage) return;

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const cleanContractAddress = activeStage.bnb_contract.trim();

            const contract = new ethers.Contract(
                cleanContractAddress,
                BNB_CONTRACT_ABI,
                signer
            );

            const valueInWei = ethers.parseUnits(amount, 18);

            const tx = await contract.buyTokens({
                value: valueInWei
            });

            if (tx && tx.hash) {
                try {
                    console.log('Saving BNB purchase:', {
                        wallet: activeAccount.address,
                        hash: tx.hash,
                        amount,
                        tokens: calculateTokens().toString()
                    });

                    await savePurchaseWithReferral(
                        activeAccount.address,
                        tx.hash,
                        amount,
                        'BNB',
                        calculateTokens().toString()
                    );

                    // Após a compra ser bem-sucedida
                    await updateRaisedValue(amount, true);
                } catch (saveError) {
                    console.error('Failed to save BNB purchase:', saveError);
                    // Continua com a transação mesmo se falhar o salvamento
                }
            }

            return tx.hash;
        } catch (error: any) {
            console.error('Error buying with BNB:', error);

            if (error.code === 4001 || error.code === 'ACTION_REJECTED' || error.message?.includes('user rejected')) {
                updateStatus('error', 'Transaction rejected by user');
            } else if (error.message?.toLowerCase().includes('insufficient funds') || 
                      error.message?.toLowerCase().includes('insufficient balance') ||
                      error.message?.toLowerCase().includes('exceeds balance')) {
                updateStatus('error', 'You do not have enough balance to cover the transaction');
            } else if (error.code === 'UNPREDICTABLE_GAS_LIMIT' || error.message?.includes('gas') || error.message?.includes('Gas')) {
                updateStatus('error', 'Error: High gas fee. Please try again later.');
            } else if (error.code === 'CALL_EXCEPTION') {
                updateStatus('error', 'Transaction failed. Please verify if you have enough BNB for the purchase and for the gas fees');
            } else {
                updateStatus('error', 'Error processing purchase: ' + error.message);
            }

            return false;
        }
    };

    // Função para verificar saldo de BNB
    const checkBNBBalance = async (amount: string) => {
        if (!activeAccount || !window.ethereum) return false;

        try {
            // Configurando o provider com a rede BSC
            const provider = new ethers.BrowserProvider(window.ethereum);
            
            // Verificando se está na rede correta
            const network = await provider.getNetwork();
            if (network.chainId !== 56n) {
                console.error('Please connect to BSC network');
                return false;
            }

            const balance = await provider.getBalance(activeAccount.address);
            const amountInWei = ethers.parseUnits(amount, 18);

            // Adiciona 10% extra para cobrir gas
            const amountWithGas = amountInWei + (amountInWei * BigInt(10) / BigInt(100));

            console.log('BNB Balance:', ethers.formatEther(balance));
            console.log('Required amount (with gas):', ethers.formatEther(amountWithGas));

            return balance >= amountWithGas;
        } catch (error) {
            console.error('Error checking BNB balance:', error);
            // Se houver erro de RPC, tenta mudar para a BSC
            //@ts-ignore
            if (error.message?.includes('Invalid RPC URL')) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0x38' }], // BSC chainId em hex
                    });
                } catch (switchError: any) {
                    // Se a rede BSC não estiver configurada, adiciona ela
                    if (switchError.code === 4902) {
                        try {
                            await window.ethereum.request({
                                method: 'wallet_addEthereumChain',
                                params: [
                                    {
                                        chainId: '0x38',
                                        chainName: 'Binance Smart Chain',
                                        nativeCurrency: {
                                            name: 'BNB',
                                            symbol: 'BNB',
                                            decimals: 18
                                        },
                                        rpcUrls: ['https://bsc-dataseed.binance.org'],
                                        blockExplorerUrls: ['https://bscscan.com']
                                    }
                                ]
                            });
                        } catch (addError) {
                            console.error('Error adding BSC network:', addError);
                        }
                    }
                }
            }
            return false;
        }
    };

    // Função para verificar saldo de USDT
    const checkUSDTBalance = async (amount: string) => {
        try {
            if (!activeAccount?.address) {
                console.error('No active account');
                return false;
            }

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const network = await provider.getNetwork();
            
            // Verifica se está na BSC
            if (network.chainId !== 56n) {
                console.error('Please connect to BSC network');
                return false;
            }

            const usdtContract = new ethers.Contract(
                USDT_TOKEN_ADDRESS,
                USDT_TOKEN_ABI,
                signer
            );

            try {
                const balance = await usdtContract.balanceOf(activeAccount.address);
                const amountInWei = ethers.parseUnits(amount, 18);
                console.log('USDT Balance:', ethers.formatUnits(balance, 18));
                console.log('Required amount:', amount);
                
                return balance >= amountInWei;
            } catch (contractError) {
                console.error('Contract call error:', contractError);
                return false;
            }
        } catch (error) {
            console.error('Error checking USDT balance:', error);
            return false;
        }
    };

    const updateStatus = (status: TransactionStatus, message: string) => {
        setTransactionStatus(status);
        setStatusMessage(message);
    };

    const handleBuy = async () => {
        if (!activeAccount) {
            alert('Please connect your wallet first');
            return;
        }

        if (!amount) return;

        // Calcula o valor em USDT
        const amountInUsdt = paymentMethod === 'BNB' 
            ? parseFloat(amount) * bnbPrice
            : parseFloat(amount);

        // Verifica se a compra excede o limite do estágio
        if (!checkStageLimits(amountInUsdt)) {
            const currentRaised = parseFloat(activeStage?.raised_value || '0');
            const targetValue = parseFloat(activeStage?.target_value || '0');
            const remainingValue = targetValue - currentRaised;
            updateStatus('error', `Value exceeds the available limit of the stage. Maximum allowed value: $${formatLargeNumber(remainingValue)} USDT`);
            return;
        }

        setLoading(true);
        setTransactionStatus('waiting_approval');
        setStatusMessage('Waiting for wallet approval...');

        try {
            const hasBalance = paymentMethod === 'BNB' 
                ? await checkBNBBalance(amount)
                : await checkUSDTBalance(amount);

                if (!hasBalance) {
                    updateStatus('error', 'Insufficient balance to perform the transaction');
                return;
            }

            let txHash;
            const provider = new ethers.BrowserProvider(window.ethereum);
            
            if (paymentMethod === 'BNB') {
                txHash = await buyWithBNB(amount);
                if (txHash) {
                    updateStatus('pending', 'Transaction sent! Waiting for confirmation...');
                    
                    const receipt = await provider.waitForTransaction(txHash);
                    if (receipt && receipt.status === 1) {
                        updateStatus('confirming', 'Verifying received tokens...');
                        
                        try {
                            console.log('Starting BNB purchase saving:', {
                                wallet: activeAccount.address,
                                hash: txHash,
                                amount,
                                tokens: calculateTokens().toString()
                            });

                            const saveResult = await savePurchaseWithReferral(
                                activeAccount.address,
                                txHash,
                                amount,
                                'BNB',
                                calculateTokens().toString()
                            );

                            console.log('BNB purchase saving result:', saveResult);

                            if (!saveResult) {
                                console.error('Failed to save BNB purchase in the database');
                            }

                            updateStatus('success', `Purchase successful! You will receive ${calculateTokens()} XSTP`);
                        } catch (error) {
                            console.error('Error saving BNB purchase:', error);
                            updateStatus('success', `Purchase successful! You will receive ${calculateTokens()} XSTP`);
                        }
                    }
                }
            } else {
                updateStatus('waiting_approval', 'Waiting for USDT approval...');
                const approveTxHash = await approveUSDT(amount);
                if (approveTxHash) {
                    updateStatus('pending', 'Approval sent! Waiting for confirmation...');
                    const approveReceipt = await provider.waitForTransaction(approveTxHash);
                    if (approveReceipt && approveReceipt.status === 1) {
                        updateStatus('waiting_approval', 'Approval confirmed! Waiting for purchase confirmation...');
                        
                        txHash = await buyWithUSDT();
                        if (txHash) {
                            updateStatus('pending', 'Purchase transaction sent! Waiting for confirmation...');
                            
                            const receipt = await provider.waitForTransaction(txHash);
                            if (receipt && receipt.status === 1) {
                                updateStatus('confirming', 'Verifying received tokens...');
                                
                                try {
                                    console.log('Starting USDT purchase saving:', {
                                        wallet: activeAccount.address,
                                        hash: txHash,
                                        amount,
                                        tokens: calculateTokens().toString()
                                    });

                                    const saveResult = await savePurchaseWithReferral(
                                        activeAccount.address,
                                        txHash,
                                        amount,
                                        'USDT',
                                        calculateTokens().toString()
                                    );

                                    console.log('USDT purchase saving result:', saveResult);

                                    if (!saveResult) {
                                        console.error('Failed to save USDT purchase in the database');
                                    }

                                    updateStatus('success', `Purchase successful! You will receive ${calculateTokens()} XSTP`);
                                } catch (error) {
                                    console.error('Error saving USDT purchase:', error);
                                    updateStatus('success', `Purchase successful! You will receive ${calculateTokens()} XSTP`);
                                }
                            }
                        }
                    }
                }
            }

            if (txHash) {
                console.log('Transaction hash:', txHash);
                setAmount('');
            }
        } catch (error: any) {
            console.error('Error buying tokens:', error);
            updateStatus('error', 'Error processing purchase: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCopyAddress = async () => {
        try {
            await navigator.clipboard.writeText('0x10B29d54f563ca9e96f53eD3a5Cd5D544f78231e');
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const handlePixPayment = () => {
        // Pega a wallet atual
        const currentWallet = activeAccount?.address;
        
        // Busca o referral do localStorage ou URL
        const urlParams = new URLSearchParams(window.location.search);
        const referralFromUrl = urlParams.get('ref');
        const referralFromStorage = localStorage.getItem('referralCode');
        const referral = referralFromUrl || referralFromStorage;

        // Constrói a URL com os parâmetros
        const pixUrl = new URL('/pix-generator', window.location.origin);
        if (currentWallet) {
            pixUrl.searchParams.set('wallet', currentWallet);
        }
        if (referral) {
            pixUrl.searchParams.set('referral', referral);
        }

        // Navega para a página do PIX
        navigate(pixUrl.toString());
        onClose();
    };

    const renderTransactionStatus = () => {
        if (transactionStatus === 'idle') return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-stone-900 border border-white/20 rounded-lg p-6 max-w-sm w-full mx-4">
                    <div className="flex items-center justify-center mb-4">
                        {transactionStatus === 'success' ? (
                            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        ) : transactionStatus === 'error' ? (
                            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                        )}
                    </div>
                    <div className={`text-center p-4 rounded-lg ${
                        transactionStatus === 'success' 
                            ? 'bg-green-900/50 text-green-300' 
                            : transactionStatus === 'error'
                            ? 'bg-red-900/50 text-red-300'
                            : 'bg-stone-800/50 text-white'
                    }`}>
                        <p className="text-sm font-medium">{statusMessage}</p>
                    </div>
                    {(transactionStatus === 'success' || transactionStatus === 'error') && (
                        <button
                            onClick={() => {
                                setTransactionStatus('idle');
                                if (transactionStatus === 'success') {
                                    onClose();
                                }
                            }}
                            className={`mt-4 w-full py-2 px-4 rounded-lg ${
                                transactionStatus === 'success' 
                                    ? 'bg-indigo-600 hover:bg-indigo-700'
                                    : 'bg-black hover:bg-gray-900 border border-white/20'
                            } text-white transition-colors`}
                        >
                            {transactionStatus === 'success' ? 'Close' : 'Try Again'}
                        </button>
                    )}
                </div>
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-black border border-purple-500/20 rounded-2xl p-6 max-w-md w-full mx-4">
                    <div className="flex justify-between items-center mb-4">
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors ml-auto"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Contract Address Field */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <label className="text-sm font-medium text-gray-400">
                                Import XSTP to wallet
                            </label>
                            <button
                                onClick={handleCopyAddress}
                                className="text-xs text-purple-500 hover:text-purple-400 transition-colors"
                            >
                                {copySuccess ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                readOnly
                                value="0x10B29d54f563ca9e96f53eD3a5Cd5D544f78231e"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-400 focus:outline-none cursor-default"
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                            Add custom token using this contract address
                        </p>
                    </div>

                    {/* Payment Method Selection */}
                    <div className="flex gap-2 mb-6">
                        <button
                            onClick={() => setPaymentMethod('BNB')}
                            className={`flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-all
              ${paymentMethod === 'BNB'
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                        >
                            Pay with BNB
                        </button>
                        <button
                            onClick={() => setPaymentMethod('USDT')}
                            className={`flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-all
              ${paymentMethod === 'USDT'
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                        >
                            Pay with USDT
                        </button>
                    </div>

                    {/* Current Price Info */}
                    <div className="text-xs text-gray-400 mb-2">
                        Current price: {getPriceInfo()}
                    </div>

                    {/* Amount Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Amount ({paymentMethod})
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 pr-12 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                placeholder={`Enter amount in ${paymentMethod}`}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <img
                                    src={IMAGES.payments[paymentMethod.toLowerCase() as keyof typeof IMAGES.payments]}
                                    alt={paymentMethod}
                                    className="w-6 h-6"
                                />
                            </div>
                        </div>
                        <p className="text-sm text-gray-400 mt-2">
                            You will receive:{' '}
                            <span className="font-bold text-purple-500">
                                {calculateTokens()}{' '}
                                <span className="font-bold text-purple-500">XSTP</span>
                            </span>
                        </p>
                    </div>

                    {/* Buy Button */}
                    <button
                        onClick={handleBuy}
                        disabled={loading || !amount || parseFloat(amount) <= 0}
                        className={`w-full py-3 px-4 rounded-full font-semibold text-white mb-2
                ${loading || !amount || parseFloat(amount) <= 0
                                ? 'bg-gray-600 cursor-not-allowed'
                                : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-opacity'
                            }`}
                    >
                        {loading ? 'Processing...' : 'Buy Now'}
                    </button>

                    {/* Divisor OR */}
                    <div className="relative w-full text-center my-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-600"></div>
                        </div>
                        <span className="relative bg-black px-4 text-sm text-gray-400">or</span>
                    </div>

                    {/* PIX e CARD Buttons */}
                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={handlePixPayment}
                            className="flex-1 py-3 px-4 rounded-full font-semibold text-white bg-white/5 hover:bg-white/10 transition-all border border-white/10 flex items-center justify-center gap-2"
                        >
                            <img src={IMAGES.payments.pix} alt="PIX" className="w-5 h-5" />
                            PIX
                        </button>
                        <button
                            onClick={() => window.open('https://global.transak.com/', '_blank')}
                            className="flex-1 py-3 px-4 rounded-full font-semibold text-white bg-white/5 hover:bg-white/10 transition-all border border-white/10 flex items-center justify-center gap-2"
                        >
                            <img src={IMAGES.payments.card} alt="CARD" className="w-5 h-5" />
                            CARD
                        </button>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-4 text-xs text-gray-400">
                        <p>• Minimum purchase: 1 USDT or equivalent</p>
                        <p>• Transaction may take a few minutes to process</p>
                        <p>• Make sure you have enough BNB for gas fees</p>
                    </div>
                </div>
            </div>
            {renderTransactionStatus()}
        </>
    );
};

export default BuyTokenModal;