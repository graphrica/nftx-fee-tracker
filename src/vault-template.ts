import { log } from "@graphprotocol/graph-ts"
import { BigInt } from "@graphprotocol/graph-ts"
import {
  VaultTemplate,
  Redeemed,
  Swapped,
  Transfer,
  VaultInit,
  Minted
} from "../generated/VaultTemplate/VaultTemplate"


// export function handleApproval(event: Approval): void {
//   // Entities can be loaded from the store using a string ID; this ID


//   // Note: If a handler doesn't require existing field values, it is faster
//   // _not_ to load the entity from the store. Instead, create it fresh with
//   // `new Entity(...)`, set the fields that should be updated and save the
//   // entity back to the store. Fields that were not set or unset remain
//   // unchanged, allowing for partial updates to be applied.

//   // It is also possible to access smart contracts from mappings. For
//   // example, the contract that has emitted the event can be connected to
//   // with:
//   //
//   // let contract = Contract.bind(event.address)
//   //
//   // The following functions can then be called on this contract to access
//   // state variables and other data:
//   //
//   // - contract.allHoldings(...)
//   // - contract.allValidNFTs(...)
//   // - contract.allowAllItems(...)
//   // - contract.allowance(...)
//   // - contract.approve(...)
//   // - contract.assetAddress(...)
//   // - contract.balanceOf(...)
//   // - contract.decimals(...)
//   // - contract.decreaseAllowance(...)
//   // - contract.deployEligibilityStorage(...)
//   // - contract.eligibilityStorage(...)
//   // - contract.enableMint(...)
//   // - contract.enableRandomRedeem(...)
//   // - contract.enableRandomSwap(...)
//   // - contract.enableTargetRedeem(...)
//   // - contract.enableTargetSwap(...)
//   // - contract.flashFee(...)
//   // - contract.flashLoan(...)
//   // - contract.increaseAllowance(...)
//   // - contract.is1155(...)
//   // - contract.manager(...)
//   // - contract.maxFlashLoan(...)
//   // - contract.mint(...)
//   // - contract.mintFee(...)
//   // - contract.mintTo(...)
//   // - contract.name(...)
//   // - contract.nftIdAt(...)
//   // - contract.onERC1155BatchReceived(...)
//   // - contract.onERC1155Received(...)
//   // - contract.onERC721Received(...)
//   // - contract.owner(...)
//   // - contract.randomRedeemFee(...)
//   // - contract.randomSwapFee(...)
//   // - contract.redeem(...)
//   // - contract.redeemTo(...)
//   // - contract.supportsInterface(...)
//   // - contract.swap(...)
//   // - contract.swapTo(...)
//   // - contract.symbol(...)
//   // - contract.targetRedeemFee(...)
//   // - contract.targetSwapFee(...)
//   // - contract.totalHoldings(...)
//   // - contract.totalSupply(...)
//   // - contract.transfer(...)
//   // - contract.transferFrom(...)
//   // - contract.vaultFactory(...)
//   // - contract.vaultFees(...)
//   // - contract.vaultId(...)
//   // - contract.version(...)
// }

// export function handleEligibilityDeployed(event: EligibilityDeployed): void {}

// export function handleEnableMintUpdated(event: EnableMintUpdated): void {}

// export function handleEnableRandomRedeemUpdated(
//   event: EnableRandomRedeemUpdated
// ): void {}

// export function handleEnableRandomSwapUpdated(
//   event: EnableRandomSwapUpdated
// ): void {}

// export function handleEnableTargetRedeemUpdated(
//   event: EnableTargetRedeemUpdated
// ): void {}

// export function handleEnableTargetSwapUpdated(
//   event: EnableTargetSwapUpdated
// ): void {}

// export function handleManagerSet(event: ManagerSet): void {}

export function handleMinted(event: Minted): void {
  // for(let i = 0; event.params.nftIds.length > i; i++){
  //   log.info("Vault: {} -  Minted: amount = {}, nftId = {}, to = {}", [event.address.toHexString(), event.params.amounts[i].toHexString(), event.params.nftIds[i].toHexString(), event.params.to.toHexString()])
  // }
  
}

export function handleRedeemed(event: Redeemed): void {
  // for(let i = 0; event.params.nftIds.length > i; i++){
  //   log.info("Vault: {} -  Redeemed: specificIds = {}, nftId = {}, to = {}", [event.address.toHexString(), event.params.specificIds[0].toHexString(), event.params.nftIds[i].toHexString(), event.params.to.toHexString()])
  // }
  
}

export function handleSwapped(event: Swapped): void {
  // for(let i = 0; event.params.nftIds.length > i; i++){
  //   log.info("Vault: {} -  Swapped: specificIds = {}, amounts = {}, nftId = {}, to = {}", [event.address.toHexString(), event.params.specificIds[0].toHexString(), event.params.amounts[i].toHexString(), event.params.nftIds[i].toHexString(), event.params.to.toHexString()])
  // }
}

export function handleVaultInit(event: VaultInit): void {}
