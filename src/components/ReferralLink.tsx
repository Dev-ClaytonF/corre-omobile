import { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { generateAndSaveReferralCode, fetchReferralCode } from '../utils/supabase';

interface UserData {
    name: string;
    email: string;
}

const ReferralLink = () => {
    const { activeAccount } = useWallet();
    const [referralCode, setReferralCode] = useState<string>('');
    const [copySuccess, setCopySuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [userData, setUserData] = useState<UserData>({ name: '', email: '' });
    const [formError, setFormError] = useState<string>('');

   
    useEffect(() => {
        const checkExistingReferral = async () => {
            if (activeAccount?.address) {
                const code = await fetchReferralCode(activeAccount.address);
                if (code) {
                    setReferralCode(code);
                }
            }
        };

        checkExistingReferral();
    }, [activeAccount]);

    const handleOpenModal = () => {
        setShowModal(true);
        setFormError('');
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setUserData({ name: '', email: '' });
        setFormError('');
    };

    const validateEmail = (email: string) => {
        return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    };

    const handleGenerateReferral = async () => {
        if (!activeAccount?.address) return;
        
        // Validação dos campos
        if (!userData.name.trim() || userData.name.trim().length < 2) {
            setFormError('Please enter your name or nickname (minimum 2 characters)');
            return;
        }
        if (!validateEmail(userData.email)) {
            setFormError('Please enter a valid email');
            return;
        }

        setIsLoading(true);
        try {
            const code = await generateAndSaveReferralCode(
                activeAccount.address,
                userData.name.trim(),
                userData.email.trim()
            );
            
            if (!code) {
                throw new Error('Erro ao gerar código de referral');
            }
            
            setReferralCode(code);
            handleCloseModal();
        } catch (error: any) {
            console.error('Error generating referral code:', error);
            setFormError(error.message || 'Erro ao gerar código. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!activeAccount) return null;

    return (
        <>
            <div className="mt-8 w-full">
                <div className="flex flex-col items-center space-y-4">
                    {!referralCode && (
                        <button
                            onClick={handleOpenModal}
                            disabled={isLoading}
                            className={`px-6 py-2 rounded-full text-sm font-semibold text-white 
                                bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90
                                transition-all duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Generating...' : 'Generate Referral Code'}
                        </button>
                    )}

                    {referralCode && (
                        <div className="w-full max-w-md">
                            <div className="relative">
                                <input
                                    type="text"
                                    readOnly
                                    value={`https://startupxchain.com/presale?ref=${referralCode}`}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none"
                                />
                                <button
                                    onClick={() => {
                                        const fullUrl = `https://startupxchain.com/presale?ref=${referralCode}`;
                                        navigator.clipboard.writeText(fullUrl)
                                            .then(() => {
                                                setCopySuccess(true);
                                                setTimeout(() => setCopySuccess(false), 2000);
                                            })
                                            .catch(err => console.error('Failed to copy text: ', err));
                                    }}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-purple-500 hover:text-purple-400 transition-colors"
                                >
                                    {copySuccess ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                            <p className="mt-2 text-center text-sm text-gray-400">
                                Share your referral code and earn rewards!
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-black border border-purple-500/20 rounded-2xl p-6 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-white">Generate Referral Code</h3>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            {formError && (
                                <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg">
                                    {formError}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                    Name or Nickname
                                </label>
                                <input
                                    type="text"
                                    value={userData.name}
                                    onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                                    placeholder="How do you want to be called"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={userData.email}
                                    onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                                    placeholder="your@email.com"
                                />
                            </div>

                            <button
                                onClick={handleGenerateReferral}
                                disabled={isLoading}
                                className="w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Generating...' : 'Generate Code'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ReferralLink; 
