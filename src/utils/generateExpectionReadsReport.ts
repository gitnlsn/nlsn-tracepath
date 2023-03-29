import { TracepathReads } from "../database/Repository.interface"

export const generateExpectionReadsReport = (
  tracepathReads: TracepathReads
): string => {
  const hop1ExpectionReads = tracepathReads.filter(
    (read) => read.hops.filter((hop) => hop.hop === 1).length > 2
  )

  const hop2ExceptionReads = tracepathReads.filter((read) =>
    read.hops.some((hop) => hop.ip === "192.168.1.1" && hop.hop !== 1)
  )

  if (hop1ExpectionReads.length > 0 && hop2ExceptionReads.length > 0) {
    return `Exception at hop 1:\n${generateDateList(
      hop1ExpectionReads
    )}\n\nException at hop 2:\n${generateDateList(hop2ExceptionReads)}`
  }

  if (hop1ExpectionReads.length > 0) {
    return `Exception at hop 1:\n${generateDateList(hop1ExpectionReads)}`
  }

  if (hop2ExceptionReads.length > 0) {
    return `Exception at hop 2:\n${generateDateList(hop2ExceptionReads)}`
  }

  return ""
}

const generateDateList = (tracepathReads: TracepathReads) =>
  tracepathReads
    .map((read) => `\t${read.createdAt.toLocaleString()}`)
    .reduce((acc, next, index) => {
      if (index === 0) {
        return next
      }

      return `${acc}\n${next}`
    }, "")
