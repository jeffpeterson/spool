# spool

![Spool of thread](https://upload.wikimedia.org/wikipedia/commons/c/cd/Bobbin_%28PSF%29.jpg)

`npm install spool`

`spool` takes functions like this:

```js
function add(a, b) {
  return a + b
}

function sub(a, b) {
  return a - b
}

add(sub(add(1, 9), 2), 5) // 13

```

and lets you call them like this:

```js
import spool from 'spool'

const math = spool({
  add,
  sub,
})

math(1).add(9).sub(2).add(5).v // 13
```

That way, you can write pure functions, but call them in an OOP style... for some reason.

`spool` threads each return value as the first parameter to the next function.
You can also use `spoor` to thread each return value as the _last_ parameter to the next function.

You can even wrap [mori](https://github.com/swannodette/mori).
This is _totally_ something you should do, and it results in a 100% better api:

```js
import mori from 'mori'
import {spoor} from 'spool'

const m = spoor(mori)

m({foo: 1, bar: 2}).toClj().keys().toJs().v // [ 'foo', 'bar' ]
```

Here is another example:

```js
import spool from 'spool'

client().artists(1).albums(2).tracks(3).get().v
// =>
// { path: ["/api/v1", "artists", 1, "albums", 2, "tracks", 3],
//   method: "GET"
// }

const client = spool({
  artists,
  albums,
  tracks,
  get,
  post,
  put,
}, {
  path: ['/api/v1'],
})

function albums(r, id) {
  return path(r, ['albums', id])
}

function artists(r, id) {
  return path(r, ['artists', id])
}

function tracks(r, id) {
  return path(r, ['tracks', id])
}

function get(r, id) {
  return method(r, 'GET')
}

function post(r, id) {
  return method(r, 'POST')
}

function put(r, id) {
  return method(r, 'PUT')
}

function method(r, method) {
  return merge(r, {method})
}

function path(r, p) {
  return nest(r, {path: p})
}

function headers(r, headers) {
  return merge(r, {headers})
}

function nest(...rs) {
  return {
    ...merge(...rs),
    path: [].concat(...rs.map(r => r.path).filter(p => p)),
  }
}

function merge(...rs) {
  return rs.reduce((o, r) => {
    for (const k in r) o[k] = _merge(o[k], r[k])
    return o
  }, {})
}

function _merge(a, b) {
  if (!a) return b
  if (!b) return a

  return typeof a === 'object' && typeof b === 'object' ? merge(a, b) : b
}
```
