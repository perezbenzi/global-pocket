import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, DollarSign } from 'lucide-react';
import { toast } from '@/lib/toast';
import Layout from '@/components/Layout';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import {
  getMonthlyExpenses,
  addMonthlyExpense,
  updateMonthlyExpense,
  deleteMonthlyExpense,
} from '@/lib/db';

interface MonthlyExpense {
  id: string;
  description: string;
  amount: number;
  date: string;
  isPaid: boolean;
}

const MonthlyExpenses = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<
    MonthlyExpense[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const totalPaidExpenses = expenses
    .filter(expense => expense.isPaid)
    .reduce((sum, expense) => sum + expense.amount, 0);
  const totalPendingExpenses = expenses
    .filter(expense => !expense.isPaid)
    .reduce((sum, expense) => sum + expense.amount, 0);

  useEffect(() => {
    const loadExpenses = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const fetchedExpenses = await getMonthlyExpenses(
          user.uid
        );
        setExpenses(fetchedExpenses);
      } catch (error) {
        console.error('Error loading expenses:', error);
        toast.error('Error loading expenses');
      } finally {
        setLoading(false);
      }
    };

    loadExpenses();
  }, [user]);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !description || !amount) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const newExpense = {
        description,
        amount: parseFloat(amount),
        date: new Date().toISOString(),
        isPaid: false,
      };

      const expenseId = await addMonthlyExpense(
        user.uid,
        newExpense
      );
      setExpenses([
        ...expenses,
        { ...newExpense, id: expenseId },
      ]);
      setDescription('');
      setAmount('');
      setIsDialogOpen(false);
      toast.success('Expense added successfully');
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Error adding expense');
    }
  };

  const handleTogglePaid = async (expenseId: string) => {
    if (!user) return;

    try {
      const expense = expenses.find(
        e => e.id === expenseId
      );
      if (!expense) return;

      const updatedExpense = {
        ...expense,
        isPaid: !expense.isPaid,
      };
      await updateMonthlyExpense(
        user.uid,
        expenseId,
        updatedExpense
      );
      setExpenses(
        expenses.map(e =>
          e.id === expenseId ? updatedExpense : e
        )
      );
      toast.success(
        `Expense marked as ${updatedExpense.isPaid ? 'paid' : 'pending'}`
      );
    } catch (error) {
      console.error('Error updating expense:', error);
      toast.error('Error updating expense');
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (!user) return;

    try {
      await deleteMonthlyExpense(user.uid, expenseId);
      setExpenses(expenses.filter(e => e.id !== expenseId));
      toast.success('Expense deleted successfully');
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Error deleting expense');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">
            Monthly Expenses
          </h1>
          <div className="grid gap-4 md:grid-cols-3">
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
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            Monthly Expenses
          </h1>
          <Dialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="flex gap-2 items-center">
                <Plus size={16} />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={handleAddExpense}
                className="grid gap-4 py-4"
              >
                <div className="grid gap-2">
                  <Label htmlFor="description">
                    Description
                  </Label>
                  <Input
                    id="description"
                    placeholder="Rent, utilities, etc."
                    value={description}
                    onChange={e =>
                      setDescription(e.target.value)
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="amount">
                    Amount (USD)
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={e =>
                      setAmount(e.target.value)
                    }
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full mt-2"
                >
                  Add Expense
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border border-border/30 bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                Total Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mt-1 bg-secondary/40 p-3 rounded-md">
                <p className="text-xl font-semibold text-right text-primary">
                  ${totalExpenses.toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/30 bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                Paid Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mt-1 bg-secondary/40 p-3 rounded-md">
                <p className="text-xl font-semibold text-right text-green-500">
                  ${totalPaidExpenses.toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/30 bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                Pending Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mt-1 bg-secondary/40 p-3 rounded-md">
                <p className="text-xl font-semibold text-right text-red-500">
                  ${totalPendingExpenses.toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {expenses.map(expense => (
            <Card
              key={expense.id}
              className={`border ${
                expense.isPaid
                  ? 'border-green-500/30'
                  : 'border-red-500/30'
              } bg-card/60 backdrop-blur-sm`}
            >
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`${
                      expense.isPaid
                        ? 'bg-green-500/10'
                        : 'bg-red-500/10'
                    } p-1.5 rounded-md`}
                  >
                    <DollarSign
                      className={`h-5 w-5 ${
                        expense.isPaid
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    />
                  </div>
                  <h3 className="text-lg font-medium">
                    {expense.description}
                  </h3>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 w-8 p-0 rounded-full ${
                      expense.isPaid
                        ? 'hover:bg-green-500/20 text-green-500'
                        : 'hover:bg-red-500/20 text-red-500'
                    }`}
                    onClick={() =>
                      handleTogglePaid(expense.id)
                    }
                  >
                    <span className="sr-only">
                      {expense.isPaid
                        ? 'Mark as Unpaid'
                        : 'Mark as Paid'}
                    </span>
                    <DollarSign className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
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
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete this
                          expense.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            handleDeleteExpense(expense.id)
                          }
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="mt-1 bg-secondary/40 p-3 rounded-md">
                  <p
                    className={`text-xl font-semibold text-right ${
                      expense.isPaid
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    ${expense.amount.toFixed(2)}
                  </p>
                </div>
                <p className="text-sm mt-2">
                  Added{' '}
                  {new Date(
                    expense.date
                  ).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
          {expenses.length === 0 && (
            <div className="text-center p-6 bg-muted rounded-md md:col-span-2 lg:col-span-3">
              <p className="text-muted-foreground">
                No monthly expenses added yet.
              </p>
              <p className="text-sm mt-2">
                Add your first expense to start tracking!
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MonthlyExpenses;
