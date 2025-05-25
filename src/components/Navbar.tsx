import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Home,
  ClipboardList,
  LogOut,
  Menu,
  X,
  DollarSign,
  Receipt,
  Bitcoin,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const isActive = (path: string) =>
    location.pathname === path;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground border-b border-primary-foreground/30 h-16">
        <div className="container h-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-4xl flex items-center justify-between px-4">
          <div className="hidden lg:flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2"
            >
              <Button
                variant={isActive('/') ? 'ghost' : 'ghost'}
                size="sm"
                className={`flex gap-2 items-center hover:bg-primary-foreground/20 ${isActive('/') ? 'bg-primary-foreground/20' : ''}`}
              >
                <Home size={18} />
                <span>Home</span>
              </Button>
            </Link>
            <Link
              to="/transactions"
              className="flex items-center gap-2"
            >
              <Button
                variant={
                  isActive('/transactions')
                    ? 'ghost'
                    : 'ghost'
                }
                size="sm"
                className={`flex gap-2 items-center hover:bg-primary-foreground/20 ${isActive('/transactions') ? 'bg-primary-foreground/20' : ''}`}
              >
                <ClipboardList size={18} />
                <span>Transactions</span>
              </Button>
            </Link>
            <Link
              to="/monthly-expenses"
              className="flex items-center gap-2"
            >
              <Button
                variant={
                  isActive('/monthly-expenses')
                    ? 'ghost'
                    : 'ghost'
                }
                size="sm"
                className={`flex gap-2 items-center hover:bg-primary-foreground/20 ${isActive('/monthly-expenses') ? 'bg-primary-foreground/20' : ''}`}
              >
                <Receipt size={18} />
                <span>Monthly Expenses</span>
              </Button>
            </Link>
            <Link
              to="/dollar"
              className="flex items-center gap-2"
            >
              <Button
                variant={
                  isActive('/dollar') ? 'ghost' : 'ghost'
                }
                size="sm"
                className={`flex gap-2 items-center hover:bg-primary-foreground/20 ${isActive('/dollar') ? 'bg-primary-foreground/20' : ''}`}
              >
                <DollarSign size={18} />
                <span>Dollar Rate</span>
              </Button>
            </Link>
            <Link
              to="/crypto"
              className="flex items-center gap-2"
            >
              <Button
                variant={
                  isActive('/crypto') ? 'ghost' : 'ghost'
                }
                size="sm"
                className={`flex gap-2 items-center hover:bg-primary-foreground/20 ${isActive('/crypto') ? 'bg-primary-foreground/20' : ''}`}
              >
                <Bitcoin size={18} />
                <span>Crypto</span>
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logout()}
              className="flex gap-2 items-center hover:bg-primary-foreground/20"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </Button>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="lg:hidden ml-auto"
          >
            <Menu
              size={24}
              className="text-primary-foreground"
            />
          </button>
        </div>
      </nav>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-64 bg-primary text-primary-foreground p-4">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-semibold">
                Menu
              </span>
              <button onClick={() => setIsOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <nav className="flex flex-col gap-6 p-2">
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2 p-2 rounded-md hover:bg-primary-foreground/20 ${isActive('/') ? 'bg-primary-foreground/20' : ''}`}
              >
                <Home size={18} />
                <span>Home</span>
              </Link>
              <Link
                to="/transactions"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2 p-2 rounded-md hover:bg-primary-foreground/20 ${isActive('/transactions') ? 'bg-primary-foreground/20' : ''}`}
              >
                <ClipboardList size={18} />
                <span>Transactions</span>
              </Link>
              <Link
                to="/monthly-expenses"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2 p-2 rounded-md hover:bg-primary-foreground/20 ${isActive('/monthly-expenses') ? 'bg-primary-foreground/20' : ''}`}
              >
                <Receipt size={18} />
                <span>Monthly Expenses</span>
              </Link>
              <Link
                to="/dollar"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2 p-2 rounded-md hover:bg-primary-foreground/20 ${isActive('/dollar') ? 'bg-primary-foreground/20' : ''}`}
              >
                <DollarSign size={18} />
                <span>Dollar Rate</span>
              </Link>
              <Link
                to="/crypto"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2 p-2 rounded-md hover:bg-primary-foreground/20 ${isActive('/crypto') ? 'bg-primary-foreground/20' : ''}`}
              >
                <Bitcoin size={18} />
                <span>Crypto</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 text-left bg-transparent border-none p-2 rounded-md hover:bg-primary-foreground/20"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
