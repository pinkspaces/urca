export type Ok<T> = {
  is_ok(): this is Ok<any>;
  is_err(): this is Err<any>;
  unwrap(): T;
  expect(_: string): T;
  unwrap_err(): never;
  expect_err(m: string): never;
};

export type Err<E> = {
  is_ok(): this is Ok<any>;
  is_err(): this is Err<any>;
  unwrap(): never;
  expect(m: string): never;
  unwrap_err(): E;
  expect_err(m: string): E;
}

export type Result<T, E> = Ok<T> | Err<E>;

export function ok<T>(value: T): Ok<T> {
  return {
    is_ok: (): this is Ok<any> => true,
    is_err: (): this is Err<any> => false,
    unwrap: () => value,
    expect: (_: string) => value,
    unwrap_err: () => { throw new Error("Ok::unwrap_err: unexpected unwrap"); },
    expect_err: (m: string) => { throw new Error(`Ok::expect_err(${m})`); }
  };
}

export function err<E>(error: E): Err<E> {
  return {
    is_ok: (): this is Ok<any> => false,
    is_err: (): this is Err<any> => true,
    unwrap: () => { throw new Error("Err::unwrap: unexpected unwrap"); },
    expect: (m: string) => { throw new Error(`Err:expect(${m})`) },
    unwrap_err: () => error,
    expect_err: (_: string) => error
  };
}

export async function safecall<T>(p: Promise<T>): Promise<Result<T, any>> {
  try {
    return ok(await p);
  } catch (e) {
    return err(e);
  }
};
