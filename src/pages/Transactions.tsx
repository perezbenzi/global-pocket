import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getTransactions, deleteTransaction } from "@/lib/db";
import { Transaction } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ArrowDownCircle, ArrowUpCircle, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
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
} from "@/components/ui/alert-dialog";

const Transactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);

  useEffect(() => {
    const loadTransactions = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const fetchedTransactions = await getTransactions(user.uid);
        setTransactions(fetchedTransactions);
      } catch (error) {
        console.error("Error loading transactions:", error);
        toast.error("Error loading transactions");
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
      return "Unknown date";
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    if (!user) return;
    
    try {
      await deleteTransaction(user.uid, transactionId);
      setTransactions(transactions.filter(transaction => transaction.id !== transactionId));
      toast.success("Transaction deleted successfully");
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Error deleting transaction");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0 md:pt-16">
      <Navbar />
      <main className="container mx-auto p-4 pb-16 max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-4xl">
        <Card className="border border-border/30 bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl">Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-secondary border-t-primary rounded-full animate-spin"></div>
              </div>
            ) : transactions.length > 0 ? (
              <ScrollArea className="h-[500px] rounded-md">
                <div className="space-y-4 p-1">
                  {transactions.map((transaction) => (
                    <div key={transaction.id}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {transaction.type === 'deposit' ? (
                            <ArrowUpCircle className="h-8 w-8 text-green-500" />
                          ) : (
                            <ArrowDownCircle className="h-8 w-8 text-red-500" />
                          )}
                          <div>
                            <p className="font-medium">{transaction.accountName}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(transaction.date)}
                            </p>
                            {transaction.description && (
                              <p className="text-sm text-muted-foreground mt-1">{transaction.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <p 
                            className={`text-lg font-semibold ${
                              transaction.type === 'deposit' ? 'text-green-500' : 'text-red-500'
                            }`}
                          >
                            {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                          </p>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 rounded-full hover:bg-destructive/20 text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action will permanently delete this transaction history. 
                                  This will not affect your account balance.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteTransaction(transaction.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                      <Separator className="my-4" />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No transactions recorded yet.</p>
                <p className="text-sm mt-2">Transactions will appear here when you add or withdraw money from your accounts.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Transactions; 