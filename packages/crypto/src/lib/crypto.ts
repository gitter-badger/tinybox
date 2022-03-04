import bcrypt from 'bcrypt';

export function crypto(): string {
  return 'crypto';
}

const BCRYPT_SALT_ROUNDS = 10;

export function bcryptHash(plaintext: string, salt?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (salt) {
      bcrypt.hash(plaintext, salt, (err: unknown, hash: string) => {
        if (err) reject(err);
        else resolve(hash);
      });
    } else {
      bcrypt.hash(
        plaintext,
        BCRYPT_SALT_ROUNDS,
        (err: unknown, hash: string) => {
          if (err) reject(err);
          else resolve(hash);
        }
      );
    }
  });
}

export function bcryptCompare(
  plaintext: string,
  hash: string
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plaintext, hash, (err: unknown, hash: boolean) => {
      if (err) reject(err);
      else resolve(hash);
    });
  });
}
