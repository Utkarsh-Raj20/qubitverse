import { useState } from "react";
import { Button } from "@/components/ui/button";

// This function extracts circuit data from the gates state
function extractCircuitData(gates, cnotGates, czGates, swapGates, nQ) {
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
            qubitA: gate.qubit1,
            qubitB: gate.qubit2,
            position: gate.x,
        };
    });

    // Combine all gates and sort by position (x coordinate)
    const allGates = [...processedGates, ...processedCnotGates, ...processedCZGates, ...processedSwapGates].sort(
        (a, b) => a.position - b.position
    );

    // Create the final circuit data object
    return {
        numQubits: nQ,
        gates: allGates,
    };
}

function quantum_encode(cktData) {
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

export function SendToBackEnd_Calculate({ gates, cnotGates, czGates, swapGates, numQubits }) {
    const [circuitData, setCircuitData] = useState(null);

    const request_backend = async (dat) => {
        try {
            const response = await fetch('http://localhost:9080/api/endpoint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: dat
            });
            return await response.text();
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    };

    const handleExtractData = () => {
        const rtCktData = extractCircuitData(gates, cnotGates, czGates, swapGates, numQubits);
        setCircuitData(rtCktData);
        request_backend(quantum_encode(rtCktData)).then(responseText => { console.log(responseText); });
    };

    return (
        <Button
            variant="outline"
            style={{
                width: "100%",
                padding: "10px",
            }}
            onClick={handleExtractData}
        >
            Calculate
        </Button>
    );
};

export default SendToBackEnd_Calculate;