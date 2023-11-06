#!/bin/bash

set -e

PUBLIC_KEY=$(cat .data/public_key)
SECRET_KEY=$(cat .data/secret_key)

RPC_URL="https://rpc-futurenet.stellar.org:443"

NETWORK_PASS="Test SDF Future Network ; October 2022"

CONTRACT_ID=$(cat .data/contract_id)

soroban contract invoke --id $CONTRACT_ID --source $SECRET_KEY --rpc-url $RPC_URL --network-passphrase "${NETWORK_PASS}" -- add --a 12 --b 3
