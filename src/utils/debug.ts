export let warn: (msg: string, source: any) => void
export let error: (msg: string, source: any) => void

if (__DEV__) {
    warn = (msg: string, source: any) => {
        console.warn(`[DdBind-warn]: at ${source} \n ${msg}`)
    }
    error = (msg: string, source: any) => {
        console.error(`[DdBind-error]: at ${source} \n ${msg}`)
    }
}