import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';

function NQubitInput({ numQubits, setQubits }) {
    const [tempQ, setTempQ] = useState('');
    const [error, setError] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleChange = (e) => {
        setTempQ(e.target.value);
        setError('');
    };

    const handleConfirm = () => {
        if (tempQ.trim() === '') {
            setError('');
            return;
        }

        const parsedValue = parseInt(tempQ.trim(), 10);

        if (/^\d+$/.test(tempQ.trim()) === false) {
            setError('Please enter a valid and positive number.');
            setQubits(null);
            inputRef.current.focus();
        } else if (isNaN(parsedValue) || parsedValue < 1 || !isFinite(parsedValue)) {
            setError('Please enter a number greater than or equal to 1.');
            setQubits(null);
            inputRef.current.focus();
        } else {
            setError('');
            setQubits(parsedValue);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleConfirm();
        }
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                userSelect: "none",
                width: "100%",
                maxWidth: "500px",
                alignItems: "center",
                justifyContent: "center",
                top: "50%",
                left: "50%",
                position: "absolute",
                transform: "translate(-50%, -50%)",
                border: "solid 3px",
                borderRadius: "8px",
                padding: "2rem",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
                backgroundColor: "#fff",
            }}
        >
            <h1 className="text-2xl font-bold mb-4 text-center">
                Enter Number of Qubits
            </h1>
            <input
                ref={inputRef}
                //type="number"
                value={tempQ}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Number of Qubits"
                min="1"
            />
            <Button
                variant="outline"
                className="w-full py-2"
                onClick={handleConfirm}
            >
                Confirm
            </Button>
            <Button
                variant="ghost"
                className="w-full text-sm text-gray-500"
                onClick={() => {
                    setTempQ('');
                    setError('');
                    setQubits(null);
                    inputRef.current.focus();
                }}
            >
                Reset
            </Button>
            {error && <p className="text-red-500 text-sm mt-2" style={{ fontFamily: "monospace, monospace",}}>{error}</p>}
        </div>
    );
}

export default NQubitInput;
