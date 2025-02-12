
import {TokenPayload} from "@authlocal/authlocal"

export type Decree<D> = {data: D} & TokenPayload

