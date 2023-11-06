const callContractModule = require('./call_contract');
const fs = require('fs');

console.log('hello',);

(async () => {
  const secretKey = fs.readFileSync('.data/secret_key').toString().replace(/\r?\n|\r/g, "");
  const contractId = fs.readFileSync('.data/contract_id').toString().replace(/\r?\n|\r/g, "");

  const { callContract, argParseInt } = callContractModule;

  console.log(contractId, secretKey);

  console.log('calling the contract...', typeof callContract);
  const result = await callContract(secretKey, contractId, 'add', argParseInt(6), argParseInt(7));
  console.log('result', result)
})();
