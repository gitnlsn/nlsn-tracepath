import { HopStats } from "../database/Repository.interface"

type GroupedStatsByHop = Array<{
  hop: number
  ips: Array<{ ip: string; count: number; avg: number | null }>
}>

export const generateStatsReport = (stats: HopStats): string =>
  stats
    .reduce<GroupedStatsByHop>((acc, next) => {
      // Grouping by hop
      const existingGroupIndex = acc.findIndex(
        (group) => group.hop === next.hop
      )

      if (existingGroupIndex === -1) {
        return [
          ...acc,
          {
            hop: next.hop,
            ips: [{ ip: next.ip, count: next._count, avg: next._avg.rtt }],
          },
        ]
      }

      return acc.map((existingGroup, index) => {
        if (index === existingGroupIndex) {
          return {
            ...existingGroup,
            ips: [
              ...existingGroup.ips,
              { ip: next.ip, count: next._count, avg: next._avg.rtt },
            ],
          }
        }

        return existingGroup
      })
    }, [])
    .map<string>(({ hop, ips }) => {
      const ipsString = ips
        .map<string>(({ ip, count, avg }) =>
          // line formated as:
          // \t192.168.1.1 (400)
          avg ? `\t${ip} (${count}, avg=${avg.toFixed(3)})` : `\t${ip} (${count}`
        )
        .reduce<string>((acc, next, index) => {
          if (index === 0) {
            return next
          }

          return `${acc}\n${next}`
        }, "")

      // Hop Heading
      return `Hop ${hop}\n${ipsString}`
    })
    .reduce<string>((acc, next, index) => {
      if (index === 0) {
        return next
      }

      return `${acc}\n\n${next}`
    }, "")
