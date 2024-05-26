import {PinoPretty} from 'pino-pretty'
const x = (opts) => PinoPretty({
  ...opts,
  messageFormat: (log, messageKey) => `hello ${log[messageKey]}`
})

export default x