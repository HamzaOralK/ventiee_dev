import * as uuidv4 from 'uuid/v4';
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

  export function generateRandomRGBAColor() {
    return new Color(COMMONS.getRandom(255), COMMONS.getRandom(255), COMMONS.getRandom(255), 1);
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
      a = parseFloat(trim(inParts[3].substring(0, inParts[3].length - 1)).toFixed(2));
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
