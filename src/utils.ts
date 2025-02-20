import { customAlphabet } from 'nanoid';

export function nanoid(length = 8) {
  const alphabet =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return customAlphabet(alphabet, length)();
}
