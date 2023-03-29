import {
  TracepathResult,
  ZSchemaTracepathResult,
} from "./TracepathResult.interface"

export const parseTracepathResult = (input: string): TracepathResult => {
  const parsedJSON = JSON.parse(input)
  return ZSchemaTracepathResult.parse(parsedJSON)
}
