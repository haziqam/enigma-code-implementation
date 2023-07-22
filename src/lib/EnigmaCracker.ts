import { Enigma } from "./Enigma";
import { getChar } from "./Util";

/*
 * Cracker enigma versi lite.
 * Kegunaan: menebak configurasi enigma berupa urutan jenis rotor yang
 * digunakan serta initial letter tiap rotor.
 * Constraints:
 * 1. Harus punya data berupa known plaintext (known plaintext subset dari plaintext)
 *  dan known plaintext sudah pasti berada di awal plaintext
 * 2. Tidak bisa menebak secara akurat kalo Enigmanya pake plugboard, tapi kalo ga
 * pake plugboard bisa akurat
 * 3. Rotor yang digunakan hanya jenis I, II, dan III, reflektor yang digunakan hanya
 * UKW-B
 */

/*
 * Cara pake: findRotorConfigList(ciphertext, knownPlaintext) => returns list konfigurasi
 * Total elemennya ada 474552 konfigurasi (maklum brute force hehe), dan diurutkan dari
 * yg kecocokannya paling tinggi. Masukin ciphertext dan knownPlaintextnya harus di-hard code
 * (soalnya ga bikin CLI atau UI untuk bagian ini). Contoh ada di paling bawah.
 * Untuk jalanin code, masukin script berikut di terminal:
 * tsc EnigmaCracker.ts
 * node EnigmaCracker.js
 */

// console.log(result.length);

// const availableRotors = ["I", "II", "III"];
// const rotorPerms: string[][] = [];
// for (const rotor1 of availableRotors) {
//   for (const rotor2 of availableRotors) {
//     for (const rotor3 of availableRotors) {
//       rotorPerms.push([rotor1, rotor2, rotor3]);
//     }
//   }
// }

const rotorPerms = [
  ["I", "I", "I"],
  ["I", "I", "II"],
  ["I", "I", "III"],
  ["I", "II", "I"],
  ["I", "II", "II"],
  ["I", "II", "III"],
  ["I", "III", "I"],
  ["I", "III", "II"],
  ["I", "III", "III"],
  ["II", "I", "I"],
  ["II", "I", "II"],
  ["II", "I", "III"],
  ["II", "II", "I"],
  ["II", "II", "II"],
  ["II", "II", "III"],
  ["II", "III", "I"],
  ["II", "III", "II"],
  ["II", "III", "III"],
  ["III", "I", "I"],
  ["III", "I", "II"],
  ["III", "I", "III"],
  ["III", "II", "I"],
  ["III", "II", "II"],
  ["III", "II", "III"],
  ["III", "III", "I"],
  ["III", "III", "II"],
  ["III", "III", "III"],
];

function evaluateFitness(s1: string, s2: string) {
  // asumsi s1.length === s2.length
  let score = 0;
  for (let i = 0; i < s1.length; i++) {
    if (s1[i] === s2[i]) score++;
  }

  return score;
}

type RotorConfig = {
  rotor: string[];
  initialLetters: string[];
  fitness: number;
};

function findRotorConfigList(ciphertext: string, knownPlaintext: string) {
  const kplength = knownPlaintext.length;
  const rotorConfigs: RotorConfig[] = [];
  for (const perm of rotorPerms) {
    for (let i = 0; i <= 25; i++) {
      for (let j = 0; j <= 25; j++) {
        for (let k = 0; k <= 25; k++) {
          const enigma = Enigma.create(perm, [i, j, k], "UKW-B");
          const encipheredPlaintext =
            enigma.encryptString(knownPlaintext).result;
          const fitness = evaluateFitness(
            encipheredPlaintext,
            ciphertext.substring(0, kplength)
          );
          rotorConfigs.push({
            rotor: perm,
            initialLetters: [getChar(i), getChar(j), getChar(k)],
            fitness: fitness,
          });
        }
      }
    }
  }
  rotorConfigs.sort((a, b) => b.fitness - a.fitness);
  return rotorConfigs;
}

const result = findRotorConfigList(
  "AHTJDOYYBNUFFSHWNHYCVOXUVIYTNVWIDKMBSPOBETFK",
  "HELLOSUDO"
);
console.log(result.slice(0, 10));
