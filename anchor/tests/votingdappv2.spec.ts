import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Votingdappv2} from '../target/types/votingdappv2'

describe('votingdappv2', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Votingdappv2 as Program<Votingdappv2>

  const votingdappv2Keypair = Keypair.generate()

  it('Initialize Votingdappv2', async () => {
    await program.methods
      .initialize()
      .accounts({
        votingdappv2: votingdappv2Keypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([votingdappv2Keypair])
      .rpc()

    const currentCount = await program.account.votingdappv2.fetch(votingdappv2Keypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Votingdappv2', async () => {
    await program.methods.increment().accounts({ votingdappv2: votingdappv2Keypair.publicKey }).rpc()

    const currentCount = await program.account.votingdappv2.fetch(votingdappv2Keypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Votingdappv2 Again', async () => {
    await program.methods.increment().accounts({ votingdappv2: votingdappv2Keypair.publicKey }).rpc()

    const currentCount = await program.account.votingdappv2.fetch(votingdappv2Keypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Votingdappv2', async () => {
    await program.methods.decrement().accounts({ votingdappv2: votingdappv2Keypair.publicKey }).rpc()

    const currentCount = await program.account.votingdappv2.fetch(votingdappv2Keypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set votingdappv2 value', async () => {
    await program.methods.set(42).accounts({ votingdappv2: votingdappv2Keypair.publicKey }).rpc()

    const currentCount = await program.account.votingdappv2.fetch(votingdappv2Keypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the votingdappv2 account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        votingdappv2: votingdappv2Keypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.votingdappv2.fetchNullable(votingdappv2Keypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
