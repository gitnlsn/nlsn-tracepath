import { TracepathHop, ZSchemaTracepathHop } from "./TracepathResult.interface"

describe("ZSchemaTracepathHop", () => {
  it.each([
    [{ hop: 1, ip: "192.168.1.1", raw: "" } as TracepathHop],
    [
      JSON.parse(
        JSON.stringify({ hop: 1, ip: "192.168.1.1", raw: "" } as TracepathHop)
      ),
    ],
  ])("should validate %s", (input) => {
    expect(ZSchemaTracepathHop.parse(input)).toBeTruthy()
  })

  it.each([
    [{ hop: "", ip: "192.168.1.1", raw: "" }],
    [{ hop: 1, ip: 192, raw: "" }],
    [{ hop: 1, ip: "192.168.1.1", raw: 12 }],
  ])("should not validate %s", (input) => {
    expect(() => ZSchemaTracepathHop.parse(input)).toThrow()
  })
})
