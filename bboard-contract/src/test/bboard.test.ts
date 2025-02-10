import { describe, expect, test } from '@jest/globals';
import { Simulator, randomSk } from './bboard-simulator-class';
import { STATE } from '../index.js';
import * as fc from 'fast-check';

const p1secretKey = randomSk();
const p2secretKey = randomSk();

function createSimulator() {
  const simulator = Simulator.deployContract(p1secretKey);
  const initialLS = simulator.getLedgerState();
  expect(initialLS.state).toBe(STATE.vacant);

  simulator.createPrivateState('p2', p2secretKey);
  return simulator;
}

describe('Game Play', () => {
  test('First check of the contract', () => {
    const simulator = createSimulator();     

    let state2 = simulator.as('p1').charge(200);
    console.log({ 
      reward: state2.reward,   
      tvl: state2.tvl,      
    });

    let state3 = simulator.as('p2').charge(200);
    console.log({ 
      reward_state3: state3.reward,    
      tvl: state3.tvl, 
    });
    
    let state4 = simulator.as('p1').withdraw();
    console.log({ 
      reward_state4: state4.reward, 
      tvl: state4.tvl,       
    });   

    let state5 = simulator.as('p2').charge(200);
    console.log({ 
      reward_state5: state5.reward,    
      tvl: state5.tvl, 
    });
  });
});
