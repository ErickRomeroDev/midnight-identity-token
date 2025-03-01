# Edda Labs - Auction Platform

Welcome to the **Sea Battle** by **Brick Towers** — a classic strategic and
engaging game reimagined with [Midnight](https://midnight.network) blockchain
[Zero Knowledge](https://en.wikipedia.org/wiki/Zero-knowledge_proof) (ZK) capabilities.
This project demonstrates how Midnight's ZK features can ensure a fair game without sharing the secret information with a 3rd party.

![Development Process snapshot](./public/docs/framework.jpg)

## Developing strategy
### Phase#1: testing using just logic (JEST)
1. Within the contract folder, compile Contract using comptactc ....
2. Within the contract folder, build the contract using yarn build
3. Within the contract folder, test the contract using yarn test

### Phase#2: testing using Midnight APIs, providers, wallet and Docker node-indexer-proofserver (JEST)
4. Within the API folder, elaborate the API and build it using yarn build
5. Within the API folder, elaborate the test Class and run it with yarn test

### Phase#3: Context, hooks
6. Three context providers nad hooks are build for each contract: Deployments, localStorage and Providers.

### Phase#4: UI and DB
7. Specific hooks for subscribing to observables are built here.
8. Connection with dB in case are necessary.
9. UI
10. Midnight wallet Widget.


## Findings or Improvements

1. Scenario: Phase 1 Succeeds but Phase 2 Fails:
    - merge_coin Functionality: When using merge_coin together with CoinInfo and Write_coin, the Phase 1 test passes, but Phase 2 fails.
    - Circuit Sizes: Phase1 does not take this in consideration.
    - Testing Framework Limitations: Phase 1 only considers private states and the logic derived from coins received through circuits. The testing framework does not account for ZswapCoinPks (which are populated with zeros in every case) and does not track any Zswap coin balances.

2. Scenario: Coins Lost or Not Tracked by the Wallet:
    - If the Kachina proof is generated and the transaction is signed, an immediate browser refresh causes the wallet to lose track of coin balances. However, if you wait until both proofs (Kachina and Zwap) are generated, this issue does not occur.

3. General Issues:
    - Next App Router not compatible with some Midnight Libraries, specifically the public provider.
    - New versions released with examples 0.2.0 are failing when minting tokens.

## Need to be installed
    - Docker. Confirm if installed by running (docker --version). 
    - Node. Confirm if installed by running (node --version) 
    - YARN. Confirm if installed by running (yarn --version). Install by running corepack enable
    - Lace Wallet
    - Compact Compiler. Confirm if installed by running (compactc --version)   

## Compiler configuration
    - Verify that your compact compiler environment variable is set by running: echo $COMPACT_HOME
    - If no value is returned, add the following to your bashrc file (Linux), ensuring you update the path to your compact binaries accordingly.
    - export COMPACT_HOME="/home/erick/my-binaries/compactc"
    - export PATH="$COMPACT_HOME:$PATH"

## Procedure to build and run the repository
    1. Initialize Variables
        - Go to /token-api/src/test/prepare-local-standalone-env.test.ts and update the "my_own_wallet" variable with your own wallet address
    2. Build the repo and initialize Midnight instances. At the root level, run:
        - yarn
        - yarn build
        - Open your Docker engine
        - yarn environment
    3. Initialize Variables
        - Create a .env file based on the .env.example. The PostgreSQL password will be generated in the next step, so just copy the format provided in the .env.example file. Optionally, insert your Blockfrost key. The token smart contract address is generated when you run "yarn environment"—simply copy the address displayed in the console and paste it into your .env file
    4. Run the UI. At the /ui-pages level, run:        
        - yarn dev
        - yarn db:init
        - yarn ngrok:init (OPTIONAL: Install NGROK and update the ngrok:init command in the package.json file located in the /ui-pages folder)
    5. Set Lace wallet Network as Undeployed. You should receive 10000 tDust and 100 tBid tokens.


Lace 1.2.3
VSCode extension 0.2.13
Compiler 0.21.0
Language 0.14.0
Example 0.17.0

Midnight structure:

1. contract instance
    - circuits: post, public_key, take_down
    - impureCircuits: post, take_down
    - initialState
    - witnesses: local_secret_key

2. Circuit Result
    - Context: currentPrivateState, currentZswapLocalState, originalState, transactionContext
    - Proof Data: input, output, privateTranscriptOutput, publicTranscript
    - Result

3. Deployed Contract
    - CallTx: access to circuits, after submitting a circuit you get the resulted deployedTxData
    - deployTxData: public, private
        - public: blockhash, blockHeight, contractAddress, initialContractState, status, tx, txHash, txId
        - private: initialPrivateState, signingKey
    - circuitMaintenanceTx: access to circuits
    - contractMaintenanceTx: replate author

4. Providers
    - Midnight Provider: submitTx
    - Private State Provider: clear, clearSigningKeys, get, getSigningKey, remove, removeSigningKey, set, setSigningKey
    - Proof Provider: proofTx
    - Public Data Provider: contractStateObservable, queryContractState, queryDeployContractState, queryZSwapAllContractState, watchForContractState, watchForDeployTxData, watchForTxData
    - Wallet Provider: balanceTx, coinPublicKey
    - ZK Config Provider: get, getProverKey, getVerifierKey, getVerifierKeys, getZKIR

5. Configuration
    - First spin up instances
    - Configure wallet (need instances)
    - Configure providers (depend on wallet & need instances)
    - CallTx (depend on providers)


1. Innovation
2. Completion
3. Technical
4. Documentation

## timeline

- 3 march - submit for hackathon
- clean up codes, get ready for packaging
- 10 march - working with jingles on packaging plans
- .... package and test
- 16 april - toolings published and documented ready for beta release
- 24 april - buidler fest in workshop (midnight tooling....)
