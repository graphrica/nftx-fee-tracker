import { BigInt, Address, log, store } from "@graphprotocol/graph-ts";
import {
  Deposit,
  Withdraw,
  FeesReceived,
  XTokenCreated,
} from "../generated/InventoryStaking/InventoryStaking";
import { PoolShare } from "../generated/schema";
import { TokenX } from "../generated/templates";
import {
  getPoolShare,
  getOrCreateUser,
  getVaultFromId,
  getOrCreateEarning,
  getOrCreateFeeReceipt,
  updateOrCreateUserVaultFeeAggregate,
  calculateEarningAmount,
  getOrCreateToken,
  createOrUpdatePoolShare,
} from "./helper";
export function handleFeesReceived(event: FeesReceived): void {
  let vault = getVaultFromId(event.params.vaultId);
  let feeReceipt = getOrCreateFeeReceipt(
    event.transaction.hash,
    event.params.vaultId,
    event.params.amount,
    event.block.timestamp,
    event.logIndex,
    true
  );

  if (vault) {
    if (vault.shares) {
      var array: string[] = vault.shares;
      var newArray: string[] = [];
      log.info("Inventory Fee Distributing to {} potential shareholders", [
        array.length.toString(),
      ]);
      for (let i = 0; i < array.length; i++) {
        let poolShare = PoolShare.load(array[i]);
        if (poolShare) {
          if (poolShare.inventoryShare != BigInt.fromI32(0).toBigDecimal()) {
            let earningAmount = calculateEarningAmount(
              vault.inventoryStakedTotal,
              poolShare.inventoryShare,
              event.params.amount
            );

            getOrCreateEarning(
              feeReceipt.id,
              earningAmount,
              Address.fromString(poolShare.user),
              vault.id,
              true
            );

            updateOrCreateUserVaultFeeAggregate(
              vault.id,
              earningAmount,
              Address.fromString(poolShare.user),
              true
            );
            newArray.push(poolShare.id);
          } else {
            if (poolShare.liquidityShare != BigInt.fromI32(0).toBigDecimal()) {
              newArray.push(poolShare.id);
            } else {
              store.remove("PoolShare", poolShare.id);
            }
          }
        }
      }
      vault.shares = newArray;
      vault.save();
    }
  }
}

export function handleDeposit(event: Deposit): void {
  getOrCreateUser(event.params.sender);
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
    if (poolShare) {
      poolShare.inventoryShare = poolShare.inventoryShare.plus(
        event.params.xTokenAmount.toBigDecimal()
      );
      poolShare.save();
    } else {
      poolShare = createOrUpdatePoolShare(
        Address.fromBytes(vault.address),
        vault.id,
        event.params.sender,
        event.params.xTokenAmount,
        BigInt.fromI32(0)
      );
      var shares = vault.shares;
      shares.push(poolShare.id);
      vault.shares = shares;
      vault.save();
    }
  }
}

export function handleWithdraw(event: Withdraw): void {
  getOrCreateUser(event.params.sender);
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
    if (poolShare) {
      poolShare.inventoryShare = poolShare.inventoryShare.minus(
        event.params.xTokenAmount.toBigDecimal()
      );
      poolShare.save();
    }
  }
}

export function handleXTokenCreated(event: XTokenCreated): void {
  let vault = getVaultFromId(event.params.vaultId);
  if (vault) {
    getOrCreateToken(event.params.xToken, vault.id, true);
    vault.xTokenAddress = event.params.xToken;
    vault.save();
    TokenX.create(event.params.xToken);
  }
}
