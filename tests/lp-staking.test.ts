import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { FeesReceived } from "../generated/LPStaking/LPStaking"
import { handleFeesReceived } from "../src/lp-staking"
import { createFeesReceivedEvent } from "./lp-staking-utils"

/**
 * Tests structure (matchstick-as >=0.5.0)
 * https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0
 */

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let vaultId = BigInt.fromI32(234)
    let amount = BigInt.fromI32(234)
    let newFeesReceivedEvent = createFeesReceivedEvent(vaultId, amount)
    handleFeesReceived(newFeesReceivedEvent)
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
      "amount",
      "234"
    )
  })
})
