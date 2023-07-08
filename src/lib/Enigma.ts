import { Plugboard } from "./Plugboard";
import { Rotor } from "./Rotor";
import { Reflector } from "./Reflector";
import { getChar, getCharNum } from "./Util";

export class Enigma {
  leftRotor: Rotor;
  middleRotor: Rotor;
  rightRotor: Rotor;
  reflector: Reflector;
  plugboard: Plugboard;

  constructor(rotors: Rotor[], reflector: Reflector) {
    // Untuk bikin custom enigma
    this.leftRotor = rotors[0];
    this.middleRotor = rotors[1];
    this.rightRotor = rotors[2];
    this.reflector = reflector;
    this.plugboard = new Plugboard();
  }

  static create(
    rotorNames: string[],
    rotorPositions: number[],
    reflectorName: string
  ): Enigma {
    // Untuk bikin enigma dari nama rotor dan reflektor yg tersedia,
    // misal rotor I, reflektor UKW-B
    const rotors = rotorNames.map((name, i) =>
      Rotor.create(name, rotorPositions[i])
    );
    const reflector = Reflector.create(reflectorName);
    return new Enigma(rotors, reflector);
  }

  rotate() {
    if (this.middleRotor.isAtNotch()) {
      this.middleRotor.turnover();
      this.leftRotor.turnover();
    } else if (this.rightRotor.isAtNotch()) {
      this.middleRotor.turnover();
    }

    this.rightRotor.turnover();
  }

  encrypt(charNum: number): number {
    this.rotate();
    console.log(`Keyboard input: ${getChar(charNum)}`);
    console.log(
      `Rotor position: ${getChar(this.leftRotor.rotorPosition)} ${getChar(
        this.middleRotor.rotorPosition
      )} ${getChar(this.rightRotor.rotorPosition)}`
    );

    // Masuk plugboard
    const c = this.plugboard.forward(charNum);
    console.log(`Plugboard encryption: ${getChar(c)}`);

    // Masuk ke rotor kanan sampai rotor kiri
    // Right to left
    const c1 = this.rightRotor.forward(c);
    console.log(`Wheel 3 encryption: ${getChar(c1)}`);
    const c2 = this.middleRotor.forward(c1);
    console.log(`Wheel 2 encryption: ${getChar(c2)}`);
    const c3 = this.leftRotor.forward(c2);
    console.log(`Wheel 1 encryption: ${getChar(c3)}`);

    // Reflector
    const c4 = this.reflector.forward(c3);
    console.log(`Rotor encryption: ${getChar(c4)}`);

    // Masuk ke rotor kiri sampai rotor kanan
    const c5 = this.leftRotor.backward(c4);
    console.log(`Wheel 1 encryption: ${getChar(c5)}`);
    const c6 = this.middleRotor.backward(c5);
    console.log(`Wheel 2 encryption: ${getChar(c6)}`);
    const c7 = this.rightRotor.backward(c6);
    console.log(`Wheel 3 encryption: ${getChar(c7)}`);

    // Keluar plugboard
    const c8 = this.plugboard.forward(c7);
    console.log(`Plugboard encryption: ${getChar(c8)}`);
    console.log("============================");
    return c8;
  }

  encryptString(input: string): string {
    const result = [];
    for (const char of input) {
      const charNum = getCharNum(char);
      const encryptedCharNum = this.encrypt(charNum);
      const encryptedChar = getChar(encryptedCharNum);
      result.push(encryptedChar);
    }
    return result.join("");
  }
}

// const enigma = Enigma.create(
//   ["III", "I", "II"],
//   [getCharNum("I"), getCharNum("K"), getCharNum("N")],
//   "UKW-B"
// );
// console.log(enigma.encryptString("APAMAUMUSIAPADIRINYA"));
