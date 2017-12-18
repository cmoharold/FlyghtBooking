export class Flyght {
  constructor(
    public _id: string,
    public code: string,
    public origin: string,
    public destination: string,
    public date: Date,
    public airplane: string
  ) {}
}
