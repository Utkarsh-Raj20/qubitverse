/**
 * @file parser.cc
 * @license This file is licensed under the GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007. You may obtain a copy of this license at https://www.gnu.org/licenses/gpl-3.0.en.html.
 * @author Tushar Chaurasia (Dark-CodeX)
 */

#include "./parser.hh"

namespace simulator
{
    bool parser::perform(std::vector<token> &toks)
    {
        std::size_t i = 0;
        if (toks[i].M_val == "n")
            i += 2; // skips n at 0, then ':' at 1
        this->M_nqubs = std::stoul(toks[i++].M_val, (std::size_t *)0, 10);
        this->M_gatelist.reserve(this->M_nqubs);

        for (; i < toks.size();)
        {
            if (toks[i].M_val == "type")
            {
                i += 2; // skips type type and :
                if (toks[i].M_val == "single")
                {
                    i++; // skips single
                    std::string g_type;
                    std::size_t qub;
                    double theta;

                    i += 2; // skips gateType
                    g_type = toks[i++].M_val;
                    i += 2; // skips qubit
                    qub = std::stoul(toks[i++].M_val);
                    i += 2; // skips theta
                    theta = std::stod(toks[i++].M_val);
                    i += 3; // skips position and its value

                    this->M_gatelist.emplace_back(new ast_single_gate_node(std::move(g_type), qub, theta));
                    if (toks[i].M_type == token_type::SEP)
                        i++;
                }
                else if (toks[i].M_val == "cnot")
                {
                    i++; // skips cnot
                    std::size_t ctrl, tar;

                    i += 2; // skips control
                    ctrl = std::stoul(toks[i++].M_val);
                    i += 2; // skips target
                    tar = std::stoul(toks[i++].M_val);
                    i += 3; // skips position and its value

                    this->M_gatelist.emplace_back(new ast_cnot_gate_node(ctrl, tar));
                    if (toks[i].M_type == token_type::SEP)
                        i++;
                }
                else if (toks[i].M_val == "cz")
                {
                    i++; // skips cz
                    std::size_t ctrl, tar;

                    i += 2; // skips control
                    ctrl = std::stoul(toks[i++].M_val);
                    i += 2; // skips target
                    tar = std::stoul(toks[i++].M_val);
                    i += 3; // skips position and its value

                    this->M_gatelist.emplace_back(new ast_cz_gate_node(ctrl, tar));
                    if (toks[i].M_type == token_type::SEP)
                        i++;
                }
                else if (toks[i].M_val == "swap")
                {
                    i++; // skips swap
                    std::size_t q1, q2;

                    i += 2; // skips qubit1
                    q1 = std::stoul(toks[i++].M_val);
                    i += 2; // skips qubit2
                    q2 = std::stoul(toks[i++].M_val);
                    i += 3; // skips position and its value

                    this->M_gatelist.emplace_back(new ast_swap_gate_node(q1, q2));
                    if (toks[i].M_type == token_type::SEP)
                        i++;
                }
                else if (toks[i].M_val == "measurenth")
                {
                    i++; // skips measurenth
                    std::size_t q;

                    i += 2; // skips qubit
                    q = std::stoul(toks[i++].M_val);
                    i += 3; // skips position and its value

                    this->M_gatelist.emplace_back(new ast_measure_nth_node(q));
                    if (toks[i].M_type == token_type::SEP)
                        i++;
                }
                else
                    return false;
            }
            else
                return false;
        }
        toks.clear();
        return true;
    }

    std::vector<std::unique_ptr<ast_node>> &parser::get()
    {
        return this->M_gatelist;
    }

    const std::size_t &parser::get_no_qubits() const
    {
        return this->M_nqubs;
    }

    void parser::debug_print() const
    {
        for (const auto &i : this->M_gatelist)
        {
            if (i->get_gate_type() == gate_type::SINGLE_GATE)
            {
                auto *casted = dynamic_cast<ast_single_gate_node *>(i.get());
                std::printf("SINGLE_GATE: [GATE: %s, QUBIT: %zu, THETA: %lf]\n",
                            casted->M_gate.c_str(),
                            casted->M_qubit,
                            casted->M_theta);
            }
            else if (i->get_gate_type() == gate_type::CNOT_GATE)
            {
                auto *casted = dynamic_cast<ast_cnot_gate_node *>(i.get());
                std::printf("CNOT_GATE: [CONTROL: %zu, TARGET: %zu]\n",
                            casted->M_control,
                            casted->M_target);
            }
            else if (i->get_gate_type() == gate_type::CZ_GATE)
            {
                auto *casted = dynamic_cast<ast_cz_gate_node *>(i.get());
                std::printf("CZ_GATE: [CONTROL: %zu, TARGET: %zu]\n",
                            casted->M_control,
                            casted->M_target);
            }
            else if (i->get_gate_type() == gate_type::SWAP_GATE)
            {
                auto *casted = dynamic_cast<ast_swap_gate_node *>(i.get());
                std::printf("SWAP_GATE: [QUBIT1: %zu, QUBIT2: %zu]\n",
                            casted->M_qubit1,
                            casted->M_qubit2);
            }
        }
    }
}