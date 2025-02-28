// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract XSTPSale is ReentrancyGuard, Ownable {
    IERC20 public xstpToken;
    IERC20 public usdtToken;
    AggregatorV3Interface public bnbPriceFeed;
    
    uint256 public constant XSTP_PRICE_USDT = 1000000; // 0.001 USDT (6 decimais)
    
    event TokensPurchased(
        address buyer,
        uint256 amount,
        string paymentMethod
    );

    constructor(
        address _xstpToken,
        address _usdtToken,
        address _bnbPriceFeed
    ) {
        xstpToken = IERC20(_xstpToken);
        usdtToken = IERC20(_usdtToken);
        bnbPriceFeed = AggregatorV3Interface(_bnbPriceFeed);
    }

    function getBnbPrice() public view returns (uint256) {
        (, int256 price,,,) = bnbPriceFeed.latestRoundData();
        return uint256(price) * 10**10; // Ajustar para 18 decimais
    }

    function buyWithBNB() external payable nonReentrant {
        require(msg.value > 0, "Amount must be greater than 0");
        
        // Pegar preço do BNB em USD
        uint256 bnbPrice = getBnbPrice();
        
        // Calcular valor em USDT (18 decimais)
        uint256 usdtValue = (msg.value * bnbPrice) / 1e18;
        
        // Calcular quantidade de tokens XSTP
        // usdtValue está em 18 decimais, XSTP_PRICE_USDT em 6 decimais
        uint256 tokenAmount = (usdtValue * 1e6) / XSTP_PRICE_USDT;
        
        require(xstpToken.transfer(msg.sender, tokenAmount), "Transfer failed");
        emit TokensPurchased(msg.sender, tokenAmount, "BNB");
    }

    function buyWithUSDT(uint256 usdtAmount) external nonReentrant {
        require(usdtAmount > 0, "Amount must be greater than 0");
        require(usdtToken.transferFrom(msg.sender, address(this), usdtAmount), "USDT transfer failed");
        
        uint256 tokenAmount = (usdtAmount * 1e18) / XSTP_PRICE_USDT;
        require(xstpToken.transfer(msg.sender, tokenAmount), "XSTP transfer failed");
        emit TokensPurchased(msg.sender, tokenAmount, "USDT");
    }
} 