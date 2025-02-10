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



## timeline

- 3 march - submit for hackathon
- clean up codes, get ready for packaging
- 10 march - working with jingles on packaging plans
- .... package and test
- 16 april - toolings published and documented ready for beta release
- 24 april - buidler fest in workshop (midnight tooling....)
