import { User } from '@tinybox/models';
import { bcryptHash } from '@tinybox/crypto';

export async function generateUser({
  name = 'hi',
  password = 'mypassword',
  email = 'hi@example.com',
} = {}) {
  const user = new User({
    name,
    hashedPassword: await bcryptHash(password),
    email,
  });
  await user.save();
  return user;
}
