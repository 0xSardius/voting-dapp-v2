import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair, PublicKey} from '@solana/web3.js'
import {Votingdappv2} from '../target/types/votingdappv2'
import { BankrunProvider, startAnchor } from 'anchor-bankrun'
import { VOTINGDAPPV2_PROGRAM_ID } from '@project/anchor'
import { BN } from 'bn.js'

const IDL = require('../target/idl/votingdappv2.json');

const votingAddress = new PublicKey(IDL.address);

describe('Votingdappv2', () => {
 
  let context;
  let provider;
  let votingdappv2: Program<Votingdappv2>;

  beforeAll(async () => {
    context = await startAnchor("", [{name: "votingdappv2", programId: votingAddress}], []);
    provider = new BankrunProvider(context);

    votingdappv2 = new Program<Votingdappv2>(IDL, provider);
  })

  it('Initialize Poll', async () => {

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
  });

  it("initialize candidate", async() => {
    await votingdappv2.methods.initializeCandidate(
      "Age of Empires II",
      new anchor.BN(1),
    ).rpc();
    await votingdappv2.methods.initializeCandidate(
      "Ogre Battle 64",
      new anchor.BN(1),
    ).rpc();

    const [aoeIIAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("Age of Empires II")],
      votingAddress,
    )
    const aoeIICandidate = await votingdappv2.account.candidate.fetch(aoeIIAddress);
    console.log(aoeIICandidate);
    expect(aoeIICandidate.candidateVotes).toEqual(new anchor.BN(0));

    const [ogreBattle64Address] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("Ogre Battle 64")],
      votingAddress,
    )
    const ogreBattle64Candidate = await votingdappv2.account.candidate.fetch(ogreBattle64Address);
    console.log(ogreBattle64Candidate);
    expect(ogreBattle64Candidate.candidateVotes).toEqual(new anchor.BN(1));

  });

  it("vote", async() => {

  });


})
