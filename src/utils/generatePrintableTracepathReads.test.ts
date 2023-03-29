import { TracepathReads } from "../database/Repository.interface"
import { generatePrintableTracepathReads } from "./generatePrintableTracepathReads"

describe("generatePrintableTracepathReads", () => {
  it.each([
    ["", [] as TracepathReads],
    [
      `Date: ${new Date(2022, 0, 1).toLocaleString()}\nfoo`,
      [
        { createdAt: new Date(2022, 0, 1), hops: [{ raw: "foo" }] },
      ] as TracepathReads,
    ],
    [
      `Date: ${new Date(2022, 0, 1).toLocaleString()}\nfoo\nbar`,
      [
        {
          createdAt: new Date(2022, 0, 1),
          hops: [
            { hop: 1, raw: "foo" },
            { hop: 2, raw: "bar" },
          ],
        },
      ] as TracepathReads,
    ],
    [
      `Date: ${new Date(2022, 0, 1).toLocaleString()}\nbar\nfoo`,
      [
        {
          createdAt: new Date(2022, 0, 1),
          hops: [
            { hop: 2, raw: "foo" },
            { hop: 1, raw: "bar" },
          ],
        },
      ] as TracepathReads,
    ],
    [
      `Date: ${new Date(2022, 0, 1).toLocaleString()}\nfoo\n\nDate: ${new Date(
        2022,
        0,
        2
      ).toLocaleString()}\nfoo`,
      [
        { createdAt: new Date(2022, 0, 1), hops: [{ raw: "foo" }] },
        { createdAt: new Date(2022, 0, 2), hops: [{ raw: "foo" }] },
      ] as TracepathReads,
    ],
  ])("should handle %s", (expected, input) => {
    expect(generatePrintableTracepathReads(input)).toBe(expected)
  })
})
