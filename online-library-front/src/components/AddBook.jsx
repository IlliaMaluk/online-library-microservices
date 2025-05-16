import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function AddBook() {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [genre, setGenre] = useState('');
    const [description, setDescription] = useState('');
    const [publicationYear, setPublicationYear] = useState('');
    const [fileUrl, setFileUrl] = useState('');
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    if (!user || user.role !== 'admin') return <p>Немає доступу</p>;

    const handleSubmit = e => {
        e.preventDefault();
        axios.post('http://localhost:3000/books', {
            title, author, genre, description,
            publication_year: parseInt(publicationYear, 10),
            file_url: fileUrl
        })
            .then(() => navigate('/books'))
            .catch(console.error);
    };

    return (
        <div className="container mx-auto p-4 max-w-md">
            <h2 className="text-xl font-bold mb-4">Додати книгу</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                {['Title', 'Author', 'Genre', 'Description', 'Publication Year', 'File URL'].map((label, idx) => (
                    <input
                        key={idx}
                        type={label === 'Publication Year' ? 'number' : 'text'}
                        placeholder={label}
                        value={{
                            'Title': title,
                            'Author': author,
                            'Genre': genre,
                            'Description': description,
                            'Publication Year': publicationYear,
                            'File URL': fileUrl
                        }[label]}
                        onChange={e => {
                            const val = e.target.value;
                            switch(label) {
                                case 'Title': setTitle(val); break;
                                case 'Author': setAuthor(val); break;
                                case 'Genre': setGenre(val); break;
                                case 'Description': setDescription(val); break;
                                case 'Publication Year': setPublicationYear(val); break;
                                case 'File URL': setFileUrl(val); break;
                            }
                        }}
                        className="border p-2 rounded"
                        required
                    />
                ))}
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Створити
                </button>
            </form>
        </div>
    );
}