import { LowerCaseDirective } from './lower-case.directive';

describe('LowerCaseDirective', () => {
  it('should create an instance', () => {
    let elRefMock = {
      nativeElement: document.createElement('div')
    };
    const directive = new LowerCaseDirective(elRefMock);
    expect(directive).toBeTruthy();
  });
});
