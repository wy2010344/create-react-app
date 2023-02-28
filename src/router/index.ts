import { useMemo, createContext, useContext } from "react"
import { useBrowserRouter as useBaseBrowserRouter } from "./base-router"
import { compileSimpleRule, pathExactly } from "./util"

type SearchParams = {
  [key: string]: string | string[]
}
type RouterParam = {
  /**路径参数 */
  pathParams?: {
    [key: string]: string
  }
  /**查询参数 */
  searchParams?: SearchParams
  /**hash值 */
  hash?: string
}
type RouterFun<T extends RouterParam> = (arg: T) => JSX.Element
export type BaseRouter = {
  match: string
  /**指定元素 */
  Render: RouterFun<RouterParam>
}

type Navigate<T extends BaseRouter> = {
  (n: number): void
  (path: T['match'], arg?: {
    replace?: boolean
  } & Parameters<T['Render']>[0]): void
}

export function createBrowserRouter<T extends BaseRouter[]>(config: T) {
  const NavigateContext = createContext<Navigate<T[number]>>(null as any)
  return {
    call(a: T[number]['match']) {

    },
    useNavigate() {
      return useContext(NavigateContext)
    },
    Provider() {
      const { paths, navigate, hash, searchParams } = useBaseBrowserRouter()
      const list = useMemo(() => {
        return config.map(function (row) {
          return {
            ...row,
            matchFun: pathExactly(compileSimpleRule(row.match)),
          }
        })
      }, [config])

      const sp = useMemo(() => {
        const map = {} as { [key: string]: string[] }
        for (const row of searchParams.entries()) {
          const key = row[0]
          const value = row[1]
          let oldValue = map[key]
          if (oldValue) {
            oldValue.push(value)
          } else {
            map[key] = [value]
          }
        }
        const newMap = {} as SearchParams
        Object.entries(map).forEach(function ([key, value]) {
          if (value.length == 1) {
            newMap[key] = value[0]
          } else {
            newMap[key] = value
          }
        })
        return newMap
      }, [searchParams])
      for (const row of list) {
        const result = row.matchFun(paths)
        if (result) {
          row.Render({
            hash,
            searchParams: sp,
            pathParams: result.scope
          })
        }
      }
    }
  }

}

