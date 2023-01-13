import React, { Fragment } from 'react'
import { MapDefine, renderXMLFun } from './xml'
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
      <div>{rcT(xml, {
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


function sT(xml: string, map?: MapDefine<string | number>) {
  return renderXMLFun(xml, (map || {} as any), join)
}
function rcT(xml: string, map: MapDefine<React.ReactNode>) {
  return renderXMLFun(xml, map, joinFragment)
}
function join(vs: (string | number)[]) {
  return vs.join('')
}
function joinFragment(vs: React.ReactNode[]) {
  return React.createElement(Fragment, {}, ...vs)
}