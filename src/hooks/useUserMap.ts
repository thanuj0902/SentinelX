import { useMemo } from 'react';
import { buildUserMap } from '../utils/helpers';
import type { User } from '../types';

export function useUserMap(users: User[]) {
  return useMemo(() => buildUserMap(users), [users]);
}
