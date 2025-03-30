/**
 * @file parser.hh
 * @license This file is licensed under the GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007. You may obtain a copy of this license at https://www.gnu.org/licenses/gpl-3.0.en.html.
 * @author Tushar Chaurasia (Dark-CodeX)
 */

#ifndef SIMULATOR_PARSER
#define SIMULATOR_PARSER

#include <vector>
#include <memory>
#include "../lexer/token.hh"
#include "./ast.hh"

namespace simulator
{
    class parser
    {
      private:
        std::vector<std::unique_ptr<ast_node>> M_gatelist;
        std::size_t M_nqubs;

      public:
        parser() = default;
        [[nodiscard]] bool perform(std::vector<token> &toks);
        [[nodiscard]] std::vector<std::unique_ptr<ast_node>> &get();
        [[nodiscard]] const std::size_t &get_no_qubits() const;
        void debug_print() const;
        ~parser() = default;
    };
}

#endif