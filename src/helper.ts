import { Address, BigInt, Bytes, BigDecimal } from "@graphprotocol/graph-ts";
import {FeeReceipt, PoolShare, User, Vault, Earning, VaultAddressLookup} from "../generated/schema";

export function getOrCreateUser(address : Address) : User {
    let user = User.load(address.toHexString());
    if(!user){
        user = new User(address.toHexString());
        user.save();
    }
    return user;
}
export function getVaultFromId(vaultId: BigInt) : Vault | null {
    let vault = Vault.load(vaultId.toHexString());
    if(!vault){
       return null;
    }
    return vault;
}

export function getVaultFromAddress(address: Address) : Vault | null {
    let vaultAddressLookup = VaultAddressLookup.load(address.toHexString());
    if(!vaultAddressLookup){
       return null;
    }
    let vault = Vault.load(vaultAddressLookup.vault);
    if(!vault){
        return null;
     }
    return vault;
}

export function getOrCreateVault(address : Address, vaultId: BigInt, ticker: string, assetAddress: Address) : Vault {
    let vault = Vault.load(vaultId.toHexString());
    if(!vault){
        vault = new Vault(vaultId.toHexString());
        vault.vaultId = vaultId;
        vault.address = address;
        vault.ticker = ticker;
        vault.assetAddress = assetAddress;
        vault.inventoryStakedTotal = BigInt.fromI32(0);
        vault.liquidityStakedTotal = BigInt.fromI32(0);
        vault.shares = [createOrUpdatePoolShare(address, address, BigInt.fromI32(0),BigInt.fromI32(0)).id]
        vault.save();
        let vaultAddressLookup = new VaultAddressLookup(address.toHexString());
        vaultAddressLookup.vault = vault.id;
        vaultAddressLookup.save();
    }
    return vault;
}

export function getPoolShare(vaultAddress: Address, userAddress: Address) : PoolShare  {
    let poolShare = PoolShare.load(vaultAddress.toHexString().concat("-").concat(userAddress.toHexString()));
    if(!poolShare){
       poolShare = createOrUpdatePoolShare(vaultAddress, userAddress, BigInt.fromI32(0), BigInt.fromI32(0))
       return poolShare;
    }
    return poolShare;
}

export function createOrUpdatePoolShare(vaultAddress: Address, userAddress: Address, inventoryShare: BigInt, liquidityShare: BigInt) : PoolShare {
    let poolShare = PoolShare.load(vaultAddress.toHexString().concat("-").concat(userAddress.toHexString()));
    if(!poolShare){
        poolShare = new PoolShare(vaultAddress.toHexString().concat("-").concat(userAddress.toHexString()));
        poolShare.vault = vaultAddress.toHexString();
        poolShare.user = userAddress.toHexString();
        poolShare.inventoryShare = inventoryShare;
        poolShare.liquidityShare = liquidityShare;
        poolShare.save();
    }
    else {
        poolShare.inventoryShare = inventoryShare;
        poolShare.liquidityShare = liquidityShare;
        poolShare.save();
    }
    return poolShare;
}

export function getOrCreateFeeReceipt(txHash : Bytes, vaultId: BigInt, amount: BigInt, timestamp: BigInt, isInventory: boolean) : FeeReceipt {
    let feeReceipt = FeeReceipt.load(txHash.toHexString().concat("-").concat(vaultId.toHexString()));
    if(!feeReceipt){

        feeReceipt = new FeeReceipt(txHash.toHexString().concat("-").concat(vaultId.toHexString()));
        feeReceipt.timestamp = timestamp;
        feeReceipt.vault = vaultId.toHexString();
        feeReceipt.amount = amount;
        feeReceipt.isInventory = isInventory;
        feeReceipt.save();
    }
    return feeReceipt;
}


export function getOrCreateEarning(feeReceiptId: string, amount : BigDecimal, userAddress: Address) : Earning {
    let earning = Earning.load(feeReceiptId.concat("-").concat(userAddress.toHexString()));
    if(!earning){
        earning = new Earning(feeReceiptId.concat("-").concat(userAddress.toHexString()));
        earning.amount = amount;
        earning.feeReceipt = feeReceiptId;
        earning.user = userAddress.toHexString();
        earning.save();
    }
    return earning;
}