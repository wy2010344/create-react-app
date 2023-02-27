import React, { Fragment } from 'react'
import { GetDefine, getRenderXMLFun, XMLParams } from './xml'




// function joinFragment(vs: React.ReactNode[]) {
//   return React.createElement(Fragment, {}, ...vs)
// }
export type RenderFun<T> = (arg: XMLParams<T>) => T
export type MapDefine<T> = {
  [key in string]: string | number | T | RenderFun<T>
}
function mapToSingle<T>(defMap: MapDefine<T>): GetDefine<T> {
  return function (tag, value) {
    const def = defMap[tag]
    if (typeof (def) == 'function') {
      return (def as any)(value)
    } else {
      return def
    }
  }
}
const renderXML2StrJoin = getRenderXMLFun<string | number>(function (vs) {
  return vs.join('')
})
export function renderXML2Str(value: string, def?: MapDefine<string | number>) {
  if (def) {
    return renderXML2StrJoin(value, mapToSingle(def))
  } else {
    return value
  }
}

const renderXML2RenderJoin = getRenderXMLFun<React.ReactNode>(function (vs) {
  return React.createElement(React.Fragment, {}, ...vs)
})

export function renderXML2Rc(value: string, def?: MapDefine<React.ReactNode>) {
  if (def) {
    return renderXML2RenderJoin(value, mapToSingle(def))
  } else {
    return value
  }
}

const xml = `
aewf
fewa <a> d ww </a>
<ul act="d">
  <li>ddd</li>
  <li>fff</li>
</ul>

<br/>
dv
few
`
export default function index() {
  return (
    <div>
      <button onClick={() => {
      }}>点击</button>
      <div>{renderXML2Rc(xml, {
        a(args) {
          //return React.createElement('a', {}, ...args.children)
          return <a>{args.children}</a>
          return <a children={args.children} />
        },
        ul(args) {
          return <ul>{args.children}</ul>
        },
        li(args) {
          return <li>{args.children}</li>
        },
        br() {
          return <br />
        }
      })}</div>
    </div>
  )
}