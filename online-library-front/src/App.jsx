import React, { useContext } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import BooksList from './components/BooksList.jsx';
import BookReader from './components/BookReader.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import AddBook from './components/AddBook.jsx';
import { AuthProvider, AuthContext } from './context/AuthContext.jsx';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';


function AppRoutes() {
    const { user, logout } = useContext(AuthContext);
    return (
        <>
            <nav className="bg-white shadow p-4 flex justify-between items-center">
                <div className="flex gap-6">
                    <Link to="/books" className="text-lg font-medium text-blue-600 hover:underline">
                        📚 Книги
                    </Link>
                </div>
                <div className="flex gap-4">
                    {user ? (
                        <>
                            <span className="text-gray-600">👤 {user.username}</span>
                            <button
                                onClick={logout}
                                className="text-red-500 hover:underline"
                            >
                                Вийти
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-blue-500 hover:underline">
                                Увійти
                            </Link>
                            <Link to="/register" className="text-green-600 hover:underline">
                                Реєстрація
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            <main className="bg-gray-50 min-h-screen flex justify-center px-4">
                <Routes>
                    <Route path="/" element={<Navigate to="/books" replace />} />
                    <Route path="/books" element={<BooksList />} />
                    <Route path="/books/:id" element={<BookReader />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/add-book" element={<AddBook />} />
                </Routes>
            </main>
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