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

- Situation where phase1 passes but phase2 fails:
    1. merge_coin can be used alongside a CoinInfo and Write_coin
    2. sizes of circuits
    3. Phase1 only takes in consideration private States, Zswap logic is not considered in the testing framework and only works with one ZwapCoinPk filled with zeros.

## Procedure to intialize
    - yarn
    - yarn build
    - Update token address at token.api test
    - yarn environment
    - Update Token address at _app.tsx
    - yarn dev

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
