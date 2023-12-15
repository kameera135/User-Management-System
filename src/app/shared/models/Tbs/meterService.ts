import { MasterDataMeters } from "./masterDataMeters"

export class MeterService {

    serviceId!: string

    serviceType!: string

    unit!: string

    unitConversionFactor!: number

    status!: boolean

    masterDataMeters!: MasterDataMeters[]
}