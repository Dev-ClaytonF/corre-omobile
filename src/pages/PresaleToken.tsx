import { useRef, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { supabase } from '../utils/supabase';
import ConnectWalletButton from '../components/ConnectWalletButton';
import ReferralLink from '../components/ReferralLink';
import ReferralBanner from '../components/ReferralBanner';
import { fetchActiveStage, initializeWebSocket } from '../config/contracts';
import { useStage } from '../contexts/StageContext';
import { IMAGES } from '../config/images';



const formatLargeNumber = (num: string | number): string => {
  const value = typeof num === 'string' ? parseFloat(num) : num;
  const integerPart = Math.floor(value); 
  return integerPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const PresaleToken = () => {
  const { activeAccount } = useWallet();
  const thirdwebButtonRef = useRef<HTMLButtonElement | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const { activeStage, nextStage, loading, setActiveStage, setNextStage } = useStage();


  const fetchNextStage = async (currentStageNumber: number) => {
    try {
      const { data, error } = await supabase
        .from('sale_stages')
        .select('*')
        .eq('stage_number', currentStageNumber + 1)
        .single();

      if (error) throw error;
      setNextStage(data);
    } catch (error) {
      console.error('Erro ao buscar próximo estágio:', error);
    }
  };

  useEffect(() => {
    const loadStages = async () => {
      const stage = await fetchActiveStage();
      if (stage) {
        setActiveStage(stage);
        fetchNextStage(stage.stage_number);
      }
    };

    loadStages();

    const cleanup = initializeWebSocket((stage) => {
      if (stage) {
        setActiveStage(stage);
        fetchNextStage(stage.stage_number);
      }
    });

    return () => {
      cleanup();
    };
  }, []);

  useEffect(() => {
    const findThirdwebButton = () => {
      let button = document.querySelector('[data-test="connect-wallet-button"]') as HTMLButtonElement | null;
      thirdwebButtonRef.current = button;
    };

    findThirdwebButton();

    observerRef.current = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          findThirdwebButton();
        }
      });
    });

    observerRef.current.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [activeAccount]);

  if (loading) return <div>loading...</div>;

  return (
    <div className="h-screen overflow-hidden bg-black flex items-center justify-center">
      <div className="w-full max-w-[600px] px-4">
        <div className="flex flex-col items-center">
          <div className="w-48 md:w-56">
            <img
              src={IMAGES.tokenXSTP}
              alt="Logo"
              className="w-full object-contain"
            />
          </div>

          <span className="text-white text-sm md:text-base mt-2 text-center font-sarpanch">
            Your Access to Real-World Assets in the Digital World. <br /> Buy on Presale
          </span>

          <div className="w-full mt-4">
            <div className="relative">
              <div>
                <span className="absolute left-0 top-0 -translate-y-full text-white text-sm md:text-base font-sarpanch">
                  STAGE {activeStage?.stage_number || 1}
                </span>
                <span className="absolute right-0 top-0 -translate-y-full text-white text-sm md:text-base font-sarpanch">
                  $ {formatLargeNumber(activeStage?.raised_value || '0')} / {formatLargeNumber(activeStage?.target_value || '100000')}
                </span>
              </div>
              <div className="h-5 bg-white/20 backdrop-blur rounded-full overflow-hidden mt-8">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center transition-all duration-300"
                  style={{ 
                    width: `${Math.min((parseFloat(activeStage?.raised_value || '0') / parseFloat(activeStage?.target_value || '100000')) * 100, 100)}%`,
                    minWidth: '30px'
                  }}
                >
                  <span className="text-white font-bold text-xs px-2">
                    {Math.min((parseFloat(activeStage?.raised_value || '0') / parseFloat(activeStage?.target_value || '100000')) * 100, 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="flex justify-between mt-2">
                <span className="text-white text-xs md:text-sm text-left font-sarpanch">
                  XSTP {activeStage?.token_price || '0.001'} USD <br />
                  {nextStage 
                    ? `NEXT STAGE ${nextStage.token_price} USD`
                    : 'FINAL STAGE'}
                </span>
                <span className="text-white text-xs md:text-sm text-right font-sarpanch">
                TOKENS SOLD <br />
                  {activeStage 
                    ? formatLargeNumber(Math.floor(parseFloat(activeStage.raised_value || '0') / parseFloat(activeStage.token_price)).toString())
                    : '0'} XSTP
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center mt-4">
              <ConnectWalletButton variant="default" showBuyNow={true} />
            </div>

            <div className="space-y-3 mt-4">
              <ReferralLink />
              <ReferralBanner />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresaleToken; 