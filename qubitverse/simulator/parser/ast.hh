/**
 * @file ast.hh
 * @license This file is licensed under the GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007. You may obtain a copy of this license at https://www.gnu.org/licenses/gpl-3.0.en.html.
 * @author Tushar Chaurasia (Dark-CodeX)
 */

#ifndef SIMULATOR_AST
#define SIMULATOR_AST

#include <string>

namespace simulator
{
    enum gate_type : unsigned char
    {
        SINGLE_GATE,
        CNOT_GATE,
        CZ_GATE,
        SWAP_GATE
    };

    class ast_node
    {
      public:
        virtual ~ast_node() = default;
        virtual gate_type get_gate_type() const = 0;
    };

    class ast_single_gate_node : public ast_node
    {
      public:
        std::string M_gate;
        std::size_t M_qubit;
        double M_theta;

        ast_single_gate_node(std::string &&_g, std::size_t _q, double _t)
            : M_gate(std::move(_g)), M_qubit(_q), M_theta(_t) {}

        gate_type get_gate_type() const override { return gate_type::SINGLE_GATE; }
    };

    class ast_cnot_gate_node : public ast_node
    {
      public:
        std::size_t M_control;
        std::size_t M_target;

        ast_cnot_gate_node(std::size_t ctrl, std::size_t tar)
            : M_control(ctrl), M_target(tar) {}

        gate_type get_gate_type() const override { return gate_type::CNOT_GATE; }
    };

    class ast_cz_gate_node : public ast_node
    {
      public:
        std::size_t M_control;
        std::size_t M_target;

        ast_cz_gate_node(std::size_t ctrl, std::size_t tar)
            : M_control(ctrl), M_target(tar) {}

        gate_type get_gate_type() const override { return gate_type::CZ_GATE; }
    };

    class ast_swap_gate_node : public ast_node
    {
      public:
        std::size_t M_qubit1;
        std::size_t M_qubit2;

        ast_swap_gate_node(std::size_t q1, std::size_t q2)
            : M_qubit1(q1), M_qubit2(q2) {}

        gate_type get_gate_type() const override { return gate_type::SWAP_GATE; }
    };
}

#endif