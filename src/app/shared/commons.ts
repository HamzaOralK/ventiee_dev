import * as uuidv4 from 'uuid/v4';

export namespace COMMONS {
  export function generateUUID(): string {
    return uuidv4();
  }

  export function getEnumArray(enm: any) {
    return Object.entries(enm).map(([key, value]) => ({ key, value }));
  }
}
