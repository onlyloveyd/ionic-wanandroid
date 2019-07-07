export class Queue<T> {
    items: T[] = [];

    enqueue(element: T) {
        this.items.push(element);
    }

    dequeue() {
        return this.items.shift();
    }

    front(): any {
        return this.items[0];
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    size(): number {
        return this.items.length;
    }

    clear() {
        this.items.length = 0;
    }

    getItems(): T[] {
        return this.items;
    }

    setItems(data: T[]) {
        this.items = data;
    }

}
