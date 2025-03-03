/**
 * @file simulator.cc
 * @license This file is licensed under the GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007. You may obtain a copy of this license at https://www.gnu.org/licenses/gpl-3.0.en.html.
 * @author Tushar Chaurasia (Dark-CodeX)
 */

#include "../gates/gates.hh"
#include <iostream>

int main()
{
    simulator::qubit<2> qubits;

    std::cout << "Initial 2-qubit state:" << std::endl;
    const auto &s1 = qubits.get_qubits();
    for (std::size_t i = 0; i < qubits.get_size(); ++i)
    {
        std::cout << "State[" << i << "] = " << s1[i] << std::endl;
    }

    qubits.apply_hadamard(0);

    std::cout << "\nAfter applying HADAMARD (H-Gate) on qubit 0:" << std::endl;
    const auto &s2 = qubits.get_qubits();
    for (std::size_t i = 0; i < qubits.get_size(); ++i)
    {
        std::cout << "State[" << i << "] = " << s2[i] << std::endl;
    }

    qubits.apply_cnot(0, 1);

    std::cout << "\nAfter applying CNOT on qubit 0 as control-qubit and 1 as target-qubit:" << std::endl;
    const auto &s3 = qubits.get_qubits();
    for (std::size_t i = 0; i < qubits.get_size(); ++i)
    {
        std::cout << "State[" << i << "] = " << s3[i] << std::endl;
    }

    std::cout << "\nMeasured Result: " << qubits.measure() << std::endl;

    return 0;
}
