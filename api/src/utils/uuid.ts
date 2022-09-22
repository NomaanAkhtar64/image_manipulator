import { v4 as uuid } from 'uuid';

export function createUUID() {
  return uuid().replace(/[-]/g, '');
}
