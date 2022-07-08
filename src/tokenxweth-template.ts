import { Address, BigDecimal, log, BigInt } from "@graphprotocol/graph-ts";
import { Token, Vault } from "../generated/schema";
import { Transfer } from "../generated/templates/TokenXWeth/ERC20";
import {
  ADDRESS_ZERO,
  createOrUpdatePoolShare,
  getOrCreateUser,
  getPoolShare,
} from "./helper";

export function handleTransfer(event: Transfer): void {
  let token = Token.load(event.address.toHexString());
  if (token) {
      let vault = Vault.load(token.vault);
      if (vault) {
        if (event.params.from == ADDRESS_ZERO && token.isUsed) {
          getOrCreateUser(event.params.to);
          vault.liquidityStakedTotal = vault.liquidityStakedTotal.plus(
            event.params.value
          );
          vault.save();
          let poolShare = getPoolShare(
            Address.fromBytes(vault.address),
            event.params.to
          );
          if(poolShare){
            poolShare.liquidityShare = poolShare.liquidityShare.plus(
              event.params.value.toBigDecimal()
            );
            poolShare.save();
          }
          else {
            poolShare = createOrUpdatePoolShare(
              Address.fromBytes(vault.address),
              vault.id,
              event.params.to,
              BigInt.fromI32(0),
              event.params.value
            );
            let shares = vault.shares;
            shares.push(poolShare.id);
            vault.shares = shares;
            vault.save();
          }
          
          log.info("Deposit LP - Vault = {} - txHash = {}", [
            vault.id,
            event.transaction.hash.toHexString(),
          ]);
        } else if (event.params.to == ADDRESS_ZERO) {
          vault.liquidityStakedTotal = vault.liquidityStakedTotal.minus(
            event.params.value
          );
          vault.save();
          let poolShare = getPoolShare(
            Address.fromBytes(vault.address),
            event.params.from
          );
          if(poolShare){
            poolShare.liquidityShare = poolShare.liquidityShare.minus(
              event.params.value.toBigDecimal()
            );
            poolShare.save();
            log.info("Withdraw LP - Vault = {} - txHash = {}", [
              vault.id,
              event.transaction.hash.toHexString(),
            ]);
          }
        } else {
          let userSenderPoolShare = getPoolShare(
            Address.fromBytes(vault.address),
            event.params.from
          );
          if(userSenderPoolShare){
            let transferAmount = event.params.value.toBigDecimal();
            if (
              userSenderPoolShare.liquidityShare != BigDecimal.fromString("0")
            ) { 
              userSenderPoolShare.liquidityShare = userSenderPoolShare.liquidityShare.minus(
                transferAmount
              );
              userSenderPoolShare.save();
            }
              getOrCreateUser(event.params.to);
              let userReceiverPoolShare = getPoolShare(
                Address.fromBytes(vault.address),
                event.params.to
              );
              if(userReceiverPoolShare) {
                userReceiverPoolShare.liquidityShare = userReceiverPoolShare.liquidityShare.plus(
                  transferAmount
                );
                userReceiverPoolShare.save();
              }
              else {
                userReceiverPoolShare = createOrUpdatePoolShare(
                  Address.fromBytes(vault.address),
                  vault.id,
                  event.params.to,
                  BigInt.fromI32(0),
                  event.params.value
                );
                userReceiverPoolShare.save();
                let shares = vault.shares;
                shares.push(userReceiverPoolShare.id);
                vault.shares = shares;
                vault.save();
              }
          }
      }
    }
  }
}
