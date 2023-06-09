class CollatzNumber {
    constructor(number) {
        this.number = number;
        this.start = number;
        this.history = [number];

        this.color = randomColor();
    }

    next() {
        if (this.number % 2 === 0) {
            this.number = this.number / 2;
        } else {
            this.number = (this.number * 3) + 1;
        }
        this.history.push(this.number);
        return this.number;
    }

    finished() {
        return this.number === 1;
    }
}