export interface DdBindOptions {
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

