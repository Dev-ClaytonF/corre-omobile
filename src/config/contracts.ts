import { createClient } from '@supabase/supabase-js';
import { RealtimeChannel } from '@supabase/supabase-js';

const supabase = createClient(
    'https://bdvscuvugnvcfvwpvfxw.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkdnNjdXZ1Z252Y2Z2d3B2Znh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4Mzc4NDYsImV4cCI6MjA1NTQxMzg0Nn0.i4yU5gP120R9dRpb7ZNT2JQEEU1jmE3BUNLjKqxHNFY'
);

let stagesChannel: RealtimeChannel | null = null;

// Função para iniciar o websocket
export const initializeWebSocket = (onStageChange: (stage: any) => void) => {
    if (stagesChannel) {
        stagesChannel.unsubscribe();
    }

    stagesChannel = supabase
        .channel('stages')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'sale_stages',
            },
            (payload) => {
                console.log('Mudança detectada:', payload);
                fetchActiveStage().then(onStageChange);
            }
        )
        .subscribe();

    return () => {
        if (stagesChannel) {
            stagesChannel.unsubscribe();
        }
    };
};

// Função para buscar os dados ativos
export const fetchActiveStage = async () => {
    const { data, error } = await supabase
        .from('sale_stages')
        .select('*')
        .eq('is_active', true)
        .single();

    if (error) {
        console.error('Erro ao buscar estágio ativo:', error);
        return null;
    }

    return data;
};

// Endereço fixo do token USDT (BSC)
export const USDT_TOKEN_ADDRESS = '0x55d398326f99059fF775485246999027B3197955';

// ABIs dos contratos
export const BNB_CONTRACT_ABI = [
    {
        "inputs": [],
        "name": "buyTokens",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "tokenAmount",
                "type": "uint256"
            }
        ],
        "name": "TokensPurchased",
        "type": "event"
    }
] as const;

export const USDT_CONTRACT_ABI = [
    {
        "inputs": [
            { "internalType": "uint256", "name": "tokenAmount", "type": "uint256" }
        ],
        "name": "buyTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "tokenAmount",
                "type": "uint256"
            }
        ],
        "name": "TokensPurchased",
        "type": "event"
    }
] as const;

export const USDT_TOKEN_ABI = [
    {
        "inputs": [
            { "name": "spender", "type": "address" },
            { "name": "amount", "type": "uint256" }
        ],
        "name": "approve",
        "outputs": [{ "type": "bool" }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [{ "name": "account", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "name": "", "type": "uint256" }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
] as const;

// Função para atualizar o raised_value após uma compra
export const updateRaisedValue = async (amount: string, isBnb: boolean = false) => {
  try {
    // Busca o estágio ativo
    const { data: activeStage, error: stageError } = await supabase
      .from('sale_stages')
      .select('*')
      .eq('is_active', true)
      .single();

    if (stageError) throw stageError;

    if (!activeStage) return;

    let usdtValue = amount;

    // Se for BNB, converte para USDT
    if (isBnb) {
      // Busca o preço atual do BNB
      const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT');
      const data = await response.json();
      const bnbPrice = parseFloat(data.price);
      
      // Converte BNB para USDT
      usdtValue = (parseFloat(amount) * bnbPrice).toString();
    }

    // Atualiza o raised_value do estágio ativo
    const newRaisedValue = (
      parseFloat(activeStage.raised_value || '0') + 
      parseFloat(usdtValue)
    ).toString();

    const { error: updateError } = await supabase
      .from('sale_stages')
      .update({ raised_value: newRaisedValue })
      .eq('stage_number', activeStage.stage_number);

    if (updateError) throw updateError;

  } catch (error) {
    console.error('Erro ao atualizar raised_value:', error);
  }
}; 