export class ConsumptionByService {

  date!: string;

  normalConsumption!: number;

  extendedConsumption!: number;

  total = this.normalConsumption + this.extendedConsumption;
}

