/**
 * @file simulator.cc
 * @license This file is licensed under the GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007. You may obtain a copy of this license at https://www.gnu.org/licenses/gpl-3.0.en.html.
 * @author Tushar Chaurasia (Dark-CodeX)
 */

#include <iostream>
#include <bitset>
#include "../gates/gates.hh"
#include "../lexer/lexer.hh"
#include "../parser/parser.hh"
#include "../dep/httplib.h"

double deg_to_rad(const double &deg)
{
    return deg * (M_PI / 180.0);
}

std::string num_binstr(const std::size_t &n, const std::size_t &n_bits)
{
    return std::bitset<sizeof(std::size_t) * (sizeof(char) * 8)>(n).to_string().substr((sizeof(std::size_t) * (sizeof(char) * 8)) - n_bits);
}

void print_quantum_states(const simulator::qubit &q)
{
    const simulator::qubit::complex *vec_space = q.get_qubits();
    for (std::size_t i = 0; i < q.get_size(); i++)
    {
        std::cout << i << ": |" << num_binstr(i, q.no_of_qubits()) << "〉: " << vec_space[i] << "\n";
    }
}

std::string get_quantum_info(const std::size_t &nQ, const std::vector<std::unique_ptr<simulator::ast_node>> &gates, bool measure)
{
    simulator::qubit qsys(nQ);
    std::puts("Initial State:");
    print_quantum_states(qsys);
    for (const auto &i : gates)
    {
        if (i->get_gate_type() == simulator::gate_type::SINGLE_GATE)
        {
            auto *casted = dynamic_cast<simulator::ast_single_gate_node *>(i.get());
            if (casted->M_gate == "I")
            {
                qsys.apply_identity(casted->M_qubit);
                std::printf("After Applying Identity Gate on Qubit %zu:\n", casted->M_qubit);
                print_quantum_states(qsys);
            }
            else if (casted->M_gate == "X")
            {
                qsys.apply_pauli_x(casted->M_qubit);
                std::printf("After Applying Pauli-X Gate on Qubit %zu:\n", casted->M_qubit);
                print_quantum_states(qsys);
            }
            else if (casted->M_gate == "Y")
            {
                qsys.apply_pauli_y(casted->M_qubit);
                std::printf("After Applying Pauli-Y Gate on Qubit %zu:\n", casted->M_qubit);
                print_quantum_states(qsys);
            }
            else if (casted->M_gate == "Z")
            {
                qsys.apply_pauli_z(casted->M_qubit);
                std::printf("After Applying Pauli-Z Gate on Qubit %zu:\n", casted->M_qubit);
                print_quantum_states(qsys);
            }
            else if (casted->M_gate == "H")
            {
                qsys.apply_hadamard(casted->M_qubit);
                std::printf("After Applying Hadamard Gate on Qubit %zu:\n", casted->M_qubit);
                print_quantum_states(qsys);
            }
            else if (casted->M_gate == "S")
            {
                qsys.apply_phase_pi_2_shift(casted->M_qubit);
                std::printf("After Applying Phase Shift Gate by pi/2 on Qubit %zu:\n", casted->M_qubit);
                print_quantum_states(qsys);
            }
            else if (casted->M_gate == "T")
            {
                qsys.apply_phase_pi_4_shift(casted->M_qubit);
                std::printf("After Applying Phase Shift Gate by pi/4 on Qubit %zu:\n", casted->M_qubit);
                print_quantum_states(qsys);
            }
            else if (casted->M_gate == "P")
            {
                qsys.apply_phase_general_shift(deg_to_rad(casted->M_theta), casted->M_qubit);
                std::printf("After Applying General Phase Shift Gate by %lf rad on Qubit %zu:\n", casted->M_qubit, deg_to_rad(casted->M_theta), casted->M_qubit);
                print_quantum_states(qsys);
            }
            else if (casted->M_gate == "Rx")
            {
                qsys.apply_rotation_x(deg_to_rad(casted->M_theta), casted->M_qubit);
                std::printf("After Applying Rotation-X Gate by %lf rad on Qubit %zu:\n", casted->M_qubit, deg_to_rad(casted->M_theta), casted->M_qubit);
                print_quantum_states(qsys);
            }
            else if (casted->M_gate == "Ry")
            {
                qsys.apply_rotation_y(deg_to_rad(casted->M_theta), casted->M_qubit);
                std::printf("After Applying Rotation-Y Gate by %lf rad on Qubit %zu:\n", casted->M_qubit, deg_to_rad(casted->M_theta), casted->M_qubit);
                print_quantum_states(qsys);
            }
            else if (casted->M_gate == "Rz")
            {
                qsys.apply_rotation_z(deg_to_rad(casted->M_theta), casted->M_qubit);
                std::printf("After Applying Rotation-Z Gate by %lf rad on Qubit %zu:\n", casted->M_qubit, deg_to_rad(casted->M_theta), casted->M_qubit);
                print_quantum_states(qsys);
            }
        }
        else if (i->get_gate_type() == simulator::gate_type::CNOT_GATE)
        {
            auto *casted = dynamic_cast<simulator::ast_cnot_gate_node *>(i.get());
            qsys.apply_cnot(casted->M_control, casted->M_target);
            std::printf("After Applying CNOT Gate [Control Qubit: %zu, Target Qubit: %zu]:\n", casted->M_control, casted->M_target);
            print_quantum_states(qsys);
        }
        else if (i->get_gate_type() == simulator::gate_type::CZ_GATE)
        {
            auto *casted = dynamic_cast<simulator::ast_cz_gate_node *>(i.get());
            qsys.apply_cz(casted->M_control, casted->M_target);
            std::printf("After Applying CZ Gate [Control Qubit: %zu, Target Qubit: %zu]:\n", casted->M_control, casted->M_target);
            print_quantum_states(qsys);
        }
        else if (i->get_gate_type() == simulator::gate_type::SWAP_GATE)
        {
            auto *casted = dynamic_cast<simulator::ast_swap_gate_node *>(i.get());
            qsys.apply_swap(casted->M_qubit1, casted->M_qubit2);
            std::printf("After Applying SWAP Gate [Qubit1: %zu, Qubit2: %zu]:\n", casted->M_qubit1, casted->M_qubit2);
            print_quantum_states(qsys);
        }
    }

    return "Done Operations\n";
}

int main(void)
{
    httplib::Server svr;
    svr.Post("/api/endpoint", [](const httplib::Request &req, httplib::Response &res)
             {

        simulator::lexer lex;
        lex.perform(req.body);

        simulator::parser parser;
        parser.perform(lex.get());
        parser.debug_print();

        std::string reply = get_quantum_info(parser.get_no_qubits(), parser.get(), false);

        // Set CORS header
        res.set_header("Access-Control-Allow-Origin", "http://localhost:5173");
        
        // Set the response content as plain text
        res.set_content(reply, "text/plain");
        std::puts("---------------------------------------------------------------------"); });

    // Start the server on port 9080
    svr.listen("0.0.0.0", 9080);

    return EXIT_SUCCESS;
}
