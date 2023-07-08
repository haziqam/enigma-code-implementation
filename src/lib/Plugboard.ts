export class Plugboard {
  private mapping: Map<number, number>;

  constructor() {
    this.mapping = new Map();
  }

  addWwire(firstCharNum: number, secondCharNum: number) {
    if (this.mapping.has(firstCharNum) || this.mapping.has(secondCharNum))
      throw new Error("Letter already added to plugboard");

    this.mapping.set(firstCharNum, secondCharNum);
    this.mapping.set(secondCharNum, firstCharNum);
  }

  removeWire(charNum: number) {
    const letterPair = this.mapping.get(charNum);
    this.mapping.delete(charNum);
    this.mapping.delete(letterPair!);
  }

  forward(charNum: number) {
    const result = this.mapping.get(charNum);
    return result !== undefined ? result : charNum;
  }

  print() {
    this.mapping.forEach((key, value) => {
      console.log(`key: ${key}, value: ${value}`);
    });
    console.log("--");
  }
}
