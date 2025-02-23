/**
 * @file gates.cc
 * @license This file is licensed under the GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007. You may obtain a copy of this license at https://www.gnu.org/licenses/gpl-3.0.en.html.
 * @author Tushar Chaurasia (Dark-CodeX)
 */

#include "./gates.hh"

namespace simulator
{
    void apply_predefined_gate(const enum gates &__g_type, complex (&__s)[2])
    {
        complex new_state[2] = {0, 0};
        for (std::size_t i = 0; i < 2; i++)
        {
            for (std::size_t j = 0; j < 2; j++)
            {
                new_state[i] += pre_defined_qgates[__g_type].matrix[i][j] * __s[j];
            }
        }

        __s[0] = new_state[0];
        __s[1] = new_state[1];
    }

    qgate &get_theta_gates(qgate &__g, const enum gates &__g_type, const double &theta)
    {
        __g.type = __g_type;
        switch (__g_type)
        {
        case gates::PHASE_GENERAL_SHIFT:
            __g.matrix[0][0] = 1.0;
            __g.matrix[0][1] = 0.0;
            __g.matrix[1][0] = 0.0;
            __g.matrix[1][1] = std::polar(1.0, theta);
            break;

        case gates::ROTATION_X:
            __g.matrix[0][0] = std::__complex_cos<double>(theta / 2.0);
            __g.matrix[0][1] = (complex){0, -1} * std::__complex_sin<double>(theta / 2.0);
            __g.matrix[1][0] = (complex){0, -1} * std::__complex_sin<double>(theta / 2.0);
            __g.matrix[1][1] = std::__complex_cos<double>(theta / 2.0);
            break;

        case gates::ROTATION_Y:
            __g.matrix[0][0] = std::__complex_cos<double>(theta / 2.0);
            __g.matrix[0][1] = -std::__complex_sin<double>(theta / 2.0);
            __g.matrix[1][0] = std::__complex_sin<double>(theta / 2.0);
            __g.matrix[1][1] = std::__complex_cos<double>(theta / 2.0);
            break;

        case gates::ROTATION_Z:
            __g.matrix[0][0] = std::polar(1.0, -theta / 2.0);
            __g.matrix[0][1] = 0.0;
            __g.matrix[1][0] = 0.0;
            __g.matrix[1][1] = std::polar(1.0, theta / 2.0);
            break;

        default:
            std::fprintf(stderr, "error: invalid gate selected '%u'\n", (unsigned)__g_type);
            std::exit(EXIT_FAILURE);
            break;
        }
        return __g;
    }

    void apply_theta_gates(const enum gates &__g_type, complex (&__s)[2], const double &theta)
    {
        qgate g = get_theta_gates(g, __g_type, theta);

        complex new_state[2] = {0, 0};
        for (std::size_t i = 0; i < 2; i++)
        {
            for (std::size_t j = 0; j < 2; j++)
            {
                new_state[i] += g.matrix[i][j] * __s[j];
            }
        }

        __s[0] = new_state[0];
        __s[1] = new_state[1];
    }
}