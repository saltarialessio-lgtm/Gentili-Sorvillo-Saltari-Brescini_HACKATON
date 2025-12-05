# 🚀 Hackathon 2025
### **Brescini · Gentili · Saltari · Sorvillo**

---

## 💡 **Project Idea**

Our project introduces a **digital inheritance system on blockchain**.
Today, when an individual owning cryptocurrencies passes away, their assets risk being **lost forever**.

💭 **Our solution:**
We implement a mechanism that allows **defining heirs and distribution shares** directly on-chain, in a secure, transparent, and automatic way.

Everything is built on a local **ETH**-based blockchain using the development environment provided by **Avalanche**, which allowed for a simple, efficient, and flexible configuration.

---

## 🧠 **Development Logic**

We created a local blockchain with a main user identified as **root**, equipped with a series of custom methods:

### 🔧 **Implemented Features**
- **`deploy`** → publishes an empty node *on-chain*.
- **`saveHash`** → saves the will's hash (stored locally) into the node.
- **`getWallet`** → returns information on balance and saved hash.
- **`kill`** → verifies the SHA of the previously registered will; if correct, it distributes funds to the users designated as *heirs*.
- **`fundMe`** → tops up the root wallet.

We also developed a **user-friendly frontend** to simplify interaction with the blockchain without using the CLI.

---

## 🛠️ **Tools Used**
- **Solidity**
- **Hardhat**
- **Avalanche CLI**
