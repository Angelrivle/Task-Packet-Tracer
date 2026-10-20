// Helper de enrutamiento y búsqueda de caminos físicos en la topología LAN

export const ADJACENCY_MAP = {
  'R1': ['SW-CORE'],
  'SRV-01': ['SW-CORE'],
  'SW-CORE': ['R1', 'SRV-01', 'SW-ACC-01', 'SW-ACC-02'],
  'SW-ACC-01': ['SW-CORE', 'PC-01', 'PC-02', 'PC-03', 'PC-04', 'PC-05'],
  'SW-ACC-02': ['SW-CORE', 'PC-06', 'PC-07', 'PC-08', 'PC-09', 'PC-10'],
  'PC-01': ['SW-ACC-01'],
  'PC-02': ['SW-ACC-01'],
  'PC-03': ['SW-ACC-01'],
  'PC-04': ['SW-ACC-01'],
  'PC-05': ['SW-ACC-01'],
  'PC-06': ['SW-ACC-02'],
  'PC-07': ['SW-ACC-02'],
  'PC-08': ['SW-ACC-02'],
  'PC-09': ['SW-ACC-02'],
  'PC-10': ['SW-ACC-02'],
};

// Algoritmo BFS para encontrar la ruta física exacta de saltos entre dos nodos cualesquiera
export function findPath(fromId, toId) {
  if (fromId === toId) return [fromId];
  
  const queue = [[fromId]];
  const visited = new Set([fromId]);

  while (queue.length > 0) {
    const path = queue.shift();
    const current = path[path.length - 1];

    const neighbors = ADJACENCY_MAP[current] || [];
    for (const neighbor of neighbors) {
      if (neighbor === toId) {
        return [...path, neighbor];
      }
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([...path, neighbor]);
      }
    }
  }

  return [];
}

// Convierte un camino de nodos ['PC-01', 'SW-ACC-01', 'SW-CORE'] en saltos físicos individuales
export function pathToHops(path) {
  const hops = [];
  for (let i = 0; i < path.length - 1; i++) {
    hops.push({
      from: path[i],
      to: path[i + 1],
    });
  }
  return hops;
}
