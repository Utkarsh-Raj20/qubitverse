/**
 * @file lexer.cc
 * @license This file is licensed under the GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007. You may obtain a copy of this license at https://www.gnu.org/licenses/gpl-3.0.en.html.
 * @author Tushar Chaurasia (Dark-CodeX)
 */

#include "./lexer.hh"

namespace simulator
{
    void lexer::advance(char &c, std::size_t &i, const std::string &__s)
    {
        c = __s[++i];
    }

    bool lexer::perform(const std::string &__s)
    {
        for (std::size_t i = 0; i < __s.length();)
        {
            char c = __s[i];
            switch (c)
            {
            case '@':
                this->M_data.emplace_back(token_type::SEP, "@");
                this->advance(c, i, __s);
                break;

            case ':':
                this->M_data.emplace_back(token_type::COLON, ":");
                this->advance(c, i, __s);
                break;

            case ' ':
            case '\t':
            case '\r':
            case '\n':
                this->advance(c, i, __s);
                break;

            default:
                if (std::isalpha(c))
                {
                    std::string temp;
                    while (std::isalpha(c))
                    {
                        temp.append(&c, 1);
                        this->advance(c, i, __s);
                    }
                    this->M_data.emplace_back(token_type::IDEN, std::move(temp));
                }
                else if (std::isdigit(c) || c == '-' || c == '.')
                {
                    std::string temp;
                    while (std::isdigit(c) || c == '-' || c == '.')
                    {
                        temp.append(&c, 1);
                        this->advance(c, i, __s);
                    }
                    this->M_data.emplace_back(token_type::IDEN, std::move(temp));
                }
                else
                    return false;
                break;
            }
        }
        this->M_data.shrink_to_fit();
        return true;
    }

    std::vector<token> &&lexer::get()
    {
        return std::move(this->M_data);
    }
};