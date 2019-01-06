class EventHub {
    constructor() {
        this.callbacks = []
    }

    listen(eventName, callback) {
        if (!this.callbacks[eventName]) {
            this.callbacks[eventName] = []
        }

        this.callbacks[eventName].push(callback)
        console.log(this.callbacks);
    }

    trigger(eventName, data) {
        this.callbacks[eventName].forEach((callback) => {
            callback(data)
        })
    }
}