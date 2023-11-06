#!/bin/bash

set -e

PUBLIC_KEY=$(cat .data/public_key)
SECRET_KEY=$(cat .data/secret_key)

# build contracts
soroban contract build

RPC_URL="https://rpc-futurenet.stellar.org:443"

NETWORK_PASS="Test SDF Future Network ; October 2022"

# deploy contracts
CONTRACT_ID=$(soroban contract deploy --wasm target/wasm32-unknown-unknown/release/my_contract.wasm --source $SECRET_KEY --rpc-url $RPC_URL --network-passphrase "${NETWORK_PASS}")

echo "deployed: $CONTRACT_ID"

echo "$CONTRACT_ID" > .data/contract_id
