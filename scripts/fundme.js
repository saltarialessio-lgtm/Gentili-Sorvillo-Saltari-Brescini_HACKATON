const { ethers } = require("hardhat");

async function main() {
  // Preleva i due account definiti in hardhat.config.js su bcPadre
  const [tuo, genesis] = await ethers.getSigners();

  console.log("TUO (deployer):", await tuo.getAddress());
  console.log("GENESIS funder :", await genesis.getAddress());

  console.log("Balance GENESIS prima:",
    ethers.formatEther(await genesis.provider.getBalance(await genesis.getAddress()))
  );
  console.log("Balance TUO prima    :",
    ethers.formatEther(await tuo.provider.getBalance(await tuo.getAddress()))
  );

  // Invia 1000 AVAX dal genesis al tuo wallet
  const tx = await genesis.sendTransaction({
    to: await tuo.getAddress(),
    value: ethers.parseEther("1000")
  });

  console.log("TX hash:", tx.hash);
  await tx.wait();

  console.log("✅ 1000 AVAX inviati!");

  console.log("Balance GENESIS dopo:",
    ethers.formatEther(await genesis.provider.getBalance(await genesis.getAddress()))
  );
  console.log("Balance TUO dopo    :",
    ethers.formatEther(await tuo.provider.getBalance(await tuo.getAddress()))
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
