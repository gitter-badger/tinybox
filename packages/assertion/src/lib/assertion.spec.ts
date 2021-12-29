import {
  assertEmail,
  assertMinLength,
  assertNonNull,
  assertTruthy,
} from './assertion';

describe('assertTruthy', () => {
  it('fails false', () => {
    expect(() => assertTruthy(false, 'err')).toThrow('err');
  });

  it('fails empty string', () => {
    expect(() => assertTruthy('', 'err')).toThrow('err');
  });

  it('fails zero', () => {
    expect(() => assertTruthy(0, 'err')).toThrow('err');
  });

  it('does not fail true', () => {
    expect(() => assertTruthy(true, 'err')).not.toThrow('err');
  });

  it('does not fail string', () => {
    expect(() => assertTruthy('hi', 'err')).not.toThrow('err');
  });
});

describe('assertNonNull', () => {
  it('fails null', () => {
    expect(() => assertNonNull(null, 'err')).toThrow('err');
  });

  it('fails undefined', () => {
    expect(() => assertNonNull(undefined, 'err')).toThrow('err');
  });

  it('does not fail empty string', () => {
    expect(() => assertNonNull('', 'err')).not.toThrow('err');
  });
});

describe('assertEmail', () => {
  it('does not fail null', () => {
    expect(() => assertEmail(null, 'err')).not.toThrow('err');
  });

  it('fails empty string', () => {
    expect(() => assertEmail('', 'err')).toThrow('err');
  });

  it('fails invalid email', () => {
    expect(() => assertEmail('invalid', 'err')).toThrow('err');
  });

  it('does not fail email', () => {
    expect(() => assertEmail('hi@example.com', 'err')).not.toThrow('err');
  });
});

describe('assertMinLength', () => {
  it('does not fail null', () => {
    expect(() => assertMinLength(null, 8, 'err')).not.toThrow('err');
  });

  it('fails empty string', () => {
    expect(() => assertMinLength('', 8, 'err')).toThrow('err');
  });

  it('fails short string', () => {
    expect(() => assertMinLength('hi', 8, 'err')).toThrow('err');
  });

  it('does not fail long string', () => {
    expect(() => assertMinLength('hello world', 8, 'err')).not.toThrow('err');
  });
});
