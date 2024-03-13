import { createStore} from './core.js'
import reducer from './reducer.js'
import withLogger from './logger.js'

const { attach, connect, dispatch} = createStore(withLogger(reducer))

// Global variable
window.dispatch = dispatch

 export {
    attach,
    connect
 }