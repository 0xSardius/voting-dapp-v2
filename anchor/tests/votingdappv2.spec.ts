import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair, PublicKey} from '@solana/web3.js'
import {Votingdappv2} from '../target/types/votingdappv2'
import { BankrunProvider, startAnchor } from 'anchor-bankrun'
import { VOTINGDAPPV2_PROGRAM_ID } from '@project/anchor'

const IDL = require('../target/idl/votingdappv2.json');

const votingAddress = new PublicKey(IDL.address);

describe('Votingdappv2', () => {
 

  it('Initialize Poll', async () => {
    const context = await startAnchor("", [{name: "votingdappv2", programId: votingAddress}], []);
    const provider = new BankrunProvider(context);

    const votingdappv2 = new Program<Votingdappv2>(IDL, provider);

    await votingdappv2.methods.initializePoll(
      new anchor.BN(1),
      "What is your favorite type of video game?",
      new anchor.BN(0),
      new anchor.BN(1798332103)
    ).rpc();


    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8)],
      votingAddress,
    );

    const poll = await votingdappv2.account.poll.fetch(pollAddress);
    console.log(poll);

    expect(poll.pollId.toNumber()).toEqual(1);
    expect(poll.description).toEqual("What is your favorite type of video game?");
    expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber());
  })
})
