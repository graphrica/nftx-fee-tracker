import { BigInt } from "@graphprotocol/graph-ts"
import {
  VaultFactory,
  DisableVaultFees,
  FeeExclusion,
  NewEligibilityManager,
  NewFeeDistributor,
  NewVault,
  NewZapContract,
  OwnershipTransferred,
  SetIsGuardian,
  SetPaused,
  UpdateFactoryFees,
  UpdateVaultFees,
  Upgraded
} from "../generated/VaultFactory/VaultFactory"
import { VaultTemplate } from "../generated/VaultTemplate/VaultTemplate";
import { VaultTemplate as VaultTemplateContract } from "../generated/templates";
import { getOrCreateVault } from "./helper"

export function handleDisableVaultFees(event: DisableVaultFees): void {


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
  // - contract.allVaults(...)
  // - contract.childImplementation(...)
  // - contract.createVault(...)
  // - contract.eligibilityManager(...)
  // - contract.excludedFromFees(...)
  // - contract.factoryMintFee(...)
  // - contract.factoryRandomRedeemFee(...)
  // - contract.factoryRandomSwapFee(...)
  // - contract.factoryTargetRedeemFee(...)
  // - contract.factoryTargetSwapFee(...)
  // - contract.feeDistributor(...)
  // - contract.isGuardian(...)
  // - contract.isLocked(...)
  // - contract.isPaused(...)
  // - contract.numVaults(...)
  // - contract.owner(...)
  // - contract.vault(...)
  // - contract.vaultFees(...)
  // - contract.vaultsForAsset(...)
  // - contract.zapContract(...)
}

export function handleFeeExclusion(event: FeeExclusion): void {}

export function handleNewVault(event: NewVault): void {

  //Create new vault
  let vaultContract = VaultTemplate.bind(event.params.vaultAddress);
  let result = vaultContract.try_symbol();
  let ticker = "";
  if(!result.reverted){
    ticker = result.value;
  }
  getOrCreateVault(event.params.vaultAddress, event.params.vaultId, ticker, event.params.assetAddress);
}

export function handleSetPaused(event: SetPaused): void {}

// export function handleUpdateFactoryFees(event: UpdateFactoryFees): void {}

// export function handleUpdateVaultFees(event: UpdateVaultFees): void {}

// export function handleUpgraded(event: Upgraded): void {}
