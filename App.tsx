import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { User, Item, NewItem } from './types';
import { api } from './services/api';
import { GoogleIcon, PlusIcon, EditIcon, TrashIcon, LogOutIcon, Spinner } from './components/Icons';
import ItemModal from './components/ItemModal';

// Auth Component - Defined outside App to prevent re-creation on re-renders
const AuthComponent: React.FC<{
    onLogin: (email: string, pass: string) => void;
    onSignup: (name: string, email: string, pass: string) => void;
    onOAuth: () => void;
    loading: boolean;
    error: string | null;
}> = ({ onLogin, onSignup, onOAuth, loading, error }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('demo@example.com');
    const [password, setPassword] = useState('password');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (isLogin) {
            onLogin(email, password);
        } else {
            onSignup(name, email, password);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
            <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-2">
                    {isLogin ? 'Welcome Back!' : 'Create Account'}
                </h1>
                <p className="text-center text-slate-500 dark:text-slate-400 mb-8">
                    {isLogin ? 'Sign in to continue' : 'Get started with your new account'}
                </p>

                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-6" role="alert">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {!isLogin && (
                        <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-2 border-transparent focus:border-indigo-500 focus:outline-none rounded-lg transition" />
                    )}
                    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-2 border-transparent focus:border-indigo-500 focus:outline-none rounded-lg transition" />
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-2 border-transparent focus:border-indigo-500 focus:outline-none rounded-lg transition" />
                    <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors flex items-center justify-center h-12">
                        {loading ? <Spinner /> : (isLogin ? 'Login' : 'Sign Up')}
                    </button>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-300 dark:border-slate-600" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">Or continue with</span>
                    </div>
                </div>

                <button onClick={onOAuth} disabled={loading} className="w-full flex items-center justify-center bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold py-3 px-4 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                    <GoogleIcon /> Login with Google
                </button>

                <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}
                    <button onClick={() => setIsLogin(!isLogin)} className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline ml-1">
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
};

// Dashboard Component
const DashboardComponent: React.FC<{
    user: User;
    items: Item[];
    onLogout: () => void;
    onAddItem: () => void;
    onEditItem: (item: Item) => void;
    onDeleteItem: (itemId: string) => void;
    loadingItems: boolean;
}> = ({ user, items, onLogout, onAddItem, onEditItem, onDeleteItem, loadingItems }) => {
    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-50">
            <header className="bg-white dark:bg-slate-800 shadow-md sticky top-0 z-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Dashboard</h1>
                        <div className="flex items-center space-x-4">
                            <span className="hidden sm:block">Welcome, <strong className="font-semibold">{user.name}</strong>!</span>
                            <button onClick={onLogout} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" aria-label="Logout">
                                <LogOutIcon />
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Your Items</h2>
                    <button onClick={onAddItem} className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2">
                        <PlusIcon />
                        <span>Add Item</span>
                    </button>
                </div>
                {loadingItems ? (
                     <div className="text-center py-10 flex justify-center"><Spinner /></div>
                ) : items.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {items.map(item => (
                            <div key={item.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-5 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                                    <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">{item.description}</p>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-700">
                                    <p className="text-xs text-slate-400 dark:text-slate-500">
                                        Created: {item.createdAt.toLocaleDateString()}
                                    </p>
                                    <div className="flex space-x-2">
                                        <button onClick={() => onEditItem(item)} className="p-2 text-slate-500 hover:text-blue-500 transition-colors" aria-label="Edit Item"><EditIcon /></button>
                                        <button onClick={() => onDeleteItem(item.id)} className="p-2 text-slate-500 hover:text-red-500 transition-colors" aria-label="Delete Item"><TrashIcon /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-2">No items yet!</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-4">Click "Add Item" to get started.</p>
                    </div>
                )}
            </main>
        </div>
    );
};


// Main App Component
function App() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Item | null>(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [loadingItems, setLoadingItems] = useState(true);

    const fetchItems = useCallback(async () => {
        if (!currentUser) return;
        setLoadingItems(true);
        try {
            const userItems = await api.getItems();
            setItems(userItems);
        } catch (error) {
            console.error("Failed to fetch items:", error);
        } finally {
            setLoadingItems(false);
        }
    }, [currentUser]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) {
            localStorage.setItem('token', token);
            // Clean the URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
        
        const checkUser = async () => {
            try {
                const user = await api.getCurrentUser();
                setCurrentUser(user);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        checkUser();
    }, []);

    useEffect(() => {
        if (currentUser) {
            fetchItems();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);

    const handleLogin = async (email: string, pass: string) => {
        setLoading(true);
        setAuthError(null);
        try {
            const user = await api.login(email, pass);
            setCurrentUser(user);
        } catch (error) {
            setAuthError(error instanceof Error ? error.message : 'An unknown error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (name: string, email: string, pass: string) => {
        setLoading(true);
        setAuthError(null);
        try {
            const user = await api.signup(name, email, pass);
            setCurrentUser(user);
        } catch (error) {
            setAuthError(error instanceof Error ? error.message : 'An unknown error occurred.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleOAuth = () => {
        // Redirect to the backend for Google OAuth
        window.location.href = '/api/auth/google/login';
    }

    const handleLogout = async () => {
        await api.logout();
        setCurrentUser(null);
        setItems([]);
    };



    const handleOpenModal = (item: Item | null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleSaveItem = async (itemData: NewItem | (NewItem & { id: string })) => {
        if (!currentUser) return;
        setModalLoading(true);
        try {
            if ('id' in itemData) {
                // Update
                const { id, ...updates } = itemData;
                await api.updateItem(id, updates);
            } else {
                // Create
                await api.createItem(itemData);
            }
            await fetchItems(); // Refetch items
            handleCloseModal();
        } catch (error) {
            console.error("Failed to save item:", error);
        } finally {
            setModalLoading(false);
        }
    };

    const handleDeleteItem = async (itemId: string) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                await api.deleteItem(itemId);
                await fetchItems(); // Refetch items
            } catch (error) {
                console.error("Failed to delete item:", error);
            }
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900"><Spinner /></div>;
    }

    return (
        <>
            {!currentUser ? (
                <AuthComponent onLogin={handleLogin} onSignup={handleSignup} onOAuth={handleOAuth} loading={loading} error={authError} />
            ) : (
                <DashboardComponent 
                    user={currentUser}
                    items={items}
                    onLogout={handleLogout}
                    onAddItem={() => handleOpenModal(null)}
                    onEditItem={(item) => handleOpenModal(item)}
                    onDeleteItem={handleDeleteItem}
                    loadingItems={loadingItems}
                />
            )}
            <ItemModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveItem}
                itemToEdit={editingItem}
                isLoading={modalLoading}
            />
        </>
    );
}

export default App;
