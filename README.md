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

## Developing strategy
### Phase#1: testing using just logic (JEST)
1. Within the contract folder, compile Contract using comptactc ....
2. Within the contract folder, build the contract using yarn build
3. Within the contract folder, test the contract using yarn test

### Phase#2: testing using Midnight APIs, providers, wallet and Docker node-indexer-proofserver (JEST)
4. Within the API folder, elaborate the API and build it using yarn build
5. Within the API folder, develop the test folder 

### Phase#3: Context, hooks

### Phase#4: UI and DB

## timeline

- 3 march - submit for hackathon
- clean up codes, get ready for packaging
- 10 march - working with jingles on packaging plans
- .... package and test
- 16 april - toolings published and documented ready for beta release
- 24 april - buidler fest in workshop (midnight tooling....)

## Findings or Improvements

1. Scenario: Phase 1 Succeeds but Phase 2 Fails

    - merge_coin Functionality: When using merge_coin together with CoinInfo and Write_coin, the Phase 1 test passes, but Phase 2 fails.
    - Circuit Sizes: Phase1 does not take this in consideration.
    - Testing Framework Limitations: Phase 1 only considers private states and the logic derived from coins received through circuits. The testing framework does not account for ZswapCoinPks (which are populated with zeros in every case) and does not track any Zswap coin balances.

2. Scenario: Coins Lost or Not Tracked by the Wallet

    - If the Kachina proof is generated and the transaction is signed, an immediate browser refresh causes the wallet to lose track of coin balances. However, if you wait until both proofs (Kachina and Zwap) are generated, this issue does not occur.

## Procedure to intialize
    1. Initialize Variables
        - Go to /token-api/src/test/prepare-local-standalone-env.test.ts and update the my_own_wallet variable with your own wallet address
    2. Build the repo and initialize Midnight instances. At the root level, run:
        - yarn
        - yarn build
        - Open your Docker engine
        - yarn environment
    3. Run the UI. At the /ui-pages level, run:
        - Create a .env file (reference .env.example). Key for the Postgress database will be created automatically. Key for your Blockfrost needs to be inserted (OPTIONAL). Token smart contract address was created when "yarn environment was executed". 
        - yarn dev
        - yarn db:init
        - yarn ngrok:init (OPTIONAL, need to install NGROK and update your NGROK domain on package.json)

## Need to be installed
    - docker --version
    - node --version
    - nvm --version
    - yarn --version 
    - Lace Wallet
    - compactc --version
    - echo $COMPACT_HOME

## Instalation commands
    - nvm install
    - corepack enable
    - export COMPACT_HOME="/home/erick/my-binaries/compactc"
    - export PATH="$COMPACT_HOME:$PATH"
