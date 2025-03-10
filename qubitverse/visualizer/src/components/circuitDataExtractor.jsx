import { useState } from "react";
import axios from "axios"; // Import axios for making HTTP requests

// Note: Using the custom Dialog components from the provided code
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog"; // Update path as needed

// API endpoint for the simulator
const API_URL = "http://localhost:5000/api/simulate"; // Update with your actual backend URL

// This function extracts circuit data from the gates state
export function extractCircuitData(gates, cnotGates) {
  // Process single-qubit gates
  const processedGates = gates.map((gate) => {
    // Calculate which qubit this gate is on based on y position
    const qubitIndex = Math.round((gate.y + 20) / 50) - 1; // 20 is half of gateSize, 50 is qubitSpacing

    return {
      type: "single",
      gateType: gate.text, // X, Y, H, etc.
      qubit: qubitIndex,
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

  // Combine all gates and sort by position (x coordinate)
  const allGates = [...processedGates, ...processedCnotGates].sort(
    (a, b) => a.position - b.position
  );

  // Create a map of gates by qubit
  const gatesByQubit = {};
  for (let i = 0; i < 5; i++) {
    // numQubits = 5
    gatesByQubit[`Q${i}`] = allGates
      .filter(
        (gate) =>
          (gate.type === "single" && gate.qubit === i) ||
          (gate.type === "cnot" && (gate.control === i || gate.target === i))
      )
      .sort((a, b) => a.position - b.position);
  }

  // Create the final circuit data object
  return {
    numQubits: 5,
    gates: allGates,
    gatesByQubit,
    // Add execution order for each qubit
    executionOrder: Object.keys(gatesByQubit).reduce((acc, qubit) => {
      acc[qubit] = gatesByQubit[qubit].map((gate) => {
        if (gate.type === "single") {
          return {
            operation: gate.gateType,
            qubit: gate.qubit,
            position: gate.position,
          };
        } else {
          return {
            operation: "CNOT",
            control: gate.control,
            target: gate.target,
            position: gate.position,
          };
        }
      });
      return acc;
    }, {}),
  };
}

// Custom Button component since we're not using the shadcn/ui components
const Button = ({ children, onClick, className, variant, disabled }) => {
  const baseStyle = "px-4 py-2 rounded-md font-medium transition-colors";
  const primaryStyle = "bg-blue-600 text-white hover:bg-blue-700";
  const outlineStyle = "border border-gray-300 hover:bg-gray-100";
  const disabledStyle = "opacity-50 cursor-not-allowed";

  const style = variant === "outline" ? outlineStyle : primaryStyle;

  return (
    <button
      className={`${baseStyle} ${style} ${disabled ? disabledStyle : ""} ${
        className || ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default function CircuitDataExtractor({ gates, cnotGates }) {
  const [isOpen, setIsOpen] = useState(false);
  const [circuitData, setCircuitData] = useState(null);
  const [simulationResults, setSimulationResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const closeDialog = () => {
    setIsOpen(false);
  };

  const handleExtractData = () => {
    const data = extractCircuitData(gates, cnotGates);
    setCircuitData(data);
    setIsOpen(true);
  };

  const handleCopyToClipboard = () => {
    if (circuitData) {
      navigator.clipboard
        .writeText(JSON.stringify(circuitData, null, 2))
        .then(() => {
          alert("Circuit data copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
        });
    }
  };

  const handleDownloadJSON = () => {
    if (circuitData) {
      const dataStr = JSON.stringify(circuitData, null, 2);
      const dataUri =
        "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

      const downloadLink = document.createElement("a");
      downloadLink.setAttribute("href", dataUri);
      downloadLink.setAttribute("download", "quantum-circuit.json");
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const handleRunSimulation = async () => {
    if (!circuitData) return;

    setIsLoading(true);
    setError(null);
    setSimulationResults(null);

    try {
      // Send the circuit data to the backend for simulation
      const response = await axios.post(API_URL, circuitData);

      if (response.data.success) {
        setSimulationResults(response.data.results);
      } else {
        setError(
          response.data.error || "Unknown error occurred during simulation"
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to communicate with the simulation server"
      );
      console.error("Simulation request failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadResults = () => {
    if (simulationResults) {
      const dataStr = JSON.stringify(simulationResults, null, 2);
      const dataUri =
        "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

      const downloadLink = document.createElement("a");
      downloadLink.setAttribute("href", dataUri);
      downloadLink.setAttribute("download", "simulation-results.json");
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
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
        <DialogContent className="max-w-3xl relative">
          {/* Added explicit close button with better visibility */}
          <button
            onClick={closeDialog}
            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800"
            aria-label="Close dialog"
          >
            ✕
          </button>

          <DialogHeader>
            <DialogTitle>Quantum Circuit Data & Simulation</DialogTitle>
            <DialogDescription>
              View the circuit data and run the simulation on the backend
            </DialogDescription>
          </DialogHeader>

          {/* Circuit Data Section */}
          <div className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">Circuit Data:</h3>
            <div className="bg-gray-100 p-4 rounded-md overflow-auto max-h-[30vh]">
              <pre className="text-sm">
                {circuitData ? JSON.stringify(circuitData, null, 2) : ""}
              </pre>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={handleCopyToClipboard}>
              Copy Data
            </Button>
            <Button variant="outline" onClick={handleDownloadJSON}>
              Download JSON
            </Button>
            <Button
              onClick={handleRunSimulation}
              disabled={isLoading || !circuitData}
            >
              {isLoading ? "Running Simulation..." : "Run Simulation"}
            </Button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mt-4">
              <h4 className="font-bold">Error</h4>
              <p>{error}</p>
            </div>
          )}

          {/* Simulation Results Section */}
          {simulationResults && (
            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-medium">Simulation Results:</h3>
              <div className="bg-gray-100 p-4 rounded-md overflow-auto max-h-[30vh]">
                <pre className="text-sm">
                  {JSON.stringify(simulationResults, null, 2)}
                </pre>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={handleDownloadResults}>
                  Download Results
                </Button>
              </div>
            </div>
          )}

          {/* Added explicit close button at the bottom */}
          <div className="mt-6 text-center">
            <Button variant="outline" onClick={closeDialog}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
