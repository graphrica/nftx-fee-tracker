import { BigInt, Address, log } from "@graphprotocol/graph-ts";
import {
  FeesReceived,
  PoolCreated,
  PoolUpdated,
} from "../generated/LPStaking/LPStaking";
import { PoolShare } from "../generated/schema";
import {
  ADDRESS_ZERO,
  calculateEarningAmount,
  getOrCreateEarning,
  getOrCreateFeeReceipt,
  getOrCreateToken,
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

export function handlePoolUpdated(event : PoolUpdated) : void {
    let vault = getVaultFromId(event.params.vaultId);
    if(vault){
      let token = getOrCreateToken(event.params.pool, vault.id, false);
      let vaultTokenXWethAddress = vault.xTokenWethAddress;
      if(vaultTokenXWethAddress == ADDRESS_ZERO){
        vault.xTokenWethAddress = event.params.pool;
        vault.save();
        token.vault = vault.id;
        token.save();
        log.info("New Pool Created", []);
      }
      else {
        vault.xTokenWethAddress = event.params.pool;
        vault.save();
        token.vault = vault.id;
        token.save();

        var oldToken = getOrCreateToken(Address.fromBytes(vaultTokenXWethAddress), vault.id, false);
        oldToken.isUsed = false;
        oldToken.save();
        log.info("Pool Updated", []);
        /// I wish for TokenXWeth.remove(vaultTokenXWethAddress);
      }
      TokenXWeth.create(event.params.pool);
      
    }
}

export function handlePoolCreated(event : PoolCreated) : void {
  let vault = getVaultFromId(event.params.vaultId);
  if(vault){
    let token = getOrCreateToken(event.params.pool, vault.id, false);
    vault.xTokenWethAddress = event.params.pool;
    vault.save();
  }
  TokenXWeth.create(event.params.pool);
}