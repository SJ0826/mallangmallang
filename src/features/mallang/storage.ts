import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import type { MallangId } from './data';

export const SQUISH_COUNTS_KEY = '@mallangmallang/squish-counts';

export type SquishCounts = Partial<Record<MallangId, number>>;

async function readSquishCounts(): Promise<SquishCounts> {
  const raw = await AsyncStorage.getItem(SQUISH_COUNTS_KEY);
  if (raw == null) return {};
  try {
    const parsed = JSON.parse(raw);
    if (parsed != null && typeof parsed === 'object') {
      return parsed as SquishCounts;
    }
    return {};
  } catch {
    return {};
  }
}

export function getTotalCount(counts: SquishCounts): number {
  return Object.values(counts).reduce<number>((sum, n) => sum + (n ?? 0), 0);
}

export function useSquishCounts() {
  const [counts, setCounts] = useState<SquishCounts>({});
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const next = await readSquishCounts();
    setCounts(next);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { counts, totalCount: getTotalCount(counts), isLoading, refresh };
}
