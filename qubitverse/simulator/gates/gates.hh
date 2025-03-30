/**
 * @file gates.hh
 * @license This file is licensed under the GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007. You may obtain a copy of this license at https://www.gnu.org/licenses/gpl-3.0.en.html.
 * @author Tushar Chaurasia (Dark-CodeX)
 */

#ifndef SIMULATOR_GATES
#define SIMULATOR_GATES

#include <complex>
#include <random>
#include <cmath> // for sqrt and M_PI

namespace simulator
{
    class qubit
    {
      public:
        using complex = std::complex<double>;

      private:
        enum gate_type : unsigned char
        {
            IDENTITY,            // Identity gate: leaves the qubit unchanged.
            PAULI_X,             // Pauli-X gate (NOT gate): flips the qubit state.
            PAULI_Y,             // Pauli-Y gate: rotates the qubit about the Y-axis.
            PAULI_Z,             // Pauli-Z gate: performs a phase flip.
            HADAMARD,            // Hadamard gate: creates superposition.
            PHASE_PI_2_SHIFT,    // S-gate: applies a π/2 phase shift.
            PHASE_PI_4_SHIFT,    // T-gate: applies a π/4 phase shift.
            PHASE_GENERAL_SHIFT, // General phase shift gate: parameterized phase shift.
            ROTATION_X,          // Rotation around the X-axis, by theta angle.
            ROTATION_Y,          // Rotation around the Y-axis, by theta angle.
            ROTATION_Z,          // Rotation around the Z-axis, by theta angle.
            CONTROLLED_NOT,      // Controlled-NOT (CNOT) gate: flips target qubit based on control, creates the state of entanglement between two qubits.
            CONTROLLED_Z,        // Controlled-Z gate: applies a phase flip conditional on the control.
            SWAP_GATE            // SWAP gate: exchanges the states of two qubits.
        };

        struct qgate_2x2
        {
            gate_type type;
            complex matrix[2][2]; // 2x2 matrix that stores various types of gates
        };

        static constexpr qgate_2x2 pre_defined_qgates[7] = {
            {IDENTITY, {{1, 0}, {0, 1}}},
            {PAULI_X, {{0, 1}, {1, 0}}},
            {PAULI_Y, {{0, {0, -1}}, {{0, 1}, 0}}},
            {PAULI_Z, {{1, 0}, {0, -1}}},
            {HADAMARD, {{M_SQRT1_2, M_SQRT1_2}, {M_SQRT1_2, -M_SQRT1_2}}},
            {PHASE_PI_2_SHIFT, {{1, 0}, {0, {0, 1}}}},                // e^(i * pi/2) = i
            {PHASE_PI_4_SHIFT, {{1, 0}, {0, {M_SQRT1_2, M_SQRT1_2}}}} // e^(i * pi/4) = (sqrt(2)/2) + i(sqrt(2)/2)
        };

        static void apply_predefined_gate(complex *&__s, const std::size_t &_len, const gate_type &__g_type, const std::size_t &qubit_target);
        static qgate_2x2 &get_theta_gate(qgate_2x2 &__g, const gate_type &__g_type, const double &__theta);
        static void apply_theta_gate(complex *&__s, const std::size_t &_len, const gate_type &__g_type, const double &__theta, const std::size_t &qubit_target);
        static void apply_2qubit_gate(complex *&__s, const std::size_t &_len, const gate_type &__g_type, const std::size_t &q_control, const std::size_t &q_target);

        // a vector-space (hilbert-space) defined over complex numbers C
        // 1 << M_no_qubits translates to 2^N, where N is the number of qubit the hilbert-space(quantum-system) supports
        // memory consumption on x86_64 architecture for N-qubit system is: f(N) = 16 * 2^abs(N) bytes, that is exponential growth
        // Initially, the hilbert-space is defined as 1 + 0i, 0 + 0i, 0 + 0i, 0 + 0i, 0 + 0i, ..., 0 + 0i
        complex *M_qubits;
        std::size_t M_len, M_no_qubits;

