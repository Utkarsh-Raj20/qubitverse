/**
 * @file lexer.hh
 * @license This file is licensed under the GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007. You may obtain a copy of this license at https://www.gnu.org/licenses/gpl-3.0.en.html.
 * @author Tushar Chaurasia (Dark-CodeX)
 */

#ifndef SIMULATOR_LEXER
#define SIMULATOR_LEXER

#include <vector>
#include "./token.hh"

namespace simulator
{
    class lexer
    {
      private:
        std::vector<token> M_data;
        void advance(char &c, std::size_t &i, const std::string &__s);

      public:
        lexer() = default;
        [[nodiscard]] bool perform(const std::string &__s);
        [[nodiscard]] std::vector<token> &get();
        void debug_print() const;
        ~lexer() = default;
    };
}

#endif