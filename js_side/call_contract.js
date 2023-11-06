const SorobanClient = require("soroban-client")

const stringToScVal = (str) => {
  const b = Buffer.from(str);
  const scVal = SorobanClient.xdr.ScVal.scvBytes(b);
  return scVal;
};

async function innerCallContract(
  secretKey,
  contractId,
  functionName,
  ...args
) {
  const keyPair = SorobanClient.Keypair.fromSecret(secretKey);
  const publicKey = keyPair.publicKey();

  const server = new SorobanClient.Server(
    "https://rpc-futurenet.stellar.org:443"
  );

  const fee = "1000";
  const account = await server.getAccount(publicKey);
  const contractObject = new SorobanClient.Contract(contractId);
  const maxWait = 10;

  let transaction = new SorobanClient.TransactionBuilder(account, {
    fee,
    networkPassphrase: "Test SDF Future Network ; October 2022",
  })
    .addOperation(
      contractObject.call(functionName, ...args)
    )
    .setTimeout(SorobanClient.TimeoutInfinite)
    .build();

  console.log('simulating transaction...');
  const simulated = await server.simulateTransaction(transaction);
  console.log(">>> SIMULATED TX", simulated);
  if (SorobanClient.SorobanRpc.isSimulationError(simulated)) {
    throw new Error(simulated.error);
  }

  let preparedTransaction = await server.prepareTransaction(transaction);
  preparedTransaction.sign(SorobanClient.Keypair.fromSecret(secretKey));

  let hash = (await server.sendTransaction(preparedTransaction)).hash;
  let response = await server.getTransaction(hash);
  let count = 0;
  while (response.status !== "SUCCESS") {
    response = await server.getTransaction(hash);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("waiting...", count, response.status);
    if (response.status === "FAILED") {
      console.error(response);
      throw new Error("FAILED");
    }
    if (count++ > maxWait) {
      // throw new Error("timeout reached");
    }
  }

  let resultMetaXdr = response.resultMetaXdr.toXDR();
  let resultMetaXdrString = resultMetaXdr.toString("base64");

  let meta = SorobanClient.xdr.TransactionMeta.fromXDR(
    resultMetaXdrString,
    "base64"
  )

  let sorobanMeta = meta.v3().sorobanMeta();
  if (sorobanMeta === null) {
    throw new Error("sorobanMeta is null");
  }
  let rawResponse = sorobanMeta.returnValue();
  let result = SorobanClient.scValToNative(rawResponse);
  return result;
}

async function callContract(
  secretKey,
  contractId,
  functionName,
  ...args
) {
  try {
    return await innerCallContract(
      secretKey,
      contractId,
      functionName,
      ...args
    );
  } catch (e) {
    console.error("An error has occured when calling a contract");
    console.error(`- contract id: ${contractId}`);
    console.error(`- function name: ${functionName}`);
    console.error('- args:', args);
    console.error(e);
    throw e;
  }
}

const argParseInt = (arg) => SorobanClient.xdr.ScVal.scvU32(parseInt(arg));

const argParseString = (arg) => SorobanClient.xdr.ScVal.scvString(arg);

const argParseMap = (map, keyConverter, ValConverter) => {
  let result = [];
  let sortedData = Object.entries(map);
  sortedData = sortedData.sort(([key1, val1], [key2, val2]) => {
    return key1.localeCompare(key2);
  });

  for (let i = 0; i < sortedData.length; ++i) {
    const dataItem = sortedData[i];
    const key = dataItem[0];
    const val = dataItem[1];

    let item = new SorobanClient.xdr.ScMapEntry({
      key: keyConverter(key),
      val: ValConverter(val),
    });
    result.push(item);
  }
  return SorobanClient.xdr.ScVal.scvMap(result);
}

const argParseVec = (arr, itemConverter) => {
  return SorobanClient.xdr.ScVal.scvVec(arr.map((item) => itemConverter(item)));
}

const argParseTuple2 = (arr, itemConverter, itemConverter2) => {
  if (arr.length != 2) {
    throw new Error("argParseTuple2 may receive only an array of 2 items, received items: " + arr.length);
  }
  return SorobanClient.xdr.ScVal.scvVec([itemConverter(arr[0]), itemConverter2(arr[1])]);
}

module.exports = {
  callContract,
  argParseInt,
  argParseString,
  argParseVec,
  argParseTuple2,
  argParseMap,
};
