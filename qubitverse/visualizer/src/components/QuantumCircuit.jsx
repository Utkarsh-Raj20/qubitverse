import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Line, Rect, Text, Group, Circle } from "react-konva";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import CircuitDataExtractor from "./circuitDataExtractor";
import { Button } from "./ui/button";

// =======================
// CONFIG CONSTANTS
// =======================
const qubitSpacing = 50; // vertical spacing between qubit lines
export const numQubits = 50;     // Q0 through Qn
const gateSize = 45;     // width/height for single-qubit gate squares
const canvasMinX = 50;   // left bound for gates on the stage
const canvasMaxX = window.innerWidth - 175 - gateSize; // right bound so gate stays visible

// =======================
// GATE LIST
// =======================
const gatesList = [
    "I", "X", "Y", "Z", "H", "S", "T", "P",
    "Rx", "Ry", "Rz",
    "CNOT", "CZ", "SWAP"
];

// =======================
// GATE TOOLTIP DATA (LaTeX + descriptions)
// =======================
const gateTooltips = {
    I: {
        desc: "Identity Gate",
        latex: "$$I = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}$$",
    },
    X: {
        desc: "Pauli-X (NOT) Gate",
        latex: "$$X = \\begin{pmatrix}0 & 1\\\\ 1 & 0\\end{pmatrix}$$",
    },
    Y: {
        desc: "Pauli-Y Gate",
        latex: "$$Y = \\begin{pmatrix}0 & -i\\\\ i & 0\\end{pmatrix}$$",
    },
    Z: {
        desc: "Pauli-Z Gate",
        latex: "$$Z = \\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}$$",
    },
    S: {
        desc: "Phase π/2 Shift",
        latex: "$$S = \\begin{pmatrix} 1 & 0 \\\\ 0 & i \\end{pmatrix}$$",
    },
    T: {
        desc: "Phase π/4 Shift",
        latex: "$$T = \\begin{pmatrix} 1 & 0 \\\\ 0 & e^{iπ/4} \\end{pmatrix}$$",
    },
    H: {
        desc: "Hadamard (Superposition) Gate",
        latex: "$$H = \\frac{1}{\\sqrt{2}} \\begin{pmatrix}1 & 1\\\\ 1 & -1\\end{pmatrix}$$",
    },
    P: {
        desc: "General Phase Shift Gate",
        latex: "$$P(\\theta) = \\begin{pmatrix} 1 & 0 \\\\ 0 & e^{i\\theta} \\end{pmatrix}$$",
    },
    Rx: {
        desc: "Rotation around X-axis",
        latex: "$$R_x(\\theta) = \\begin{pmatrix} \\cos(\\theta/2) & -i\\sin(\\theta/2) \\\\ -i\\sin(\\theta/2) & \\cos(\\theta/2) \\end{pmatrix}$$",
    },
    Ry: {
        desc: "Rotation around Y-axis",
        latex: "$$R_y(\\theta) = \\begin{pmatrix} \\cos(\\theta/2) & -\\sin(\\theta/2) \\\\ \\sin(\\theta/2) & \\cos(\\theta/2) \\end{pmatrix}$$",
    },
    Rz: {
        desc: "Rotation around Z-axis",
        latex: "$$R_z(\\theta) = \\begin{pmatrix} e^{-i\\theta/2} & 0 \\\\ 0 & e^{i\\theta/2} \\end{pmatrix}$$",
    },
    CNOT: {
        desc: "Controlled-NOT (Entanglement) Gate",
        latex: "$$CNOT = \\begin{pmatrix}1 & 0 & 0 & 0\\\\ 0 & 1 & 0 & 0\\\\ 0 & 0 & 0 & 1\\\\ 0 & 0 & 1 & 0\\end{pmatrix}$$",
    },
    CZ: {
        desc: "Controlled-Z Gate",
        latex: "$$CZ = \\begin{pmatrix} 1 & 0 & 0 & 0 \\\\ 0 & 1 & 0 & 0 \\\\ 0 & 0 & 1 & 0 \\\\ 0 & 0 & 0 & -1 \\end{pmatrix}$$",
    },
    SWAP: {
        desc: "SWAP Gate",
        latex: "$$SWAP = \\begin{pmatrix} 1 & 0 & 0 & 0 \\\\ 0 & 0 & 1 & 0 \\\\ 0 & 1 & 0 & 0 \\\\ 0 & 0 & 0 & 1 \\end{pmatrix}$$",
    },
};

