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

### Run the network
```shell
docker compose -f undeployed-compose.yml up
```

## Important Notes
1. When configuring a new workspace, create a copy of a template and change the names, update workspaces
2. run "yarn" at the root
3. Run nvm install at the project workspace level
4. Run npx turbo build at the project workspace level

## Developing strategy
### testing using just logic (JEST)
1. Within the contract folder, compile Contract using comptactc ....
2. Within the contract folder, build the contract using yarn build
3. Within the contract folder, test the contract using yarn test

### testing using Midnight APIs, providers, wallet and Docker node-indexer-proofserver (JEST)
4. Within the midnight-js folder, elaborate the API and build it using yarn build
5. Within the midnight-js folder, develop the test folder and test it using yarn build

### testing using UI framework and real Midnight server and concensus
6. Within the UI folder, elaborate the UI and build it using yarn build
7. Within the UI folder, run the UI using yarn start

## Some external issues resolvers
when doing a compile, change the exports for export for ledger, contract, purecircuits and others. At contract/dist/manged/mxmxmx/contract/index.cjs.

### For files bigger than 100MB
1. sudo dnf install git-lfs
2. git lfs --version
3. git lfs install
4. git lfs track "public/navalBattle/zkir/*"
5. git lfs track "public/navalBattle/keys/*"

6. git add public/navalBattle/zkir/*     ***stage files to LFS
7. git add public/navalBattle/keys/*
7. git lfs ls-files       **list all the files that i have stored in LFS

### Go back one commit
git reset HEAD~1   ***clear last commit and leave changes intact and unstaged



## timeline

- 3 march - submit for hackathon
- clean up codes, get ready for packaging
- 10 march - working with jingles on packaging plans
- .... package and test
- 16 april - toolings published and documented ready for beta release
- 24 april - buidler fest in workshop (midnight tooling....)

## Findings

- Situation where phase1 passes but phase2 fails:
    1. merge_coin can be used alongside a CoinInfo and Write_coin
    2. sizes of circuits

## Procedure to intialize
    - yarn build
    - yarn environment
    - yarn dev
    - Update Token address at _app.tsx

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
