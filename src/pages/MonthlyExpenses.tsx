import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Plus,
  Trash2,
  Check,
  X,
  ArrowUpDown,
} from 'lucide-react';
import { toast } from '@/lib/toast';
import Layout from '@/components/Layout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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

const formatNumber = (num: number): string => {
  const numStr = Math.round(num).toString();
  const parts = [];
  for (let i = numStr.length; i > 0; i -= 3) {
    parts.unshift(numStr.slice(Math.max(0, i - 3), i));
  }
  return parts.join('.');
};

interface MonthlyExpense {
  id: string;
  description: string;
  amount: number;
  date: string;
  isPaid: boolean;
}

interface EditingExpense {
  id: string;
  description: string;
  amount: string;
}

const MonthlyExpenses = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<
    MonthlyExpense[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] =
    useState(false);
  const [editingExpense, setEditingExpense] =
    useState<EditingExpense | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: 'amount';
    direction: 'asc' | 'desc';
  } | null>(null);

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const sortedExpenses = React.useMemo(() => {
    if (!sortConfig) return expenses;

    return [...expenses].sort((a, b) => {
      if (sortConfig.key === 'amount') {
        return sortConfig.direction === 'asc'
          ? a.amount - b.amount
          : b.amount - a.amount;
      }
      return 0;
    });
  }, [expenses, sortConfig]);

  const requestSort = (key: 'amount') => {
    let direction: 'asc' | 'desc' = 'asc';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'asc'
    ) {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

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
    if (
      !user ||
      !newExpense.description ||
      !newExpense.amount
    ) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const expense = {
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        date: new Date().toISOString(),
        isPaid: false,
      };

      const expenseId = await addMonthlyExpense(
        user.uid,
        expense
      );
      setExpenses([
        ...expenses,
        { ...expense, id: expenseId },
      ]);
      setNewExpense({ description: '', amount: '' });
      setIsDialogOpen(false);
      toast.success('Expense added successfully');
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Error adding expense');
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

  const handleEditStart = (expense: MonthlyExpense) => {
    setEditingExpense({
      id: expense.id,
      description: expense.description,
      amount: expense.amount.toString(),
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    if (!user || !editingExpense) return;

    try {
      const expense = expenses.find(
        e => e.id === editingExpense.id
      );
      if (!expense) return;

      const updatedExpense = {
        ...expense,
        description: editingExpense.description,
        amount: parseFloat(editingExpense.amount),
      };

      await updateMonthlyExpense(
        user.uid,
        editingExpense.id,
        updatedExpense
      );
      setExpenses(
        expenses.map(e =>
          e.id === editingExpense.id ? updatedExpense : e
        )
      );
      setIsEditDialogOpen(false);
      setEditingExpense(null);
      toast.success('Expense updated successfully');
    } catch (error) {
      console.error('Error updating expense:', error);
      toast.error('Error updating expense');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">
            Monthly Expenses
          </h1>
          <div className="h-24 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-secondary border-t-primary rounded-full animate-spin"></div>
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
                    value={newExpense.description}
                    onChange={e =>
                      setNewExpense({
                        ...newExpense,
                        description: e.target.value,
                      })
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
                    value={newExpense.amount}
                    onChange={e =>
                      setNewExpense({
                        ...newExpense,
                        amount: e.target.value,
                      })
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

        <div className="rounded-lg bg-card/60 backdrop-blur-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/50 bg-muted/50">
                <TableHead className="font-semibold border-r border-border/30 w-1/2">
                  Description
                </TableHead>
                <TableHead
                  className="text-right font-semibold border-r border-border/30 w-1/2 cursor-pointer"
                  onClick={() => requestSort('amount')}
                >
                  <div className="flex items-center justify-end gap-2">
                    Amount
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="w-[80px] font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedExpenses.map(expense => (
                <TableRow
                  key={expense.id}
                  className="border-b border-border/30"
                >
                  <TableCell className="font-medium border-r border-border/30">
                    <div
                      className="cursor-pointer hover:text-primary"
                      onClick={() =>
                        handleEditStart(expense)
                      }
                    >
                      {expense.description}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium border-r border-border/30">
                    <div
                      className="cursor-pointer hover:text-primary"
                      onClick={() =>
                        handleEditStart(expense)
                      }
                    >
                      ${formatNumber(expense.amount)}
                    </div>
                  </TableCell>
                  <TableCell>
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
                            This will permanently delete
                            this expense.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              handleDeleteExpense(
                                expense.id
                              )
                            }
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50">
                <TableCell className="font-bold border-r border-border/30">
                  Total
                </TableCell>
                <TableCell className="text-right font-bold border-r border-border/30">
                  ${formatNumber(totalExpenses)}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={e => {
              e.preventDefault();
              handleEditSave();
            }}
            className="grid gap-4 py-4"
          >
            <div className="grid gap-2">
              <Label htmlFor="edit-description">
                Description
              </Label>
              <Input
                id="edit-description"
                value={editingExpense?.description || ''}
                onChange={e =>
                  setEditingExpense(prev =>
                    prev
                      ? {
                          ...prev,
                          description: e.target.value,
                        }
                      : null
                  )
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-amount">
                Amount (USD)
              </Label>
              <Input
                id="edit-amount"
                type="number"
                step="0.01"
                value={editingExpense?.amount || ''}
                onChange={e =>
                  setEditingExpense(prev =>
                    prev
                      ? { ...prev, amount: e.target.value }
                      : null
                  )
                }
                required
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default MonthlyExpenses;
