import { xml2js, Element } from 'xml-js'
export function renderXMLFun<T>(xml: string, map: MapDefine<T>, toSingle: ToSingle<T>) {
  xml = `<Root>${xml}</Root>`
  var result2 = xml2js(xml, { compact: false });
  const root = result2.elements[0]
  const list = root.elements as Element[]
  return transRC(list, map, toSingle)
}

/**
 * T不能是函数
 */
export type RenderFun<T> = (arg: {
  attrs: {
    [key in string]: string
  }
  children: (T | string)
}) => T
export type MapDefine<T> = {
  [key in string]: string | number | T | RenderFun<T>
}
export type ToSingle<T> = (v: (T | string)[]) => (T | string)
function transRC<T>(list: Element[], map: MapDefine<T>, toSingle: ToSingle<T>): T | string {
  return toSingle(list.map(row => {
    if (row.type == 'text') {
      return row.text as string
    } else if (row.type == 'element') {
      if (row.name) {
        const define = map[row.name]
        if (define) {
          if (typeof (define) == 'function') {
            return (define as any)({
              attrs: row.attributes as any || {},
              children: transRC(row.elements || [], map, toSingle)
            })
          } else {
            return define as string
          }
        } else {
          throw new Error(`no define for ${row.name}`)
        }
      } else {
        console.log(row)
        throw new Error('no element name')
      }
    } else {
      console.log(row)
      throw new Error(`unknow element type ${row.type}`)
    }
  }))
}