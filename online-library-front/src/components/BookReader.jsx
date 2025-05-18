import React, {
    useState,
    useEffect,
    useCallback,
    useMemo,
    useContext,
    useRef
} from 'react';
import { Document, Page } from 'react-pdf';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { BookContext } from '../context/BookContext';

export default function BookReader() {
    const { id } = useParams();
    const token = localStorage.getItem('token');
    const userId = token ? jwtDecode(token).sub : null;

    const [book, setBook] = useState(null);
    const [progress, setProgress] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [page, setPage] = useState(1);

    const { setBookInfo } = useContext(BookContext);
    const containerRef = useRef(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setWidth(containerRef.current.offsetWidth);
            }
        };
        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    useEffect(() => {
        if (book && progress) {
            setBookInfo({
                title: book.title,
                page,
                numPages,
                percentage: progress.percentage_read
            });
        }
        return () => setBookInfo(null);
    }, [book, page, progress, numPages, setBookInfo]);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const { data } = await axios.get(`http://localhost:3000/books/${id}`);
                setBook(data);
            } catch (err) {
                console.error('Помилка при завантаженні книги:', err);
            }
        };
        fetchBook();
    }, [id]);

    useEffect(() => {
        if (!userId || !book) return;

        const loadProgress = async () => {
            try {
                const { data: all } = await axios.get(
                    `http://localhost:3000/reading-progress/${userId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const existing = all.find(r => r.book_id === id);
                if (existing) {
                    setProgress(existing);
                    setPage(existing.current_page);
                } else {
                    const { data: created } = await axios.post(
                        `http://localhost:3000/reading-progress`,
                        {
                            user_id: userId,
                            book_id: id,
                            current_page: 1,
                            percentage_read: 0
                        },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setProgress(created);
                    setPage(1);
                }
            } catch (err) {
                console.error('Load progress failed:', err);
            }
        };

        loadProgress();
    }, [id, userId, book, token]);

    const saveProgress = useCallback(
        (newPage, newPct) => {
            if (!progress || !userId || newPage <= progress.current_page) return;
            axios
                .put(
                    `http://localhost:3000/reading-progress/${progress.id}`,
                    { current_page: newPage, percentage_read: newPct },
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then(({ data }) => setProgress(data))
                .catch(console.error);
        },
        [progress, userId, token]
    );

    const goPage = offset => {
        if (!numPages) return;
        if (!userId) {
            setPage(p => {
                const nxt = p + offset;
                return Math.min(Math.max(nxt, 1), numPages);
            });
            return;
        }
        const next = page + offset;
        if (next < 1 || next > numPages) return;
        setPage(next);
        if (next > (progress?.current_page || 0)) {
            const newPct = Math.round((next / numPages) * 100);
            saveProgress(next, newPct);
        }
    };


    const file = useMemo(() => {
        const isExternal =
            book?.file_url?.startsWith('http') &&
            !book.file_url.includes('localhost:5173');
        return {
            url: isExternal
                ? `/pdf-proxy?url=${encodeURIComponent(book.file_url)}`
                : book?.file_url
        };
    }, [book?.file_url]);

    if (!book)
        return (
            <div className="text-center py-10 text-lg text-gray-600">
                Завантаження книги…
            </div>
        );

    return (
        <div className="container mx-auto px-4 pt-2 pb-4">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6 sm:flex-nowrap">
                <button
                    onClick={() => goPage(-1)}
                    disabled={page <= 1}
                    className="w-full sm:w-auto px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                    ← Назад
                </button>

                <div
                    className="shadow-md overflow-auto w-full max-w-[90vw] sm:max-w-[600px] mx-auto"
                    ref={containerRef}
                >
                    <Document
                        file={file}
                        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                        loading={<p>Завантаження PDF…</p>}
                        error={<p>Не вдалося завантажити PDF.</p>}
                    >
                        <Page pageNumber={page} width={width} />
                    </Document>
                </div>

                <button
                    onClick={() => goPage(1)}
                    disabled={numPages && page >= numPages}
                    className="w-full sm:w-auto px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                    Вперед →
                </button>
            </div>

                <p className="text-center mt-2 text-gray-700">
                    Сторінка {page} з {numPages}
                </p>
        </div>
    );
}