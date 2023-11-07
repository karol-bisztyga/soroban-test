# soroban-test

Here I reproduced some problems I encountered when working with Soroban.

## Usage

In order to run the tests, you should first run
```
./build.sh
```
and then `./run.sh` with one of the possible options (they will be listed when you provide nothing).
As a second argument you should pass `0` or `1` depending if you want the operation to succeed or fail (reproduce the issue).

### Examples:
```
./run.sh map 1 # this will successfully run map operations
./run.sh map 0 # this will reproduce the map issue

./run.sh trust 1 # this will successfully run the "trust" operations
./run.sh trust 0 # this will reproduce the "trust" issue

# and so on...
```

### Operations

#### Map

Here we try to pass a map from JS to Soroban. For some values it works and for some it does not with no clear pattern what really causes the problem.

#### Trust

Here we upload some data to the blockchain and once we want to fetch it, it fails if the data's too big.

#### Page Rank

This just runs some calculations using the "trust" data.
The point here is that if we go for too much calculations, the transaction will hang forever.

## Note

I realize that Soroban has some constraints and we cannot run everything there. The point is, these constraints are too strict for us to successfully implement desired functionalities.
