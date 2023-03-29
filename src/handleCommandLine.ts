import getoptions from "get-options"
import { countHops } from "./utils/countHops"
import { PrismaClient } from ".prisma/client"
import { Repository } from "./database/Repository"
import { exec } from "child_process"
import { promisify } from "util"
import {
  TracepathResult,
  TracepathResultParser,
} from "./model/TracepathResult.interface"
import { generatePrintableTracepathReads } from "./utils/generatePrintableTracepathReads"
import { generateExpectionReadsReport } from "./utils/generateExpectionReadsReport"
import { generateStatsReport } from "./utils/generateStatsReport"
import { generatePrintableTracepathResult } from "./utils/generatePrintableTracepathResult"

const promissedExec = promisify(exec)

export const handleCommandLine = async () => {
  const { options } = getoptions(process.argv, {
    "-d, --destination": "[destination ip/url]",
    "-m, --maxHops": "[number of hops]",
    "-c, --countHops": "",
    "-p, --postgresUrlPath": "[url]",
    "-i, --insertDatabase": "",
    "-r, --readDatabase": "[last n reads]",
    "-s, --hopStats": "",
    "-e, --expectionReads": "[last n reads]",
  })

  let tracepathResult: TracepathResult | undefined = undefined
  let printTracepathResult = false

  if (hasKey(options, "destination")) {
    const destination = options["destination"]
    const maxHops = options["maxHops"] ?? 5

    const { stdout, stderr } = await promissedExec(
      `bash scripts/trace.sh ${destination} ${maxHops}`
    )
    if (stderr) {
      throw new Error(stderr)
    }

    tracepathResult = TracepathResultParser.fromJsonString(stdout)
    printTracepathResult = true
  }

  if (hasKey(options, "countHops")) {
    if (!tracepathResult) {
      throw new Error("Invalid destination")
    }

    const hopsCounter = countHops(tracepathResult)

    console.log(JSON.stringify(hopsCounter, null, 2))
    printTracepathResult = false
  }

  if (hasKey(options, "insertDatabase")) {
    if (!tracepathResult) {
      throw new Error("Invalid tracepath destination")
    }

    if (!hasKey(options, "postgresUrlPath")) {
      throw new Error("Missing postgres url path")
    }

    const prismaUrl = options["postgresUrlPath"]
    const prisma = new PrismaClient({ datasources: { db: { url: prismaUrl } } })
    const repository = Repository.create({ prisma })
    await repository.insertTracepathResult(tracepathResult)
  }

  if (hasKey(options, "readDatabase")) {
    if (!hasKey(options, "postgresUrlPath")) {
      throw new Error("Missing postgres url path")
    }

    const prismaUrl = options["postgresUrlPath"]

    const limit =
      Number(options["readDatabase"]) !== 0
        ? Number(options["readDatabase"])
        : undefined

    const prisma = new PrismaClient({ datasources: { db: { url: prismaUrl } } })
    const repository = Repository.create({ prisma })
    const insertedTracepathReads = await repository.getTracepathReads(limit)

    console.log(generatePrintableTracepathReads(insertedTracepathReads))
    printTracepathResult = false
  }

  if (hasKey(options, "hopStats")) {
    if (!hasKey(options, "postgresUrlPath")) {
      throw new Error("Missing postgres url path")
    }

    const prismaUrl = options["postgresUrlPath"]

    const prisma = new PrismaClient({ datasources: { db: { url: prismaUrl } } })
    const repository = Repository.create({ prisma })
    const stats = await repository.getHopsStats()

    console.log(generateStatsReport(stats))
  }

  if (hasKey(options, "expectionReads")) {
    if (!hasKey(options, "postgresUrlPath")) {
      throw new Error("Missing postgres url path")
    }

    const limit =
      Number(options["expectionReads"]) !== 0
        ? Number(options["expectionReads"])
        : undefined

    const prismaUrl = options["postgresUrlPath"]
    const prisma = new PrismaClient({ datasources: { db: { url: prismaUrl } } })
    const repository = Repository.create({ prisma })
    const expectionReads = await repository.getExpectionTracepathReads(limit)

    console.log(generateExpectionReadsReport(expectionReads))
  }

  if (printTracepathResult && tracepathResult) {
    console.log(generatePrintableTracepathResult(tracepathResult))
  }
}

const hasKey = (options: any, key: string) => Object.keys(options).includes(key)
