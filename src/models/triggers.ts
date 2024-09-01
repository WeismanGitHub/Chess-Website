import { Events } from 'discord.js'

// By adding a type property I'm making it more flexible for future additions like a 'cronjob' type maybe.
export interface ITrigger {
    type: 'event'
}

export interface IEventTrigger extends ITrigger {
    event: Events
}
