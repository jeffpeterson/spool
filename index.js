// thread first (left) argument
export const spool = s => _spool(s, liftL)
export default spool

// thread last (right) argument
export const spoor = s => _spool(s, liftR)

function _spool(shape, lift) {
  function Spool(v) { this.v = v }
  const s = v => new Spool(v)

  const p = Spool.prototype = {
    valueOf() {return this.v},
    toString() {return this.v},
    toJSON() {return this.v},
  }

  for (const k in shape) p[k] = lift(shape[k], s)

  return s
}

const liftL = (f, s) => function(...a) { return s(f(this.v, ...a)) }
const liftR = (f, s) => function(...a) { return s(f(...a, this.v)) }
