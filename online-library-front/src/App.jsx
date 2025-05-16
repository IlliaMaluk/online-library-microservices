import React, { useContext } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import BooksList from './components/BooksList.jsx';
import BookReader from './components/BookReader.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import AddBook from './components/AddBook.jsx';
import { AuthProvider, AuthContext } from './context/AuthContext.jsx';

function AppRoutes() {
    const { user, logout } = useContext(AuthContext);
    return (
        <>
            <nav className="bg-gray-100 p-3 flex justify-between">
                <div className="flex gap-4">
                    <Link to="/books" className="font-semibold">Книги</Link>
                </div>
                <div>
                    {user ? (
                        <button onClick={logout} className="text-red-500">Вийти</button>
                    ) : (
                        <>
                            <Link to="/login" className="mr-4">Увійти</Link>
                            <Link to="/register">Реєстрація</Link>
                        </>
                    )}
                </div>
            </nav>

            <Routes>
                <Route path="/" element={<Navigate to="/books" replace />} />
                <Route path="/books" element={<BooksList />} />
                <Route path="/books/:id" element={<BookReader />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/add-book" element={<AddBook />} />
            </Routes>
        </>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    );
}
