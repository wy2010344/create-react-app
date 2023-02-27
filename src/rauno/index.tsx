import React from 'react'
import { renderXML2Rc } from '../i18nx'

export default function index() {
  return (
    <div>
      {renderXML2Rc(`这个人有很多美妙的特效<a href="https://rauno.me/craft"/>`, {
        a(arg) {
          return <a href={arg.attrs.href}>{arg.attrs.href}</a>
        }
      })}
    </div>
  )
}
