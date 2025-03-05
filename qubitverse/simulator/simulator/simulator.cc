#include <iostream>
#include <cmath>
#include "../gates/gates.hh"

int main()
{
    simulator::qubit<3> qsys;
    qsys.apply_hadamard(0);
    qsys.apply_hadamard(1);
    qsys.apply_hadamard(2);

    const auto &s1 = qsys.get_qubits();
    for (std::size_t i = 0; i < qsys.get_size(); i++)
    {
        std::cout << "State [" << i << "] = " << s1[i] << "\n";
    }

    simulator::qubit<3>::complex q1[2], q2[2], q3[2];
    qsys.get_nth_qubit(q1, 0);
    qsys.get_nth_qubit(q2, 1);
    qsys.get_nth_qubit(q3, 2);

    std::cout << "QUBIT 0: " << q1[0] << ", " << q1[1] << "\n";
    std::cout << "QUBIT 1: " << q2[0] << ", " << q2[1] << "\n";
    std::cout << "QUBIT 2: " << q3[0] << ", " << q3[1] << "\n";

    std::cout << "Measured Result: " << qsys.measure() << std::endl;
    return 0;
}
