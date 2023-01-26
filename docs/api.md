# API文档

## 应用实例

### createApp()

签名：`function createApp(options: DdBindOptions): DdBindVm`

通过传入的[DdBindOptions](#ddbindoptions)选项参数构建生成[DdBindVm](#ddbindvm)应用实例。

example:

```typescript
const app = createApp({
    setup() {
        return {
            foo: ref('bar')
        }
    }
})
app.mount('#app')
```

应用实例当且仅当调用了 `.mount()` 方法后才会渲染出来，并将覆盖指定的容器DOM。其选项中的响应式数据和方法也仅当 `.mount()`
方法调用后才能使用。

本框架暂未实现多根节点挂载，因此要求容器DOM第一层元素仅包含一个节点，形如：

```html
<div id="app">
  <div><!-- 此div内的元素会被成功挂载 -->
  	<h1>{{ foo }}</h1>
  </div>
</div>
```

### DdBindVm

应用实例对象，任何在构建选项中声明的data、methods、computed、watch都将挂载于此对象上，可通过this进行访问。在构建选项作用域外通过[createApp()](#createApp())
创建的应用实例进行访问。

### DdBindVm.mount()

签名：`function mount(el?: string | HTMLElement)`

唯一参数为应用需要挂载的目标DOM或其selector，当此参数不存在时默认挂载到document.body节点。

请注意：挂载目标节点中第一层元素仅能包含一个根元素。

### DdBindOptions

#### template

签名：`template?: string`

可选，挂载目标的HTML模版，当存在此属性时则会使用此模版覆盖目标DOM，否则使用`DdBindVm.mount()`方法传入参数的innerHTML。

#### data()

签名：`data?: () => object`

可选，需要一个对象作为返回值，其返回值会被自动转化为响应式对象并挂载到应用实例上，并能用于文本插值和指令。

example:

```typescript
const app = createApp({
    data() {
        return {
            foo: 'bar'
        }
    }
})
app.mount('#app')

app.foo
// 'bar'
```

#### methods

签名：`methods?: { [propName: string]: Function }`

可选，一个属性值为函数的对象。此对象内所有方法将被挂载到应用实例上，并能在文本插值和指令中使用。

#### computed

签名：`computed?: { [propName: string]: Function }`

可选，一个属性值为函数的对象。此对象内所有方法将作为计算属性挂载到应用实例上，并能在文本插值和指令中使用。

#### watch

签名：`watch?: { [propName: string]: Function }`

可选，一个属性值为函数的对象。此对象内所有函数名都应是响应式变量名，其会根据其名称监听挂载到应用实例上的变量，在变量发生变化时触发其函数内容。

example:

```typescript
const app = createApp({
    data() {
        return {
            foo: 'bar'
        }
    },
    watch: {
        foo(newVal, oldVal) {
            console.log(newVal)
        }
    }
})
app.mount('#app')
```

#### Setup()

签名：`setup?: () => object`

返回一个包含了应用所需响应式数据、方法、计算属性的对象，符合Vue3的setup语法。

返回值将被挂载到应用实例上，并能在文本插值和指令中使用。

注意，在setup中返回值不会主动转化为响应式值，应手动转化。

example:

```typescript
const app = createApp({
    setup() {
        return {
            foo: ref('bar'),
          	func() {
              	console.log(this.foo)
            },
          	computedVal: computed(() => {
              	return 'foo' + this.foo
            })
        }
    }
})
app.mount('#app')
```

#### onMounted()

签名：`onMounted?: () => any`

注册一个生命周期钩子，此钩子函数将在应用实例成功挂载到目标DOM上后执行。

## 核心模块

### watchEffect()

签名：`function watchEffect(func: () => any, options: EffectOption = {}): EffectFunction`

立刻运行传入的函数，响应式地追踪函数依赖，并在其依赖更改时重新执行。

第一个参数为需要运行的副作用函数，第二个参数为可选选项[EffectOption](#effectoption)，用来调整副作用函数执行时机。

正常使用：

```typescript
const count = ref(0)
watchEffect(() => {
    console.log(count.value)
})
// 输出0
count.value++
// 输出1
```

在注册副作用函数时不自动运行：

```typescript
const count = ref(0)
watchEffect(() => console.log(count.value), {
    isLazy: true
})
count.value++
// 输出1
```

自定义运行时机：

```typescript
const count = ref(0)
watchEffect(() => console.log(count.value), {
    scheduler: (fn) => {
        console.log('start')
        fn()
        console.log('end')
    }
})
count.value++
// 输出'start'
// 输出1
// 输出'end'
```

### EffectOption

签名：

```typescript
interface EffectOption {
    isLazy?: boolean,
    scheduler?: (func: EffectFunction) => any
}
```

### EffectFunction

签名：

```typescript
interface EffectFunction<T = any> extends Function {
    (): T
    deps?: Array<Set<EffectFunction>>
    options?: EffectOption
}
```

## 响应式API

此模块包含了`ref()`,`reactive()`,`watch()`,`computed()`等响应式方法，旨在生成可以侦听对象内容变化的响应式对象。

### ref()

签名：`function ref<T>(value: T): RefObj<T>`

接收需要代理的原始值和非原始值，返回一个响应式对象[RefObj](#RefObj)，代理值保存在其value属性中。

example:

```typescript
const foo = ref('bar')
const obj = ref({
    text: 'test'
})

foo.value
// 'bar'
obj.value.text
// 'test'
```

使用value属性访问代理值，因此可以代理string， number等原始值，用于文本插值、指令中时会自动脱ref，无需使用value属性。

### reactive()

签名：`reactive<T extends object>(value: T): T`

接收需要代理的非原始值，返回一个响应式的代理对象。

example:

```typescript
const obj = ref({
    text: 'test'
})
obj.text
// 'test'
```

得到的响应式对象本身每一次读写其属性都会触发其绑定的副作用函数。

### watch()

签名：`function watch<T>(target: T | (() => T) | RefObj<T>, callback: WatchCallback<T>)`

第一个参数接受需要侦听的目标对象或目标对象的getter方法，第二个参数接受一个侦听到目标值发生变化时的回调函数[WatchCallback](#WatchCallback)

example:

```typescript
const foo = ref('bar')
watch(foo, (newVal, oldVal) => {
    console.log(newVal)
})
```

### computed()

签名：`function computed<T>(getter: () => T): Computed<T>`

接受一个getter方法，返回其计算属性对象，计算值保存在其value属性中。

example:

```typescript
const foo = ref('world')
const computedVal = (() => {
    return 'hello ' + foo.value
})
computedVal.value
// 'hello world'
```

### toRefs()

签名：`function toRefs(target: object): object`

将目标响应式对象的值复制成为[RefObj](#refobj)并保留其响应能力。

example:

```typescript
const data = reactive({
    text: 'test'
})
const refObj = toRefs(data)

refObj.text.value
// 'test'
```

此方法不会主动代理目标对象为响应式对象，仅适用于需要保留响应式能力的响应式数据，其必须经过reactive代理

### proxyRefs()

签名：`function proxyRefs<T extends object>(target: T): any`

使目标对象的每个[RefObj](#refobj)类型的属性获得自动脱ref的能力。

example:

```typescript
const data = {
    foo: ref('bar')
}
const vm = proxyRefs(data)

vm.foo
// 'bar'
```

### RefObj

签名：

```typescript
type RefObj<T> =  {
    value: T
    _is_Ref_?: boolean
}
```

### Computed

签名：

```typescript
class Computed<T = any> implements RefObj<T>{
    readonly value: T
}
```

### WatchCallback

签名：

```typescript
interface WatchCallback<T> {
    (newValue: T, oldValue: T, onExpired: (fn: () => {}) => any): any
}
```

onExpired参数为一个方法，用于注册watch的过期函数，其方法的唯一参数即需要注册的函数。注册函数将在callback回调执行前执行。

## 内置指令

### 文本插值

通过在HTML内进行文本插值，可响应式地将 js 变量绑定为HTML文本元素，同时文本插值和框架指令都支持 js 表达式，可以通过复杂的 js
语句来构建响应式布局。

##### 普通插值

```typescript
const foo = ref('bar')
```

```html
<div id="app">
  <div>
  	<h1>{{ foo }}</h1>
  </div>
</div>
```

以上内容将被渲染为：

```html
<div id="app">
  <div>
  	<h1>bar</h1>
  </div>
</div>
```

##### js 表达式插值

```typescript
const isFoo = ref(true)
const foo = ref('bar')
const longText = ref('this is a long text...')
```

```html
<div id="app">
  <div>
  	<h1>{{ isFoo ? foo : longText }}</h1>
  </div>
</div>
```

当isFoo.value为true时，此处渲染结果和上述普通插值相同。但假如执行`isFoo.value = false`，此时渲染结果将变为：

```html
<div id="app">
  <div>
  	<h1>this is a long text...</h1>
  </div>
</div>
```

### d-model

用于视图与model的双向绑定，适用于input元素。

example:

```html
<div id="app">
  <div>
    <input d-model="foo" type="text"/>
  	<h1>{{ foo }}</h1>
  </div>
</div>
<script>
const app = createApp({
    setup() {
        return {
            foo: ref('bar')
        }
    }
})
app.mount('#app')
</script>
```

此例子中，h1标签的内容将随着input输入框中输入的值变化。

### d-if

通过指令值表达式判断是否渲染此DOM。

```html
<div id="app">
  <div>
  	<h1 d-if="foo === 'bar'">{{ foo }}</h1>
  </div>
</div>
<script>
const app = createApp({
    setup() {
        return {
            foo: ref('bar')
        }
    }
})
app.mount('#app')
</script>
```

### d-show

通过指令值表达式判断是否显示此元素。此指令与 if 指令的区别是此指令通过更改元素的样式 `dispaly` 属性是否为 `none` 来控制显示。

example:

```html
<div id="app">
  <div>
  	<h1 d-if="foo === 'bar'">{{ foo }}</h1>
  </div>
</div>
```

### d-on

为元素绑定事件处理函数，此指令会监视DOM事件并调用指令表达式中分配的函数或 Javascript 语句。

用法：`d-on:click="funcName"` 或`@click="js expression"`

example:

```html
<div id="app">
  <div>
  	<h1 @click="count++" @mouseover="funcName">{{ count }}</h1>
  </div>
</div>
```

### d-bind

将元素的属性绑定为变量或 js 表达式，此指令和普通的同名属性声明重复时将会覆盖普通的HTML声明。

用法：`d-bind:value="valName"` 或 `:value="js expression"`

example:

```typescript
const typeVal = ref('text')
```

```html
<div id="app">
  <div>
  	<input :type="typeVal"/>
  </div>
</div>
```

此指令针对style和class属性进行了特殊处理，因此可以通过数组来为其批量绑定属性：

```typescript
const styleVal = ref({
	color: 'red',
  fontWeight: 'bold'
})
```

```html
<div id="app">
  <div>
  	<h1 :style="[{fontSize: '30px'}, styleVal]">hello world</h1>
    <p :class="['my-container', 'my-container-wrap']">some text...</p>
  </div>
</div>
```

### d-html

此指令将会将表达式内容渲染为HTML而非文本。

example:

```typescript
const htmlVal = ref('<h1>hello world</h1>')
```

```html
<div id="app">
  <div>
    <div d-html="htmlVal"></div>
  </div>
</div>
```

