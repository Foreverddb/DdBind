export interface DdBindOptions {

    template?: string
    setup: () => object

    onMounted: () => any

    data: () => object

    methods: {
        [propName: string]: Function
    }

    computed: {
        [propName: string]: Function
    }

    watch: {
        [propName: string]: Function
    }
}

