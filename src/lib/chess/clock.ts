export default class Clock {
    public whiteSeconds: number
    public blackSeconds: number

    public current: 'black' | 'white' = 'white'

    private interval: NodeJS.Timer | null = null

    constructor(seconds: number) {
        if (seconds <= 0) {
            throw new Error(`${seconds} is an invalid amount of time.`)
        }

        this.whiteSeconds = seconds
        this.blackSeconds = seconds
    }

    public start() {
        if (this.interval) {
            throw new Error('Clock already started.')
        }

        this.interval = setInterval(() => {
            if ((this.whiteSeconds === 0 || this.blackSeconds === 0) && this.interval) {
                return clearInterval(this.interval)
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
}
