import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  User,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { migrateLocalDataToFirestore } from '../lib/db';
import { toast } from '../lib/toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<void>;
  signUp: (
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(
  null
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }
  return context;
};

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [migratedData, setMigratedData] =
    useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async user => {
        setUser(user);

        if (user && !migratedData) {
          try {
            const migrationKey = `migration-done-${user.uid}`;
            const alreadyMigrated =
              localStorage.getItem(migrationKey);

            if (alreadyMigrated) {
              setMigratedData(true);
              setLoading(false);
              return;
            }

            const hasLocalData =
              localStorage.getItem('accounts') ||
              localStorage.getItem('debts');

            if (hasLocalData) {
              setLoading(true);

              await migrateLocalDataToFirestore(user);

              localStorage.setItem(migrationKey, 'true');

              toast.success('Data migrated successfully');
            }

            setMigratedData(true);
          } catch (error) {
            console.error('Error migrating data:', error);
            toast.error('Error migrating data');
          } finally {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      }
    );

    return unsubscribe;
  }, [migratedData]);

  const signIn = async (
    email: string,
    password: string
  ) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (
    email: string,
    password: string
  ) => {
    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
  };

  const logout = async () => {
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
