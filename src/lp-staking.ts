import { BigInt, Address } from "@graphprotocol/graph-ts";
import { WithdrawCall } from "../generated/InventoryStaking/InventoryStaking";
import {
  LPStaking,
  FeesReceived,
  PoolCreated,
  PoolUpdated,
  DepositCall,
} from "../generated/LPStaking/LPStaking";
import { Earning, PoolShare } from "../generated/schema";
import {
  getOrCreateEarning,
  getOrCreateFeeReceipt,
  getOrCreateUser,
  getOrCreateVault,
  getPoolShare,
  getVaultFromId,
} from "./helper";

export function handleFeesReceived(event: FeesReceived): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let vault = getVaultFromId(event.params.vaultId);
  let feeReceipt = getOrCreateFeeReceipt(
    event.transaction.hash,
    event.params.vaultId,
    event.params.amount,
    event.block.timestamp
  );

  if (vault != null) {
    if (vault.shares != null) {
      var array: string[] | null = vault.shares;
      if (array != null) {
        for (let i = 0; i < array.length; i++) {
          let poolShare = PoolShare.load(array[i]);
          if (poolShare) {
            if (poolShare.liquidityShare != BigInt.fromI32(0)) {
              let earningAmount = poolShare.liquidityShare
                .div(vault.liquidityStakedTotal)
                .times(event.params.amount)
                .div(BigInt.fromI32(5))
                .times(BigInt.fromI32(4));
              let earning = getOrCreateEarning(
                feeReceipt.id,
                earningAmount,
                Address.fromString(poolShare.user)
              );
            }
          }
        }
      }
    }
  }

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract._oldRewardDistributionTokenAddr(...)
  // - contract._rewardDistributionTokenAddr(...)
  // - contract._unusedRewardDistributionTokenAddr(...)
  // - contract.balanceOf(...)
  // - contract.isGuardian(...)
  // - contract.isPaused(...)
  // - contract.newRewardDistributionToken(...)
  // - contract.newTimelockRewardDistTokenImpl(...)
  // - contract.nftxVaultFactory(...)
  // - contract.oldBalanceOf(...)
  // - contract.oldRewardDistributionToken(...)
  // - contract.owner(...)
  // - contract.receiveRewards(...)
  // - contract.rewardDistTokenImpl(...)
  // - contract.rewardDistributionToken(...)
  // - contract.rewardDistributionTokenAddr(...)
  // - contract.stakingTokenProvider(...)
  // - contract.unusedBalanceOf(...)
  // - contract.unusedRewardDistributionToken(...)
  // - contract.vaultStakingInfo(...)
}

// export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handlePoolCreated(event: PoolCreated): void {}

export function handlePoolUpdated(event: PoolUpdated): void {}

// export function handleSetIsGuardian(event: SetIsGuardian): void {}

// export function handleSetPaused(event: SetPaused): void {}

export function handleDeposit(call: DepositCall): void {
  let user = getOrCreateUser(call.from);
  let vault = getVaultFromId(call.inputs.vaultId);
  if (vault) {
    vault.liquidityStakedTotal = vault.liquidityStakedTotal.plus(
      call.inputs.amount
    );
    vault.save();
    let poolShare = getPoolShare(Address.fromBytes(vault.address), call.from);
    poolShare.liquidityShare = poolShare.liquidityShare.plus(
      call.inputs.amount
    );
    poolShare.save();
    var shares = vault.shares;
    shares.push(poolShare.id);
    vault.shares = shares;
    vault.save();
  }
}

export function handleWithdraw(call: WithdrawCall): void {
  let user = getOrCreateUser(call.from);
  let vault = getVaultFromId(call.inputs.vaultId);
  if (vault) {
    vault.liquidityStakedTotal = vault.liquidityStakedTotal.minus(
      call.inputs._share
    );
    vault.save();
    let poolShare = getPoolShare(Address.fromBytes(vault.address), call.from);
    poolShare.liquidityShare = poolShare.liquidityShare.minus(
      call.inputs._share
    );
    poolShare.save();
  }
}
