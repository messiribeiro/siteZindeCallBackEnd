class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class usersConnecteds {
  constructor() {
    this.root = null;
  }


  showValues() {
    const valores = [];
    const percorrerEmOrdem = (node) => {
      if (node !== null) {
        percorrerEmOrdem(node.left);
        valores.push(node.value);
        percorrerEmOrdem(node.right);
      }
    };
    percorrerEmOrdem(this.root);
    return valores;
  }

  sortNode(arr) {
    const presentValues = this.showValues();
    const valuesNotInArray = presentValues.filter((val) => !arr.includes(val));

    if (valuesNotInArray.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * valuesNotInArray.length);
    return valuesNotInArray[randomIndex];
  }


  remove(value) {
    this.root = this.removeNode(this.root, value);
  }

  removeNode(node, key) {
    if (node === null) {
      return null;
    } else if (key < node.value) {
      node.left = this.removeNode(node.left, key);
      return node;
    } else if (key > node.value) {
      node.right = this.removeNode(node.right, key);
      return node;
    } else {
      // Caso 1: Nó folha
      if (node.left === null && node.right === null) {
        node = null;
        return node;
      }
      // Caso 2: Nó com apenas um filho
      if (node.left === null) {
        node = node.right;
        return node;
      } else if (node.right === null) {
        node = node.left;
        return node;
      }
      // Caso 3: Nó com dois filhos
      const aux = this.findMinNode(node.right);
      node.value = aux.value;
      node.right = this.removeNode(node.right, aux.value);
      return node;
    }
  }

  insert(value) {
    const newNode = new Node(value);
    if (this.root === null) {
      this.root = newNode;
    } else {
      this.insertNode(this.root, newNode);
    }
  }

  insertNode(node, newNode) {
    if (newNode.value < node.value) {
      if (node.left === null) {
        node.left = newNode;
      } else {
        this.insertNode(node.left, newNode);
      }
    } else {
      if (node.right === null) {
        node.right = newNode;
      } else {
        this.insertNode(node.right, newNode);
      }
    }
  }

  search(value) {
    return this.searchNode(this.root, value);
  }

  searchNode(node, value) {
    if (node === null) {
      return false;
    }
    if (value < node.value) {
      return this.searchNode(node.left, value);
    } else if (value > node.value) {
      return this.searchNode(node.right, value);
    } else {
      return true;
    }
  }
}

export default usersConnecteds;