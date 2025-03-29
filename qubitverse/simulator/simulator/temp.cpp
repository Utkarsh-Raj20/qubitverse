#include <iostream>
#include <string>

int main()
{
    std::string line;
    while (std::getline(std::cin, line))
    {
        std::cout << line << std::endl;
    }

    // Output results to stdout
    std::cout << "Processed result here";

    return 0;
}