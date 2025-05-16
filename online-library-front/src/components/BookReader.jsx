import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Document, Page } from 'react-pdf';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function BookReader() {
    const { id } = useParams();
    const token = localStorage.getItem('token');
    const userId = token ? jwtDecode(token).sub : null;

    const [book, setBook] = useState(null);
    const [progress, setProgress] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [page, setPage] = useState(1);

    useEffect(() => {
        if (!userId) return;

        const loadBookAndProgress = async () => {
            try {
                const bookRes = await axios.get(`http://localhost:3000/books/${id}`);
                setBook(bookRes.data);

                const progressRes = await axios.get(`http://localhost:3000/reading-progress/${userId}`);
                const allProgress = progressRes.data;
                const existing = allProgress.find(r => r.book_id === id);

                if (existing) {
                    setProgress(existing);
                    setPage(existing.current_page);
                } else {
                    const createRes = await axios.post(`http://localhost:3000/reading-progress`, {
                        user_id: userId,
                        book_id: id,
                        current_page: 1,
                        percentage_read: 0
                    });
                    setProgress(createRes.data);
                    setPage(1);
                }
            } catch (err) {
                console.error('Load progress failed:', err);
            }
        };

        loadBookAndProgress();
    }, [id, userId]);



    const saveProgress = useCallback((newPage, newPct) => {
        if (!progress) return;

        axios.put(`http://localhost:3000/reading-progress/${progress.id}`, {
            current_page: newPage,
            percentage_read: newPct
        }).catch(console.error);
    }, [progress]);


    const goPage = (offset) => {
        const next = page + offset;
        if (next < 1 || next > numPages) return;
        const newPct = Math.round((next / numPages) * 100);
        setPage(next);
        setProgress(p => ({ ...p, current_page: next, percentage_read: newPct }));
        saveProgress(next, newPct);
    };

    // Використовуємо локальний файл як fallback, якщо book.file_url не валідний
    const file = useMemo(() => {
        const isExternal = book?.file_url?.startsWith('http') && !book.file_url.includes('localhost:5173');
        return {
            url: isExternal
                ? `/pdf-proxy?url=${encodeURIComponent(book.file_url)}`
                : book?.file_url // напряму, якщо з localhost
        };
    }, [book?.file_url]);


    if (!book) return <p>Завантаження книги…</p>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-2">{book.title}</h1>
            <p className="mb-4">
                Прочитано: {progress?.percentage_read ?? 0}% (сторінка {page} з {numPages ?? '…'})
            </p>

            <div className="flex items-center gap-4 mb-4">
                <button
                    onClick={() => goPage(-1)}
                    disabled={page <= 1}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >← Назад</button>
                <button
                    onClick={() => goPage(1)}
                    disabled={numPages && page >= numPages}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >Вперед →</button>
            </div>

            <Document
                file={file}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                loading={<p>Завантаження PDF…</p>}
                error={<p>Не вдалося завантажити PDF.</p>}
            >
                <Page pageNumber={page} />
            </Document>
        </div>
    );
}