// Helper to clamp a value between min and max
const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

// =======================
// SINGLE-QUBIT GATE COMPONENT
// =======================
const QuantumGate = ({
    x,
    y,
    text,
    draggable,
    onDragEnd,
    fixedY,
    onRightClick,
    order,
    params = {},
}) => {
    const isRotationGate = params.theta !== undefined;
    let thetalength = 0;
    if (params.theta != null) {
        thetalength = params.theta.toString().length;
    }
    return (
        <Group
            draggable={draggable}
            x={x}
            y={y}
            dragBoundFunc={
                fixedY !== undefined
                    ? (pos) => ({
                        x: clamp(pos.x, canvasMinX, canvasMaxX),
                        y: fixedY,
                    })
                    : undefined
            }
            onDragEnd={onDragEnd}
            onContextMenu={(e) => {
                e.evt.preventDefault();
                onRightClick();
            }}
        >
            <Rect
                width={gateSize}
                height={gateSize}
                fill="white"
                stroke="black"
                strokeWidth={2}
                cornerRadius={5}
            />
            <Text
                text={text}
                fontSize={16}
                fontFamily="Fira Code, monospace"
                x={text.length > 1 ? gateSize / 2 - 10 : gateSize / 2 - 5}
                y={gateSize / 2 - 10}
            />
            {isRotationGate && (
                <Text
                    text={`${params.theta}°`}
                    fontSize={10}
                    x={thetalength === 1 ? gateSize / 2 - 19 : gateSize / 2 - 20}
                    y={gateSize / 2 + 8}
                    width={gateSize - 4}
                    align="center"
                />
            )}
            {order !== undefined && (
                <Text
                    text={String(order)}
                    fontSize={12}
                    fill="red"
                    x={gateSize - 10}
                    y={3}
                />
            )}
        </Group>
    );
};

// =======================
// CNOT GATE COMPONENT
// =======================
const CNOTGate = ({ x, control, target, onDragEnd, onRightClick, order }) => {
    const yControl = (control + 1) * qubitSpacing;
    const yTarget = (target + 1) * qubitSpacing;
    return (
        <Group
            draggable
            x={x}
            y={0}
            dragBoundFunc={(pos) => ({
                x: clamp(pos.x, canvasMinX, canvasMaxX),
                y: 0,
            })}
            onDragEnd={onDragEnd}
            onContextMenu={(e) => {
                e.evt.preventDefault();
                onRightClick();
            }}
        >
            <Line points={[0, yControl, 0, yTarget]} stroke="black" strokeWidth={2} />
            <Circle x={0} y={yControl} radius={6} fill="black" />
            <Circle x={0} y={yTarget} radius={10} stroke="black" strokeWidth={2} />
            <Line points={[-6, yTarget, 6, yTarget]} stroke="black" strokeWidth={2} />
            <Line
                points={[0, yTarget - 6, 0, yTarget + 6]}
                stroke="black"
                strokeWidth={2}
            />
            {order !== undefined && (
                <Text
                    text={String(order)}
                    fontSize={12}
                    fill="red"
                    x={5}
                    y={(yControl + yTarget) / 2 - 5}
                />
            )}
        </Group>
    );
};

// =======================
// CZ GATE COMPONENT
// =======================
const CZGate = ({ x, control, target, onDragEnd, onRightClick, order }) => {
    const yControl = (control + 1) * qubitSpacing;
    const yTarget = (target + 1) * qubitSpacing;
    return (
        <Group
            draggable
            x={x}
            y={0}
            dragBoundFunc={(pos) => ({
                x: clamp(pos.x, canvasMinX, canvasMaxX),
                y: 0,
            })}
            onDragEnd={onDragEnd}
            onContextMenu={(e) => {
                e.evt.preventDefault();
                onRightClick();
            }}
        >
            <Line points={[0, yControl, 0, yTarget]} stroke="black" strokeWidth={2} />
            <Circle x={0} y={yControl} radius={6} fill="black" />
            <Rect
                x={-20}
                y={yTarget - 20}
                width={40}
                height={40}
                fill="white"
                stroke="black"
                strokeWidth={2}
                cornerRadius={5}
            />
            <Text
                text="Z"
                fontSize={18}
                x={-6}
                y={yTarget - 8}
                fontFamily="Fira Code, monospace"
            />
            {order !== undefined && (
                <Text
                    text={String(order)}
                    fontSize={12}
                    fill="red"
                    x={5}
                    y={(yControl + yTarget) / 2 - 5}
                />
            )}
        </Group>
    );
};

