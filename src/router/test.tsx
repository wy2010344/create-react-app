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


type A<F extends {
  b: string | string[]
}> = {
  m: F
}