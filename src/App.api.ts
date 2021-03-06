// api的枚举
const components = require.context('./api', true, /\.api.ts$/)
const loadApis: any = {}
const names: string[] = []
components.keys().forEach((key: any) => {
    let defines: undefined | { apis: any; name: string } = undefined
    try {
        defines = components(key).default
    } catch (e) {
        throw Error(`${key}:${e}`)
    }
    if (defines === undefined || typeof defines !== 'object') {
        throw Error(`${key}:内没有 export default 或者export default格式有误 `)
    } else if (typeof defines.apis != 'object') {
        throw Error(`${key}:apis不是object`)
    }
    let { name } = defines
    if (typeof name !== 'string') {
        throw Error(`${key}:缺少name属性`)
    }
    name = name.trim()
    if (names.includes(name)) {
        throw Error(`${key}:${name}此命名空间已被使用`)
    } else {
        names.push(name)
    }
    loadApis[name] = defines.apis
})
export default loadApis
