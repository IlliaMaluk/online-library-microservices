import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function AddBook() {
    const [form, setForm] = useState({
        title: '',
        author: '',
        genre: '',
        description: '',
        publicationYear: '',
        fileUrl: ''
    });

    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    if (!user || user.role !== 'admin') {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-lg font-semibold text-red-600">Немає доступу</p>
            </div>
        );
    }

    const handleChange = e => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = e => {
        e.preventDefault();
        axios.post('http://localhost:3000/books', {
            title: form.title,
            author: form.author,
            genre: form.genre,
            description: form.description,
            publication_year: parseInt(form.publicationYear, 10),
            file_url: form.fileUrl
        })
            .then(() => navigate('/books'))
            .catch(console.error);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Додати книгу</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="title"
                        type="text"
                        placeholder="Назва книги"
                        value={form.title}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        name="author"
                        type="text"
                        placeholder="Автор"
                        value={form.author}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        name="genre"
                        type="text"
                        placeholder="Жанр"
                        value={form.genre}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <textarea
                        name="description"
                        placeholder="Опис"
                        value={form.description}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        name="publicationYear"
                        type="number"
                        placeholder="Рік публікації"
                        value={form.publicationYear}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        name="fileUrl"
                        type="text"
                        placeholder="URL PDF-файлу"
                        value={form.fileUrl}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
                    >
                        Створити книгу
                    </button>
                </form>
            </div>
        </div>
    );
}