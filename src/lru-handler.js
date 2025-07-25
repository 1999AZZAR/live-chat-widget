// LRU Cache implementation

// Simple synchronous hash function (FNV-1a variant)
function simpleHash(str) {
  let hash = 5381, i = str.length;
  while(i) hash = (hash * 33) ^ str.charCodeAt(--i);
  return (hash >>> 0).toString(16);
}

class LRUCache {
  constructor(options = {}) {
    this.calculateItemWeight = options.calculateItemWeight || null;

    if (this.calculateItemWeight && options.maxWeight != null && options.maxWeight > 0) {
      this.isWeightedMode = true;
      this.maxWeight = options.maxWeight;
      this.maxSize = Infinity; // In weighted mode, item count is not directly limited by maxSize
    } else {
      this.isWeightedMode = false;
      this.maxSize = options.maxSize || 50; // Default item count if not weighted
      this.maxWeight = Infinity; // In item count mode, total weight is not limited
    }

    this.ttl = options.ttl || 0; // TTL in seconds, 0 = no expiration
    this.hits = 0;
    this.misses = 0;

    this.cache = new Map(); // Stores key -> { value, weight, next, prev }
    this.currentWeight = 0;
    
    // Initialize LRU tracking pointers
    this.head = null; // Most recently used
    this.tail = null; // Least recently used
  }

  // Generate a cache key from messages - robust version
  static generateKey(messages, options = {}) {
    // Normalize, trim, lowercase, and hash
    const len = messages.length;
    if (len === 0) return '';
    let keyParts = [];
    const startIndex = Math.max(0, len - 3);
    for (let i = startIndex; i < len; i++) {
      const msg = messages[i];
      // Normalize: trim, lowercase, collapse whitespace
      let content = msg.content || '';
      content = content.replace(/\s+/g, ' ').trim().toLowerCase();
      keyParts.push(`${msg.role}:${content}`);
    }
    const rawKey = keyParts.join('|');
    // Use simpleHash for compatibility
    const hash = simpleHash(rawKey);
    return hash;
  }

  // Check if a key exists and is valid (not expired)
  has(key) {
    const node = this.cache.get(key);
    if (!node) return false;
    if (this.ttl > 0 && node.timestamp) {
      const now = Date.now();
      if (now - node.timestamp > this.ttl * 1000) {
        this._removeItem(key);
        return false;
      }
    }
    return true;
  }

  // Move a node to the front of the list (most recently used)
  _moveToFront(node) {
    if (node === this.head) {
      // Already at front
      return;
    }

    if (node === this.tail) {
      // If it's the tail, update tail pointer
      this.tail = node.prev;
      if (this.tail) this.tail.next = null;
    } else {
      // Remove from current position in list
      if (node.prev) node.prev.next = node.next;
      if (node.next) node.next.prev = node.prev;
    }

    // Insert at the front
    node.next = this.head;
    node.prev = null;
    if (this.head) this.head.prev = node;
    this.head = node;
    
    // If this is the only node, it's also the tail
    if (!this.tail) this.tail = node;
  }

  // Add a node to the front of the list
  _addToFront(node) {
    node.next = this.head;
    node.prev = null;
    
    if (this.head) {
      this.head.prev = node;
    }
    
    this.head = node;
    
    // If this is the first node, it's also the tail
    if (!this.tail) {
      this.tail = node;
    }
  }

  // Remove a node from the linked list
  _removeNode(node) {
    if (node === this.head) {
      this.head = node.next;
      if (this.head) this.head.prev = null;
    } else if (node === this.tail) {
      this.tail = node.prev;
      if (this.tail) this.tail.next = null;
    } else {
      node.prev.next = node.next;
      node.next.prev = node.prev;
    }
  }

  // Get a value from cache
  get(key) {
    const node = this.cache.get(key);
    if (!node) {
      this.misses++;
      return null;
    }
    if (this.ttl > 0 && node.timestamp) {
      const now = Date.now();
      if (now - node.timestamp > this.ttl * 1000) {
        this._removeItem(key);
        this.misses++;
        return null;
      }
    }
    this.hits++;
    this._moveToFront(node);
    return node.value;
  }

