import { Address, BigDecimal, log } from "@graphprotocol/graph-ts";
import { BigInt } from "@graphprotocol/graph-ts";
import { Token } from "../generated/schema";
import { Transfer } from "../generated/templates/TokenX/ERC20";
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
          // getOrCreateUser(event.params.to);
          // vault.inventoryStakedTotal = vault.inventoryStakedTotal.plus(
          //   event.params.value
          // );
          // vault.save();
          // let poolShare = getPoolShare(
          //   Address.fromBytes(vault.address),
          //   event.params.to
          // );
          // poolShare.inventoryShare = poolShare.inventoryShare.plus(
          //   event.params.value.toBigDecimal()
          // );
          // poolShare.save();
          // var shares = vault.shares;
          // shares.push(poolShare.id);
          // vault.shares = shares;
          // vault.save();
          log.info("Deposit Inventory - Vault = {} - txHash = {}", [
            vault.id,
            event.transaction.hash.toHexString(),
          ]);
        
      } else if (event.params.to == ADDRESS_ZERO) {
        // vault.inventoryStakedTotal = vault.inventoryStakedTotal.minus(
        //   event.params.value
        // );
        // vault.save();
        // let poolShare = getPoolShare(Address.fromBytes(vault.address), event.params.from);
        // poolShare.inventoryShare = poolShare.inventoryShare.minus(
        //   event.params.value.toBigDecimal()
        // );
        // poolShare.save();
        log.info("Withdraw Inventory - Vault = {} - txHash = {}", [
          vault.id,
          event.transaction.hash.toHexString(),
        ]);
      } else {
        let userSenderPoolShare = getPoolShare(
          Address.fromBytes(vault.address),
          event.params.from
        );

        if (userSenderPoolShare.inventoryShare != BigDecimal.fromString("0")) {
 
          let transferAmount = event.params.value.toBigDecimal()
          userSenderPoolShare.inventoryShare = userSenderPoolShare.inventoryShare.minus(
            transferAmount
          );
          userSenderPoolShare.save();

          getOrCreateUser(event.params.to);
          let userReceiverPoolShare = getPoolShare(
            Address.fromBytes(vault.address),
            event.params.to
          );
          userReceiverPoolShare.inventoryShare = userReceiverPoolShare.inventoryShare.plus(
            transferAmount
          );
          userReceiverPoolShare.save();
        }
      }
    }
  }
}
