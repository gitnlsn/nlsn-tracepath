import { PrismaClient } from "@prisma/client"
import { endOfDay, startOfDay } from "date-fns"
import { TracepathResult } from "../model/TracepathResult.interface"
import { GetReadsProps } from "./Repository.interface"

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

  async getTracepathReads({ at, since, before }: GetReadsProps) {
    if (at) {
      return this.prisma.tracepathRead.findMany({
        where: {
          createdAt: { gte: startOfDay(at), lte: endOfDay(at) },
        },
        include: {
          hops: true,
        },
      })
    }

    if (before || since) {
      return this.prisma.tracepathRead.findMany({
        where: {
          createdAt: { gte: since, lte: before },
        },
        include: {
          hops: true,
        },
      })
    }

    return this.prisma.tracepathRead.findMany({
      include: {
        hops: true,
      },
    })
  }
}