// =======================
// SWAP GATE COMPONENT
// =======================
const SWAPGate = ({ x, qubit1, qubit2, onDragEnd, onRightClick, order }) => {
    const y1 = (qubit1 + 1) * qubitSpacing;
    const y2 = (qubit2 + 1) * qubitSpacing;
    const topY = Math.min(y1, y2);
    const bottomY = Math.max(y1, y2);
    return (
        <Group
            draggable
            x={x}
            y={0}
            dragBoundFunc={(pos) => ({
                x: clamp(pos.x, canvasMinX, canvasMaxX),
                y: 0,
            })}
            onDragEnd={onDragEnd}
            onContextMenu={(e) => {
                e.evt.preventDefault();
                onRightClick();
            }}
        >
            <Line points={[0, topY, 0, bottomY]} stroke="black" strokeWidth={2} />
            {/* 'X' cross on qubit1 */}
            <Line points={[-8, y1 - 8, 8, y1 + 8]} stroke="black" strokeWidth={2} />
            <Line points={[8, y1 - 8, -8, y1 + 8]} stroke="black" strokeWidth={2} />
            {/* 'X' cross on qubit2 */}
            <Line points={[-8, y2 - 8, 8, y2 + 8]} stroke="black" strokeWidth={2} />
            <Line points={[8, y2 - 8, -8, y2 + 8]} stroke="black" strokeWidth={2} />
            {order !== undefined && (
                <Text
                    text={String(order)}
                    fontSize={12}
                    fill="red"
                    x={5}
                    y={(topY + bottomY) / 2 - 5}
                />
            )}
        </Group>
    );
};

// =======================
// QUBIT LINE COMPONENT
// =======================
const QubitLine = ({ y, label, onClickQubit }) => (
    <Group>
        <Text
            text={label}
            fontSize={20}
            x={10}
            y={y - 20}
            fill="blue"
            listening={true}
            onClick={onClickQubit}
        />
        <Line points={[50, y, window.innerWidth - 175, y]} stroke="black" strokeWidth={2} />
    </Group>
);

// =======================
// Helper: snap single-qubit gates to a line
// =======================
const snapY = (pointerY) => {
    const desiredCenter = Math.round(pointerY / qubitSpacing) * qubitSpacing;
    const clampedCenter = Math.max(
        qubitSpacing,
        Math.min(desiredCenter, numQubits * qubitSpacing)
    );
    return clampedCenter - gateSize / 2;
};

