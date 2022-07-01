import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { Deposit } from "../generated/InventoryStaking/InventoryStaking"
import { handleDeposit } from "../src/inventory-staking"
import { createDepositEvent } from "./inventory-staking-utils"

/**
 * Tests structure (matchstick-as >=0.5.0)
 * https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0
 */

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let vaultId = BigInt.fromI32(234)
    let baseTokenAmount = BigInt.fromI32(234)
    let xTokenAmount = BigInt.fromI32(234)
    let timelockUntil = BigInt.fromI32(234)
    let sender = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newDepositEvent = createDepositEvent(
      vaultId,
      baseTokenAmount,
      xTokenAmount,
      timelockUntil,
      sender
    )
    handleDeposit(newDepositEvent)
  })

  afterAll(() => {
    clearStore()
  })

  test("ExampleEntity created and stored", () => {
    assert.entityCount("ExampleEntity", 1)

    // 0xA16081F360e3847006dB660bae1c6d1b2e17eC2A is the default address used in newMockEvent() function

    assert.fieldEquals(
      "ExampleEntity",
      "0xA16081F360e3847006dB660bae1c6d1b2e17eC2A",
      "vaultId",
      "234"
    )

    assert.fieldEquals(
      "ExampleEntity",
      "0xA16081F360e3847006dB660bae1c6d1b2e17eC2A",
      "baseTokenAmount",
      "234"
    )

    assert.fieldEquals(
      "ExampleEntity",
      "0xA16081F360e3847006dB660bae1c6d1b2e17eC2A",
      "xTokenAmount",
      "234"
    )

    assert.fieldEquals(
      "ExampleEntity",
      "0xA16081F360e3847006dB660bae1c6d1b2e17eC2A",
      "timelockUntil",
      "234"
    )

    assert.fieldEquals(
      "ExampleEntity",
      "0xA16081F360e3847006dB660bae1c6d1b2e17eC2A",
      "sender",
      "0x0000000000000000000000000000000000000001"
    )
  })
})
