import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from '@/lib/toast';

interface DollarRate {
  moneda: string;
  casa: string;
  nombre: string;
  compra: number;
  venta: number;
  fechaActualizacion: string;
}

const DollarRate = () => {
  const [rates, setRates] = useState<DollarRate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          'https://dolarapi.com/v1/dolares'
        );
        const data = await response.json();
        setRates(data);
      } catch (error) {
        console.error('Error fetching rates:', error);
        toast.error('Error loading dollar rates');
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
    const interval = setInterval(fetchRates, 300000); // Actualizar cada 5 minutos
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          {[1, 2, 3, 4, 5, 6].map(i => (
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {rates.map(rate => (
          <Card
            key={rate.casa}
            className="border border-border/30 bg-card/60 backdrop-blur-sm"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center gap-2">
                {rate.nombre}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-foreground/80">
                      Compra
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      ${rate.compra?.toFixed(2) || '-'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-foreground/80">
                      Venta
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      ${rate.venta?.toFixed(2) || '-'}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-foreground/60 text-right">
                  Actualizado:{' '}
                  {formatDate(rate.fechaActualizacion)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Layout>
  );
};

export default DollarRate;
