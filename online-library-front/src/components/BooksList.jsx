import { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext.jsx'

export default function BooksList() {
    const { user } = useContext(AuthContext)
    const [books, setBooks] = useState([])
    const [genreFilter, setGenreFilter] = useState('')
    const [authorFilter, setAuthorFilter] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 5
    const navigate = useNavigate()

    useEffect(() => {
        axios
            .get('http://localhost:3000/books', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            })
            .then(res => setBooks(res.data))
            .catch(console.error)
    }, [])

    const handleDelete = async bookId => {
        if (!window.confirm('Ви впевнені, що хочете видалити цю книгу?')) return

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };

            await axios.delete(`http://localhost:3000/books/${bookId}`, config);

            const userId = JSON.parse(atob(token.split('.')[1])).sub;
            const res = await axios.get(`http://localhost:3000/reading-progress/${userId}`, config);

            const progress = res.data.find(p => p.book_id === bookId);

            if (progress) {
                await axios.delete(`http://localhost:3000/reading-progress/${progress.id}`, config);
            }

            setBooks(prev => prev.filter(b => b.id !== bookId));
        } catch (err) {
            console.error('Помилка при видаленні книги або прогресу:', err);
            alert('Не вдалося повністю видалити книгу. Подивіться консоль.');
        }
    };

    const filtered = books
        .filter(b => !genreFilter || b.genre.toLowerCase().includes(genreFilter.toLowerCase()))
        .filter(b => !authorFilter || b.author.toLowerCase().includes(authorFilter.toLowerCase()))

    const totalPages = Math.ceil(filtered.length / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const paginated = filtered.slice(startIndex, startIndex + pageSize)

    const goToPage = page => {
        if (page < 1 || page > totalPages) return
        setCurrentPage(page)
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Каталог книг</h1>
                {user?.role === 'admin' && (
                    <button
                        onClick={() => navigate('/add-book')}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        + Додати книгу
                    </button>
                )}
            </div>

            <div className="flex gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Фільтр за жанром"
                    value={genreFilter}
                    onChange={e => {
                        setGenreFilter(e.target.value)
                        setCurrentPage(1)
                    }}
                    className="border p-2 rounded"
                />
                <input
                    type="text"
                    placeholder="Фільтр за автором"
                    value={authorFilter}
                    onChange={e => {
                        setAuthorFilter(e.target.value)
                        setCurrentPage(1)
                    }}
                    className="border p-2 rounded"
                />
            </div>

            {paginated.length === 0 ? (
                <p>Нічого не знайдено.</p>
            ) : (
                <ul className="space-y-4">
                    {paginated.map(book => (
                        <li
                            key={book.id}
                            className="border p-4 rounded shadow-sm hover:shadow-md transition"
                        >
                            <h2 className="text-xl font-semibold">{book.title}</h2>
                            <p className="mt-1">
                                <strong>Автор:</strong> {book.author} <br />
                                <strong>Жанр:</strong> {book.genre}
                            </p>
                            <p className="mt-2 text-gray-700">{book.description}</p>
                            <div className="mt-3 flex gap-2">
                                <button
                                    onClick={() => navigate(`/books/${book.id}`)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Деталі / Читати
                                </button>
                                {user?.role === 'admin' && (
                                    <button
                                        onClick={() => handleDelete(book.id)}
                                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                    >
                                        🗑 Видалити
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-6">
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                    >
                        ←
                    </button>
                    {[...Array(totalPages)].map((_, idx) => {
                        const page = idx + 1
                        return (
                            <button
                                key={page}
                                onClick={() => goToPage(page)}
                                className={`px-3 py-1 rounded ${
                                    page === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-100'
                                }`}
                            >
                                {page}
                            </button>
                        )
                    })}
                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                    >
                        →
                    </button>
                </div>
            )}
        </div>
    )
}
