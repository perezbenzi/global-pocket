import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  getTransactions,
  deleteTransaction,
} from '@/lib/db';
import { Transaction } from '@/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { toast } from '@/lib/toast';
import Layout from '@/components/Layout';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const ITEMS_PER_PAGE = 4;

const Transactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<
    Transaction[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(
    transactions.length / ITEMS_PER_PAGE
  );
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTransactions = transactions.slice(
    startIndex,
    endIndex
  );

  useEffect(() => {
    const loadTransactions = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const fetchedTransactions = await getTransactions(
          user.uid
        );
        setTransactions(fetchedTransactions);
      } catch (error) {
        console.error('Error loading transactions:', error);
        toast.error('Error loading transactions');
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [user]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return 'Unknown date';
    }
  };

  const handleDeleteTransaction = async (
    transactionId: string
  ) => {
    if (!user) return;

    try {
      await deleteTransaction(user.uid, transactionId);
      setTransactions(
        transactions.filter(
          transaction => transaction.id !== transactionId
        )
      );
      toast.success('Transaction deleted successfully');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Error deleting transaction');
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">
            Transaction History
          </h1>
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
            {[1, 2, 3, 4].map(i => (
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
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">
          Transaction History
        </h1>
        {transactions.length > 0 ? (
          <>
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
              {currentTransactions.map(transaction => (
                <Card
                  key={transaction.id}
                  className="border border-border/30 bg-card/60 backdrop-blur-sm"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {transaction.type === 'deposit' ? (
                          <div className="bg-green-500/10 p-3 rounded-full">
                            <ArrowUpCircle className="h-6 w-6 text-green-500" />
                          </div>
                        ) : (
                          <div className="bg-red-500/10 p-3 rounded-full">
                            <ArrowDownCircle className="h-6 w-6 text-red-500" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-foreground text-lg">
                            {transaction.accountName}
                          </p>
                          <p className="text-sm text-foreground/80">
                            {formatDate(transaction.date)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-end gap-2">
                        <p
                          className={`text-xl font-bold ${transaction.type === 'deposit' ? 'text-green-500' : 'text-red-500'}`}
                        >
                          {transaction.type === 'deposit'
                            ? '+'
                            : '-'}
                          ${transaction.amount.toFixed(2)}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-full hover:bg-destructive/20 text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">
                            Delete
                          </span>
                        </Button>
                        <AlertDialog>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action will permanently
                                delete this transaction
                                history. This will not
                                affect your account balance.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteTransaction(
                                    transaction.id
                                  )
                                }
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <Card className="border border-border/30 bg-card/60 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="text-center py-8">
                <p>No transactions found</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Transactions;
