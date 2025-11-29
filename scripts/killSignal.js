const hre = require("hardhat");
const fs = require("fs"); 
const jsonRequired = require("../json-out.json");
const path = require("path")
const { createHash } = require("crypto");
const will_extractor = require("./will_extractor.js")

// Indirizzo contratto salvato da saveHash come hash_comm_token
const contractAddress = jsonRequired.hash_comm_token;

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

async function main () {
    try {
      // Connetti al contratto
        const HashStore = await hre.ethers.getContractFactory("HashStore");
        const hashStore = HashStore.attach(contractAddress);
        const storedHash = await hashStore.storedHash();
        console.log("🔐 HASH DEL TESTAMENTO:", storedHash);
        
        if (storedHash === "0x0000000000000000000000000000000000000000000000000000000000000000"){
            console.log("hash non trovato")
            return;
        }
      

        const shafile = await calcolaSHA();

        console.log("🔐 HASH DEL FILE:", shafile);

        if(shafile !== storedHash) {
            console.log("lhash non corrisponde")
            return;
        }
        
        const [deployer] = await hre.ethers.getSigners();
        console.log("Deploying with account:", deployer.address);

        const {addresses, percentages} = will_extractor.extractWillArrays();
        console.log(addresses, percentages)

        const InheritanceController = await hre.ethers.getContractFactory("InheritanceController");

        const [signer] = await hre.ethers.getSigners();
        const balance = await hre.ethers.provider.getBalance(signer.address);

        const deployTx = await InheritanceController.getDeployTransaction(addresses, percentages);
        deployTx.from = signer.address;

        // stima gas
        const gasEstimate = await hre.ethers.provider.estimateGas(deployTx);

        // fee data (per EIP‑1559)
        const feeData = await hre.ethers.provider.getFeeData();
        const maxFeePerGas = feeData.maxFeePerGas ?? feeData.gasPrice; // fallback se gasPrice esiste

        // costo gas
        const gasCost = gasEstimate * maxFeePerGas;

        // tutto il saldo meno gas
        let value = balance - gasCost;
        if (value < 0n) value = 0n;

        const inheritanceController = await InheritanceController.deploy(
            addresses, 
            percentages,
            { value: value}
        );
        
        await inheritanceController.waitForDeployment();
        const addrCom = await inheritanceController.getAddress();
        
        await inheritanceController.payHeirs();
        console.log("HashStore deployed to:", addrCom);
            


    } catch (error) {
      console.log("❌ Errore contratto:", error.message);
      console.log("ℹ️  Prova su bcPadre o redeploya");
    }
}

main().catch(console.error);