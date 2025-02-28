interface Purchase {
    hash: string;
    amount: string;
    currency: 'BNB' | 'USDT';
    timestamp: number;
    tokenAmount: string;
}

export const savePurchase = (
    address: string,
    hash: string,
    amount: string,
    currency: 'BNB' | 'USDT',
    tokenAmount: string
) => {
    try {
        // Busca compras existentes
        const existingPurchasesStr = localStorage.getItem(`purchases_${address}`);
        const existingPurchases: Purchase[] = existingPurchasesStr 
            ? JSON.parse(existingPurchasesStr)
            : [];

        // Adiciona nova compra
        const newPurchase: Purchase = {
            hash,
            amount,
            currency,
            timestamp: Date.now(),
            tokenAmount
        };

        // Combina e salva
        const updatedPurchases = [newPurchase, ...existingPurchases];
        localStorage.setItem(`purchases_${address}`, JSON.stringify(updatedPurchases));

        return true;
    } catch (error) {
        console.error('Error saving purchase:', error);
        return false;
    }
}; 