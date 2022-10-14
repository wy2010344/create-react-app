/// <reference types="react-scripts" />



declare module 'sort-by' {
  export default function sortBy<T>(...args: string[]): (a: T, b: T) => number
}