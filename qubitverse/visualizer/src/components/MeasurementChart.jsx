import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

function array_to_freq_table(a) {
    const data = new Map();
    a.forEach(i => { data.set(i, (data.get(i) || 0) + 1); });
    return Array.from(data, ([val, freq]) => ({ val, freq }));
}

export default function MeasurementChart({ hist }) {
    // hist is a list of numbers, we need to convert it into freq. table that means how much an item has occurred in the list
    const [activeIndex, setActiveIndex] = useState(null);
    const freqTable = array_to_freq_table(hist);
    return (
        <div style={{
            width: "100%",
            height: "calc(100vh - 185px)",
        }}>
            <ResponsiveContainer style={{
                width: "100%",
                height: "calc(100vh - 185px)",
            }}>
                <BarChart data={freqTable} onMouseLeave={() => setActiveIndex(null)}>
                    <CartesianGrid strokeDasharray="15 15" />
                    <XAxis dataKey="val" />
                    <YAxis/>
                    <Tooltip
                        contentStyle={{ background: "#F8F1E7", fontWeight: "bold", borderRadius: "5px", padding: "10px", boxShadow: "0px 0px 10px rgba(0,0,0,0.2)" }}
                        labelFormatter={(name) => [`Measured Value: ${name}`]}
                        formatter={(value) => [`Frequency: ${value}`]}
                    />
                    <Bar
                        cursor="pointer"
                        dataKey="freq"
                        fill="#5A90E7"
                        onMouseOver={(_, index) => setActiveIndex(index)}
                        barSize={30}
                        radius={[5, 5, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}