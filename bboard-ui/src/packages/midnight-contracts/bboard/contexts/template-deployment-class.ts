import { API, type Providers, type DeployedAPI } from '@meshsdk/bboard-api';
import { type ContractAddress } from '@midnight-ntwrk/compact-runtime';
import { BehaviorSubject, type Observable } from 'rxjs';
import { type Logger } from 'pino';
import { type LocalStorageProps } from './bboard-localStorage-class';

export type ContractType = 'recent' | 'youcouldjoin' | 'yours' | 'allOther';

export interface ContractState {
  readonly observable: BehaviorSubject<ContractDeployment>;
  readonly contractType: ContractType;
  address?: ContractAddress;
}

export interface InProgressContractDeployment {
  readonly status: 'in-progress';
  readonly address?: ContractAddress;
}

export interface DeployedContract {
  readonly status: 'deployed';
  readonly api: DeployedAPI;
  readonly address: ContractAddress;
}

export interface FailedContractDeployment {
  readonly status: 'failed';
  readonly error: Error;
  readonly address?: ContractAddress;
}

export type ContractDeployment = InProgressContractDeployment | DeployedContract | FailedContractDeployment;

export interface DeployedTemplateAPIProvider {
  readonly contractDeployments$: Observable<ContractState[]>;
  readonly addContract: (providers: Providers, contractType: ContractType, contractAddress: ContractAddress) => ContractState;
  readonly deployAndAddContract: (providers: Providers, contractType: ContractType) => Promise<ContractState>;
}

export class DeployedTemplateManager implements DeployedTemplateAPIProvider {
  readonly #contractDeploymentsSubject: BehaviorSubject<ContractState[]>;

  constructor(
    private readonly logger: Logger,
    private readonly localState: LocalStorageProps,
    private readonly tokenContractAddress: ContractAddress,
  ) {
    this.#contractDeploymentsSubject = new BehaviorSubject<ContractState[]>([]);
    this.contractDeployments$ = this.#contractDeploymentsSubject;
  }

  readonly contractDeployments$: Observable<ContractState[]>;

  addContract(providers: Providers, contractType: ContractType, contractAddress: ContractAddress): ContractState {
    const deployments = this.#contractDeploymentsSubject.value;

    const deployment = new BehaviorSubject<ContractDeployment>({
      status: 'in-progress',
      address: contractAddress,
    });

    const contract: ContractState = { observable: deployment, contractType, address: contractAddress };

    const deploymentsToKeep = deployments.filter(
      (deployment) => !(deployment.observable.value.address === contractAddress && deployment.contractType === contractType),
    );
    this.#contractDeploymentsSubject.next([...deploymentsToKeep, contract]);
    void this.joinGame(providers, deployment, contractAddress);

    return contract;
  }

  async deployAndAddContract(providers: Providers, contractType: ContractType): Promise<ContractState> {
    const deployments = this.#contractDeploymentsSubject.value;

    const deployment = new BehaviorSubject<ContractDeployment>({
      status: 'in-progress',
    });

    const contract: ContractState = { observable: deployment, contractType };

    this.#contractDeploymentsSubject.next([...deployments, contract]);
    const address = await this.deployGame(providers, deployment);

    return { observable: deployment, contractType, address };
  }

  private async deployGame(providers: Providers, deployment: BehaviorSubject<ContractDeployment>): Promise<string | undefined> {
    try {
      const uuid: string = crypto.randomUUID();
      const api = await API.deploy(uuid, this.tokenContractAddress, providers, this.logger);
      this.localState.setContractPrivateId(uuid, api.deployedContractAddress);
      this.localState.addContract(api.deployedContractAddress);

      deployment.next({
        status: 'deployed',
        api,
        address: api.deployedContractAddress,
      });
      return api.deployedContractAddress;
    } catch (error: unknown) {
      this.logger.error(error);
      deployment.next({
        status: 'failed',
        error: error instanceof Error ? error : new Error(String(error)),
      });
    }
    return undefined;
  }

  private async joinGame(
    providers: Providers,
    deployment: BehaviorSubject<ContractDeployment>,
    contractAddress: ContractAddress,
  ): Promise<void> {
    try {
      let uuid: string = crypto.randomUUID();
      const item = this.localState.getContractPrivateId(contractAddress);
      if (item != null) {
        uuid = item;
      } else {
        this.localState.setContractPrivateId(uuid, contractAddress);
      }
      const api = await API.subscribe(uuid, this.tokenContractAddress, providers, contractAddress, this.logger);

      deployment.next({
        status: 'deployed',
        api,
        address: api.deployedContractAddress,
      });
    } catch (error: unknown) {
      this.logger.error(error);
      deployment.next({
        status: 'failed',
        error: error instanceof Error ? error : new Error(String(error)),
      });
    }
  }
}
