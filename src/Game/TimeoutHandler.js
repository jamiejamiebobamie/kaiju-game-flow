export class TimeoutHandler {
    constructor() {
        this.timeouts = {};
        this.pauseAccTime = undefined;
    }

    registerTimeout(accTime, callback, delay) {
        const timeoutRef = setTimeout(() => {
            callback();
            this.unregisterTimeout(timeoutRef);
        }, delay);
        const timeout = { callback, delay, accTime, timeoutRef };
        this.timeouts[timeoutRef] = timeout;
        return timeoutRef;
    }

    unregisterTimeout(timeoutRef) {
        if (!!this.timeouts[timeoutRef]) {
            delete this.timeouts[timeoutRef];
        }
    }

    pauseTimeouts(accTime) {
        this.pauseAccTime = accTime;
        Object.values(this.timeouts).forEach(({ timeoutRef }) => clearTimeout(timeoutRef));
    }

    restartTimeouts(accTime) {
        const timeouts = structuredClone(this.timeouts);
        Object.values(this.timeouts).forEach(({ timeoutRef }) => this.unregisterTimeout(timeoutRef));

        Object.values(timeouts).forEach(t => {
            const timePassedBeforePause = this.pauseAccTime - t.accTime;
            const updatedDelay = t.delay - timePassedBeforePause;
            registerTimeout(accTime, t.callback, updatedDelay);
        });

        this.pauseAccTime = undefined;
    }
}