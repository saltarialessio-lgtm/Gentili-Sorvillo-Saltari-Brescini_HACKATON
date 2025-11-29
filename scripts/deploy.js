const hre = require("hardhat");
const fs = require("fs");
const path = require("path")

function refreshLog(jsonRequired_updated) {
    fs.writeFileSync(path.join(__dirname, "../json-out.json"), JSON.stringify(jsonRequired_updated, null, 2), 'utf8');
}

async function main() {
    let jsonOut;
    
    try {
        jsonOut = require("../json-out.json");
    } catch (error) {
        jsonOut = {};  // File non esiste
    }
    
    // Controlla se già deployato
    if (jsonOut.comm_hash_contract_HashTestamento) {
        console.log("❌ Contratto già deployato:", jsonOut.comm_hash_contract_HashTestamento);
        return;
    }

    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying with account:", deployer.address);

    const HashStore = await hre.ethers.getContractFactory("HashStore");
    const hashStore = await HashStore.deploy();
    
    await hashStore.waitForDeployment();
    const contractAddress = await hashStore.getAddress();
    console.log("HashStore deployed to:", contractAddress);

    // ✅ RICREA oggetto completo e salva
    const updatedJson = {
        ...jsonOut,
        comm_hash_contract_HashTestamento: contractAddress
    };
    
    refreshLog(updatedJson);
    console.log("💾 SALVATO in json-out.json!");
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
