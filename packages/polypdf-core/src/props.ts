const propsMap: Map<string, any> = new Map()

export function setProps(key: string, fn: any) {
  propsMap.set(key, fn)
}

export function getProps(key: string) {
  return propsMap.get(key)
}

export function removeProps(key: string) {
  propsMap.delete(key)
}
