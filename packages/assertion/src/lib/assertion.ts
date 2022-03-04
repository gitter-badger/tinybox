export function isNull(value: unknown) {
  return value === undefined || value === null;
}

export function assertTruthy(value: unknown, message: string) {
  if (!value) {
    throw new Error(message);
  }
}

export function assertNonNull(value: unknown, message: string) {
  if (isNull(value)) {
    throw new Error(message);
  }
}

export function assertEmail(value: string | null, message: string) {
  if (!isNull(value)) {
    if (!value!.match(/\S+@\S+\.\S+/)) {
      throw new Error(message);
    }
  }
}

export function assertMinLength(
  value: string | null,
  length: number,
  message: string
) {
  if (!isNull(value)) {
    if (value!.length < length) {
      throw new Error(message);
    }
  }
}
