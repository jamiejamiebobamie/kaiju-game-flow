export class TimeoutHandler {
    constructor() {
        this.timeouts = {};
        this.pauseAccTime = undefined;
    }

    reset() {
        Object.keys(this.timeouts).forEach(tRef => this.unregisterTimeout(tRef))
        this.timeouts = {};
        this.pauseAccTime = undefined;
    }

    registerTimeout = (accTime, callback, delay) => {
        const timeoutRef = setTimeout(() => {
            callback();
            this.unregisterTimeout(timeoutRef);
        }, delay);
        const timeout = { callback, delay, accTime, timeoutRef };
        this.timeouts[timeoutRef] = timeout;
        return timeoutRef;
    }

    unregisterTimeout = (timeoutRef) => {
        if (!!this.timeouts[timeoutRef]) {
            clearTimeout(timeoutRef);
            delete this.timeouts[timeoutRef];
        }
    }

    pauseTimeouts(accTime) {
        this.pauseAccTime = accTime;
        Object.values(this.timeouts).forEach(({ timeoutRef }) => clearTimeout(timeoutRef));
    }

    // TO-DO: FIX! broken...
    restartTimeouts(accTime) {
        const oldTimeouts = Object.values(this.timeouts);
        const newTimeouts = Object.values(this.timeouts).map(t => {
            const timePassedBeforePause = this.pauseAccTime - t.accTime;
            const updatedDelay = t.delay - timePassedBeforePause;
            return { accTime, callBack: t.callback, delay: updatedDelay };
        });

        Object.values(newTimeouts).forEach(({ accTime, callback, delay }) => this.registerTimeout(accTime, callback, delay));
        // Object.values(oldTimeouts).forEach(({ timeoutRef }) => this.unregisterTimeout(timeoutRef));

        this.pauseAccTime = undefined;
    }
}