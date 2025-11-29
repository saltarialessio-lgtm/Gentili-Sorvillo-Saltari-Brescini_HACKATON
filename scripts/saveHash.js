const hre = require("hardhat");
const path = require("path");
const fs = require("fs");
const { createHash } = require("crypto");
const jsonRequired = require("../json-out.json");

function refreshLog(jsonRequired_updated) {
    fs.writeFileSync(path.join(__dirname, "../json-out.json"), JSON.stringify(jsonRequired_updated, null, 2), 'utf8');
}

async function calcolaSHA() {
    const filepath = path.join(__dirname, "../testamenti/testamento.json");
    try {
        const testamentoRaw = fs.readFileSync(filepath, 'utf8');
        const hash = createHash('sha256');
        hash.update(testamentoRaw);
        return "0x" + hash.digest('hex');
    } catch (error) {
        console.error("❌ Errore lettura testamento.json:", error.message);
        throw error;
    }
}

async function main() {
    if (!jsonRequired.comm_hash_contract_HashTestamento) {
        console.log("❌ Contratto non trovato! Esegui deploy.js prima");
        return;
    }

    const contractAddress = jsonRequired.comm_hash_contract_HashTestamento;
    console.log("🏠 Contratto:", contractAddress);

    const [signer] = await hre.ethers.getSigners();
    console.log("👤 Account:", signer.address);

    const sha256Testamento = await calcolaSHA();
    console.log("🔐 SHA256:", sha256Testamento);

    // ✅ Connetti al contratto
    const HashStore = await hre.ethers.getContractFactory("HashStore");
    const hashStore = HashStore.attach(contractAddress);

    // Salva hash
    const tx = await hashStore.connect(signer).setHash(sha256Testamento);
    console.log("⏳ TX:", tx.hash);
    await tx.wait();
    console.log("✅ Confermata!");

    // ✅ SALVA hashStore.getAddress() come hash_comm_token
    const contractAddr = await hashStore.getAddress();
    const updatedJson = {
        comm_hash_contract_HashTestamento: null,
        hash_comm_token: contractAddress
    };
    refreshLog(updatedJson);

    console.log("💾 Salvato indirizzo contratto:", contractAddr);
}

main().catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
});
