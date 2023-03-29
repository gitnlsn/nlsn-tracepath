import { PrismaClient } from "@prisma/client"
import { TracepathResult } from "../model/TracepathResult.interface"

export interface RepositoryProps {
  prisma: PrismaClient
}

export class Repository {
  private constructor(private readonly prisma: PrismaClient) {}

  static create({ prisma }: RepositoryProps) {
    return new Repository(prisma)
  }

  async insertTracepathResult(tracepathResult: TracepathResult) {
    return this.prisma.tracepathRead.create({
      data: {
        hops: {
          createMany: {
            data: tracepathResult,
          },
        },
      },
      include: {
        hops: true,
      },
    })
  }

  async getTracepathReads(limit = 3) {
    return this.prisma.tracepathRead.findMany({
      include: { hops: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    })
  }

  async getHopsStats() {
    return this.prisma.tracepathHop.groupBy({
      _count: true,
      _avg: { rtt: true },
      by: ["ip", "hop"],
      orderBy: {
        hop: "asc",
      },
    })
  }

  async getExpectionTracepathReads(limit = 3) {
    return this.prisma.$transaction(async (transaction) => {
      const readsWith3PoinstAtHop1 = await transaction.tracepathHop.groupBy({
        _count: true,
        by: ["tracepathReadId"],
        where: {
          hop: { equals: 1 },
        },
      })

      const readsWithRouterAtHop2 = await transaction.tracepathHop.groupBy({
        by: ["tracepathReadId"],
        where: {
          AND: {
            hop: { gt: 1 },
            ip: { equals: "192.168.1.1" },
          },
        },
      })

      const excepctionReads = [
        ...readsWith3PoinstAtHop1
          .filter((read) => read._count > 2)
          .map((read) => read.tracepathReadId),
        ...readsWithRouterAtHop2.map((read) => read.tracepathReadId),
      ]

      return transaction.tracepathRead.findMany({
        where: {
          id: {
            in: excepctionReads,
          },
        },
        orderBy: { createdAt: "desc" },
        include: {
          hops: true,
        },
        take: limit,
      })
    })
  }
}
