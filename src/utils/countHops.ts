import { TracepathResult } from "../model/TracepathResult.interface"

interface HopCounter {
  hop: number
  counter: number
}

export const countHops = (tracepathResult: TracepathResult) =>
  tracepathResult
    .reduce<Array<HopCounter>>((acc, next) => {
      const existingHopCounter = acc.find((hop) => hop.hop === next.hop)
      if (!existingHopCounter) {
        return [
          ...acc,
          {
            hop: next.hop,
            counter: 1,
          },
        ]
      }

      return acc.map((existingHop) => {
        if (existingHop.hop === next.hop) {
          return {
            ...existingHop,
            counter: existingHop.counter + 1,
          }
        }

        return existingHop
      })
    }, [])
    .reduce((acc, next) => {
      const key = `hop-${next.hop}`
      return {
        ...acc,
        [key]: next.counter,
      }
    }, {})
