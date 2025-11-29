// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract InheritanceController {
    uint256 private constant BASIS_POINTS_DENOMINATOR = 10000;

    struct Heir {
        address beneficiaryAddress;
        uint256 sharePercentage; // in basis points (somma = 10000)
    }

    mapping(address => Heir) public heirs;
    address[] public beneficiaryAddresses;

    address payable public owner;
    
    modifier onlyProprietario() {
        require(msg.sender == owner, "Accesso negato: solo il proprietario puo' eseguire questa funzione.");
        _;
    }

    // ✅ constructor payable: il capitale può essere inviato al deploy
    constructor(
        address[] memory _addresses,
        uint256[] memory _percentages
    ) payable {
        owner = payable(msg.sender);

        require(
            _addresses.length == _percentages.length,
            "Numero eredi non corrispondente alle percentuali."
        );
        
        uint256 totalSum = 0;

        for (uint i = 0; i < _addresses.length; i++) {
            address currentAddress = _addresses[i];
            uint256 currentPercentage = _percentages[i];
            
            require(currentAddress != address(0), "Indirizzo erede non valido (Zero Address).");
            require(currentPercentage > 0, "Percentuale erede non valida.");
            
            heirs[currentAddress] = Heir({
                beneficiaryAddress: currentAddress,
                sharePercentage: currentPercentage
            });

            beneficiaryAddresses.push(currentAddress);
            
            totalSum += currentPercentage;
        }

        require(totalSum == BASIS_POINTS_DENOMINATOR, "La somma delle percentuali non e' 10000.");
    }

    // ✅ funzione per ricevere altri fondi dopo il deploy (opzionale ma utile)
    receive() external payable {}

    function _calculatePercentage(uint256 amount, uint256 bps) internal pure returns (uint256) {
        return (amount * bps) / BASIS_POINTS_DENOMINATOR;
    }

    function getPercentagesHeirs() public view returns (uint256[] memory) {
        // ✅ usa il saldo del contratto, non del proprietario
        uint256 contractBalance = address(this).balance;

        uint256[] memory risultati = new uint256[](beneficiaryAddresses.length);

        for (uint i = 0; i < beneficiaryAddresses.length; i++) {
            require(
                heirs[beneficiaryAddresses[i]].sharePercentage <= BASIS_POINTS_DENOMINATOR,
                "La percentuale non puo' superare il 100% (10000 BPS)."
            );

            risultati[i] = _calculatePercentage(
                contractBalance,
                heirs[beneficiaryAddresses[i]].sharePercentage
            );
        }

        return risultati;
    }

    function payHeirs() public onlyProprietario {
        uint256[] memory amountToPay = getPercentagesHeirs();

        for (uint i = 0; i < beneficiaryAddresses.length; i++) {
            uint256 amount = amountToPay[i];
            if (amount > 0) {
                (bool success, ) = beneficiaryAddresses[i].call{value: amount}("");
                if (!success) {
                    // qui potresti emettere un evento PaymentFailed
                }
            }
        }

        // qui potresti emettere PaymentExecuted(address(this).balance) PRIMA dei pagamenti
    }
}
