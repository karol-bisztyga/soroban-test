#!/bin/bash

set -e

RPC_URL="https://rpc-futurenet.stellar.org:443"
NETWORK_PASS="Test SDF Future Network ; October 2022"
FRIENDBOT_URL="https://friendbot-futurenet.stellar.org/"

PUBLIC_KEY="GCSKTE64HQRTJR2F3I5HZYJSCEJMCDNMJTD77HCA3IO3NQBCIURU4SEE"
SECRET_KEY="SC4GNDOETTVW7FCOKWZ4M7NND3M4XGALQ7OXXL43EP237QEUSHFXQVCG"

echo -n "$PUBLIC_KEY" > .data/public_key
echo -n "$SECRET_KEY" > .data/secret_key

soroban config network add --rpc-url "$RPC_URL" --network-passphrase "$NETWORK_PASS" futurenet

# build contracts
soroban contract build

# deploy contracts
CONTRACT_ID=$(soroban contract deploy --wasm target/wasm32-unknown-unknown/release/my_contract.wasm --source $SECRET_KEY --rpc-url $RPC_URL --network-passphrase "${NETWORK_PASS}")

echo "deployed: $CONTRACT_ID"

echo "$CONTRACT_ID" > .data/contract_id
