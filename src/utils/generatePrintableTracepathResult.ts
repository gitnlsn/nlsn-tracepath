import { TracepathResult } from "../model/TracepathResult.interface"

export const generatePrintableTracepathResult = (
  result: TracepathResult
): string =>
  result
    .map<string>((hop) => hop.raw)
    .reduce<string>((acc, next, index) => {
      if (index === 0) {
        return next
      }

      return `${acc}\n${next}`
    }, "")
