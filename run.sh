#!/bin/bash

set -e

# build contracts
soroban contract build

# deploy contracts
ID=$(soroban contract deploy --wasm target/wasm32-unknown-unknown/release/my_contract.wasm --source SCZ7SY5XLBYHWMVRYQXDFMXL273L5VOIKGAM7UXJARECYKRYICZLOWHM --rpc-url http://localhost:8000/soroban/rpc --network-passphrase 'Standalone Network ; February 2017')

echo "deployed: $ID"
VAL=$(soroban contract invoke --id $ID --source SCZ7SY5XLBYHWMVRYQXDFMXL273L5VOIKGAM7UXJARECYKRYICZLOWHM --rpc-url http://localhost:8000/soroban/rpc --network-passphrase 'Standalone Network ; February 2017' -- get_val)

echo "VAL (should be 'NONE'): $VAL"
soroban contract invoke --id $ID --source SCZ7SY5XLBYHWMVRYQXDFMXL273L5VOIKGAM7UXJARECYKRYICZLOWHM --rpc-url http://localhost:8000/soroban/rpc --network-passphrase 'Standalone Network ; February 2017' -- set_val --new_val hello!
VAL=$(soroban contract invoke --id $ID --source SCZ7SY5XLBYHWMVRYQXDFMXL273L5VOIKGAM7UXJARECYKRYICZLOWHM --rpc-url http://localhost:8000/soroban/rpc --network-passphrase 'Standalone Network ; February 2017' -- get_val)
echo "VAL (should be 'hello!'): $VAL"
