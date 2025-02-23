/**
 * @file gates.hh
 * @license This file is licensed under the GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007. You may obtain a copy of this license at https://www.gnu.org/licenses/gpl-3.0.en.html.
 * @author Tushar Chaurasia (Dark-CodeX)
 */

#ifndef SIMULATOR_GATES
#define SIMULATOR_GATES

#include <complex>
#include <cmath> // for sqrt and M_PI

namespace simulator
{
    using complex = std::complex<double>;
    using namespace std::complex_literals;

    enum gates : unsigned char
    {
        IDENTITY, // identity-gate
        PAULI_X,  // NOT-gate
        PAULI_Y,
        PAULI_Z,          // Phase Flip gate
        HADAMARD,         // H-gate
        PHASE_PI_2_SHIFT, // pi/2 phase shift
        PHASE_PI_4_SHIFT, // pi/4 phase shift
        PHASE_GENERAL_SHIFT,
        ROTATION_X,
        ROTATION_Y,
        ROTATION_Z
    };

    struct qgate
    {
        gates type;
        complex matrix[2][2]; // 2x2 matrix that stores various types of gates
    };

    inline const constexpr qgate pre_defined_qgates[7] = {
        {IDENTITY, {{1, 0}, {0, 1}}},
        {PAULI_X, {{0, 1}, {1, 0}}},
        {PAULI_Y, {{0, {0, -1}}, {{0, 1}, 0}}},
        {PAULI_Z, {{1, 0}, {0, -1}}},
        {HADAMARD, {{1.0 / M_SQRT2, 1.0 / M_SQRT2}, {1.0 / M_SQRT2, -1.0 / M_SQRT2}}},
        {PHASE_PI_2_SHIFT, {{1, 0}, {0, {0, 1}}}},                // e^(i * pi/2) = i
        {PHASE_PI_4_SHIFT, {{1, 0}, {0, {M_SQRT1_2, M_SQRT1_2}}}} // e^(i * pi/4) = (sqrt(2)/2) + i(sqrt(2)/2)
    };

    void apply_predefined_gate(const enum gates &__g_type, complex (&__s)[2]);

    qgate &get_theta_gates(qgate &__g, const enum gates &__g_type, const double &theta);

    void apply_theta_gates(const enum gates &__g_type, complex (&__s)[2], const double &theta);
}

#endif
