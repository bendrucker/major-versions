'use strict'

import test from 'tape'
import majors from '../'

test((t) => {
  t.deepEqual(majors('> 2 < 5'), [3, 4])
  t.deepEqual(majors('>= 2.3.0 < 5'), [2, 3, 4])
  t.end()
})

