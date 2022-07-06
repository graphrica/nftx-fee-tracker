import { Address, BigDecimal, log } from "@graphprotocol/graph-ts";
import { BigInt } from "@graphprotocol/graph-ts";
import { Token } from "../generated/schema";
import { Transfer } from "../generated/templates/TokenXWeth/ERC20";
import {
  ADDRESS_ZERO,
  getOrCreateUser,
  getPoolShare,
  getVaultFromId,
} from "./helper";

export function handleTransfer(event: Transfer): void {
  let token = Token.load(event.address.toHexString());
  if (token) {
    let vault = getVaultFromId(BigInt.fromString(token.vault));
    if (vault) {
      if (event.params.from == ADDRESS_ZERO) {
          getOrCreateUser(event.params.to);
          vault.liquidityStakedTotal = vault.liquidityStakedTotal.plus(
            event.params.value
          );
          vault.save();
          let poolShare = getPoolShare(
            Address.fromBytes(vault.address),
            event.params.to
          );
          poolShare.liquidityShare = poolShare.liquidityShare.plus(
            event.params.value.toBigDecimal()
          );
          poolShare.save();
          var shares = vault.shares;
          shares.push(poolShare.id);
          vault.shares = shares;
          vault.save();
          log.info("Deposit LP - Vault = {} - txHash = {}", [
            vault.id,
            event.transaction.hash.toHexString(),
          ]);
        
      } else if (event.params.to == ADDRESS_ZERO) {
        vault.liquidityStakedTotal = vault.liquidityStakedTotal.minus(
          event.params.value
        );
        vault.save();
        let poolShare = getPoolShare(Address.fromBytes(vault.address), event.params.from);
        poolShare.liquidityShare = poolShare.liquidityShare.minus(
          event.params.value.toBigDecimal()
        );
        poolShare.save();
        log.info("Withdraw LP - Vault = {} - txHash = {}", [
          vault.id,
          event.transaction.hash.toHexString(),
        ]);
      } else {
        let userSenderPoolShare = getPoolShare(
          Address.fromBytes(vault.address),
          event.params.from
        );

        if (userSenderPoolShare.liquidityShare != BigDecimal.fromString("0")) {
 
          let transferAmount = event.params.value.toBigDecimal()
          userSenderPoolShare.liquidityShare = userSenderPoolShare.liquidityShare.minus(
            transferAmount
          );
          userSenderPoolShare.save();

          getOrCreateUser(event.params.to);
          let userReceiverPoolShare = getPoolShare(
            Address.fromBytes(vault.address),
            event.params.to
          );
          userReceiverPoolShare.liquidityShare = userReceiverPoolShare.liquidityShare.plus(
            transferAmount
          );
          userReceiverPoolShare.save();
        }
      }
    }
  }
}
