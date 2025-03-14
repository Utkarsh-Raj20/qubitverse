import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { numQubits } from "./QuantumCircuit";

// This function extracts circuit data from the gates state
export function extractCircuitData(gates, cnotGates, czGates, swapGates) {
    // Process single-qubit gates
    const processedGates = gates.map((gate) => {
        // Calculate which qubit this gate is on based on y position
        const qubitIndex = Math.round((gate.y + 20) / 50) - 1; // 20 is half of gateSize, 50 is qubitSpacing
        return {
            type: "single",
            gateType: gate.text, // X, Y, H, etc.
            qubit: qubitIndex,
            theta: Object.hasOwn(gate, "params") === false ? -1 : gate.params.theta,
            position: gate.x,
        };
    });

    // Process CNOT gates
    const processedCnotGates = cnotGates.map((gate) => {
        return {
            type: "cnot",
            control: gate.control,
            target: gate.target,
            position: gate.x,
        };
    });

    // Process CZ gates
    const processedCZGates = czGates.map((gate) => {
        return {
            type: "cz",
            control: gate.control,
            target: gate.target,
            position: gate.x,
        };
    });

    // Process SWAP gates
    const processedSwapGates = swapGates.map((gate) => {
        return {
            type: "swap",
            qubit1: gate.qubit1,
            qubit2: gate.qubit2,
            position: gate.x,
        };
    });

    // Combine all gates and sort by position (x coordinate)
    const allGates = [...processedGates, ...processedCnotGates, ...processedCZGates, ...processedSwapGates].sort(
        (a, b) => a.position - b.position
    );

    // Create a map of gates by qubit
    const gatesByQubit = {};
    for (let i = 0; i < numQubits; i++) {
        gatesByQubit[`Q${i}`] = allGates
            .filter(
                (gate) =>
                    (gate.type === "single" && gate.qubit === i) ||
                    (gate.type === "cnot" && (gate.control === i || gate.target === i)) ||
                    (gate.type === "cz" && (gate.control === i || gate.target === i)) ||
                    (gate.type === "swap" && (gate.qubit1 === i || gate.qubit2 === i))
            )
            .sort((a, b) => a.position - b.position);
    }

    // Create the final circuit data object
    return {
        numQubits: numQubits,
        gates: allGates,
    };
}

export function quantum_encode(cktData) {
    let s = "n:" + cktData.numQubits + "\n";
    for (let i = 0; i < cktData.gates.length; i++) {
        for (const key in cktData.gates[i]) {
            if (Object.hasOwn(cktData.gates[i], key)) {
                s += key + ":" + cktData.gates[i][key] + "\n";
            }
        }
        s += "@\n";
    }
    return s;
}

export default function CircuitDataExtractor({ gates, cnotGates, czGates, swapGates }) {
    const [isOpen, setIsOpen] = useState(false);
    const [circuitData, setCircuitData] = useState(null);

    const handleExtractData = () => {
        const data = extractCircuitData(gates, cnotGates, czGates, swapGates);
        setCircuitData(data);
        setIsOpen(true);
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <Button
                onClick={handleExtractData}
                className="flex items-center gap-2 mt-4"
            >
                Extract Circuit Data
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Quantum Circuit Data</DialogTitle>
                        <DialogDescription>
                            This is the extracted data representation of your quantum circuit
                        </DialogDescription>
                    </DialogHeader>

                    <div className="bg-muted p-4 rounded-md overflow-auto max-h-[60vh]">
                        <pre className="text-sm">
                            {circuitData ? quantum_encode(circuitData) : ""}
                        </pre>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
