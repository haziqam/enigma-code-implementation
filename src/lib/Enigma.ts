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

  encrypt(charNum: number): {
    result: number;
    step: string;
    rotorPosition: string;
  } {
    const step: string[] = [];
    this.rotate();
    const rotorPosition = `${getChar(this.leftRotor.rotorPosition)}${getChar(
      this.middleRotor.rotorPosition
    )}${getChar(this.rightRotor.rotorPosition)}`;
    step.push(`Keyboard input: ${getChar(charNum)}`);
    step.push(`Rotor positions: ${rotorPosition}`);

    // Masuk plugboard
    const c = this.plugboard.forward(charNum);
    step.push(`Plugboard encryption: ${getChar(c)}`);

    // Masuk ke rotor kanan sampai rotor kiri
    const c1 = this.rightRotor.forward(c);
    step.push(`Wheel 3 encryption: ${getChar(c1)}`);
    const c2 = this.middleRotor.forward(c1);
    step.push(`Wheel 2 encryption: ${getChar(c2)}`);
    const c3 = this.leftRotor.forward(c2);
    step.push(`Wheel 1 encryption: ${getChar(c3)}`);

    // Reflector
    const c4 = this.reflector.forward(c3);
    step.push(`Reflector encryption: ${getChar(c4)}`);

    // Masuk ke rotor kiri sampai rotor kanan
    const c5 = this.leftRotor.backward(c4);
    step.push(`Wheel 1 encryption: ${getChar(c5)}`);
    const c6 = this.middleRotor.backward(c5);
    step.push(`Wheel 2 encryption: ${getChar(c6)}`);
    const c7 = this.rightRotor.backward(c6);
    step.push(`Wheel 3 encryption: ${getChar(c7)}`);

    // Keluar plugboard
    const c8 = this.plugboard.forward(c7);
    step.push(`Plugboard encryption: ${getChar(c8)}`);
    step.push("============================");
    return {
      result: c8,
      step: step.join("\n"),
      rotorPosition: rotorPosition,
    };
  }

  encryptString(input: string): {
    result: string;
    steps: string;
    rotorPositionSequence: string[];
  } {
    const result: string[] = [];
    const RPS: string[] = [];
    const steps: string[] = [];
    for (const char of input) {
      const charNum = getCharNum(char);
      const {
        result: encryptedCharNum,
        step: step,
        rotorPosition: rotorPosition,
      } = this.encrypt(charNum);
      const encryptedChar = getChar(encryptedCharNum);
      result.push(encryptedChar);
      RPS.push(rotorPosition);
      steps.push(step);
    }
    return {
      result: result.join(""),
      steps: steps.join("\n"),
      rotorPositionSequence: RPS,
    };
  }
}

// const enigma = Enigma.create(
//   ["II", "III", "I"],
//   [getCharNum("G"), getCharNum("P"), getCharNum("O")],
//   "UKW-B"
// );
// const a = enigma.encryptString("AABBCCDDEE");

// console.log(a.steps);
