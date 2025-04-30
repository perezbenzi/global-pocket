
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Account } from "@/types";

interface AddAccountFormProps {
  onAddAccount: (account: Omit<Account, "id">) => void;
  onUpdateAccount?: (account: Account) => void;
  account?: Account;
}

const AddAccountForm = ({ onAddAccount, onUpdateAccount, account }: AddAccountFormProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const isEditing = Boolean(account);

  useEffect(() => {
    if (account) {
      setName(account.name);
      setBalance(account.balance.toString());
    }
  }, [account]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !balance) return;
    
    if (isEditing && account && onUpdateAccount) {
      onUpdateAccount({
        ...account,
        name,
        balance: parseFloat(balance),
      });
    } else {
      onAddAccount({
        name,
        balance: parseFloat(balance),
      });
    }
    
    // Reset form
    setName("");
    setBalance("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full flex gap-2 items-center">
          <Plus size={16} />
          {isEditing ? "Editar Cuenta" : "Agregar Cuenta"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Cuenta" : "Agregar Nueva Cuenta"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre de la Cuenta</Label>
            <Input
              id="name"
              placeholder="Banco, Efectivo, etc."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="balance">Balance (USD)</Label>
            <Input
              id="balance"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full mt-2">
            {isEditing ? "Actualizar" : "Agregar"} Cuenta
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAccountForm;
