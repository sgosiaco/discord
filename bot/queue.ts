module.exports = class Queue {
    constructor(max) {
        this.makeEmpty();
        this.max = max === 0 ? 2147483647 : max; //set "uncapped max" at 2^31-1 for now
    }

    enqueue(item) {
        if (this.isFull()) return null;
        this.back = (this.back + 1) % this.max;
        this.items[this.back] = item;
        this.size += 1;
    }

    dequeue() {
        if (this.isEmpty()) return null;
        this.size -= 1;
        let item = this.items[this.front];
        this.front = (this.front + 1) % this.max;
        return item;
    }

    getFront() {
        if (this.isEmpty()) return null;
        return this.items[this.front];
    }

    getLast() {
        if (this.isEmpty()) return null;
        return this.items[this.back];
    }

    isEmpty() {
        return this.size === 0;
    }

    isFull() {
        return this.size === this.max;
    }

    getSize() {
        return this.size
    }

    makeEmpty() {
        this.items = [];
        this.front = 0;
        this.back = -1;
        this.size = 0;
    }
};