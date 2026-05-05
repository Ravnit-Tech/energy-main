const KEY = "online_users";
const TTL = 2 * 60 * 1000; // 2 minutes — considered online
const HEARTBEAT = 30 * 1000; // write every 30s

export interface OnlineUser {
  id: string;
  name: string;
  email: string;
  role: string;
  depot?: string;
  lastSeen: number; // timestamp ms
}

function write(user: OnlineUser) {
  try {
    const all: OnlineUser[] = JSON.parse(localStorage.getItem(KEY) || "[]");
    const others = all.filter(u => u.id !== user.id);
    localStorage.setItem(KEY, JSON.stringify([...others, { ...user, lastSeen: Date.now() }]));
  } catch { /**/ }
}

function remove(id: string) {
  try {
    const all: OnlineUser[] = JSON.parse(localStorage.getItem(KEY) || "[]");
    localStorage.setItem(KEY, JSON.stringify(all.filter(u => u.id !== id)));
  } catch { /**/ }
}

export function getOnlineUsers(): OnlineUser[] {
  try {
    const all: OnlineUser[] = JSON.parse(localStorage.getItem(KEY) || "[]");
    const cutoff = Date.now() - TTL;
    return all.filter(u => u.lastSeen > cutoff);
  } catch { return []; }
}

export function startTracking(user: OnlineUser): () => void {
  write(user);
  const interval = setInterval(() => write(user), HEARTBEAT);
  return () => {
    clearInterval(interval);
    remove(user.id);
  };
}
