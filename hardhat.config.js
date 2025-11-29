require("@nomicfoundation/hardhat-ethers");

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    bcPadre: {
      url: "http://127.0.0.1:9654/ext/bc/zW7gucvLEAMU32rk5oGi7oTzqsa1EMFCWuH17F96rkbGf31oP/rpc ", // sostituisci col BlockchainID reale
      chainId: 1, // o il chainId che hai scelto per BCpadre
      accounts: [
        "0xa0fd238487be1ca9832b9a5ba4940b0e2e7d1c8bfd32b1a88afe1b50c73c16ec", // TUO
        "0x56289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5ccf558d8027"  // GENESIS
      ],
    },
  },
};
