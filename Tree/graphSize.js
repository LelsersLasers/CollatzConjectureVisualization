class GraphSize {

    static slideMinX;
    static slideMaxX;
    static slideMinY;
    static slideMaxY;

    static init() {
        this.slideMinX = new SlideEffect(0, 0);
        this.slideMaxX = new SlideEffect(1, 1);
        this.slideMinY = new SlideEffect(0, 0);
        this.slideMaxY = new SlideEffect(1, 1);
    }

    static update(delta) {
        this.slideMinX.update(delta);
        this.slideMaxX.update(delta);
        this.slideMinY.update(delta);
        this.slideMaxY.update(delta);
    }

    static getMinX = () => this.slideMinX.current;
    static getMaxX = () => this.slideMaxX.current;
    static getMinY = () => this.slideMinY.current;
    static getMaxY = () => this.slideMaxY.current;

    static setMinX = (value) => this.slideMinX = new SlideEffect(this.slideMinX.current, value);
    static setMaxX = (value) => this.slideMaxX = new SlideEffect(this.slideMaxX.current, value);
    static setMinY = (value) => this.slideMinY = new SlideEffect(this.slideMinY.current, value);
    static setMaxY = (value) => this.slideMaxY = new SlideEffect(this.slideMaxY.current, value);
}
