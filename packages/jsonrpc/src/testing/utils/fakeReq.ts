export function fakeReq({ session = {} } = {}): any {
  return {
    session: session,
  };
}
