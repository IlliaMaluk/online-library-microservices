import React, {useContext, useEffect, useState} from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import BooksList from './components/BooksList.jsx';
import BookReader from './components/BookReader.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import AddBook from './components/AddBook.jsx';
import { AuthProvider, AuthContext } from './context/AuthContext.jsx';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import {BookContext, BookProvider} from './context/BookContext.jsx';
import { useLocation } from 'react-router-dom';

function AppRoutes() {
    const { user, logout } = useContext(AuthContext);
    const { bookInfo } = useContext(BookContext);
    const [showHeader, setShowHeader] = useState(true);
    const location = useLocation();
    const isBooksListPage = location.pathname === '/books';
    const isReadingPage = /^\/books\/[^\/]+$/.test(location.pathname);

    useEffect(() => {
        if (!isReadingPage) {
            setShowHeader(true);
            return;
        }

        const handleMouseMove = (e) => {
            setShowHeader(e.clientY < 60);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isReadingPage]);

    return (
        <>
            <nav
                className={`fixed top-0 w-full z-50 bg-white shadow p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 transition-all duration-300 ease-in-out
    ${showHeader ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}
            >
                <div className="flex justify-center sm:justify-start gap-4">
                    <Link to="/books" className="text-lg font-medium text-blue-600 hover:underline">
                        Книги
                    </Link>
                </div>

                {bookInfo && (
                    <div className="text-center text-gray-800 text-base font-medium">
                        {bookInfo.title} | Сторінка {bookInfo.page} з {bookInfo.numPages} ({bookInfo.percentage}%)
                    </div>
                )}

                <div className="flex justify-center sm:justify-end gap-3 flex-wrap">
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

            <main
                className={`bg-gray-50 min-h-screen flex justify-center px-4 ${
                    isBooksListPage ? 'pt-24' : isReadingPage ? 'pt-4' : 'pt-0'
                }`}
            >
                <div className="w-full max-w-screen-lg">
                    <Routes>
                        <Route path="/" element={<Navigate to="/books" replace />} />
                        <Route path="/books" element={<BooksList />} />
                        <Route path="/books/:id" element={<BookReader />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/add-book" element={<AddBook />} />
                    </Routes>
                </div>
            </main>
        </>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <BookProvider>
                <AppRoutes />
            </BookProvider>
        </AuthProvider>
    );
}