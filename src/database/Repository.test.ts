import { PrismaClient } from ".prisma/client"
import { TracepathResult } from "../model/TracepathResult.interface"
import { Repository } from "./Repository"

describe("Repository", () => {
  let prisma: PrismaClient
  let repository: Repository

  beforeAll(() => {
    prisma = new PrismaClient()
    repository = Repository.create({ prisma })
  })

  afterEach(async () => {
    await prisma.tracepathHop.deleteMany({})
    await prisma.tracepathRead.deleteMany({})
  })

  describe("insert tracepath results", () => {
    it("should insert single hop result", async () => {
      const tracepathResult = [
        {
          hop: 1,
          ip: "192.168.1.1",
          rtt: 1.1,
          raw: "",
        },
      ] as TracepathResult
      const insertedTracepathResult = await repository.insertTracepathResult(
        tracepathResult
      )

      expect(insertedTracepathResult.hops).toContainEqual(
        expect.objectContaining(tracepathResult[0])
      )
    })

    it("should insert multiple hop result", async () => {
      const tracepathResult = [
        {
          hop: 1,
          ip: "192.168.1.1",
          rtt: 1.1,
          raw: "",
        },
        {
          hop: 2,
          ip: "192.168.1.2",
          rtt: 1.2,
          raw: "",
        },
      ] as TracepathResult
      const insertedTracepathResult = await repository.insertTracepathResult(
        tracepathResult
      )

      expect(insertedTracepathResult.hops).toContainEqual(
        expect.objectContaining(tracepathResult[0])
      )
      expect(insertedTracepathResult.hops).toContainEqual(
        expect.objectContaining(tracepathResult[1])
      )
    })
  })
})
