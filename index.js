
export default spool

// thread first (left) argument
export function spool(s, v) {
  return _spool(s, v, (v, args) => [v, ...args])
}

// thread last (right) argument
export function spoor(s, v) {
  return _spool(s, v, (v, args) => [...args, v])
}

function _spool(shape, v, fn) {
  const s = _set(null, v);

  for (const k in shape) {
    s[k] = function(...args) {
      return _set(this, shape[k](...fn(this.v, args)))
    }
  }

  return v => _set(s, v)
}

function _set(s, v) {
  const o = Object.create(s)
  if (v === undefined) return o
  o.v = v
  return o
}
