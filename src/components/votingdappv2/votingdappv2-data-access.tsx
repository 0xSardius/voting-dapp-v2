'use client'

import { getVotingdappv2Program, getVotingdappv2ProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

export function useVotingdappv2Program() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getVotingdappv2ProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getVotingdappv2Program(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['votingdappv2', 'all', { cluster }],
    queryFn: () => program.account.votingdappv2.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['votingdappv2', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ votingdappv2: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useVotingdappv2ProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useVotingdappv2Program()

  const accountQuery = useQuery({
    queryKey: ['votingdappv2', 'fetch', { cluster, account }],
    queryFn: () => program.account.votingdappv2.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['votingdappv2', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ votingdappv2: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['votingdappv2', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ votingdappv2: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['votingdappv2', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ votingdappv2: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['votingdappv2', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ votingdappv2: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
