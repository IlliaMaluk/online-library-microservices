import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = e => {
        e.preventDefault();
        login(username, password)
            .then(() => navigate('/books'))
            .catch(() => setError('Невірний логін або пароль'));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md w-full max-w-sm">
                <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 text-gray-900">Вхід до системи</h2>
                {error && <p className="text-red-500 text-center mb-2 text-sm sm:text-base">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Ім'я користувача"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
                    >
                        Увійти
                    </button>
                </form>
            </div>
        </div>
    );
}