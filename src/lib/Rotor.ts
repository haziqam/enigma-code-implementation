import { decodeWiring } from "./Util";

export class Rotor {
  name: string;
  forwardWiring: number[];
  backwardWiring: number[];
  rotorPosition: number;
  notchPosition: number;

  constructor(
    name: string,
    encoding: string,
    rotorPosition: number,
    notchPosition: number
  ) {
    // Untuk create custom rotor
    this.name = name;
    this.forwardWiring = decodeWiring(encoding);
    this.backwardWiring = this.generateBackwardWiring();
    this.rotorPosition = rotorPosition;
    this.notchPosition = notchPosition;
  }

  static create(name: string, rotorPosition: number) {
    // Untuk create rotor dengan pilihan rotor I, II dan III
    switch (name) {
      case "I":
        return new Rotor("I", "EKMFLGDQVZNTOWYHXUSPAIBRCJ", rotorPosition, 16);
      case "II":
        return new Rotor("II", "AJDKSIRUXBLHWTMCQGZNPYFVOE", rotorPosition, 4);
      case "III":
        return new Rotor(
          "III",
          "BDFHJLCPRTXVZNYEIWGAKMUSQO",
          rotorPosition,
          21
        );
    }
    throw new Error("Rotor name not available");
  }

  generateBackwardWiring(): number[] {
    const inverse = [];
    for (let i = 0; i < this.forwardWiring.length; i++) {
      const forward = this.forwardWiring[i];
      inverse[forward] = i;
    }
    return inverse;
  }

  encipher(charNum: number, wiring: number[]): number {
    const shift = this.rotorPosition;
    return (wiring[(charNum + shift + 26) % 26] - shift + 26) % 26;
  }

  forward(charNum: number): number {
    return this.encipher(charNum, this.forwardWiring);
  }

  backward(charNum: number): number {
    return this.encipher(charNum, this.backwardWiring);
  }

  isAtNotch(): boolean {
    return this.notchPosition === this.rotorPosition;
  }

  turnover() {
    this.rotorPosition = (this.rotorPosition + 1) % 26;
  }
}
