# soroban-test

Here I reproduced some problems I encountered when working with Soroban.

## Usage

In order to run the tests, you need to have these files:
```
.data/public_key
.data/secret_key
```
They must contain keys of a valid futurenet account.

Once you have this, you should run
```
./build.sh
```
and then `./run.sh` with one of the possible options (they will be listed when you provide nothing).
As a second argument you should pass `0` or `1` depending if you want the operation to succeed or fail (reproduce the issue).

### Examples:
```
./run.sh map 1 # this will successfully run map operations
./run.sh map 0 # this will reproduce the map issue

./run.sh get_data_too_big 1 # this will successfully run the "get_data_too_big" operations
./run.sh get_data_too_big 0 # this will reproduce the "get_data_too_big" issue

# and so on...
```

### Operations

#### Map

Here we try to pass a map from JS to Soroban. For some values it works and for some it does not with no clear pattern what really causes the problem.

#### get/set data too big

Here we send some data to the blockchain or fetch somedata from it and once we want to fetch it, it fails if the data's too big.

#### Too many calculations

The point here is that if we go for too much calculations, the transaction will hang forever.

Important thing to note here is that we do not exceed the limit of CPU isntructions (100_000_000 based on https://soroban.stellar.org/docs/fundamentals-and-concepts/fees-and-metering#resource-fee).
I know once this limit is exceeeded, the transaction will hang forever.
I performed transactions that would have 80_000_000 - 96_000_000 and still hang (die).

In this example the cpu instructions value is 86_828_462 and the transaction hangs indefinitely.

## Note

I realize that Soroban has some constraints and we cannot run everything there. The point is, these constraints are too strict for us to successfully implement desired functionalities.
