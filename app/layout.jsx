'use client'

import { useState, useEffect, createContext } from 'react'
import './globals.css'
import { Cairo } from 'next/font/google'

export const DarkModeContext = createContext()

const cairo = Cairo({
    subsets: ['arabic'],
    weight: ['400', '600', '700'],
})

export default function RootLayout({ children }) {
    const [darkMode, setDarkMode] = useState(false)

    useEffect(() => {
        const stored = localStorage.getItem('darkMode')
        if (stored === 'true') setDarkMode(true)
    }, [])

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark')
            localStorage.setItem('darkMode', 'true')
        } else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('darkMode', 'false')
        }
    }, [darkMode])

    return (
        <html lang="ar" dir="rtl" className={darkMode ? 'dark' : ''}>
            <body className={`${cairo.className} transition-colors duration-500`}>
                <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
                    {children}
                </DarkModeContext.Provider>
            </body>
        </html>
    )
}
