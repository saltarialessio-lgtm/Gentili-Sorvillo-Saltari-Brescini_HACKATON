const hre = require("hardhat");
const fs = require("fs"); 
const jsonRequired = require("../json-out.json");
const path = require("path")

// Indirizzo contratto salvato da saveHash come hash_comm_token
const contractAddress = jsonRequired.hash_comm_token;

async function main() {
  const [signer] = await hre.ethers.getSigners();
  
  // 1. Controlla fondi
  const balance = await hre.ethers.provider.getBalance(signer.address);
  console.log("💰 SALDO:", hre.ethers.formatEther(balance), "AVAX");
  console.log("👤 Account:", signer.address);
  
  // 2. SE indirizzo contratto esiste, connetti e leggi hash
  if (contractAddress) {
    console.log("🏠 Contratto trovato:", contractAddress);
    
    try {
      // Connetti al contratto
      const HashStore = await hre.ethers.getContractFactory("HashStore");
      const hashStore = HashStore.attach(contractAddress);
      
      // Leggi hash DAL CONTRATTO
      const storedHash = await hashStore.storedHash();
      console.log("🔐 HASH DEL TESTAMENTO:", storedHash);
      
      if (storedHash === "0x0000000000000000000000000000000000000000000000000000000000000000") {
        console.log("⚠️  Nessun testamento salvato");
      } else {
        console.log("✅ TESTAMENTO SALVATO ON-CHAIN!");
      }
    } catch (error) {
      console.log("❌ Errore contratto:", error.message);
      console.log("ℹ️  Prova su bcPadre o redeploya");
    }
  } else {
    console.log("⚠️  Nessun contratto salvato in json-out.json");
  }
}

main().catch(console.error);
