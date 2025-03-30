import React, { useState, useEffect } from "react";

const Navbar = () => {
    const [darkTheme, setDarkTheme] = useState(false);

    useEffect(() => {
        if (darkTheme) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [darkTheme]);

    return (
        <nav className="flex items-center justify-between px-6 py-4 bg-gray-100 dark:bg-gray-800 shadow">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white" style={{userSelect: "none"}}>QubitVerse</h1>
            <div className="flex items-center space-x-5">
                <button
                    onClick={() => setDarkTheme((prev) => !prev)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded focus:outline-none"
                    style={{userSelect: "none"}}
                >
                    {darkTheme ? "Light Mode" : "Dark Mode"}
                </button>
                <a
                    href="https://github.com/Dark-CodeX/qubitverse"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                    style={{userSelect: "none"}}
                >
                    <img src="/Octicons-mark-github.svg" width={38} height={38} style={{ filter: "invert(1)", userSelect: "none"}}></img>
                </a>
            </div>
        </nav>
    );
};

export default Navbar;
