'use strict'

import test from 'tape'
import majors from '../'

test((t) => {
  t.deepEqual(majors('> 2 < 5'), ['3', '4'])
  t.deepEqual(majors('< 5 > 2'), ['3', '4'])
  t.deepEqual(majors('>= 2.3.0 < 5'), ['2', '3', '4'])
  t.throws(majors.bind(null, '> 2 > 10'), /unbounded/)
  t.throws(majors.bind(null, '> 2'), /unbounded/)
  t.end()
})

