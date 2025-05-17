import { createContext, useState } from 'react';

export const BookContext = createContext();

export function BookProvider({ children }) {
    const [bookInfo, setBookInfo] = useState(null);
    return (
        <BookContext.Provider value={{ bookInfo, setBookInfo }}>
            {children}
        </BookContext.Provider>
    );
}