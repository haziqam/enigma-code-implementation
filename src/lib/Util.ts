export function decodeWiring(encoding: string): number[] {
  const numberWiring = [];

  for (let i = 0; i < encoding.length; i++) {
    numberWiring.push(getCharNum(encoding.charAt(i)));
  }
  return numberWiring;
}

export function getCharNum(c: string) {
  const A: number = "A".charCodeAt(0);
  const charNum = c.charCodeAt(0) - A;
  return charNum;
}

export function getChar(charNum: number) {
  const A: number = "A".charCodeAt(0);
  const unicode = charNum + A;
  return String.fromCharCode(unicode);
}
