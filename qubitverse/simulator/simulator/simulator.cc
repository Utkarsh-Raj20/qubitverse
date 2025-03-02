/**
 * @file simulator.cc
 * @license This file is licensed under the GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007. You may obtain a copy of this license at https://www.gnu.org/licenses/gpl-3.0.en.html.
 * @author Tushar Chaurasia (Dark-CodeX)
 */

#include "../gates/gates.hh"
#include <iostream>

int main()
{
    using namespace simulator;
    qubit<3> q;
    std::cout << "Initial state (3-qubit system):\n";
    const auto &init_state = q.get_qubits();
    for (std::size_t i = 0; i < q.get_size(); ++i)
    {
        std::cout << "State[" << i << "] = " << init_state[i] << "\n";
    }

    q.apply_hadamard(0);
    q.apply_pauli_y(1);

    std::cout << "\nState after applying Hadamard on qubit 0 and Pauli-Y on qubit 1:\n";
    const auto &state_after_gates = q.get_qubits();
    for (std::size_t i = 0; i < q.get_size(); ++i)
    {
        std::cout << "State[" << i << "] = " << state_after_gates[i] << "\n";
    }

    std::cout << "\nMeasuring the entire system...\n";
    std::size_t outcome = q.measure();
    std::cout << "Measurement outcome: " << outcome << "\n";

    std::cout << "\nState after measurement (collapsed state):\n";
    const auto &state_after_measure = q.get_qubits();
    for (std::size_t i = 0; i < q.get_size(); ++i)
    {
        std::cout << "State[" << i << "] = " << state_after_measure[i] << "\n";
    }

    return 0;
}
