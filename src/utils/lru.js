import { LRUCache as _LRUCache } from 'lru-fast';

class LRUCache extends _LRUCache {
  constructor(limit, entries) {
    super(limit);

    if (entries) {
      if (limit < entries) {
        console.error('Overflow LRUCache');
        return;
      }

      this.assign(entries);
    }
  }

  assign(entries, compare = (oldValue, newValue) => true, keepOrigin = false) {
    if (!keepOrigin) {
      this._keymap = {};
    }

    if (!entries) {
      return;
    }

    entries.forEach(entry => {
      if (!this.oldest) {
        this.oldest = this._makeEntry(entry.key, entry.value);
        return;
      }

      const oldEntry = this._keymap[entry.key];

      if (oldEntry) {
        // 이미 존재하는 Entry 있음
        if (compare(oldEntry.value, entry.value)) {
          this._keymap[entry.key].value = entry.value;
        }
      } else {
        const newEntry = this._makeEntry(entry.key, entry.value);

        this.oldest.older = newEntry;
        newEntry.newer = this.oldest;
        this.oldest = newEntry;
      }
    });

    this.size = Object.keys(this._keymap).length;
  }

  merge(entries, compare = (oldValue, newValue) => true) {
    entries.forEach(entry => {
      const oldEntry = this._keymap[entry.key];

      if (oldEntry) {
        if (compare(oldEntry.value, entry.value)) {
          this.put(entry.key, entry.value);
        } else {
          this.put(entry.key, oldEntry.value);
        }
      } else {
        this.put(entry.key, entry.value);
      }
    });
  }

  _makeEntry(key, value) {
    return { key, value, older: undefined, newer: undefined };
  }
}

export default LRUCache;
