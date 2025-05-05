import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Bitcoin, Wallet } from 'lucide-react';
import { toast } from '@/lib/toast';

interface CryptoRate {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  lastUpdate: string;
}

const CryptoRates = () => {
  const [rates, setRates] = useState<CryptoRate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin&vs_currencies=usd&include_24hr_change=true'
        );
        const data = await response.json();

        const formattedData: CryptoRate[] = [
          {
            symbol: 'BTC',
            name: 'Bitcoin',
            price: data.bitcoin.usd,
            change24h: data.bitcoin.usd_24h_change,
            lastUpdate: new Date().toISOString(),
          },
          {
            symbol: 'ETH',
            name: 'Ethereum',
            price: data.ethereum.usd,
            change24h: data.ethereum.usd_24h_change,
            lastUpdate: new Date().toISOString(),
          },
          {
            symbol: 'BNB',
            name: 'BNB',
            price: data.binancecoin.usd,
            change24h: data.binancecoin.usd_24h_change,
            lastUpdate: new Date().toISOString(),
          },
        ];

        setRates(formattedData);
      } catch (error) {
        console.error('Error fetching rates:', error);
        toast.error('Error loading crypto rates');
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
    const interval = setInterval(fetchRates, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <Card
              key={i}
              className="border border-border/30 bg-card/60 backdrop-blur-sm"
            >
              <CardContent className="p-6">
                <div className="h-24 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-secondary border-t-primary rounded-full animate-spin"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rates.map(rate => (
          <Card
            key={rate.symbol}
            className="border border-border/30 bg-card/60 backdrop-blur-sm"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center gap-2">
                <div className="bg-primary/10 p-1.5 rounded-md">
                  {rate.symbol === 'BTC' ? (
                    <Bitcoin className="h-5 w-5 text-primary" />
                  ) : (
                    <Wallet className="h-5 w-5 text-primary" />
                  )}
                </div>
                {rate.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-sm text-foreground/80">
                    Price
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    ${rate.price.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-foreground/80">
                    24h Change
                  </p>
                  <p
                    className={`text-lg font-medium ${
                      rate.change24h >= 0
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {rate.change24h >= 0 ? '+' : ''}
                    {rate.change24h.toFixed(2)}%
                  </p>
                </div>
                <div className="text-sm text-foreground/60 text-right">
                  Updated: {formatDate(rate.lastUpdate)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Layout>
  );
};

export default CryptoRates;
