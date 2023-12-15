export class ConsumptionByMeter {
  date!: Date;

  normal_consumption!: number;

  extended_consumption!: number;

  total = this.normal_consumption + this.extended_consumption;
}
