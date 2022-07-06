import { BigInt, Address, log } from "@graphprotocol/graph-ts";
import {
  FeesReceived,
  DepositCall,
  TimelockDepositForCall,
  PoolCreated,
  WithdrawCall,
} from "../generated/LPStaking/LPStaking";
import { PoolShare } from "../generated/schema";
import {
  calculateEarningAmount,
  getOrCreateEarning,
  getOrCreateFeeReceipt,
  getOrCreateToken,
  getOrCreateUser,
  getOrCreateVault,
  getPoolShare,
  getVaultFromId,
  updateOrCreateUserVaultFeeAggregate,
} from "./helper";

import { TokenXWeth} from "../generated/templates"

export function handleFeesReceived(event: FeesReceived): void {
  let vault = getVaultFromId(event.params.vaultId);
  let feeReceipt = getOrCreateFeeReceipt(
    event.transaction.hash,
    event.params.vaultId,
    event.params.amount,
    event.block.timestamp,
    event.logIndex,
    false
  );

  if (vault) {
    if (vault.shares) {
      var array: string[] = vault.shares;
      for (let i = 0; i < array.length; i++) {
        let poolShare = PoolShare.load(array[i]);
        if (poolShare) {
          if (poolShare.liquidityShare != BigInt.fromI32(0).toBigDecimal()) {
            let earningAmount = calculateEarningAmount(
              vault.liquidityStakedTotal,
              poolShare.liquidityShare,
              event.params.amount
            );

            getOrCreateEarning(
              feeReceipt.id,
              earningAmount,
              Address.fromString(poolShare.user),
              vault.id,
              false
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

export function handlePoolCreated(event : PoolCreated) : void {
    let vault = getVaultFromId(event.params.vaultId);
    if(vault){
      let token = getOrCreateToken(event.params.pool, vault.id, false);
      TokenXWeth.create(event.params.pool);
    }
}