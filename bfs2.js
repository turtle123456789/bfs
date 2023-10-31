const graph = {
    S: { A: 3, B: 9, C: 9 },
    A: { B: 4, D: 5, S: 3 },
    B: { A: 4, C: 4, D: 4, E: 3, S: 9 },
    C: { S: 9, B: 4, F: 7, G: 7 },
    D: { A: 5, B: 4, E: 3 },
    E: { B: 3, D: 3, G: 3},
    G: { E: 3, C: 7, F: 5},
    F: { G: 5, C: 7},
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
    const queue = [{ vertex: start, weight: 0, path: [start] }];
    const visited = new Set();
    const resultList = document.querySelector('.Result');
    const pathList = document.querySelector('.Path');
    let colNo = -1; // Column sequence number
    let foundPath = null;

    // Add a starting column
    resultList.appendChild(createColumnTemplate(++colNo, '', start, 0));

    while (queue.length) {
        queue.sort((a, b) => a.weight - b.weight);
        const { vertex, weight, path } = queue.shift();
        const expandedInfo = `${vertex}(${weight})`;

        if (vertex === end) {
            foundPath = path;
            resultList.appendChild(createColumnTemplate(++colNo, expandedInfo, '', weight));
            break;
        }

        if (!visited.has(vertex)) {
            visited.add(vertex);

            const frontierInfo = [];

            for (const neighbor in graph[vertex]) {
                if (!visited.has(neighbor)) {
                    const newPath = [...path, neighbor];
                    queue.push({ vertex: neighbor, weight: weight + graph[vertex][neighbor], path: newPath });

                    frontierInfo.push(neighbor);
                }
            }

            resultList.appendChild(createColumnTemplate(++colNo, expandedInfo, frontierInfo.join(', '), weight));
        }
    }

    if (foundPath) {
        const pathString = foundPath.join(' -> ');
        pathList.innerHTML = `${pathString}`;
    }
}


bfs(graph, 'S', 'G');
