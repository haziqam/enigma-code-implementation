import { decodeWiring } from "./Util";

export class Reflector {
  forwardWiring: number[];

  constructor(encoding: string) {
    this.forwardWiring = decodeWiring(encoding);
  }

  static create(name: string): Reflector {
    // Bisa pake UKW-B atau UKW-C
    switch (name) {
      case "UKW-B":
        return new Reflector("YRUHQSLDPXNGOKMIEBFZCWVJAT");
      case "UKW-C":
        return new Reflector("FVPJIAOYEDRZXWGCTKUQSBNMHL");
    }
    throw new Error("Reflector name not available");
  }

  forward(charNum: number) {
    return this.forwardWiring[charNum];
  }
}
