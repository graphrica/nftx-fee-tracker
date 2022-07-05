import { Address, BigInt, Bytes, BigDecimal } from "@graphprotocol/graph-ts";
import {
  FeeReceipt,
  PoolShare,
  User,
  Vault,
  Earning,
  VaultAddressLookup,
  UserVaultFeeAggregate,
} from "../generated/schema";

export const calculateEarningAmount = (
  totalStake: BigInt,
  userStake: BigInt,
  feeAmount: BigInt
): BigDecimal =>
  userStake
    .toBigDecimal()
    .div(totalStake.toBigDecimal())
    .times(feeAmount.toBigDecimal());

export function getOrCreateUser(address: Address): User {
  let user = User.load(address.toHexString());
  if (!user) {
    user = new User(address.toHexString());
    user.save();
  }
  return user;
}
export function getVaultFromId(vaultId: BigInt): Vault | null {
  let vault = Vault.load(vaultId.toHexString());
  return vault;
}

export function getVaultFromAddress(address: Address): Vault | null {
  let vaultAddressLookup = VaultAddressLookup.load(address.toHexString());
  if (!vaultAddressLookup) {
    return null;
  }
  let vault = Vault.load(vaultAddressLookup.vault);
  if (!vault) {
    return null;
  }
  return vault;
}

export function getOrCreateVault(
  address: Address,
  vaultId: BigInt,
  ticker: string,
  assetAddress: Address
): Vault {
  let vault = Vault.load(vaultId.toHexString());
  if (!vault) {
    vault = new Vault(vaultId.toHexString());
    vault.vaultId = vaultId;
    vault.address = address;
    vault.ticker = ticker;
    vault.assetAddress = assetAddress;
    vault.inventoryStakedTotal = BigInt.fromI32(0);
    vault.liquidityStakedTotal = BigInt.fromI32(0);
    vault.shares = [
      createOrUpdatePoolShare(
        address,
        address,
        BigInt.fromI32(0),
        BigInt.fromI32(0)
      ).id,
    ];
    vault.save();
    let vaultAddressLookup = new VaultAddressLookup(address.toHexString());
    vaultAddressLookup.vault = vault.id;
    vaultAddressLookup.save();
  }
  return vault;
}

export function getPoolShare(
  vaultAddress: Address,
  userAddress: Address
): PoolShare {
  let poolShare = PoolShare.load(
    vaultAddress
      .toHexString()
      .concat("-")
      .concat(userAddress.toHexString())
  );
  if (!poolShare) {
    poolShare = createOrUpdatePoolShare(
      vaultAddress,
      userAddress,
      BigInt.fromI32(0),
      BigInt.fromI32(0)
    );
    return poolShare;
  }
  return poolShare;
}

export function createOrUpdatePoolShare(
  vaultAddress: Address,
  userAddress: Address,
  inventoryShare: BigInt,
  liquidityShare: BigInt
): PoolShare {
  let poolShare = PoolShare.load(
    vaultAddress
      .toHexString()
      .concat("-")
      .concat(userAddress.toHexString())
  );
  if (!poolShare) {
    poolShare = new PoolShare(
      vaultAddress
        .toHexString()
        .concat("-")
        .concat(userAddress.toHexString())
    );
    poolShare.vault = vaultAddress.toHexString();
    poolShare.user = userAddress.toHexString();
    poolShare.inventoryShare = inventoryShare;
    poolShare.liquidityShare = liquidityShare;
    poolShare.save();
  } else {
    poolShare.inventoryShare = inventoryShare;
    poolShare.liquidityShare = liquidityShare;
    poolShare.save();
  }
  return poolShare;
}

export function getOrCreateFeeReceipt(
  txHash: Bytes,
  vaultId: BigInt,
  amount: BigInt,
  timestamp: BigInt,
  logIndex: BigInt,
  isInventory: boolean
): FeeReceipt {
  let feeReceiptId = txHash
    .toHexString()
    .concat("-")
    .concat(vaultId.toHexString())
    .concat("-")
    .concat(logIndex.toHexString())
    .concat("-")
    .concat(
      isInventory
        ? BigInt.fromI32(1).toHexString()
        : BigInt.fromI32(0).toHexString()
    );
  let feeReceipt = FeeReceipt.load(feeReceiptId);
  if (!feeReceipt) {
    feeReceipt = new FeeReceipt(feeReceiptId);
    feeReceipt.timestamp = timestamp;
    feeReceipt.vault = vaultId.toHexString();
    feeReceipt.amount = amount.toBigDecimal();
    feeReceipt.isInventory = isInventory;
    feeReceipt.save();
  }
  return feeReceipt;
}

export function getOrCreateEarning(
  feeReceiptId: string,
  amount: BigDecimal,
  userAddress: Address,
  vaultId: string,
  isInventory: boolean
): Earning {
  let earningId = feeReceiptId.concat("-").concat(userAddress.toHexString());
  let earning = Earning.load(earningId);
  if (!earning) {
    earning = new Earning(earningId);
    earning.amount = amount;
    earning.feeReceipt = feeReceiptId;
    earning.vault = vaultId;
    earning.isInventory = isInventory;
    earning.user = userAddress.toHexString();
    earning.save();
  }
  return earning;
}

export function updateOrCreateUserVaultFeeAggregate(
  vaultId: string,
  amount: BigDecimal,
  userAddress: Address,
  isInventory: boolean
): UserVaultFeeAggregate {
  let userVaultFeeAggregate = UserVaultFeeAggregate.load(
    vaultId.concat("-").concat(userAddress.toHexString())
  );
  if (!userVaultFeeAggregate) {
    userVaultFeeAggregate = new UserVaultFeeAggregate(
      vaultId.concat("-").concat(userAddress.toHexString())
    );
    userVaultFeeAggregate.aggregatedVaultFees = amount;
    userVaultFeeAggregate.vault = vaultId;
    userVaultFeeAggregate.isInventory = isInventory;
    userVaultFeeAggregate.user = userAddress.toHexString();
    userVaultFeeAggregate.save();
  } else {
    userVaultFeeAggregate.aggregatedVaultFees = userVaultFeeAggregate.aggregatedVaultFees.plus(
      amount
    );
    userVaultFeeAggregate.save();
  }
  return userVaultFeeAggregate;
}
