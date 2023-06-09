class GraphSize {
    static slideEffectX;
    static slideEffectY;

    static init() {
        this.slideEffectX = new SlideEffect(SLIDE_START, SLIDE_START);
        this.slideEffectY = new SlideEffect(SLIDE_START, SLIDE_START);
    }

    static update(delta) {
        this.slideEffectX.update(delta);
        this.slideEffectY.update(delta);
    }

    static getX() {
        return this.slideEffectX.current;
    }
    static getY() {
        return this.slideEffectY.current;
    }

    static setX(x) {
        this.slideEffectX = new SlideEffect(this.slideEffectX.current, x);
    }
    static setY(y) {
        this.slideEffectY = new SlideEffect(this.slideEffectY.current, y);
    }
}