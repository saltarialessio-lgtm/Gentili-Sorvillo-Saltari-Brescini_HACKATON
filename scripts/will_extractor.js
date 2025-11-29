// will_extractor.js

const data = require("../testamenti/testamento.json");

/**
 * Estrae arrays di address e percentuali dal JSON del testamento.
 * Lancia un errore se la somma delle percentuali non coincide con totalPercentage.
 *
 * @param {object} data
 * @param {Array<{name: string, address: string, percentage: number}>} data.heirs
 * @param {{ totalPercentage: number }} data.rules
 * @returns {{ addresses: string[], percentages: number[] }}
 */



function extractWillArrays() {
  const totalPercentage = data.heirs.reduce(
    (sum, heir) => sum + heir.percentage,
    0
  );

  if (totalPercentage !== data.rules.totalPercentage) {
    throw new Error(
      `Errore di validazione: la somma delle percentuali è ${totalPercentage}, ` +
      `non ${data.rules.totalPercentage}.`
    );
  }

  const addresses = [];
  const percentages = [];

  for (const heir of data.heirs) {
    addresses.push(heir.address);
    percentages.push(heir.percentage);
  }

  return { addresses, percentages };
}

// esporti sia la funzione sia il json tipizzato già pronto
module.exports = {
  extractWillArrays
};
