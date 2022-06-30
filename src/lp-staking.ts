import { BigInt, Address, BigDecimal } from "@graphprotocol/graph-ts";
import { WithdrawCall } from "../generated/InventoryStaking/InventoryStaking";
import { FeesReceived, DepositCall } from "../generated/LPStaking/LPStaking";
import { PoolShare } from "../generated/schema";
import {
  calculateEarningAmount,
  getOrCreateEarning,
  getOrCreateFeeReceipt,
  getOrCreateUser,
  getPoolShare,
  getVaultFromId,
  updateOrCreateUserVaultFeeAggregate,
} from "./helper";

export function handleFeesReceived(event: FeesReceived): void {
  let vault = getVaultFromId(event.params.vaultId);
  let feeReceipt = getOrCreateFeeReceipt(
    event.transaction.hash,
    event.params.vaultId,
    event.params.amount,
    event.block.timestamp,
    false
  );

  if (vault != null) {
    if (vault.shares != null) {
      var array: string[] | null = vault.shares;
      if (array != null) {
        for (let i = 0; i < array.length; i++) {
          let poolShare = PoolShare.load(array[i]);
          if (poolShare) {
            if (poolShare.liquidityShare != BigInt.fromI32(0)) {
              let earningAmount = calculateEarningAmount(vault.liquidityStakedTotal, poolShare.liquidityShare, event.params.amount);
             
              getOrCreateEarning(
                feeReceipt.id,
                earningAmount,
                Address.fromString(poolShare.user)
              );

              updateOrCreateUserVaultFeeAggregate(
                vault.id,
                earningAmount,
                Address.fromString(poolShare.user),
                false
              );
            }
          }
        }
      }
    }
  }
}

export function handleDeposit(call: DepositCall): void {
  getOrCreateUser(call.from);
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
  getOrCreateUser(call.from);
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
