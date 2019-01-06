class EventHub {
    constructor() {
        this.callbacks = []
    }

    listen(eventName, callback) {
        if (!this.callbacks[eventName]) {
            this.callbacks[eventName] = []
        }

        this.callbacks[eventName].push(callback)
    }

    trigger(eventName, data) {
        this.callbacks[eventName].forEach((callback) => {
            callback(data)
        })
    }
}