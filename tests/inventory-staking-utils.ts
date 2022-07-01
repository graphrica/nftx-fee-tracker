import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  Deposit,
  OwnershipTransferred,
  SetIsGuardian,
  SetPaused,
  Upgraded,
  Withdraw,
  XTokenCreated,
  FeesReceived
} from "../generated/InventoryStaking/InventoryStaking"

export function createDepositEvent(
  vaultId: BigInt,
  baseTokenAmount: BigInt,
  xTokenAmount: BigInt,
  timelockUntil: BigInt,
  sender: Address
): Deposit {
  let depositEvent = changetype<Deposit>(newMockEvent())

  depositEvent.parameters = new Array()

  depositEvent.parameters.push(
    new ethereum.EventParam(
      "vaultId",
      ethereum.Value.fromUnsignedBigInt(vaultId)
    )
  )
  depositEvent.parameters.push(
    new ethereum.EventParam(
      "baseTokenAmount",
      ethereum.Value.fromUnsignedBigInt(baseTokenAmount)
    )
  )
  depositEvent.parameters.push(
    new ethereum.EventParam(
      "xTokenAmount",
      ethereum.Value.fromUnsignedBigInt(xTokenAmount)
    )
  )
  depositEvent.parameters.push(
    new ethereum.EventParam(
      "timelockUntil",
      ethereum.Value.fromUnsignedBigInt(timelockUntil)
    )
  )
  depositEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return depositEvent
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

export function createUpgradedEvent(childImplementation: Address): Upgraded {
  let upgradedEvent = changetype<Upgraded>(newMockEvent())

  upgradedEvent.parameters = new Array()

  upgradedEvent.parameters.push(
    new ethereum.EventParam(
      "childImplementation",
      ethereum.Value.fromAddress(childImplementation)
    )
  )

  return upgradedEvent
}

export function createWithdrawEvent(
  vaultId: BigInt,
  baseTokenAmount: BigInt,
  xTokenAmount: BigInt,
  sender: Address
): Withdraw {
  let withdrawEvent = changetype<Withdraw>(newMockEvent())

  withdrawEvent.parameters = new Array()

  withdrawEvent.parameters.push(
    new ethereum.EventParam(
      "vaultId",
      ethereum.Value.fromUnsignedBigInt(vaultId)
    )
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam(
      "baseTokenAmount",
      ethereum.Value.fromUnsignedBigInt(baseTokenAmount)
    )
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam(
      "xTokenAmount",
      ethereum.Value.fromUnsignedBigInt(xTokenAmount)
    )
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return withdrawEvent
}

export function createXTokenCreatedEvent(
  vaultId: BigInt,
  baseToken: Address,
  xToken: Address
): XTokenCreated {
  let xTokenCreatedEvent = changetype<XTokenCreated>(newMockEvent())

  xTokenCreatedEvent.parameters = new Array()

  xTokenCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "vaultId",
      ethereum.Value.fromUnsignedBigInt(vaultId)
    )
  )
  xTokenCreatedEvent.parameters.push(
    new ethereum.EventParam("baseToken", ethereum.Value.fromAddress(baseToken))
  )
  xTokenCreatedEvent.parameters.push(
    new ethereum.EventParam("xToken", ethereum.Value.fromAddress(xToken))
  )

  return xTokenCreatedEvent
}

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