      public:
        qubit() = delete;
        qubit(const std::size_t &n);
        qubit(const qubit &q);
        qubit(qubit &&q) noexcept(true);
        qubit &apply_identity(const std::size_t &q_target);
        qubit &apply_pauli_x(const std::size_t &q_target);
        qubit &apply_pauli_y(const std::size_t &q_target);
        qubit &apply_pauli_z(const std::size_t &q_target);
        qubit &apply_hadamard(const std::size_t &q_target);
        qubit &apply_phase_pi_2_shift(const std::size_t &q_target);
        qubit &apply_phase_pi_4_shift(const std::size_t &q_target);
        qubit &apply_phase_general_shift(const double &_theta, const std::size_t &q_target);
        qubit &apply_rotation_x(const double &_theta, const std::size_t &q_target);
        qubit &apply_rotation_y(const double &_theta, const std::size_t &q_target);
        qubit &apply_rotation_z(const double &_theta, const std::size_t &q_target);
        qubit &apply_cnot(const std::size_t &q_control, const std::size_t &q_target);
        qubit &apply_cz(const std::size_t &q_control, const std::size_t &q_target);
        qubit &apply_swap(const std::size_t &qubit_1, const std::size_t &qubit_2);
        const complex *get_qubits() const;
        const std::size_t &get_size() const;
        const std::size_t &memory_consumption() const;
        const std::size_t &no_of_qubits() const;
        void get_nth_qubit(complex (&__s)[2], const std::size_t &nth) const;
        std::size_t measure();
        qubit &operator=(const qubit &q);
        qubit &operator=(qubit &&q) noexcept(true);
        ~qubit();
    };

    void qubit::apply_predefined_gate(complex *&__s, const std::size_t &_len, const gate_type &__g_type, const std::size_t &qubit_target)
    {
        const std::size_t stride = 1 << qubit_target; // Distance between paired indices

        for (std::size_t i = 0; i < _len; i += 2 * stride)
        {
            for (std::size_t j = 0; j < stride; ++j)
            {
                std::size_t idx0 = i + j;
                std::size_t idx1 = i + j + stride;

                // Apply the gate to the two elements
                complex a = __s[idx0];
                complex b = __s[idx1];

                __s[idx0] = pre_defined_qgates[static_cast<std::size_t>(__g_type)].matrix[0][0] * a + pre_defined_qgates[static_cast<std::size_t>(__g_type)].matrix[0][1] * b;
                __s[idx1] = pre_defined_qgates[static_cast<std::size_t>(__g_type)].matrix[1][0] * a + pre_defined_qgates[static_cast<std::size_t>(__g_type)].matrix[1][1] * b;
            }
        }
    }

    qubit::qgate_2x2 &qubit::get_theta_gate(qgate_2x2 &__g, const gate_type &__g_type, const double &__theta)
    {
        __g.type = __g_type;
        switch (__g_type)
        {
        case gate_type::PHASE_GENERAL_SHIFT:
            __g.matrix[0][0] = 1.0;
            __g.matrix[0][1] = 0.0;
            __g.matrix[1][0] = 0.0;
            __g.matrix[1][1] = std::polar(1.0, __theta);
            break;

        case gate_type::ROTATION_X:
            __g.matrix[0][0] = std::cos<double>(__theta / 2.0);
            __g.matrix[0][1] = (complex){0.0, -1.0} * std::sin<double>(__theta / 2.0);
            __g.matrix[1][0] = (complex){0.0, -1.0} * std::sin<double>(__theta / 2.0);
            __g.matrix[1][1] = std::cos<double>(__theta / 2.0);
            break;

        case gate_type::ROTATION_Y:
            __g.matrix[0][0] = std::cos<double>(__theta / 2.0);
            __g.matrix[0][1] = -std::sin<double>(__theta / 2.0);
            __g.matrix[1][0] = std::sin<double>(__theta / 2.0);
            __g.matrix[1][1] = std::cos<double>(__theta / 2.0);
            break;

        case gate_type::ROTATION_Z:
            __g.matrix[0][0] = std::polar(1.0, -__theta / 2.0);
            __g.matrix[0][1] = 0.0;
            __g.matrix[1][0] = 0.0;
            __g.matrix[1][1] = std::polar(1.0, __theta / 2.0);
            break;

        default:
            std::fprintf(stderr, "error: invalid gate selected '%u'\n", (unsigned)__g_type);
            std::exit(EXIT_FAILURE);
        }
        return __g;
    }

    void qubit::apply_theta_gate(complex *&__s, const std::size_t &_len, const gate_type &__g_type, const double &__theta, const std::size_t &qubit_target)
    {
        const std::size_t stride = 1 << qubit_target; // Distance between paired indices
        qgate_2x2 __g;
        __g = qubit::get_theta_gate(__g, __g_type, __theta);

        for (std::size_t i = 0; i < _len; i += 2 * stride)
        {
            for (std::size_t j = 0; j < stride; ++j)
            {
                std::size_t idx0 = i + j;
                std::size_t idx1 = i + j + stride;

                // Apply the gate to the two elements
                complex a = __s[idx0];
                complex b = __s[idx1];

                __s[idx0] = __g.matrix[0][0] * a + __g.matrix[0][1] * b;
                __s[idx1] = __g.matrix[1][0] * a + __g.matrix[1][1] * b;
            }
        }
    }