// =======================
// MAIN QUANTUM CIRCUIT COMPONENT
// =======================
const QuantumCircuit = () => {
    // Single-qubit gates
    const [gates, setGates] = useState([]);       // { x, y, text, params? }
    // CNOT gates
    const [cnotGates, setCnotGates] = useState([]); // { x, control, target }
    // CZ gates
    const [czGates, setCzGates] = useState([]);     // { x, control, target }
    // SWAP gates
    const [swapGates, setSwapGates] = useState([]); // { x, qubit1, qubit2 }

    // For Bloch sphere popup
    const [selectedQubit, setSelectedQubit] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    // For rotation/phase gates
    const [rotationModalOpen, setRotationModalOpen] = useState(false);
    const [rotationValue, setRotationValue] = useState(45);
    const [rotationX, setRotationX] = useState(0);
    const [rotationY, setRotationY] = useState(0);
    const [rotationType, setRotationType] = useState("P");

    // For CNOT selection
    const [cnotModalOpen, setCnotModalOpen] = useState(false);
    const [cnotX, setCnotX] = useState(0);
    const [cnotControl, setCnotControl] = useState(0);
    const [cnotTarget, setCnotTarget] = useState(1);

    // For CZ selection
    const [czModalOpen, setCzModalOpen] = useState(false);
    const [czX, setCzX] = useState(0);
    const [czControl, setCzControl] = useState(0);
    const [czTarget, setCzTarget] = useState(1);

    // For SWAP selection
    const [swapModalOpen, setSwapModalOpen] = useState(false);
    const [swapX, setSwapX] = useState(0);
    const [swapQubit1, setSwapQubit1] = useState(0);
    const [swapQubit2, setSwapQubit2] = useState(1);

    // Tooltip
    const [tooltip, setTooltip] = useState({
        visible: false,
        x: 0,
        y: 0,
        desc: "",
        latex: "",
    });

    const stageRef = useRef(null);

    // =======================
    // ORDERING: Combined ordering for all gates on a qubit line
    // Single-qubit: line = Math.round((y+gateSize/2)/qubitSpacing)-1
    // CNOT, CZ: use control qubit
    // SWAP: use Math.min(qubit1, qubit2)
    // =======================
    const combinedGroups = {};
    // Single-qubit
    gates.forEach((g, i) => {
        const qid = Math.round((g.y + gateSize / 2) / qubitSpacing) - 1;
        if (!combinedGroups[qid]) combinedGroups[qid] = [];
        combinedGroups[qid].push({ type: "single", index: i, x: g.x });
    });
    // CNOT
    cnotGates.forEach((g, i) => {
        const qid = g.control;
        if (!combinedGroups[qid]) combinedGroups[qid] = [];
        combinedGroups[qid].push({ type: "cnot", index: i, x: g.x });
    });
    // CZ
    czGates.forEach((g, i) => {
        const qid = g.control;
        if (!combinedGroups[qid]) combinedGroups[qid] = [];
        combinedGroups[qid].push({ type: "cz", index: i, x: g.x });
    });
    // SWAP
    swapGates.forEach((g, i) => {
        const qid = Math.min(g.qubit1, g.qubit2);
        if (!combinedGroups[qid]) combinedGroups[qid] = [];
        combinedGroups[qid].push({ type: "swap", index: i, x: g.x });
    });

    const combinedOrders = {
        single: {},
        cnot: {},
        cz: {},
        swap: {},
    };
    Object.keys(combinedGroups).forEach((qid) => {
        combinedGroups[qid].sort((a, b) => a.x - b.x);
        combinedGroups[qid].forEach((item, orderIndex) => {
            if (item.type === "single") {
                combinedOrders.single[item.index] = orderIndex + 1;
            } else if (item.type === "cnot") {
                combinedOrders.cnot[item.index] = orderIndex + 1;
            } else if (item.type === "cz") {
                combinedOrders.cz[item.index] = orderIndex + 1;
            } else if (item.type === "swap") {
                combinedOrders.swap[item.index] = orderIndex + 1;
            }
        });
    });

    // =======================
    // DRAG & DROP LOGIC
    // =======================
    useEffect(() => {
        const container = stageRef.current.container();
        const handleDrop = (e) => {
            e.preventDefault();
            const rect = container.getBoundingClientRect();
            const pointerX = e.clientX - rect.left;
            const pointerY = e.clientY - rect.top;
            const gateType = e.dataTransfer.getData("text/plain");
            if (!gateType) return;

            if (gateType === "CNOT") {
                setCnotModalOpen(true);
                setCnotX(pointerX);
            } else if (gateType === "CZ") {
                setCzModalOpen(true);
                setCzX(pointerX);
            } else if (gateType === "SWAP") {
                setSwapModalOpen(true);
                setSwapX(pointerX);
            } else if (
                gateType === "P" ||
                gateType === "Rx" ||
                gateType === "Ry" ||
                gateType === "Rz"
            ) {
                const snappedY = snapY(pointerY);
                setRotationModalOpen(true);
                setRotationX(pointerX);
                setRotationY(snappedY);
                setRotationType(gateType);
                setRotationValue(45); // default
            } else {
                // Single-qubit gate
                const snappedY = snapY(pointerY);
                setGates((prev) => [
                    ...prev,
                    { x: pointerX, y: snappedY, text: gateType },
                ]);
            }
        };
        const handleDragOver = (e) => e.preventDefault();
        container.addEventListener("drop", handleDrop);
        container.addEventListener("dragover", handleDragOver);
        return () => {
            container.removeEventListener("drop", handleDrop);
            container.removeEventListener("dragover", handleDragOver);
        };
    }, []);

    // =======================
    // DRAG END HANDLERS
    // =======================
    const handleGateDragEnd = (e, index) => {
        const { x } = e.target.position();
        setGates((prev) => {
            const newGates = [...prev];
            newGates[index] = { ...newGates[index], x: clamp(x, canvasMinX, canvasMaxX) };
            return newGates;
        });
    };

    const handleCnotDragEnd = (e, index) => {
        const { x } = e.target.position();
        setCnotGates((prev) => {
            const newArr = [...prev];
            newArr[index].x = clamp(x, canvasMinX, canvasMaxX);
            return newArr;
        });
    };

    const handleCzDragEnd = (e, index) => {
        const { x } = e.target.position();
        setCzGates((prev) => {
            const newArr = [...prev];
            newArr[index].x = clamp(x, canvasMinX, canvasMaxX);
            return newArr;
        });
    };

    const handleSwapDragEnd = (e, index) => {
        const { x } = e.target.position();
        setSwapGates((prev) => {
            const newArr = [...prev];
            newArr[index].x = clamp(x, canvasMinX, canvasMaxX);
            return newArr;
        });
    };

    // =======================
    // DELETE HANDLERS (Right-click)
    // =======================
    const handleDeleteGate = (index) => {
        setGates((prev) => prev.filter((_, i) => i !== index));
    };
    const handleDeleteCnot = (index) => {
        setCnotGates((prev) => prev.filter((_, i) => i !== index));
    };
    const handleDeleteCz = (index) => {
        setCzGates((prev) => prev.filter((_, i) => i !== index));
    };
    const handleDeleteSwap = (index) => {
        setSwapGates((prev) => prev.filter((_, i) => i !== index));
    };

    // =======================
    // MODALS & POPUPS
    // =======================
    // Bloch sphere popup
    const openModalForQubit = (qid) => {
        setSelectedQubit(qid);
        setModalOpen(true);
    };
    const closeModal = () => {
        setSelectedQubit(null);
        setModalOpen(false);
    };

    // Rotation/phase gate modal (unchanged)
    const validateRotationValue = (value) => (value === 0 ? 1 : value);
    const handleRotationConfirm = () => {
        const validTheta = validateRotationValue(rotationValue);
        setGates((prev) => [
            ...prev,
            {
                x: rotationX,
                y: rotationY,
                text: rotationType,
                params: { theta: validTheta },
            },
        ]);
        setRotationModalOpen(false);
    };
    const handleRotationCancel = () => {
        setRotationModalOpen(false);
    };
    const handleRotationInputChange = (e) => {
        const val = parseFloat(e.target.value) || 1;
        setRotationValue(val === 0 ? 1 : val);
    };
    const getRotationModalContent = () => {
        switch (rotationType) {
            case "Rx":
                return {
                    title: "Rotation around X-axis (θ)",
                    latex:
                        "$$R_x(\\theta) = \\begin{pmatrix} \\cos(\\theta/2) & -i\\sin(\\theta/2) \\\\ -i\\sin(\\theta/2) & \\cos(\\theta/2) \\end{pmatrix}$$",
                };
            case "Ry":
                return {
                    title: "Rotation around Y-axis (θ)",
                    latex:
                        "$$R_y(\\theta) = \\begin{pmatrix} \\cos(\\theta/2) & -\\sin(\\theta/2) \\\\ \\sin(\\theta/2) & \\cos(\\theta/2) \\end{pmatrix}$$",
                };
            case "Rz":
                return {
                    title: "Rotation around Z-axis (θ)",
                    latex:
                        "$$R_z(\\theta) = \\begin{pmatrix} e^{-i\\theta/2} & 0 \\\\ 0 & e^{i\\theta/2} \\end{pmatrix}$$",
                };
            default:
                return {
                    title: "Phase Angle (θ)",
                    latex:
                        "$$P(\\theta) = \\begin{pmatrix} 1 & 0 \\\\ 0 & e^{i\\theta} \\end{pmatrix}$$",
                };
        }
    };

    // CNOT modal
    const handleCnotConfirm = () => {
        if (cnotControl === cnotTarget) {
            alert("Control and target qubits must be different!");
            return;
        }
        setCnotGates((prev) => [
            ...prev,
            { x: cnotX, control: cnotControl, target: cnotTarget },
        ]);
        setCnotModalOpen(false);
    };
    const handleCnotCancel = () => {
        setCnotModalOpen(false);
    };

    // CZ modal
    const handleCzConfirm = () => {
        if (czControl === czTarget) {
            alert("Control and target qubits must be different!");
            return;
        }
        setCzGates((prev) => [
            ...prev,
            { x: czX, control: czControl, target: czTarget },
        ]);
        setCzModalOpen(false);
    };
    const handleCzCancel = () => {
        setCzModalOpen(false);
    };

    // SWAP modal
    const handleSwapConfirm = () => {
        if (swapQubit1 === swapQubit2) {
            alert("SWAP requires two distinct qubits!");
            return;
        }
        setSwapGates((prev) => [
            ...prev,
            { x: swapX, qubit1: swapQubit1, qubit2: swapQubit2 },
        ]);
        setSwapModalOpen(false);
    };
    const handleSwapCancel = () => {
        setSwapModalOpen(false);
    };

    // Tooltip handlers
    const handleTooltipEnter = (e, gate) => {
        const rect = e.target.getBoundingClientRect();
        setTooltip({
            visible: true,
            x: rect.left + window.scrollX + 150,
            y: rect.bottom + window.scrollY - 150,
            desc: gateTooltips[gate].desc,
            latex: gateTooltips[gate].latex,
        });
    };
    const handleTooltipLeave = () => {
        setTooltip({ visible: false, x: 0, y: 0, desc: "", latex: "" });
    };

    // =======================
    // RENDER
    // =======================
    return (
        <MathJaxContext>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative",
                }}
            >
                {/* TOP MENU */}
                <div
                    style={{
                        position: "fixed",
                        display: "grid",
                        padding: "10px",
                        border: "3px solid black",
                        borderRadius: "5px",
                        background: "white",
                        top: "50%",
                        left: "5px",
                        gridTemplateRows: "repeat(14, 1fr)",
                        transform: "translateY(-50%)"
                    }}
                >
                    {gatesList.map((gate, index) => (
                        <div
                            key={index}
                            style={{
                                width: gateSize,
                                height: gateSize,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "3px solid black",
                                margin: "5px",
                                borderRadius: "5px",
                                cursor: "grab",
                                background: "white",
                                fontFamily: "Fira Code, monospace",
                                transition: "background-color 0.2s ease",
                            }}
                            draggable
                            onDragStart={(e) => e.dataTransfer.setData("text/plain", gate)}
                            onMouseEnter={(e) => handleTooltipEnter(e, gate)}
                            onMouseMove={(e) => { e.currentTarget.style.background = "#D0E8FF"; }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "white";
                                handleTooltipLeave(e);
                            }}
                        >
                            {gate}
                        </div>
                    ))}
                </div>

                {/* TOOLTIP */}
                {tooltip.visible && (
                    <div
                        style={{
                            position: "absolute",
                            top: tooltip.y,
                            left: tooltip.x,
                            background: "rgba(255,255,255,0.95)",
                            padding: "8px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            zIndex: 1000,
                            boxShadow: "0px 0px 5px rgba(0,0,0,0.3)",
                        }}
                    >
                        <div style={{ fontWeight: "bold", marginBottom: "4px", textAlign: "center" }}>
                            {tooltip.desc}
                        </div>
                        <MathJax dynamic inline>
                            {tooltip.latex}
                        </MathJax>
                    </div>
                )}

                {/* STAGE: QUBIT LINES & GATES */}
                <Stage
                    ref={stageRef}
                    width={window.innerWidth - 150}
                    height={(numQubits + 1) * qubitSpacing}
                    style={{
                        border: "3px solid black",
                        background: "white",
                        borderRadius: "5px",
                        overflow: "auto",
                        marginLeft: "75px"
                    }}
                >
                    <Layer>
                        {Array.from({ length: numQubits }).map((_, i) => (
                            <QubitLine
                                key={i}
                                y={(i + 1) * qubitSpacing}
                                label={`Q${i}`}
                                onClickQubit={() => openModalForQubit(i)}
                            />
                        ))}
                        {/* Render single-qubit gates */}
                        {gates.map((g, i) => (
                            <QuantumGate
                                key={i}
                                x={g.x}
                                y={g.y}
                                text={g.text}
                                params={g.params}
                                draggable
                                fixedY={g.y}
                                onDragEnd={(e) => handleGateDragEnd(e, i)}
                                onRightClick={() => handleDeleteGate(i)}
                                order={combinedOrders.single[i]}
                            />
                        ))}
                        {/* Render CNOT gates */}
                        {cnotGates.map((g, i) => (
                            <CNOTGate
                                key={i}
                                x={g.x}
                                control={g.control}
                                target={g.target}
                                draggable
                                onDragEnd={(e) => handleCnotDragEnd(e, i)}
                                onRightClick={() => handleDeleteCnot(i)}
                                order={combinedOrders.cnot[i]}
                            />
                        ))}
                        {/* Render CZ gates */}
                        {czGates.map((g, i) => (
                            <CZGate
                                key={i}
                                x={g.x}
                                control={g.control}
                                target={g.target}
                                draggable
                                onDragEnd={(e) => handleCzDragEnd(e, i)}
                                onRightClick={() => handleDeleteCz(i)}
                                order={combinedOrders.cz[i]}
                            />
                        ))}
                        {/* Render SWAP gates */}
                        {swapGates.map((g, i) => (
                            <SWAPGate
                                key={i}
                                x={g.x}
                                qubit1={g.qubit1}
                                qubit2={g.qubit2}
                                draggable
                                onDragEnd={(e) => handleSwapDragEnd(e, i)}
                                onRightClick={() => handleDeleteSwap(i)}
                                order={combinedOrders.swap[i]}
                            />
                        ))}
                    </Layer>
                </Stage>

                {/* BLOCH SPHERE MODAL */}
                {modalOpen && (
                    <div
                        onClick={closeModal}
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100vw",
                            height: "100vh",
                            background: "rgba(0, 0, 0, 0.5)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                background: "white",
                                padding: "20px",
                                borderRadius: "10px",
                                textAlign: "center",
                            }}
                        >
                            <h3>Bloch Sphere for Q{selectedQubit}</h3>
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Bloch_sphere.svg/512px-Bloch_sphere.svg.png"
                                alt="Bloch Sphere"
                                style={{ width: "300px", height: "300px" }}
                            />
                            <br />
                            <button onClick={closeModal} style={{ marginTop: "10px" }}>
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {/* ROTATION/PHASE GATE MODAL */}
                {rotationModalOpen && (
                    <div
                        onClick={handleRotationCancel}
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100vw",
                            height: "100vh",
                            background: "rgba(0,0,0,0.5)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 1001,
                        }}
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                background: "white",
                                padding: "20px",
                                borderRadius: "10px",
                                textAlign: "center",
                                minWidth: "300px",
                            }}
                        >
                            <h2>{getRotationModalContent().title}</h2>
                            <div style={{ margin: "20px 0" }}>
                                <MathJax>{getRotationModalContent().latex}</MathJax>
                            </div>
                            <div
                                style={{
                                    margin: "10px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <label style={{ marginRight: "10px" }}>θ (degrees): </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="360"
                                    value={rotationValue}
                                    onChange={handleRotationInputChange}
                                    style={{ width: "80px", padding: "4px" }}
                                />
                            </div>
                            <div style={{ margin: "10px" }}>
                                <input
                                    type="range"
                                    min="1"
                                    max="360"
                                    step="1"
                                    value={rotationValue}
                                    onChange={handleRotationInputChange}
                                    style={{ width: "100%" }}
                                />
                                <div
                                    style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}
                                >
                                    Note: Angle must be between 1° and 360°
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                onClick={handleRotationConfirm}
                                style={{ marginRight: "10px" }}
                            >
                                Confirm
                            </Button>
                            <Button variant="outline" onClick={handleRotationCancel}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}

                {/* CNOT SELECTION MODAL */}
                {cnotModalOpen && (
                    <div
                        onClick={handleCnotCancel}
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100vw",
                            height: "100vh",
                            background: "rgba(0,0,0,0.5)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                background: "white",
                                padding: "20px",
                                borderRadius: "10px",
                                textAlign: "center",
                                minWidth: "300px",
                            }}
                        >
                            <h2>Select Control and Target Qubit</h2>
                            <div style={{ margin: "10px" }}>
                                <label>Control Qubit: </label>
                                <select
                                    value={cnotControl}
                                    onChange={(e) => setCnotControl(Number(e.target.value))}
                                >
                                    {Array.from({ length: numQubits }).map((_, i) => (
                                        <option key={i} value={i}>
                                            Q{i}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ margin: "10px" }}>
                                <label>Target Qubit: </label>
                                <select
                                    value={cnotTarget}
                                    onChange={(e) => setCnotTarget(Number(e.target.value))}
                                >
                                    {Array.from({ length: numQubits }).map((_, i) => (
                                        <option key={i} value={i}>
                                            Q{i}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <Button
                                variant="outline"
                                onClick={handleCnotConfirm}
                                style={{ marginRight: "10px" }}
                            >
                                Confirm
                            </Button>
                            <Button variant="outline" onClick={handleCnotCancel}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}

                {/* CZ SELECTION MODAL */}
                {czModalOpen && (
                    <div
                        onClick={handleCzCancel}
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100vw",
                            height: "100vh",
                            background: "rgba(0,0,0,0.5)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                background: "white",
                                padding: "20px",
                                borderRadius: "10px",
                                textAlign: "center",
                                minWidth: "300px",
                            }}
                        >
                            <h2>Select Control and Target Qubit (CZ)</h2>
                            <div style={{ margin: "10px" }}>
                                <label>Control Qubit: </label>
                                <select
                                    value={czControl}
                                    onChange={(e) => setCzControl(Number(e.target.value))}
                                >
                                    {Array.from({ length: numQubits }).map((_, i) => (
                                        <option key={i} value={i}>
                                            Q{i}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ margin: "10px" }}>
                                <label>Target Qubit: </label>
                                <select
                                    value={czTarget}
                                    onChange={(e) => setCzTarget(Number(e.target.value))}
                                >
                                    {Array.from({ length: numQubits }).map((_, i) => (
                                        <option key={i} value={i}>
                                            Q{i}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <Button
                                variant="outline"
                                onClick={handleCzConfirm}
                                style={{ marginRight: "10px" }}
                            >
                                Confirm
                            </Button>
                            <Button variant="outline" onClick={handleCzCancel}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}

                {/* SWAP SELECTION MODAL */}
                {swapModalOpen && (
                    <div
                        onClick={handleSwapCancel}
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100vw",
                            height: "100vh",
                            background: "rgba(0,0,0,0.5)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                background: "white",
                                padding: "20px",
                                borderRadius: "10px",
                                textAlign: "center",
                                minWidth: "300px",
                            }}
                        >
                            <h2>Select Qubits to SWAP</h2>
                            <div style={{ margin: "10px" }}>
                                <label>Qubit A: </label>
                                <select
                                    value={swapQubit1}
                                    onChange={(e) => setSwapQubit1(Number(e.target.value))}
                                >
                                    {Array.from({ length: numQubits }).map((_, i) => (
                                        <option key={i} value={i}>
                                            Q{i}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ margin: "10px" }}>
                                <label>Qubit B: </label>
                                <select
                                    value={swapQubit2}
                                    onChange={(e) => setSwapQubit2(Number(e.target.value))}
                                >
                                    {Array.from({ length: numQubits }).map((_, i) => (
                                        <option key={i} value={i}>
                                            Q{i}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <Button
                                variant="outline"
                                onClick={handleSwapConfirm}
                                style={{ marginRight: "10px" }}
                            >
                                Confirm
                            </Button>
                            <Button variant="outline" onClick={handleSwapCancel}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* CircuitDataExtractor or other component that processes the final state */}
            <CircuitDataExtractor gates={gates} cnotGates={cnotGates} czGates={czGates} swapGates={swapGates} />
        </MathJaxContext>
    );
};

export default QuantumCircuit;
