import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  FeesReceived,
  OwnershipTransferred,
  PoolCreated,
  PoolUpdated,
  SetIsGuardian,
  SetPaused
} from "../generated/LPStaking/LPStaking"

export function createFeesReceivedEvent(
  vaultId: BigInt,
  amount: BigInt
): FeesReceived {
  let feesReceivedEvent = changetype<FeesReceived>(newMockEvent())

  feesReceivedEvent.parameters = new Array()

  feesReceivedEvent.parameters.push(
    new ethereum.EventParam(
      "vaultId",
      ethereum.Value.fromUnsignedBigInt(vaultId)
    )
  )
  feesReceivedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return feesReceivedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createPoolCreatedEvent(
  vaultId: BigInt,
  pool: Address
): PoolCreated {
  let poolCreatedEvent = changetype<PoolCreated>(newMockEvent())

  poolCreatedEvent.parameters = new Array()

  poolCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "vaultId",
      ethereum.Value.fromUnsignedBigInt(vaultId)
    )
  )
  poolCreatedEvent.parameters.push(
    new ethereum.EventParam("pool", ethereum.Value.fromAddress(pool))
  )

  return poolCreatedEvent
}

export function createPoolUpdatedEvent(
  vaultId: BigInt,
  pool: Address
): PoolUpdated {
  let poolUpdatedEvent = changetype<PoolUpdated>(newMockEvent())

  poolUpdatedEvent.parameters = new Array()

  poolUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "vaultId",
      ethereum.Value.fromUnsignedBigInt(vaultId)
    )
  )
  poolUpdatedEvent.parameters.push(
    new ethereum.EventParam("pool", ethereum.Value.fromAddress(pool))
  )

  return poolUpdatedEvent
}

export function createSetIsGuardianEvent(
  addr: Address,
  isGuardian: boolean
): SetIsGuardian {
  let setIsGuardianEvent = changetype<SetIsGuardian>(newMockEvent())

  setIsGuardianEvent.parameters = new Array()

  setIsGuardianEvent.parameters.push(
    new ethereum.EventParam("addr", ethereum.Value.fromAddress(addr))
  )
  setIsGuardianEvent.parameters.push(
    new ethereum.EventParam(
      "isGuardian",
      ethereum.Value.fromBoolean(isGuardian)
    )
  )

  return setIsGuardianEvent
}

export function createSetPausedEvent(
  lockId: BigInt,
  paused: boolean
): SetPaused {
  let setPausedEvent = changetype<SetPaused>(newMockEvent())

  setPausedEvent.parameters = new Array()

  setPausedEvent.parameters.push(
    new ethereum.EventParam("lockId", ethereum.Value.fromUnsignedBigInt(lockId))
  )
  setPausedEvent.parameters.push(
    new ethereum.EventParam("paused", ethereum.Value.fromBoolean(paused))
  )

  return setPausedEvent
}
