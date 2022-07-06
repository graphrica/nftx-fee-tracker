# NFTX Fee Tracker Subgraph


## Overview

The goal of this subgraph is to index historical data for the exact fees earned by each staked user in each vault.

The basic calculation for fees earned is `poolShare * allocPoint * fee` where `poolShare` is the user’s % ownership of the staked pool (`stakedTokens / totalSupplyOfStakedTokens`) and `allocPoint` is the % fee split given to the fee receiver i.e. Inventory (20%) or Liquidity (80%). The `fee` is generated whenever the vault has a Mint, Redeem or Swap transaction. The fee is then split and transferred to the Inventory and Liquidity receivers.

The Inventory and Liquidity receivers can be set in the subgraph’s config. However it would be desirable to find a way to future proof against future receivers being added.

**Requirements**

- For each fee transfer, calculate the share of the fee earned by each staked user.
- If broader granularity required (one hour, one day etc) then ensuring the total aggregated fee earned for a user takes into account their change `poolShare` for that time period.

**Summary**

Index the exact amount of fee received for every staked individual when a fee receipt is created via mint/redeem/swap.

[NFTX Brief](https://nftx.notion.site/Subgraph-Fee-Split-Tracking-cd12c15d0dff4f22981a01e0ca268646)

___
## Coverage

[**VaultFactoryUpgradeable**](https://github.com/NFTX-project/nftx-protocol-v2/blob/master/contracts/solidity/NFTXVaultFactoryUpgradeable.sol)
```
eventHandlers:
  - event: NewVault(indexed uint256,address,address)
    handler: handleNewVault - // Creates New Vault Entity

```
[**InventoryStaking**](https://github.com/NFTX-project/nftx-protocol-v2/blob/master/contracts/solidity/NFTXInventoryStaking.sol)
```
eventHandlers:
  - event: FeesReceived(uint256,uint256)
    handler: handleFeesReceived
  - event: Deposit(uint256,uint256,uint256,uint256,address)
    handler: handleDeposit
  - event: Withdraw(uint256,uint256,uint256,address)
    handler: handleWithdraw
  - event: XTokenCreated(uint256,address,address)
    handler: handleXTokenCreated
```

[**LPStaking**](https://github.com/NFTX-project/nftx-protocol-v2/blob/master/contracts/solidity/NFTXLPStaking.sol)

```
eventHandlers:
  - event: FeesReceived(uint256,uint256)
    handler: handleFeesReceived
  - event: PoolUpdated(uint256,address)
    handler: handlePoolUpdated
```

**TokenX & TokenXWeth**

```
eventHandlers:
  - event: Transfer(address,address,uint256)
    handler: handleTransfer
```
___
## Schema

```
type User @entity {
  id: ID!
  poolShares: [PoolShare!] @derivedFrom(field: "user")
  earnings: [Earning!]  @derivedFrom(field: "user")
}

type Vault @entity {
  id: ID! # VaultID
  vaultId: BigInt!
  address: Bytes!
  assetAddress: Bytes!
  xTokenAddress: Bytes!
  xTokenWethAddress: Bytes!
  inventoryStakedTotal: BigInt!
  liquidityStakedTotal: BigInt!
  shares: [String!]! ##PoolShareID
  ticker: String # i.e. PUNK
}

type VaultAddressLookup @entity {
  id: ID! #Address
  vault: Vault!
}


type PoolShare @entity {
  id: ID!
  vault: Vault!
  user: User!
  inventoryShare: BigDecimal!
  liquidityShare: BigDecimal!
}

type Earning @entity {
  id: ID!
  feeReceipt: FeeReceipt!
  vault: Vault!
  isInventory: Boolean!
  user: User!
  amount: BigDecimal
}

type UserVaultFeeAggregate @entity {
  id: ID! # UserID - Vault - Inventory/LP
  isInventory: Boolean!
  user: User!
  vault: Vault!
  aggregatedVaultFees: BigDecimal!
}

type FeeReceipt @entity {
  id: ID!
	timestamp: BigInt!
  isInventory: Boolean!
  vault: Vault!
  amount: BigDecimal!
  feeDistribution: [Earning!] @derivedFrom(field: "feeReceipt")
}

type Token @entity {
  id: ID!
  vault: Vault!
  isUsed: Boolean!
  isInventory: Boolean!
}
```
___
### Deployment

Coming soon

___

Made with 💚 by Graphrica 🌍