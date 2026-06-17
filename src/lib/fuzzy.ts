export interface FuzzyResult {
  /** Did every query character appear, in order? */
  matched: boolean;
  /** Indices into `target` of the matched characters (for highlighting). */
  indices: number[];
  /** Higher = tighter / more contiguous match. */
  score: number;
}

/**
 * Subsequence fuzzy match. Whitespace in the query is ignored so that
 * "gotoblog" or "go bl" both light up "goto blog". Contiguous runs and
 * start-of-string hits score higher. Returns the matched character indices
 * so the caller can highlight them in the amber accent.
 */
export function fuzzyMatch(query: string, target: string): FuzzyResult {
  const q = query.toLowerCase().replace(/\s+/g, "");
  const t = target.toLowerCase();

  if (!q) return { matched: true, indices: [], score: 0 };

  const indices: number[] = [];
  let qi = 0;
  let score = 0;
  let prev = -2;

  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      indices.push(ti);
      score += ti === prev + 1 ? 3 : 1; // contiguity bonus
      if (ti === 0) score += 2; // anchored at start
      prev = ti;
      qi += 1;
    }
  }

  return { matched: qi === q.length, indices, score };
}
