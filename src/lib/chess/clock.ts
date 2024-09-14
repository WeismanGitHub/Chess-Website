export default class Clock {
    public whiteSeconds: number
    public blackSeconds: number

    public current: 'black' | 'white' = 'white'

    private interval: NodeJS.Timer | null = null
    private callback: Function

    constructor(seconds: number, callback: Function) {
        if (seconds <= 0) {
            throw new Error(`${seconds} is an invalid amount of time.`)
        }

        this.whiteSeconds = seconds
        this.blackSeconds = seconds
        this.callback = callback
    }

    public start() {
        if (this.interval) {
            throw new Error('Clock already started.')
        }

        this.interval = setInterval(() => {
            if ((this.whiteSeconds === 0 || this.blackSeconds === 0) && this.interval) {
                this.callback()
                this.end()
            }

            if (this.current === 'white') {
                this.whiteSeconds -= 1
            } else {
                this.blackSeconds -= 1
            }
        }, 1000)
    }

    public switch() {
        this.current = this.current === 'white' ? 'black' : 'white'
    }

    public end() {
        if (!this.interval) {
            throw new Error("The clock hasn't been started.")
        }

        clearInterval(this.interval)
    }
}
