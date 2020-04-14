import { MultiLanguagePipe } from './multi-language.pipe';

describe('MultiLanguagePipe', () => {
  it('create an instance', () => {
    let serviceMock = {
      setTitle: (title: string) => null,
      language: '',
      dictionary: [],
      decideDict: () => null,
      get: (key: string) => '',
    };
    const pipe = new MultiLanguagePipe(serviceMock);
    expect(pipe).toBeTruthy();
  });
});
