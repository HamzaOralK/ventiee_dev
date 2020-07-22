import { v4 as uuidv4 } from "uuid";
import { Color } from '../dtos/room';

export namespace COMMONS {
  export function generateUUID(): string {
    return uuidv4();
  }

  export function getEnumArray(enm: any) {
    return Object.entries(enm).map(([key, value]) => ({ key, value }));
  }

  export function getRandom(number: number) {
    return Math.floor(Math.random() * number);
  }

  export function generateRandomRGBAColor(index?: number) {
    if(index !== undefined) {
      let color = UserColors[index];
      return new Color(color.r, color.g, color.b, color.a);
    }
    else return new Color(COMMONS.getRandom(255), COMMONS.getRandom(255), COMMONS.getRandom(255), 1);
  }

  export function generateRandomHexColor() {
    let color = COMMONS.generateRandomRGBAColor();
    const rgba = "rgba(" + color.r + "," + color.g + ","+ color.b + ","+ color.a +" )";
    return COMMONS.rgbaToHex(rgba);
  }

  export function rgbaToHex(rgba) {
    var inParts = rgba.substring(rgba.indexOf("(")).split(","),
      r = parseInt(trim(inParts[0].substring(1)), 10),
      g = parseInt(trim(inParts[1]), 10),
      b = parseInt(trim(inParts[2]), 10),
      a = parseFloat(trim(inParts[3].substring(0, inParts[3].length - 1))).toFixed(2) as any;
    var outParts = [
      r.toString(16),
      g.toString(16),
      b.toString(16),
      Math.round(a * 255).toString(16).substring(0, 2)
    ];

    // Pad single-digit output values
    outParts.forEach(function (part, i) {
      if (part.length === 1) {
        outParts[i] = '0' + part;
      }
    })

    return ('#' + outParts.join(''));
  }

  export function trim(str) {
    return str.replace(/^\s+|\s+$/gm, '');
  }
}

export const UserColors: Color[] = [
  {r: 249, g: 40, b: 39, a: 1},
  {r: 69, g: 87, b: 8, a: 1},
  {r: 158, g: 123, b: 99, a: 1},
  {r: 96, g: 117, b: 200, a: 1},
  {r: 247, g: 180, b: 126, a: 1},
  {r: 64, g: 255, b: 145, a: 1},
  {r: 151, g: 233, b: 30, a: 1},
  {r: 73, g: 42, b: 8, a: 1},
  {r: 201, g: 31, b: 102, a: 1},
  {r: 103, g: 250, b: 95, a: 1},
  {r: 24, g: 143, b: 198, a: 1 },
  {r: 158, g: 120, b: 47, a: 1 },
  {r: 32, g: 255, b: 197, a: 1 },
  {r: 45, g: 181, b: 89, a: 1 },
  {r: 118, g: 210, b: 229, a: 1},
  {r: 48, g: 187, b: 144, a: 1},
  {r: 143, g: 76, b: 202, a: 1},
  {r: 52, g: 61, b: 119, a: 1 },
  {r: 86, g: 117, b: 164, a: 1},
  {r: 54, g: 188, b: 121, a: 1}
]
