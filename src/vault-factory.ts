import { NewVault } from "../generated/VaultFactory/VaultFactory";
import { VaultTemplate } from "../generated/VaultTemplate/VaultTemplate";
import { getOrCreateVault } from "./helper";

export function handleNewVault(event: NewVault): void {
  //Create new vault
  let vaultContract = VaultTemplate.bind(event.params.vaultAddress);
  let result = vaultContract.try_symbol();
  let ticker = "";
  if (!result.reverted) {
    ticker = result.value;
  }
  getOrCreateVault(
    event.params.vaultAddress,
    event.params.vaultId,
    ticker,
    event.params.assetAddress
  );
}
