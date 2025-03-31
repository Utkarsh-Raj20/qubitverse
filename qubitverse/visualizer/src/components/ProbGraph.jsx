import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";



export default function InteractiveBarGraph({ probs }) {
    const [activeIndex, setActiveIndex] = useState(null);

    return (
        <div style={{
            width: "100%",
            height: "calc(100vh - 185px)",
        }}>
            <ResponsiveContainer style={{
                width: "100%",
                height: "calc(100vh - 185px)",
            }}>
                <BarChart data={probs} onMouseLeave={() => setActiveIndex(null)}>
                    <CartesianGrid strokeDasharray="15 15" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                        contentStyle={{ background: "#F8F1E7", fontWeight: "bold", borderRadius: "5px", padding: "10px", boxShadow: "0px 0px 10px rgba(0,0,0,0.2)" }}
                        labelFormatter={(name) => [`${name}: |${Number(name).toString(2)}〉`]}
                        formatter={(value) => [`Probability: ${value}`]}
                    />
                    <Bar
                        cursor="pointer"
                        dataKey="value"
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