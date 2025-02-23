/**
 * @file simulator.cc
 * @license This file is licensed under the GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007. You may obtain a copy of this license at https://www.gnu.org/licenses/gpl-3.0.en.html.
 * @author Tushar Chaurasia (Dark-CodeX)
 */

#include <iostream>
#include "../gates/gates.hh"

int main(int argc, char **argv)
{
    // Initialize qubit state vector |0> = {1, 0}
    simulator::complex state[2] = {1.0, 0.0};

    std::cout << "Initial state:" << std::endl;
    std::cout << "state[0] = " << state[0] << ", state[1] = " << state[1] << "\n\n";

    // Apply the Hadamard gate (predefined gate)
    simulator::apply_predefined_gate(simulator::HADAMARD, state);
    std::cout << "After applying Hadamard gate:" << std::endl;
    std::cout << "state[0] = " << state[0] << ", state[1] = " << state[1] << "\n\n";

    // Apply a phase shift gate with theta = pi/4 (parameterized gate)
    double theta = M_PI / 4;
    simulator::apply_theta_gates(simulator::PHASE_GENERAL_SHIFT, state, theta);
    std::cout << "After applying PHASE_GENERAL_SHIFT gate (theta = pi/4):" << std::endl;
    std::cout << "state[0] = " << state[0] << ", state[1] = " << state[1] << "\n\n";

    // Apply a rotation gate (e.g., ROTATION_X) with theta = pi/2
    theta = M_PI / 2;
    simulator::apply_theta_gates(simulator::ROTATION_X, state, theta);
    std::cout << "After applying ROTATION_X gate (theta = pi/2):" << std::endl;
    std::cout << "state[0] = " << state[0] << ", state[1] = " << state[1] << "\n";

    return EXIT_SUCCESS;
}