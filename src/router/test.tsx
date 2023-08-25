import { BaseRouter, createBrowserRouter } from "."


type a = {
  n: 9
}

const test = createBrowserRouter([
  {
    match: "abc",
    Render(arg: {}) {

      return <></>
    }
  },
  {
    match: "evw",
    Render(arg: {

    }) {
      return <></>
    },
  }
])

test.call("")
const navigate = test.useNavigate()

navigate("abc")


type MF = {
  [key in string]?: never
} | {
  b: string | string[]
}
type A<F extends MF> = {
  m: F
}
type NF = A<{
  b: "89",
}>