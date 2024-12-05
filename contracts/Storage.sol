//Modelo feito apenas para teste

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Storage {
    uint256 private value;

    // Função para definir o valor
    function set(uint256 _value) public {
        value = _value;
    }

    // Função para obter o valor
    function get() public view returns (uint256) {
        return value;
    }
}
