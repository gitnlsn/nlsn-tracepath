import { TracepathResult } from "../model/TracepathResult.interface"
import { countHops } from "./countHops"

describe("countHops", () => {
  it("should parse empty array", () => {
    expect(countHops([])).toEqual({})
  })

  it.each([
    [[{ hop: 1 }] as TracepathResult, { "hop-1": 1 }],
    [[{ hop: 1 }, { hop: 1 }] as TracepathResult, { "hop-1": 2 }],
    [[{ hop: 1 }, { hop: 2 }] as TracepathResult, { "hop-1": 1, "hop-2": 1 }],
  ])("should parse hop", (input, expected) => {
    expect(countHops(input)).toEqual(expected)
  })
})
