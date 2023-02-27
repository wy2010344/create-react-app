// import { xml2js, Element } from "xml-js"; // 这个依赖的是sax,sax有1566行,xml2js有360行
import * as XmlReqder from 'xml-reader'

type Element = XmlReqder.XmlNode

const urlRegex = /(https?:\/\/[^\s]+)/g;
/**
 * 将纯文本中的换行与url替换成xml
 * @param text
 * @returns
 */
export const urlify = (text: string) => {
  const value = text
    .replace(urlRegex, (url) => {
      return `<a href="${url}">${url}</a>`;
    })
    .replace(/\n/g, () => {
      return "<br/>";
    });
  console.log(value);
  return value;
};

export type XMLParams<T> = {
  attrs: {
    [key in string]: string;
  };
  children: T;
};
export type GetDefine<T> = (tag: string, value: XMLParams<T>) => T | string;
export type ToSingle<T> = (v: (T | string)[]) => T;


function getTransRC<T>(toSingle: ToSingle<T>) {
  return function transRC(list: Element[], getDefine: GetDefine<T>): T {
    return toSingle(
      list.map((row) => {
        if (row.type == "text") {
          return row.value
          //return row.text as string;
        } else if (row.type == "element") {
          if (row.name) {
            return getDefine(row.name, {
              attrs: (row.attributes as any) || {},
              //children: transRC(row.elements || [], getDefine),
              children: transRC(row.children || [], getDefine),
            });
          } else {
            console.log(row);
            throw new Error("no element name");
          }
        } else {
          console.log(row);
          throw new Error(`unknow element type ${row}`);
        }
      })
    );
  };
}

const cacheMap = new Map<string, Element[]>();
function getElements(xml: string, noCache?: boolean) {
  const old = cacheMap.get(xml);
  if (old) {
    return old;
  } else {
    xml = `<Root>${xml}</Root>`;
    //var result2 = xml2js(xml, { compact: false });
    //const root = result2.elements[0];
    //const list = root.elements as Element[];
    const result2 = XmlReqder.parseSync(xml) as XmlReqder.XmlElement
    const list = result2.children
    if (!noCache) {
      cacheMap.set(xml, list);
    }
    return list;
  }
}
export function getRenderXMLFun<T>(toSingle: ToSingle<T>, noCache?: boolean) {
  const transRC = getTransRC(toSingle);
  return function (xml: string, getDefine: GetDefine<T>) {
    return transRC(getElements(xml, noCache), getDefine);
  };
}
