import { TracepathReads } from "../database/Repository.interface"

export const generatePrintableTracepathReads = (reads: TracepathReads) =>
  [...reads]
    .sort((left, right) => left.createdAt.getTime() - right.createdAt.getTime())
    .map(({ createdAt, hops }) => {
      const tracepathPrintableResult = [...hops]
        .sort((left, right) => left.hop - right.hop)
        .map<string>((hop) => hop.raw)
        .reduce<string>((acc, next, index) => {
          if (index === 0) {
            return next
          }

          return `${acc}\n${next}`
        }, "")

      return `Date: ${createdAt.toLocaleString()}\n${tracepathPrintableResult}`
    })
    .reduce<string>((acc, next, index) => {
      if (index === 0) {
        return next
      }

      return `${acc}\n\n${next}`
    }, "")