    void qubit::apply_2qubit_gate(complex *&__s, const std::size_t &_len, const gate_type &__g_type, const std::size_t &q_control, const std::size_t &q_target)
    {
        if (std::log2(_len) < 2.0)
        {
            std::fprintf(stderr, "error: specified gate operation requires a minimum of 2 qubit-system, but it was %zu qubit-system.\n", (std::size_t)std::log2(_len));
            std::exit(EXIT_FAILURE);
        }

        if (__g_type == gate_type::CONTROLLED_NOT)
        {
            for (std::size_t i = 0; i < _len; i++)
            {
                if ((i & (1 << q_control)) != 0)
                { // If control qubit is 1
                    std::size_t target_bit_flipped_index = i ^ (1 << q_target);
                    // Only swap once per pair.
                    if (i < target_bit_flipped_index)
                    {
                        std::swap(__s[i], __s[target_bit_flipped_index]);
                    }
                }
            }
        }
        else if (__g_type == gate_type::CONTROLLED_Z)
        {
            for (std::size_t i = 0; i < _len; i++)
            {
                if (((i >> q_control) & 1) && ((i >> q_target) & 1))
                {
                    __s[i] *= -1;
                }
            }
        }
        else if (__g_type == gate_type::SWAP_GATE)
        {
            for (std::size_t i = 0; i < _len; ++i)
            {
                // Extract the bits at positions q_control and q_target.
                const std::size_t bit_q1 = (i >> q_control) & 1;
                const std::size_t bit_q2 = (i >> q_target) & 1;

                // Only need to swap if the bits differ.
                if (bit_q1 != bit_q2)
                {
                    // Flip the bits at q_control and q_target.
                    std::size_t j = i ^ ((1 << q_control) | (1 << q_target));
                    // To avoid double swapping, swap only if i < j.
                    if (i < j)
                    {
                        std::swap(__s[i], __s[j]);
                    }
                }
            }
        }
    }

    qubit::qubit(const std::size_t &n)
    {
        if (n < 1)
        {
            std::fprintf(stderr, "error: at-least 1 qubit must be present in a valid quantum circuit\n");
            std::exit(EXIT_FAILURE);
        }
        this->M_no_qubits = n;
        this->M_len = 1 << n;
        this->M_qubits = new complex[this->M_len]();
        this->M_qubits[0] = {1, 0};
    }

    qubit::qubit(const qubit &q)
    {
        this->M_len = q.M_len;
        this->M_no_qubits = q.M_no_qubits;
        this->M_qubits = new complex[this->M_len]();

        for (std::size_t i = 0; i < this->M_len; i++)
        {
            this->M_qubits[i] = q.M_qubits[i];
        }
    }

    qubit::qubit(qubit &&q) noexcept(true)
    {
        this->M_len = q.M_len;
        this->M_no_qubits = q.M_no_qubits;
        this->M_qubits = q.M_qubits;

        q.M_len = q.M_no_qubits = 0;
        q.M_qubits = nullptr;
    }

    qubit &qubit::apply_identity(const std::size_t &q_target)
    {
        qubit::apply_predefined_gate(this->M_qubits, this->M_len, gate_type::IDENTITY, q_target);
        return *this;
    }

    qubit &qubit::apply_pauli_x(const std::size_t &q_target)
    {
        qubit::apply_predefined_gate(this->M_qubits, this->M_len, gate_type::PAULI_X, q_target);
        return *this;
    }

    qubit &qubit::apply_pauli_y(const std::size_t &q_target)
    {
        qubit::apply_predefined_gate(this->M_qubits, this->M_len, gate_type::PAULI_Y, q_target);
        return *this;
    }

    qubit &qubit::apply_pauli_z(const std::size_t &q_target)
    {
        qubit::apply_predefined_gate(this->M_qubits, this->M_len, gate_type::PAULI_Z, q_target);
        return *this;
    }

    qubit &qubit::apply_hadamard(const std::size_t &q_target)
    {
        qubit::apply_predefined_gate(this->M_qubits, this->M_len, gate_type::HADAMARD, q_target);
        return *this;
    }

    qubit &qubit::apply_phase_pi_2_shift(const std::size_t &q_target)
    {
        qubit::apply_predefined_gate(this->M_qubits, this->M_len, gate_type::PHASE_PI_2_SHIFT, q_target);
        return *this;
    }

    qubit &qubit::apply_phase_pi_4_shift(const std::size_t &q_target)
    {
        qubit::apply_predefined_gate(this->M_qubits, this->M_len, gate_type::PHASE_PI_4_SHIFT, q_target);
        return *this;
    }

