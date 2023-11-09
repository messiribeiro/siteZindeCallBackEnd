class Node {
    constructor(value) {
      this.value = value;
      this.left = null;
      this.right = null;
    }
  }
  
  class BinarySearchTree {
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

      sortNode(ids) {
        const idsArray = new Set(ids);
        let nodeValue = null;
    
        const traverse = (node) => {
            if (node === null) return;
            if (!idsArray.has(node.value)) {
                nodeValue = node.value;
                return;
            }
            traverse(node.left);
            traverse(node.right);
        };
    
        traverse(this.root);
        return nodeValue;
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

    findMinNode(node) {
      if (node.left === null) {
        return node;
      } else {
        return this.findMinNode(node.left);
      }
    }
  }

  export default BinarySearchTree;