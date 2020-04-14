import { OnlyNumbersDirective } from './only-numbers.directive';

describe('OnlyNumbersDirective', () => {
  it('should create an instance', () => {
    let elRefMock = {
      nativeElement: document.createElement('div')
    };
    const directive = new OnlyNumbersDirective(elRefMock);
    expect(directive).toBeTruthy();
  });
});
