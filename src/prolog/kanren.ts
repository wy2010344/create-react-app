export class Pair<L, R>{
  private constructor(
    public readonly left: L,
    public readonly right: R
  ) { }
  static of<L, R>(left: L, right: R) {
    return new Pair(left, right)
  }
  toString(): string {
    const left = this.left instanceof Pair ? `[${this.left.toString()}]` : this.left
    return `${left} -> ${this.right}`
  }
}
/**
 * V类型列表,后继为V,或null
 */
type NotNullList<T> = Pair<T, List<T>>
export type List<T> = NotNullList<T> | null

/**
 * V类型的流
 * 后继为一个延迟求值得到V
 */
type DelayStream<V> = () => Stream<V>
export type Stream<V> = null | Pair<V, DelayStream<V>>
export const emptyDelayStream: DelayStream<any> = () => null

/**
 * 在a流的最后添加b流
 * 方法是,a的每一个后继,每次求解时,递归追加
 * @param a 
 * @param b 
 * @returns 
 */
export function streamAppendStream<V>(a: Stream<V>, b: DelayStream<V>): Stream<V> {
  if (a == null) {
    return b()
  } else {
    //如果a有后继，追加到后继之后
    return Pair.of(a.left, function () {
      return streamAppendStream(a.right(), b)
    })
  }
}
/**
 * 在a流中追加b流
 * 直接插入在a流的下一个,而非最后一个
 * @param a 
 * @param b 
 * @returns 
 */
export function streamInterleaveStream<V>(a: Stream<V>, b: DelayStream<V>): Stream<V> {
  if (a == null) {
    return b()
  } else {
    return Pair.of(a.left, function () {
      return streamInterleaveStream(b(), a.right)
    })
  }
}
/**作用域,K与V */
type Subsitution<K, V> = List<Pair<K, V>>
export function extendSubsitution<K, V>(key: K, value: V, parent: Subsitution<K, V>) {
  return Pair.of(Pair.of(key, value), parent)
}
export class KVar {
  static UID = 0
  constructor(public readonly flag: string = `_${KVar.UID++}`) { }
  toString() {
    return `Var(${this.flag})`
  }
  equals(v: any) {
    return v == this || (v instanceof KVar && v.flag == this.flag)
  }
}

abstract class UnifyBuildType {
  abstract walk(sub: KSubsitution<KType>): UnifyBuildType
  abstract unify(b: UnifyBuildType, sub: KSubsitution<KType>): [boolean, KSubsitution<KType>]
}
/**
 * 基础类型，混合KVar和T
 */
export type KType = KVar | string | number | UnifyBuildType
/**
 * 作用域链表,key为KVar,value变具体类型,或仍为KVar
 */
export type KSubsitution<T> = Subsitution<KVar, T>
/**
 * 寻找作用域上的定义
 * @param v 
 * @param sub 
 * @returns 
 */
function find<T>(v: KVar, sub: KSubsitution<T>) {
  while (sub) {
    const kv = sub.left
    if (kv.left == v || v.equals(kv.left)) {
      return kv
    }
    sub = sub.right
  }
  return null
}

function walk(v: KType, sub: KSubsitution<KType>): KType {
  if (v instanceof KVar) {
    const val = find(v, sub)
    if (val) {
      //寻找到所有定义
      return walk(val.right, sub)
    }
    //没有找到,返回自身
    return v
  } else if (v instanceof UnifyBuildType) {
    //对于其它类型,自定义查找
    return v.walk(sub)
  } else {
    return v
  }
}

function unify(a: KType, b: KType, sub: KSubsitution<KType>): [boolean, KSubsitution<KType>] {
  a = walk(a, sub)
  b = walk(b, sub)
  if (a == b) {
    return [true, sub]
  }
  if (a instanceof KVar) {
    if (a.equals(b)) {
      return [true, sub]
    }
    return [true, extendSubsitution(a, b, sub)]
  }
  if (b instanceof KVar) {
    if (b.equals(a)) {
      return [true, sub]
    }
    return [true, extendSubsitution(b, a, sub)]
  }
  if (a instanceof UnifyBuildType && b instanceof UnifyBuildType) {
    return a.unify(b, sub)
  }
  if (a == b) {
    return [true, sub]
  }
  return [false, null]
}

function generateMapBuild<T extends Record<string, any>>(map: {
  [key in keyof T]: true
}) {
  const list = Object.keys(map)
  type Key = keyof T
  type NT = {
    [key in Key]: KType
  }
  class MapBuildType extends UnifyBuildType {
    constructor(private records: NT) {
      super()
    }
    get(key: Key) {
      return this.records[key]
    }
    walk(sub: KSubsitution<KType>): MapBuildType {
      const newRecords = {} as NT
      for (const row of list) {
        newRecords[row as keyof T] = walk(this.records[row], sub)
      }
      return new MapBuildType(newRecords)
    }
    unify(b: UnifyBuildType, sub: KSubsitution<KType>): [boolean, KSubsitution<KType>] {
      if (b instanceof MapBuildType) {
        let newSub = sub
        let success = true
        for (const row of list) {
          const nrow = row as Key
          [success, newSub] = unify(this.get(nrow), b.get(nrow), newSub)
          if (!success) {
            return [false, null]
          }
        }
        return [true, newSub]
      }
      return [false, null]
    }
  }
  return function (records: T) {
    return new MapBuildType(records)
  }
}