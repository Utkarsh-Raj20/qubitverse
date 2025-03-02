/**
 * @file simulator.cc
 * @license This file is licensed under the GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007. You may obtain a copy of this license at https://www.gnu.org/licenses/gpl-3.0.en.html.
 * @author Tushar Chaurasia (Dark-CodeX)
 */
#include "../gates/gates.hh"
#include <iostream>

int main() {
    using namespace simulator;

    // Instantiate a 3-qubit system
    qubit<100> q;

    std::cout << "Initial state (3-qubit system):\n";
    const auto &init_state = q.get_qubits();
    for (std::size_t i = 0; i < q.get_size(); ++i) {
        std::cout << "State[" << i << "] = " << init_state[i] << "\n";
    }

    q.apply_pauli_x(1);
    std::cout << "\n\nAFTER\n";

    const auto &final_state = q.get_qubits();
    for (std::size_t i = 0; i < q.get_size(); ++i) {
        std::cout << "State[" << i << "] = " << final_state[i] << "\n";
    }

    return 0;
}
