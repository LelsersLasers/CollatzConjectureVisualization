class SlideEffect {
    constructor(start, end) {
        this.start = start;
        this.end = end;

        this.current = start;
        this.timer = 0;
    }
    update(delta) {
        this.timer += delta;
        this.current = this.start + (this.timer / Settings.slideSpeed) * (this.end - this.start);
        if (this.timer > Settings.slideSpeed) {
            this.current = this.end;
        }
    }
}