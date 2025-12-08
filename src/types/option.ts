export type Some<T> = {
  is_some(): this is Some<any>;
  is_none(): this is None;
  unwrap(): T;
  expect(_: string): T;
}

export type None = {
  is_some(): this is Some<any>;
  is_none(): this is None;
  unwrap(): never;
  expect(m: string): never;
}

export type Option<T> = Some<T> | None;

export function some<T>(value: T): Some<T> {
  return {
    is_some: (): this is Some<any> => true,
    is_none: (): this is None => false,
    unwrap: () => value,
    expect: (_: string) => value
  };
}

export const none: None = {
  is_some: (): this is Some<any> => false,
  is_none: (): this is None => true,
  unwrap: () => { throw new Error(`None::unwrap: unexpected unwrap`); },
  expect: (m: string) => { throw new Error(`None::expect(${m})`); }
};
