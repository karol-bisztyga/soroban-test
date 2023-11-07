const { callContract, argParseInt, argParseMap, argParseString, argParseVec } = require('./call_contract');
const fs = require('fs');

const secretKey = fs.readFileSync('.data/secret_key').toString().replace(/\r?\n|\r/g, "");
const contractId = fs.readFileSync('.data/contract_id').toString().replace(/\r?\n|\r/g, "");

const mapRepro = async () => {
  let result = null;
  // console.log('calling add');
  // result = await callContract(secretKey, contractId, 'add', argParseInt(6), argParseInt(7));
  // console.log('result of add', result);

  const map = {
    'jn5CIos0YBtfaVDC28mh1q': 8,
    'ou4O2XAVKQah8toY8ueryt': 2,
    'jn5CIos0YBtfaVDC28mh7z': 5,
    'jn5CIos0YBtfaVDC28mgxk': 7,
    'jn5CIos0YBtfaVDC28mgzn': 4,
    'jn5CIos0YBtfaVDC28mh5w': 3,
    'jn5CIos0YBtfaVDC28mh3t': 1,
    // uncomment one of the items below to fail the transaction
    // 'JZNJ190x24zgFxN3aQJJ0M': 4,
    // 'JZNJ190x24zgFxN3aQIr7p': 9,
  }
  console.log('calling sum_map', map);
  result = await callContract(secretKey, contractId, 'sum_map', argParseMap(map, argParseString, argParseInt));
  console.log('result of sum_map', result);

  /**
    Error: host invocation failed

    Caused by:
      HostError: Error(Value, InternalError)
      
      Event log (newest first):
         0: [Diagnostic Event] topics:[error, Error(Value, InternalError)], data:"failed to convert ScVal to host value"
      
      Backtrace (newest first):
         0: <core::iter::adapters::map::Map<I,F> as core::iter::traits::iterator::Iterator>::try_fold
         1: <alloc::vec::Vec<T> as alloc::vec::spec_from_iter::SpecFromIter<T,I>>::from_iter
         2: soroban_env_host::host::metered_clone::MeteredIterator::metered_collect
         3: soroban_env_host::host::frame::<impl soroban_env_host::host::Host>::invoke_function
         4: preflight::preflight::preflight_invoke_hf_op
         5: preflight::preflight_invoke_hf_op::{{closure}}
         6: core::ops::function::FnOnce::call_once{{vtable.shim}}
         7: preflight::catch_preflight_panic
         8: _cgo_0b49d6ed4a0b_Cfunc_preflight_invoke_hf_op
                   at tmp/go-build/cgo-gcc-prolog:103:11
         9: runtime.asmcgocall
                   at ./runtime/asm_amd64.s:848
   */

};

const trustRepro = async () => {
  await callContract(
    secretKey,
    contractId,
    "clear_trust_map",
  );

  let data = fs.readFileSync('js_side/data/trust.json').toString();
  data = JSON.parse(data);
  let parsedResult = {};
  for (let item of data.result) {
    parsedResult[item.trusting_user._ref] = item.trusted_users.map((user) => user._ref);
  }
  console.log(parsedResult);

  let counter = 0;
  let size = Object.keys(parsedResult).length;
  let limit = null; // 3;

  /*
  if you set a small limit (like 3), everything works, when you remove the limit, you get 23 invokations of set_trust_map_for_user_vec
  get_trust_map throws this error:

    {
      status: 'FAILED',
      latestLedger: '867294',
      latestLedgerCloseTime: '1699360154',
      oldestLedger: '865855',
      oldestLedgerCloseTime: '1699352569'
    }
    An error has occured when calling a contract
    - contract id: CA35SHZ2KG4B4ETP3D57PYBJNIH7DXTB3AB6FLWIV5D7RAJXYZ2RM76J
    - function name: get_trust_map
    - args: []
    Error: FAILED
        at innerCallContract (/Users/karolbisztyga/Desktop/workspace/stellar/soroban-test/js_side/call_contract.js:56:13)
        at async callContract (/Users/karolbisztyga/Desktop/workspace/stellar/soroban-test/js_side/call_contract.js:87:12)
        at async trustRepro (/Users/karolbisztyga/Desktop/workspace/stellar/soroban-test/js_side/index.js:90:17)
        at async /Users/karolbisztyga/Desktop/workspace/stellar/soroban-test/js_side/index.js:100:3
    node:internal/process/promises:288
                triggerUncaughtException(err, true /* fromPromise * /);
                ^

    Error: FAILED
        at innerCallContract (/Users/karolbisztyga/Desktop/workspace/stellar/soroban-test/js_side/call_contract.js:56:13)
        at async callContract (/Users/karolbisztyga/Desktop/workspace/stellar/soroban-test/js_side/call_contract.js:87:12)
        at async trustRepro (/Users/karolbisztyga/Desktop/workspace/stellar/soroban-test/js_side/index.js:90:17)
        at async /Users/karolbisztyga/Desktop/workspace/stellar/soroban-test/js_side/index.js:100:3
  */

  for (userId in parsedResult) {
    ++counter;
    console.log('----- calling set_trust_map_for_user_vec', counter, '/', size);
    if (limit && counter > limit) {
      console.log('limit reached, breaking');
      break;
    }
    await callContract(
      secretKey,
      contractId,
      "set_trust_map_for_user_vec",
      argParseString(userId),
      argParseVec(parsedResult[userId], argParseString),
    );
  }
  console.log('setting trust map done, fetching back');

  let fetched = await callContract(
    secretKey,
    contractId,
    "get_trust_map",
  );
  console.log('fetched trust map', fetched);
}

(async () => {
  // await mapRepro();
  await trustRepro();
})();