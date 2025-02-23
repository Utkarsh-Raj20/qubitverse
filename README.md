# Quantum Gate Simulator & GUI Visualizer

A simple quantum gate simulator implemented in C++ that allows you to store and apply various quantum gates to qubit states. The simulator is designed to work as a backend, with a Node.js-based GUI for a more interactive, visual experience.

## Overview

This project consists of two main parts:

1. **Quantum Gate Simulator (C++)**
   - Implements basic quantum mechanics concepts such as qubit state representation and quantum gate operations.
   - Provides a set of common quantum gates (Identity, Pauli-X, Pauli-Y, Pauli-Z, Hadamard, Phase (S), and T-Gate).
   - Uses manual matrix operations (without external libraries like Eigen) to evolve the quantum state.

2. **GUI Visualizer (Node.js)**
   - A frontend interface that communicates with the C++ simulator.
   - Allows users to drag and drop gates onto qubits, build circuits, and see the resulting state evolution.
   - Visualizes quantum states using tools like Bloch spheres or probability histograms.

## Features

- **Quantum Gate Storage:** Easily store and manage common quantum gates.
- **State Evolution:** Apply gate operations to a qubit state and observe the transformation.
- **Extensible Backend:** Ready to be expanded to support multi-qubit systems and more complex gates (like CNOT).
- **Interactive GUI:** Planned Node.js frontend to provide a user-friendly visual interface.
- **Separation of Concerns:** C++ handles the quantum computation while Node.js manages the visualization and user interactions.