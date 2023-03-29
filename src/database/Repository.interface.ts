import { Repository } from "./Repository"

export type TracepathReads = Awaited<
  ReturnType<typeof Repository.prototype.getTracepathReads>
>

export type HopStats = Awaited<
  ReturnType<typeof Repository.prototype.getHopsStats>
>
