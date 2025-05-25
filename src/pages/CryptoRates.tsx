import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Bitcoin,
  Wallet,
  Plus,
  Trash2,
} from 'lucide-react';
import { toast } from '@/lib/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import {
  getCryptoHoldings,
  addCryptoHolding,
  updateCryptoHolding,
  deleteCryptoHolding,
} from '@/lib/db';

interface CryptoRate {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  lastUpdate: string;
}

interface CryptoHolding {
  id: string;
  symbol: string;
  amount: number;
}

const formatCurrency = (value: number) => {
  const integerValue = parseInt(value.toString());
  return integerValue
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const CryptoRates = () => {
  const { user } = useAuth();
  const [rates, setRates] = useState<CryptoRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [holdings, setHoldings] = useState<CryptoHolding[]>(
    []
  );
  const [newHolding, setNewHolding] = useState({
    symbol: '',
    amount: '',
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const loadHoldings = async () => {
      if (!user) return;
      try {
        const fetchedHoldings = await getCryptoHoldings(
          user.uid
        );
        setHoldings(fetchedHoldings as CryptoHolding[]);
      } catch (error) {
        console.error('Error loading holdings:', error);
        toast.error('Error loading crypto holdings');
      }
    };

    loadHoldings();
  }, [user]);

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
    const interval = setInterval(fetchRates, 300000);
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

  const handleAddHolding = async () => {
    if (!user || !newHolding.symbol || !newHolding.amount) {
      toast.error('Please fill in all fields');
      return;
    }

    const amount = parseFloat(newHolding.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      const existingHolding = holdings.find(
        h => h.symbol === newHolding.symbol
      );
      if (existingHolding) {
        const updatedAmount =
          existingHolding.amount + amount;
        await updateCryptoHolding(
          user.uid,
          existingHolding.id,
          {
            symbol: existingHolding.symbol,
            amount: updatedAmount,
          }
        );
        setHoldings(
          holdings.map(h =>
            h.id === existingHolding.id
              ? { ...h, amount: updatedAmount }
              : h
          )
        );
      } else {
        const holdingId = await addCryptoHolding(user.uid, {
          symbol: newHolding.symbol,
          amount,
        });
        setHoldings([
          ...holdings,
          {
            id: holdingId,
            symbol: newHolding.symbol,
            amount,
          },
        ]);
      }

      setNewHolding({ symbol: '', amount: '' });
      setIsDialogOpen(false);
      toast.success('Holding added successfully');
    } catch (error) {
      console.error('Error adding holding:', error);
      toast.error('Error adding crypto holding');
    }
  };

  const handleDeleteHolding = async (id: string) => {
    if (!user) return;

    try {
      await deleteCryptoHolding(user.uid, id);
      setHoldings(holdings.filter(h => h.id !== id));
      toast.success('Holding removed successfully');
    } catch (error) {
      console.error('Error deleting holding:', error);
      toast.error('Error removing crypto holding');
    }
  };

  const calculateTotalValue = () => {
    return holdings.reduce((total, holding) => {
      const rate = rates.find(
        r => r.symbol === holding.symbol
      );
      return (
        total + (rate ? rate.price * holding.amount : 0)
      );
    }, 0);
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
      <div className="space-y-4">
        <Card className="border border-border/30 bg-card/60 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">
              My Crypto Holdings
            </CardTitle>
            <Dialog
              open={isDialogOpen}
              onOpenChange={setIsDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="flex gap-2 items-center">
                  <Plus size={16} />
                  Add Crypto
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Crypto</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label className="text-sm text-foreground/80">
                      Crypto
                    </label>
                    <Select
                      value={newHolding.symbol}
                      onValueChange={value =>
                        setNewHolding({
                          ...newHolding,
                          symbol: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select crypto" />
                      </SelectTrigger>
                      <SelectContent>
                        {rates.map(rate => (
                          <SelectItem
                            key={rate.symbol}
                            value={rate.symbol}
                          >
                            {rate.name} ({rate.symbol})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm text-foreground/80">
                      Amount
                    </label>
                    <Input
                      type="number"
                      step="0.00000001"
                      placeholder="0.00"
                      value={newHolding.amount}
                      onChange={e =>
                        setNewHolding({
                          ...newHolding,
                          amount: e.target.value,
                        })
                      }
                    />
                  </div>
                  <Button
                    onClick={handleAddHolding}
                    className="w-full mt-2"
                  >
                    Add Crypto
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {holdings.length > 0 ? (
              <div className="space-y-4">
                <div className="grid gap-2">
                  {holdings.map(holding => {
                    const rate = rates.find(
                      r => r.symbol === holding.symbol
                    );
                    const value = rate
                      ? rate.price * holding.amount
                      : 0;
                    return (
                      <div
                        key={holding.id}
                        className="flex items-center justify-between p-3 rounded-md bg-card/60 backdrop-blur-sm bg-secondary/40"
                      >
                        <div>
                          <div className="font-medium">
                            {holding.symbol}
                          </div>
                          <div className="text-sm text-foreground/80">
                            {holding.amount}{' '}
                            {holding.symbol} (
                            {formatCurrency(value)})
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-full hover:bg-destructive/20 text-destructive"
                          onClick={() =>
                            handleDeleteHolding(holding.id)
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
                <div className="text-right pt-2 border-t border-border/30">
                  <div className="text-sm text-foreground/80">
                    Total Value
                  </div>
                  <div className="text-xl font-bold">
                    {formatCurrency(calculateTotalValue())}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-foreground/60">
                No crypto holdings yet. Click "Add Crypto"
                to get started.
              </div>
            )}
          </CardContent>
        </Card>

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
                      {formatCurrency(rate.price)}
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
      </div>
    </Layout>
  );
};

export default CryptoRates;
