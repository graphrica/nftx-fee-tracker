import { BigInt, Address, BigDecimal } from "@graphprotocol/graph-ts";
import {
  InventoryStaking,
  Deposit,
  Withdraw,
  XTokenCreated,
  FeesReceived,
} from "../generated/InventoryStaking/InventoryStaking";
import { PoolShare } from "../generated/schema";
import {
  getPoolShare,
  getOrCreateUser,
  getVaultFromId,
  getOrCreateEarning,
  getOrCreateFeeReceipt,
} from "./helper";
export function handleFeesReceived(event: FeesReceived): void {
  let vault = getVaultFromId(event.params.vaultId);
  let feeReceipt = getOrCreateFeeReceipt(
    event.transaction.hash,
    event.params.vaultId,
    event.params.amount,
    event.block.timestamp,
    true
  );

  if (vault != null) {
    if (vault.shares != null) {
      var array: string[] = vault.shares;
      if (array != null) {
        for (let i = 0; i < array.length; i++) {
          let poolShare = PoolShare.load(array[i]);
          if (poolShare) {
            if (poolShare.inventoryShare != BigInt.fromI32(0)) {
              let userShare = BigDecimal.fromString(poolShare.inventoryShare.toString())
              .div(BigDecimal.fromString(vault.inventoryStakedTotal.toString()));

            let earningAmount = userShare.times(BigDecimal.fromString(event.params.amount.toString()))
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
}
export function handleDeposit(event: Deposit): void {
  // Increase PoolShare inventory for user for vault

  let user = getOrCreateUser(event.params.sender);

  let vault = getVaultFromId(event.params.vaultId);
  if (vault) {
    vault.inventoryStakedTotal = vault.inventoryStakedTotal.plus(
      event.params.xTokenAmount
    );
    vault.save();
    let poolShare = getPoolShare(
      Address.fromBytes(vault.address),
      event.params.sender
    );
    poolShare.inventoryShare = poolShare.inventoryShare.plus(
      event.params.xTokenAmount
    );
    poolShare.save();
    var shares = vault.shares;
    shares.push(poolShare.id);
    vault.shares = shares;
    vault.save();
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
  // - contract.balanceOf(...)
  // - contract.childImplementation(...)
  // - contract.isGuardian(...)
  // - contract.isPaused(...)
  // - contract.nftxVaultFactory(...)
  // - contract.owner(...)
  // - contract.receiveRewards(...)
  // - contract.timelockMintFor(...)
  // - contract.timelockUntil(...)
  // - contract.vaultXToken(...)
  // - contract.xTokenAddr(...)
  // - contract.xTokenShareValue(...)
}

// export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

// export function handleSetIsGuardian(event: SetIsGuardian): void {}

// export function handleSetPaused(event: SetPaused): void {}

// export function handleUpgraded(event: Upgraded): void {}

export function handleWithdraw(event: Withdraw): void {
  let user = getOrCreateUser(event.params.sender);
  let vault = getVaultFromId(event.params.vaultId);
  if (vault) {
    vault.inventoryStakedTotal = vault.inventoryStakedTotal.minus(
      event.params.xTokenAmount
    );
    vault.save();
    let poolShare = getPoolShare(
      Address.fromBytes(vault.address),
      event.params.sender
    );
    poolShare.inventoryShare = poolShare.inventoryShare.minus(
      event.params.xTokenAmount
    );
    poolShare.save();
  }
  // Decrease PoolShare inventory for user for vault
}

export function handleXTokenCreated(event: XTokenCreated): void {}
