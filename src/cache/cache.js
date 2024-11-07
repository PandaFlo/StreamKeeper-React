class Cache {
    constructor() {
      this.cache = new Map();
    }
  
    generateKey(command, query) {
      return `${command}_${JSON.stringify(query)}`;
    }
  
    set(command, query, value) {
      const key = this.generateKey(command, query);
      this.cache.set(key, value);
    }
  
    get(command, query) {
      const key = this.generateKey(command, query);
      return this.cache.get(key);
    }
  
    has(command, query) {
      const key = this.generateKey(command, query);
      return this.cache.has(key);
    }
  
    clear() {
      this.cache.clear();
    }
  }
  
  export default Cache;
  