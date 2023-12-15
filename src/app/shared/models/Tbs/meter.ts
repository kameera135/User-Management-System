import { MeterService } from "./meterService";

export class Meter {

    id!: number;

    value!: string;

    meterId!: string;


    serviceType!: string

    meterName!: string

    meterType!: string

    meterTag!: any

    maxValue!: number

    meterUnit!: string

    factor!: any

    meterService!: MeterService
}