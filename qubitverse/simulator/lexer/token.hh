/**
 * @file token.hh
 * @license This file is licensed under the GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007. You may obtain a copy of this license at https://www.gnu.org/licenses/gpl-3.0.en.html.
 * @author Tushar Chaurasia (Dark-CodeX)
 */

#ifndef SIMULATOR_TOKEN
#define SIMULATOR_TOKEN

#include <string>

namespace simulator
{
    enum token_type : unsigned char
    {
        IDEN,
        COLON,
        SEP
    };

    struct token
    {
        token_type M_type;
        std::string M_val;
    };
};

#endif