// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract XSTPToken is ERC20, Ownable {
    constructor() ERC20("StartUpX Token", "XSTP") {
        _mint(msg.sender, 1000000000 * 10 ** decimals()); // 1 bilhão de tokens
    }
} 