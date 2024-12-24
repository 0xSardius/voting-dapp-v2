// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import Votingdappv2IDL from '../target/idl/votingdappv2.json'
import type { Votingdappv2 } from '../target/types/votingdappv2'

// Re-export the generated IDL and type
export { Votingdappv2, Votingdappv2IDL }

// The programId is imported from the program IDL.
export const VOTINGDAPPV2_PROGRAM_ID = new PublicKey(Votingdappv2IDL.address)

// This is a helper function to get the Votingdappv2 Anchor program.
export function getVotingdappv2Program(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...Votingdappv2IDL, address: address ? address.toBase58() : Votingdappv2IDL.address } as Votingdappv2, provider)
}

// This is a helper function to get the program ID for the Votingdappv2 program depending on the cluster.
export function getVotingdappv2ProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Votingdappv2 program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return VOTINGDAPPV2_PROGRAM_ID
  }
}
