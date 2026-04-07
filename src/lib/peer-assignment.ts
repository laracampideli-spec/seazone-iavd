import { users } from "@/data/users";
import { getManager, getSubordinates } from "./org-tree";

export interface PeerAssignment {
  evaluatorId: string;
  evaluateeId: string;
  /**
   * true when this pair was assigned via the fallback rule:
   * "liderado de um par da liderança direta".
   * Should be visible in admin UI and flagged in reports.
   */
  isFallback?: boolean;
}

// Pre-compute manager IDs at module load (stable for a given cycle)
const managerIdOf = new Map<string, string | null>();
for (const u of users) {
  const mgr = getManager(u.id);
  managerIdOf.set(u.id, mgr?.id ?? null);
}

// Group users by managerId for fast lookup
const usersByManager = new Map<string, string[]>();
for (const u of users) {
  const mid = managerIdOf.get(u.id);
  if (mid) {
    const list = usersByManager.get(mid) ?? [];
    list.push(u.id);
    usersByManager.set(mid, list);
  }
}

// Group users by sector for fast lookup
const usersBySector = new Map<string, string[]>();
for (const u of users) {
  const list = usersBySector.get(u.sector) ?? [];
  list.push(u.id);
  usersBySector.set(u.sector, list);
}

function hashStr(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h + s.charCodeAt(i)) & 0x7fffffff;
  }
  return h;
}

/** Deterministic shuffle using a linear congruential generator */
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    const j = s % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Primary peer pool for a user:
 * - People with the same sector (same immediate team)
 * - OR people with the same direct manager (common leadership)
 *
 * Excludes: self, direct manager, direct subordinates.
 *
 * Rule: "pessoas com o mesmo departamento ou com uma liderança em comum"
 */
function buildPrimaryPeerPool(userId: string): string[] {
  const user = users.find((u) => u.id === userId);
  if (!user) return [];

  const managerId = managerIdOf.get(userId) ?? null;
  const directSubIds = new Set(getSubordinates(userId).map((s) => s.id));

  const isExcluded = (id: string) =>
    id === userId || id === managerId || directSubIds.has(id);

  const pool = new Set<string>();

  // Same sector (same team)
  for (const id of usersBySector.get(user.sector) ?? []) {
    if (!isExcluded(id)) pool.add(id);
  }

  // Same manager (common leadership)
  if (managerId) {
    for (const id of usersByManager.get(managerId) ?? []) {
      if (!isExcluded(id)) pool.add(id);
    }
  }

  return [...pool];
}

/**
 * Fallback peer pool:
 * Subordinates of the manager's peers.
 *
 * Rule: "liderado de um par da sua liderança direta"
 * Only used when fewer than 2 primary peers exist.
 */
function buildFallbackPeerPool(userId: string, alreadyPicked: Set<string>): string[] {
  const managerId = managerIdOf.get(userId) ?? null;
  if (!managerId) return [];

  // Peers of the manager (using same primary logic)
  const managerPeers = buildPrimaryPeerPool(managerId);

  const fallback = new Set<string>();
  for (const peerId of managerPeers) {
    for (const sub of getSubordinates(peerId)) {
      if (sub.id !== userId && !alreadyPicked.has(sub.id)) {
        fallback.add(sub.id);
      }
    }
  }

  return [...fallback];
}

/**
 * Generate peer evaluation assignments for the entire company.
 *
 * Each person is assigned exactly 2 peers to evaluate (when pool allows):
 *
 * 1. Primary pool: same sector OR same direct manager
 * 2. Fallback (isFallback=true): subordinate of a peer of their direct manager
 *    — only when primary pool has fewer than 2 people
 *
 * Assignments are deterministic: same seed → same output.
 */
export function generatePeerAssignments(seed: number = 42): PeerAssignment[] {
  const assignments: PeerAssignment[] = [];

  for (const user of users) {
    const userSeed = seed ^ hashStr(user.id);

    const primary = buildPrimaryPeerPool(user.id);
    const shuffledPrimary = seededShuffle(primary, userSeed);

    const picked: PeerAssignment[] = [];

    // Take up to 2 from primary pool
    for (let i = 0; i < Math.min(2, shuffledPrimary.length); i++) {
      picked.push({ evaluatorId: user.id, evaluateeId: shuffledPrimary[i] });
    }

    // Fallback: fill remaining slots from manager's peers' subordinates
    if (picked.length < 2) {
      const pickedSet = new Set([user.id, ...picked.map((p) => p.evaluateeId)]);
      const fallback = buildFallbackPeerPool(user.id, pickedSet);
      const shuffledFallback = seededShuffle(fallback, userSeed + 1);

      for (let i = 0; i < Math.min(2 - picked.length, shuffledFallback.length); i++) {
        picked.push({
          evaluatorId: user.id,
          evaluateeId: shuffledFallback[i],
          isFallback: true,
        });
      }
    }

    assignments.push(...picked);
  }

  return assignments;
}

/** Get the peers that a specific user must evaluate */
export function getPeersToEvaluate(
  userId: string,
  assignments: PeerAssignment[]
): string[] {
  return assignments
    .filter((a) => a.evaluatorId === userId)
    .map((a) => a.evaluateeId);
}

/** Get who evaluates a specific user as peer */
export function getPeerEvaluators(
  userId: string,
  assignments: PeerAssignment[]
): string[] {
  return assignments
    .filter((a) => a.evaluateeId === userId)
    .map((a) => a.evaluatorId);
}

/** Check if a peer assignment was made via fallback rule */
export function isFallbackAssignment(
  evaluatorId: string,
  evaluateeId: string,
  assignments: PeerAssignment[]
): boolean {
  return assignments.some(
    (a) =>
      a.evaluatorId === evaluatorId &&
      a.evaluateeId === evaluateeId &&
      a.isFallback === true
  );
}
