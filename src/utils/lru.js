import { LRUCache as _LRUCache } from 'lru-fast';

const makeEntry = (key, value) => ({
  key,
  value,
  older: undefined,
  newer: undefined,
});

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

  assign(entries, compare = () => true, keepOrigin = false) {
    if (!keepOrigin) {
      this._keymap = {};
    }

    if (!entries || entries.length === 0) {
      return;
    }

    const _entries = entries.filter(value => value !== null && value !== undefined);
    _entries.forEach(entry => {
      if (!this.oldest) {
        const _entry = makeEntry(entry.key, entry.value);
        this.oldest = _entry;
        this._keymap[entry.key] = _entry;
        return;
      }

      const existEntry = this._keymap[entry.key];
      if (existEntry) {
        // 이미 존재하는 Entry 있음
        if (compare(existEntry.value, entry.value)) {
          this._keymap[entry.key].value = entry.value;
        }
      } else {
        const newEntry = makeEntry(entry.key, entry.value);

        this.oldest.older = newEntry;
        newEntry.newer = this.oldest;
        this.oldest = newEntry;
        this._keymap[entry.key] = newEntry;
      }
    });

    this.size = Object.keys(this._keymap).length;
  }

  merge(entries, compare = () => true) {
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
}

export default LRUCache;
