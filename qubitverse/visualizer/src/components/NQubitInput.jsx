import React, { useState, useRef, useEffect } from 'react';
import { LineChart, Legend, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { Button } from './ui/button';

function NQubitInput({ setQubits }) {
    const [tempQ, setTempQ] = useState('');
    const [error, setError] = useState('');
    const [lineData, setLineData] = useState([]);
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const validate_input = (x) => {
        if (/^\d+$/.test(x.trim()) === false) {
            setError('Please enter a valid and positive number.');
            setQubits(null);
            inputRef.current.focus();
            return null;
        }
        const parsedValue = parseInt(x.trim(), 10);

        if (isNaN(parsedValue) || parsedValue < 1 || !isFinite(parsedValue)) {
            setError('Please enter a number greater than or equal to 1.');
            setQubits(null);
            inputRef.current.focus();
        } else {
            setError('');
        }

        return parsedValue;
    }

    const handleChange = (e) => {
        setTempQ(e.target.value);
        const parsed = validate_input(e.target.value);

        if (error == '' || parsed !== null) {
            const newData = [];
            for (let i = 1; i <= parsed; i++) {
                newData.push({
                    name: `Qubit ${i}`,
                    qubits: i,
                    bytes: Math.pow(2, i) * 16
                });
            }
            setLineData(newData);
        }
        else
            setLineData([]);
    };

    const handleConfirm = () => {
        if (tempQ.trim() === '') {
            setError('');
            return;
        }

        const x = validate_input(tempQ);
        if (error == '' && x !== null) {
            setLineData([]);
            setQubits(x);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleConfirm();
        }
    };

    return (
        <div style={{
            display: "flex"
        }}>
            <div style={{ height: "600px", width: "50%" }}>
                <div style={{ height: "480px", width: "100%", marginLeft: "20px" }}>
                    {lineData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%" style={{ marginTop: "100px", marginLeft: "30px" }}>
                            <LineChart data={lineData} margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="qubits" label={{ value: 'Qubits', position: 'insideBottom', offset: -5 }} />
                                <YAxis
                                    label={{ value: "", angle: -90, position: 'insideLeft', offset: 50 }}
                                    tickFormatter={(val) => {
                                        if (val >= 1e15) return `${(val / 1e15).toFixed(1)} PB`;
                                        if (val >= 1e12) return `${(val / 1e12).toFixed(1)} TB`;
                                        if (val >= 1e9) return `${(val / 1e9).toFixed(1)} GB`;
                                        if (val >= 1e6) return `${(val / 1e6).toFixed(1)} MB`;
                                        if (val >= 1e3) return `${(val / 1e3).toFixed(1)} KB`;
                                        return `${val} B`;
                                    }}
                                />
                                <Tooltip
                                    contentStyle={{ background: "#F8F1E7", fontWeight: "bold", borderRadius: "5px", padding: "10px", boxShadow: "0px 0px 10px rgba(0,0,0,0.2)" }}
                                    formatter={(val) =>
                                        [val >= 1e15 ? `Mem. Required: ${(val / 1e15).toFixed(1)} PB` :
                                            val >= 1e12 ? `Mem. Required: ${(val / 1e12).toFixed(1)} TB` :
                                                val >= 1e9 ? `Mem. Required: ${(val / 1e9).toFixed(1)} GB` :
                                                    val >= 1e6 ? `Mem. Required: ${(val / 1e6).toFixed(1)} MB` :
                                                        val >= 1e3 ? `Mem. Required: ${(val / 1e3).toFixed(1)} KB` :
                                                            `${val} B`]
                                    }
                                    labelFormatter={(name) => [`Qubits: ${name}`]} />
                                <Legend />
                                <Line type="monotone" dataKey="bytes" stroke="#82ca9d" dot />
                            </LineChart>
                        </ResponsiveContainer>

                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-500">
                            Chart will appear here once you enter a number.
                        </div>
                    )}
                </div>
            </div>
            <div style={{
                width: "50%",
                height: "600px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
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
                        type="number"
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
                    {error.length > 0 && <p className="text-red-500 text-sm mt-2" style={{ fontFamily: "monospace, monospace", }}>{error}</p>}
                </div>
            </div>
        </div>
    );
}

export default NQubitInput;