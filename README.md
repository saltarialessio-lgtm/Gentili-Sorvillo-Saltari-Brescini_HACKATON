# 🚀 Hackathlon 2025  
### **Brescini · Gentili · Saltari · Sorvillo**

---

## 💡 **Idea del Progetto**

Il nostro progetto introduce un sistema di **ereditarietà digitale su blockchain**.  
Oggi, quando una persona fisica possiede criptovalute e viene a mancare, i suoi asset rischiano di andare **perduti per sempre**.

💭 **La nostra soluzione:**  
Implementiamo un meccanismo che consente di **definire eredi e quote di ripartizione** direttamente on-chain, in modo sicuro, trasparente e automatico.

Il tutto è costruito su una blockchain locale basata su **ETH** grazie all’ambiente di sviluppo fornito da **Avalanche**, che ci ha permesso una configurazione semplice, efficiente e flessibile.

---

## 🧠 **Logiche di Sviluppo**

Abbiamo creato una blockchain locale con un utente principale identificato come **root**, dotato di una serie di metodi personalizzati:

### 🔧 **Funzionalità implementate**
- **`deploy`** → pubblica *on-chain* un nodo vuoto.  
- **`saveHash`** → salva nel nodo l’hash del testamento (conservato in locale).  
- **`getWallet`** → restituisce informazioni su balance e hash salvato.  
- **`kill`** → verifica lo SHA del testamento precedentemente registrato, se corretto distribuisce i fondi agli utenti designati come *eredi*.  
- **`fundMe`** → ricarica il portafoglio della root.  

Abbiamo inoltre sviluppato un **frontend user-friendly** per semplificare l’interazione con la blockchain senza ricorrere alla CLI.

---

## 🛠️ **Tool Utilizzati**
- **Solidity**
- **Hardhat**
- **Avalanche CLI**

---