    qubit &qubit::apply_phase_general_shift(const double &_theta, const std::size_t &q_target)
    {
        qubit::apply_theta_gate(this->M_qubits, this->M_len, gate_type::PHASE_GENERAL_SHIFT, _theta, q_target);
        return *this;
    }

    qubit &qubit::apply_rotation_x(const double &_theta, const std::size_t &q_target)
    {
        qubit::apply_theta_gate(this->M_qubits, this->M_len, gate_type::ROTATION_X, _theta, q_target);
        return *this;
    }

    qubit &qubit::apply_rotation_y(const double &_theta, const std::size_t &q_target)
    {
        qubit::apply_theta_gate(this->M_qubits, this->M_len, gate_type::ROTATION_Y, _theta, q_target);
        return *this;
    }

    qubit &qubit::apply_rotation_z(const double &_theta, const std::size_t &q_target)
    {
        qubit::apply_theta_gate(this->M_qubits, this->M_len, gate_type::ROTATION_Z, _theta, q_target);
        return *this;
    }

    qubit &qubit::apply_cnot(const std::size_t &q_control, const std::size_t &q_target)
    {
        qubit::apply_2qubit_gate(this->M_qubits, this->M_len, gate_type::CONTROLLED_NOT, q_control, q_target);
        return *this;
    }

    qubit &qubit::apply_cz(const std::size_t &q_control, const std::size_t &q_target)
    {
        qubit::apply_2qubit_gate(this->M_qubits, this->M_len, gate_type::CONTROLLED_Z, q_control, q_target);
        return *this;
    }

    qubit &qubit::apply_swap(const std::size_t &qubit_1, const std::size_t &qubit_2)
    {
        qubit::apply_2qubit_gate(this->M_qubits, this->M_len, gate_type::SWAP_GATE, qubit_1, qubit_2);
        return *this;
    }

    const qubit::complex *qubit::get_qubits() const
    {
        return this->M_qubits;
    }

    const std::size_t &qubit::get_size() const
    {
        return this->M_len;
    }

    const std::size_t &qubit::memory_consumption() const
    {
        return sizeof(complex) * (this->M_len);
    }

    const std::size_t &qubit::no_of_qubits() const
    {
        return this->M_no_qubits;
    }

    void qubit::get_nth_qubit(complex (&__s)[2], const std::size_t &nth) const
    {
        std::size_t mask = 1 << (this->M_no_qubits - nth - 1);
        for (std::size_t i = 0; i < this->M_len; i++)
        {
            if (i & mask)
                __s[1] += this->M_qubits[i];
            else
                __s[0] += this->M_qubits[i];
        }
        double norm = std::sqrt((std::abs(__s[0]) * std::abs(__s[0])) + (std::abs(__s[1]) * std::abs(__s[1])));

        if (norm > 0)
        {
            __s[0] /= norm;
            __s[1] /= norm;
        }
    }

    std::size_t qubit::measure()
    {
        double tot_prob = 0.0;
        for (std::size_t i = 0; i < this->M_len; i++)
        {
            tot_prob += std::norm(this->M_qubits[i]);
        }

        std::random_device rd;
        std::mt19937 gen(rd());
        std::uniform_real_distribution dist(0.0, tot_prob);
        double r = dist(gen);

        double accum = 0.0;
        std::size_t res = 0;
        for (std::size_t i = 0; i < this->M_len; i++)
        {
            accum += std::norm(this->M_qubits[i]);
            if (accum >= r)
            {
                res = i;
                break;
            }
        }

        for (std::size_t i = 0; i < this->M_len; i++)
        {
            this->M_qubits[i] = (i == res) ? (complex){1.0, 0.0} : (complex){0.0, 0.0};
        }

        return res;
    }

    qubit &qubit::operator=(const qubit &q)
    {
        if (this != &q)
        {
            if (this->M_qubits)
                delete[] this->M_qubits;

            this->M_len = q.M_len;
            this->M_no_qubits = q.M_no_qubits;
            this->M_qubits = new complex[this->M_len]();

            for (std::size_t i = 0; i < this->M_len; i++)
            {
                this->M_qubits[i] = q.M_qubits[i];
            }
        }
        return *this;
    }

    qubit &qubit::operator=(qubit &&q) noexcept(true)
    {
        if (this != &q)
        {
            if (this->M_qubits)
                delete[] this->M_qubits;

            this->M_len = q.M_len;
            this->M_no_qubits = q.M_no_qubits;
            this->M_qubits = q.M_qubits;

            q.M_len = q.M_no_qubits = 0;
            q.M_qubits = nullptr;
        }
        return *this;
    }

    qubit::~qubit()
    {
        if (this->M_qubits)
            delete[] this->M_qubits;
    }
}

#endif
