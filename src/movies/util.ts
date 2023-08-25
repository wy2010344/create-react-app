export type FalseType = false | undefined | null | ""
function getTrue<T>(v: T) {
  return v
}
export function mergeClassName(...vs: (string | FalseType)[]) {
  return vs.filter(getTrue).join(' ')
}