import { BigInt, Address, BigDecimal } from "@graphprotocol/graph-ts";
import {
  Deposit,
  Withdraw,
  FeesReceived,
} from "../generated/InventoryStaking/InventoryStaking";
import { PoolShare } from "../generated/schema";
import {
  getPoolShare,
  getOrCreateUser,
  getVaultFromId,
  getOrCreateEarning,
  getOrCreateFeeReceipt,
  updateOrCreateUserVaultFeeAggregate,
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
              let userShare = BigDecimal.fromString(
                poolShare.inventoryShare.toString()
              ).div(
                BigDecimal.fromString(vault.inventoryStakedTotal.toString())
              );

              let earningAmount = userShare.times(
                BigDecimal.fromString(event.params.amount.toString())
              );
              getOrCreateEarning(
                feeReceipt.id,
                earningAmount,
                Address.fromString(poolShare.user)
              );

              updateOrCreateUserVaultFeeAggregate(
                vault.id,
                earningAmount,
                Address.fromString(poolShare.user),
                true
              );
            }
          }
        }
      }
    }
  }
}
export function handleDeposit(event: Deposit): void {
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
}

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
}
