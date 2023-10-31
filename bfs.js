const weightedGraph = {
    'S': { 'A': 3, 'B': 9, 'C': 9 },
    'A': { 'B': 4, 'D': 5, 'S': 3 },
    'B': { 'A': 4, 'C': 4, 'D': 4, E: 3, S: 9 },
    'C': { 'S': 9, 'B': 4, 'F': 7, G: 7 },
    'D': { 'A': 5, 'B': 4, 'E': 3 },
    'E': { 'B': 3, 'D': 3, 'G': 3},
    'G': { 'E': 3, 'C': 7, 'F': 5},
    'F': { 'G': 5, 'C': 7},
  };
function createColumnTemplate(colNo, expandedInfo, frontierInfo) {
    const colTemplate = document.getElementById('col-template');
    const colClone = document.importNode(colTemplate.content, true);
    colClone.querySelector('.No').textContent = colNo;
    colClone.querySelector('.Expanded').textContent = expandedInfo;
    colClone.querySelector('.Frontier').textContent = frontierInfo;
    return colClone;
}
function bfs(graph, start, end) {
    const queue = [{ node: start, pathWeight: 0 }];
    const visited = new Set();
    const path = {};
    const pathWeight = {};
    let colNo = -1; // Column sequence number
    resultList.appendChild(createColumnTemplate(++colNo, '', start, 0));
    while (queue.length) {
      queue.sort((a, b) => pathWeight[a.node] - pathWeight[b.node]); // Sắp xếp hàng đợi theo trọng số đường đi tăng dần
      const { node, pathWeight: currentWeight } = queue.shift();
  
      if (!visited.has(node)) {
        visited.add(node);
  
        if (node === end) {
          let current = end;
          const pathList = [end];
  
          while (current !== start) {
            const previous = path[current];
            pathList.push(previous);
            current = previous;
          }
  
          pathList.reverse();
          return { path: pathList, pathWeight: currentWeight, adjacencyList: graph };
        }
  
        for (const neighbor of Object.keys(graph[node])) {
          const weight = graph[node][neighbor];
          const totalWeight = currentWeight + weight;
  
          if (!visited.has(neighbor) && (!pathWeight[neighbor] || totalWeight < pathWeight[neighbor])) {
            pathWeight[neighbor] = totalWeight;
            queue.push({ node: neighbor, pathWeight: totalWeight });
            path[neighbor] = node;
          }
        }
      }
    }
  
    return { path: [], pathWeight: 0, adjacencyList: graph };
  }
  
  const start = 'A';
  const end = 'F';
  const { path, pathWeight, adjacencyList } = bfs(weightedGraph, start, end);
  
  console.log('Danh sách kề:', adjacencyList);
  console.log('Đường đi từ', start, 'đến', end, ':', path);
  console.log('Tổng trọng số:', pathWeight);
  