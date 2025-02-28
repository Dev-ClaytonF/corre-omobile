import React, { useEffect, useState } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { formatDistanceToNow } from 'date-fns';
import { fetchPurchases } from '../utils/supabase';
import { Purchase } from '../types/purchase';

const MyPurchases: React.FC = () => {
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'all' | 'crypto' | 'pix'>('all');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
    const activeAccount = useActiveAccount();

    useEffect(() => {
        const loadPurchases = async () => {
            if (!activeAccount) {
                setPurchases([]);
                setLoading(false);
                return;
            }

            try {
                console.log('Buscando compras para:', activeAccount.address);
                const purchasesData = await fetchPurchases(activeAccount.address);
                console.log('Compras encontradas:', purchasesData);
                setPurchases(purchasesData);
            } catch (error) {
                console.error('Error loading purchases:', error);
                setPurchases([]);
            }
            setLoading(false);
        };

        loadPurchases();
    }, [activeAccount]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 640);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const filteredPurchases = purchases.filter(purchase => {
        if (activeTab === 'all') return true;
        if (activeTab === 'crypto') return purchase.payment_method === 'CRYPTO';
        return purchase.payment_method === 'PIX';
    });

    const formatHash = (hash: string) => {
        if (isMobile) {
            return hash.slice(0, 12) + '... view';
        }
        return hash;
    };

    if (!activeAccount) {
        return (
            <div className="min-h-screen bg-black py-8 px-3 pt-20">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                            Connect your wallet
                        </h2>
                        <p className="mt-2 text-sm text-gray-400">
                            To view your purchase history, you need to connect your wallet.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-black py-8 px-3 pt-20">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent mx-auto"></div>
                        <h2 className="mt-2 text-base font-medium text-white">
                            Loading...
                        </h2>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black py-8 px-3 pt-20">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                        My Purchases
                    </h2>
                    <p className="mt-2 text-sm text-gray-400">
                        History of all your purchases
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-6">
                    <div className="bg-white/5 rounded-full p-1">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                activeTab === 'all'
                                    ? 'bg-purple-500 text-white'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setActiveTab('crypto')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                activeTab === 'crypto'
                                    ? 'bg-purple-500 text-white'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            Crypto
                        </button>
                        <button
                            onClick={() => setActiveTab('pix')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                activeTab === 'pix'
                                    ? 'bg-purple-500 text-white'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            PIX
                        </button>
                    </div>
                </div>

                <div className="mt-4">
                    {filteredPurchases.length === 0 ? (
                        <div className="text-center py-8 bg-white/5 rounded-xl border border-white/10">
                            <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 12H4M8 16l-4-4 4-4M16 8l4 4-4 4" />
                            </svg>
                            <h3 className="mt-3 text-base font-medium text-gray-300">No purchases found</h3>
                            <p className="mt-1 text-xs text-gray-400">
                                {activeTab === 'all'
                                    ? 'Your transactions will appear here after your first purchase.'
                                    : activeTab === 'crypto'
                                    ? 'You have not made any crypto purchases yet.'
                                    : 'You have not made any PIX purchases yet.'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredPurchases.map((purchase, index) => (
                                <div key={index} className="bg-white/5 rounded-xl border border-white/10 p-4 transition-all hover:bg-white/10">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                    purchase.payment_method === 'PIX'
                                                        ? 'bg-green-900/50 text-green-300'
                                                        : purchase.currency === 'BNB'
                                                        ? 'bg-yellow-900/50 text-yellow-300'
                                                        : 'bg-blue-900/50 text-blue-300'
                                                }`}>
                                                    {purchase.payment_method === 'PIX' ? 'PIX' : purchase.currency}
                                                </span>
                                                <span className="text-gray-400 text-xs">
                                                    {formatDistanceToNow(new Date(purchase.created_at || Date.now()), {
                                                        addSuffix: true
                                                    })}
                                                </span>
                                            </div>
                                            <div className="mt-1 flex items-center gap-1">
                                                <span className="text-gray-300 text-xs">
                                                    {purchase.payment_method === 'PIX' ? 'ID:' : 'Hash:'}
                                                </span>
                                                {purchase.payment_method === 'CRYPTO' ? (
                                                    <a 
                                                        href={`https://bscscan.com/tx/${purchase.hash}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-purple-400 hover:text-purple-300 truncate text-xs"
                                                    >
                                                        {formatHash(purchase.hash)}
                                                    </a>
                                                ) : (
                                                    <span className="text-purple-400 text-xs truncate">
                                                        {formatHash(purchase.transaction_id || purchase.hash)}
                                                    </span>
                                                )}
                                            </div>
                                            {purchase.referral_code && (
                                                <div className="mt-1.5 flex items-center gap-1.5">
                                                    <span className="text-xs text-gray-400">Referral:</span>
                                                    <span className="text-xs font-medium text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                                                        {purchase.referral_code}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col items-end gap-0.5">
                                            <div className="text-white text-sm font-medium">
                                                {purchase.amount} {purchase.currency}
                                            </div>
                                            <div className="text-purple-400 text-sm font-medium">
                                                {purchase.token_amount} XSTP
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyPurchases; 