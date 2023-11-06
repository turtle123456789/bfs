// Định nghĩa hàm tạo một đối tượng nút với các thuộc tính state, parent, action, và pCost
function createNode(state, parent = null, action = null, pCost = 0) {
    return {
      State: state,
      Parent: parent,
      Action: action,
      PCost: pCost,
    };
  }
  
  // Khởi tạo biến inputData là chuỗi rỗng
  const inputData = '';
  
  // Định nghĩa hàm để tạo hàng đợi ưu dựa trên hàm so sánh
  function createPriorityQueue(compareFunction) {
    const queue = [];
  
    return {
      // Thêm một phần tử vào hàng đợi ưu
      enqueue: function (element) {
        if (this.isEmpty()) {
          queue.push(element);
        } else {
          let added = false;
          for (let i = 0; i < queue.length; i++) {
            if (compareFunction(element, queue[i]) < 0) {
              queue.splice(i, 0, element);
              added = true;
              break;
            }
          }
          if (!added) {
            queue.push(element);
          }
        }
      },
      // Loại bỏ và trả về phần tử từ đầu hàng đợi
      dequeue: function () {
        return queue.shift();
      },
      // Kiểm tra xem hàng đợi có rỗng không
      isEmpty: function () {
        return queue.length === 0;
      },
    };
  }
  
  // Định nghĩa hàm parseInput để phân tích dữ liệu đầu vào thành biểu đồ
  function parseInput(input) {
    const lines = input.split("\n");
    const graph = {};
  
    let startNode, endNode;
    lines.forEach((line) => {
      const parts = line.trim().split(" ");
      if (parts[0] === "startNode") {
        startNode = parts[1];
      } else if (parts[0] === "endNode") {
        endNode = parts[1];
      } else if (parts[0] === "edge") {
        const [from, to, cost] = parts.slice(1);
        if (!graph[from]) {
          graph[from] = {};
        }
        graph[from][to] = parseInt(cost);
        if (!graph[to]) {
          graph[to] = {};
        }
        graph[to][from] = parseInt(cost);
      }
    });
    addRow('', `${startNode}`);
    return { startNode, endNode, graph };
  }
  
  // Định nghĩa hàm expand để mở rộng các nút con từ nút hiện tại
  function expand(problem, node) {
    const nodes = [];
    const s = node.State;
    const actions = problem.graph[s];
  
    if (actions) {
      for (let action in actions) {
        const sPrime = action;
        const cost = node.PCost + actions[action];
        if (!node.Parent || sPrime !== node.Parent.State) {
          const childNode = createNode(sPrime, node, action, cost);
          nodes.push(childNode);
        }
      }
    }
  
    return nodes;
  }
  
  // Khởi tạo một mảng nodes2 để theo dõi nút đã mở rộng
  const nodes2 = [];
  
  // Định nghĩa hàm expand2 để mở rộng các nút con và lưu vào mảng nodes2
  function expand2(problem, node) {
    const s = node.State;
    const actions = problem.graph[s];
  
    if (actions) {
      for (let action in actions) {
        const sPrime = action;
        const cost = node.PCost + actions[action];
        if (!node.Parent || sPrime !== node.Parent.State) {
          const childNode = createNode(sPrime, node, action, cost);
          nodes2.push(childNode);
        }
      }
    }
  
    return nodes2;
  }
  
  // Định nghĩa hàm bestFirstSearch để thực hiện tìm kiếm theo thuật toán Best-First
  function bestFirstSearch(problem, f) {
    const frontier = createPriorityQueue((a, b) => f(a) - f(b));
    const startNode = createNode(problem.startNode);
    frontier.enqueue(startNode);
    const reached = {};
    reached[problem.startNode] = startNode;
    const steps = [];
  
    while (!frontier.isEmpty()) {
      const node = frontier.dequeue();
      steps.push(node);
  
      if (problem.endNode === node.State) {
        return steps;
      }
  
      const children = expand(problem, node);
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const s = child.State;
  
        if (!(s in reached) || child.PCost < reached[s].PCost) {
          reached[s] = child;
          frontier.enqueue(child);
        }
      }
  
      // Xóa các nút con có trọng số lớn hơn so với nút hiện tại
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        if (step.PCost > node.PCost) {
          const index = frontier.findIndex((item) => item.State === step.State);
          if (index !== -1) {
            frontier.splice(index, 1);
          }
          delete reached[step.State];
        }
      }
    }
  
    return steps;
  }
  
  // Khởi tạo biến currentNo với giá trị ban đầu là 0
  let currentNo = 0;
  
  // Định nghĩa hàm addRow để thêm một hàng mới vào danh sách kết quả
  function addRow(Expanded, Frontier) {
    // Lấy mẫu từ template
    const template = document.querySelector('#col-template');
  
    // Sao chép mẫu để tạo một bản sao mới
    const newRow = document.importNode(template.content, true);
  
    // Cập nhật giá trị của các phần tử trong dòng mới
    newRow.querySelector('.No').textContent = currentNo; // Thiết lập giá trị của currentNo
    newRow.querySelector('.Expanded').textContent = Expanded;
    newRow.querySelector('.Frontier').textContent = Frontier;
  
    // Thêm dòng mới vào danh sách kết quả
    const result = document.querySelector('.Result');
    result.appendChild(newRow);
  
    currentNo++; // Tăng giá trị của currentNo cho hàng tiếp theo
  }
  
  // Định nghĩa hàm executeSearch để thực hiện tìm kiếm
  function executeSearch() {
    currentNo = 0;
    const inputDataElement = document.getElementById('inputData');
    const userInput = inputDataElement.value;
    const resultElement = document.querySelector('.Result');
    resultElement.innerHTML = '';
  
    // Xóa đường đi hiện tại
    const pathElement = document.querySelector('.Path');
    pathElement.innerHTML = '';
    try {
      const problem = parseInput(userInput);
      const steps = bestFirstSearch(problem, (node) => node.PCost);
      if (steps && steps.length > 0) {
        const seenStates = {}; // Đối tượng để theo dõi các trạng thái đã xuất hiện
        const stepOfQueue = [];
  
        steps.forEach((step) => {
          const currentState = step.State;
          const currentPCost = step.PCost;
          // Kiểm tra xem trạng thái đã xuất hiện chưa và giữ lại bước có chi phí nhỏ nhất
          if (
            !seenStates[currentState] ||
            currentPCost < seenStates[currentState].PCost
          ) {
            seenStates[currentState] = step;
          }
        });
  
        // In ra các bước đã lọc
        // console.log("Expanded: Frontier [Priority Queue]");
        Object.values(seenStates).forEach((step) => {
          const childNodes = expand2(problem, step); // Gọi hàm expand2 của bạn
          for (let i = 0; i < childNodes.length; i++) {
            if (
              //   `${step.State}(${step.PCost})` ===
              //   `${childNodes[i].State}(${childNodes[i].PCost})`
              `${step.State}` === `${childNodes[i].State}`
            ) {
              childNodes.splice(i, 1);
              i--;
              //   console.log("123");
            }
          }
  
          //   console.log("steps", stepOfQueue);
          //   console.log("childnode", childNodes);
  
          stepOfQueue.push(step);
          for (let i = 0; i < stepOfQueue.length; i++) {
            if (stepOfQueue[i].State !== undefined) {
              for (let j = 0; j < childNodes.length; j++) {
                if (childNodes[j].State === stepOfQueue[i].State) {
                  childNodes.splice(j, 1);
                  j--;
                }
              }
            }
          }
          //   console.log("steps", stepOfQueue);
          //   console.log("childnode", childNodes);
          const childNodeInfo = childNodes
            .map((node) => `${node.State}(${node.PCost})`)
            .join(" ");
          //   console.log(`${step.State}(${step.PCost}):     ${childNodeInfo}`);
          addRow(`${step.State}(${step.PCost})`, `${childNodeInfo}`);
          for (let i = 0; i < childNodes.length; i++) {
            let currentNode = childNodes[i];
            for (let j = i + 1; j < childNodes.length; j++) {
              let compareNode = childNodes[j];
              if (
                currentNode.State === compareNode.State &&
                currentNode.PCost > compareNode.PCost
              ) {
                childNodes.splice(i, 1);
                i--;
              }
            }
          }
          //   console.log("childNodes", childNodes);
        });
  
        const result = steps[steps.length - 1];
        const path = [];
        let currentNode = result;
        const pathElement = document.querySelector('.Path');
        while (currentNode !== null) {
          path.unshift(`${currentNode.State}(${currentNode.PCost})`);
          currentNode = currentNode.Parent;
        }
        pathElement.innerHTML = "Đường đi: " + path.join(" → ") + "<br>Tổng trọng số:" + result.PCost;
  
        // console.log(`\nĐường đi: ${path.join(" → ")}`);
        // console.log(`Trọng số: ${result.PCost}`);
      }
    } catch (error) {
      console.error("Đã xảy ra lỗi khi đọc dữ liệu từ tệp văn bản:", error);
    }
  }
  