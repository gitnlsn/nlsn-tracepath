import { Repository } from "./Repository"

export interface GetReadsProps {
  since?: Date
  at?: Date
  before?: Date
}

export type TracepathReads = Awaited<
  ReturnType<typeof Repository.prototype.getTracepathReads>
>