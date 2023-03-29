import { z } from "zod"
import { parseTracepathResult } from "./parseTracepathResult"

export const ZSchemaTracepathHop = z.object({
  hop: z.number(),
  ip: z.string().ip(),
  rtt: z.number(),
  raw: z.string(),
})
export type TracepathHop = z.infer<typeof ZSchemaTracepathHop>

export const ZSchemaTracepathResult = z.array(ZSchemaTracepathHop)

/**
 * Abstraction of result from tracepath command in bash.
 * ```bash
 *  1:  192.168.1.1                                           1.047ms
 *  1:  192.168.1.1                                           1.021ms
 *  2:  192.168.1.1                                           0.895ms pmtu 1492
 * ```
 * This is converted in to
 * ```json
 * [
 *   {
 *     "hop": 1,
 *     "ip": "192.168.1.1",
 *     "raw": "1: 192.168.1.1 1.047ms"
 *   },
 *   {
 *     "hop": 1,
 *     "ip": "192.168.1.1",
 *     "raw": "1: 192.168.1.1 1.021ms"
 *   },
 *   {
 *     "hop": 2,
 *     "ip": "192.168.1.1",
 *     "raw": "2: 192.168.1.1 0.895ms pmtu 1492"
 *   },
 * ]
 * ```
 */
export type TracepathResult = z.infer<typeof ZSchemaTracepathResult>

export class TracepathResultParser {
  static fromJsonString = (jsonString: string): TracepathResult =>
    parseTracepathResult(jsonString)
}