  // Set a value in cache
  set(key, value) {
    // Calculate weight if in weighted mode
    let itemWeight = this.isWeightedMode ? this.calculateItemWeight(value) : 0;
    
    // Check if item is too large for cache
    if (this.isWeightedMode && itemWeight > this.maxWeight) {
      // If updating existing entry, remove it
      if (this.cache.has(key)) {
        this._removeItem(key);
      }
      return;
    }

    // If key already exists, update it
    if (this.cache.has(key)) {
      const existingNode = this.cache.get(key);
      const oldWeight = existingNode.weight;
      
      // Update value and weight
      existingNode.value = value;
      existingNode.weight = itemWeight;
      
      // Update total weight
      if (this.isWeightedMode) {
        this.currentWeight = this.currentWeight - oldWeight + itemWeight;
      }
      
      // Move to front of LRU list
      this._moveToFront(existingNode);
      return;
    }
    
    // Create new cache node
    const newNode = { key, value, weight: itemWeight, timestamp: this.ttl > 0 ? Date.now() : undefined };
    
    // Make space if needed (different strategy for weighted vs. count modes)
    if (this.isWeightedMode) {
      // Batch eviction for weighted mode
      this._makeSpaceForWeight(itemWeight);
    } else if (this.cache.size >= this.maxSize) {
      // Evict LRU item for count mode
      this._evictLRU();
    }
    
    // Add the node
    this.cache.set(key, newNode);
    this._addToFront(newNode);
    
    // Update weight counter
    if (this.isWeightedMode) {
      this.currentWeight += itemWeight;
    }
  }

  // Make space for a new item of given weight
  _makeSpaceForWeight(requiredWeight) {
    // Return early if we already have enough space
    if (this.currentWeight + requiredWeight <= this.maxWeight) return;
    
    // Batch remove from the tail until we have enough space or the cache is empty
    while (this.tail && (this.currentWeight + requiredWeight > this.maxWeight)) {
      const tailNode = this.tail;
      const tailWeight = tailNode.weight || 0;
      
      // Update pointers
      this.tail = tailNode.prev;
      if (this.tail) {
        this.tail.next = null;
      } else {
        // Cache became empty
        this.head = null;
      }
      
      // Remove from Map
      this.cache.delete(tailNode.key);
      
      // Update weight
      this.currentWeight -= tailWeight;
    }
  }

  // Remove least recently used item
  _evictLRU() {
    if (!this.tail) return; // Nothing to evict
    
    const tailKey = this.tail.key;
    
    // Update pointers
    this.tail = this.tail.prev;
    if (this.tail) {
      this.tail.next = null;
    } else {
      // Cache became empty
      this.head = null;
    }
    
    // Remove from Map
    this.cache.delete(tailKey);
  }
  
  // Remove specific item
  _removeItem(key) {
    const node = this.cache.get(key);
    if (!node) return false;
    
    // Update weight
    if (this.isWeightedMode && node.weight) {
      this.currentWeight -= node.weight;
    }
    
    // Remove from linked list
    this._removeNode(node);
    
    // Remove from Map
    this.cache.delete(key);
    
    return true;
  }

  // Clear the entire cache
  clear() {
    this.cache.clear();
    this.head = null;
    this.tail = null;
    this.currentWeight = 0;
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      maxWeight: this.maxWeight,
      currentWeight: this.currentWeight,
      hits: this.hits,
      misses: this.misses,
      ttl: this.ttl
    };
  }
}

// Create a global memory cache instance using weighted strategy and TTL (e.g., 1 hour)
const memoryCache = new LRUCache({
  maxWeight: 10 * 1024 * 1024, // 10MB
  calculateItemWeight: (value) => {
    if (typeof value === 'string') {
      return value.length;
    } else if (value && typeof value === 'object') {
      try {
        return JSON.stringify(value).length;
      } catch (e) {
        return 1024;
      }
    }
    return 1;
  },
  ttl: 3600 // 1 hour TTL
});

// Only export once at the end
export { LRUCache, memoryCache };
export function getMemoryCacheStats() {
  return memoryCache.getStats();
} 