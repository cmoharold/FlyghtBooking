export class Airline {
  constructor(
    public _id: string,
    public code: string,
    public timestamp: Date,
    public passenger: string,
    public flyght: string,
    public seat: string
  ) {}
}
