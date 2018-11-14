'use strict'

var test = require('tape')
var majors = require('./')

test('bounded ranges', function (t) {
  t.deepEqual(majors('2'), ['2'])
  t.deepEqual(majors('> 2 < 5'), ['3', '4'])
  t.deepEqual(majors('> 2 <= 4'), ['3', '4'])
  t.deepEqual(majors('< 5 > 2'), ['3', '4'])
  t.deepEqual(majors('>= 2.3.0 < 5'), ['2.3', '3', '4'])
  t.deepEqual(majors('>= 2.3.4 < 5'), ['2.3.4', '3', '4'])
  t.deepEqual(majors('>= 9 < 11'), ['9', '10'])

  t.end()
})

test('unbounded ranges', function (t) {
  t.throws(majors.bind(null, '> 2 > 10'), /unbounded and no maximum/)
  t.throws(majors.bind(null, '> 2'), /unbounded and no maximum/)
  t.deepEqual(majors('>= 2', '4.3.2'), ['2', '3', '4'], 'unbounded with maximum')
  t.throws(majors.bind(null, '> 5', '4.0.0'), /unbounded and "4\.0\.0"/)

  t.deepEqual(majors('<= 2'), ['0', '1', '2'], 'lower bound is zero')

  t.end()
})

test('0.x ranges', function (t) {
  t.deepEqual(majors('>= 0.1 <= 0.2'), ['0.2'])
  t.deepEqual(majors('< 0.4'), ['0.3'])

  t.throws(majors.bind(null, '> 0.1'), /unbounded and no maximum/)

  t.deepEqual(majors('> 0.1', '0.5.0'), ['0.5.0'])

  t.end()
})

test('or', function (t) {
  t.deepEqual(majors('2 || > 5 < 8'), ['2', '6', '7'])
  t.end()
})

test('>2 comparators', function (t) {
  t.deepEqual(majors('> 2 < 7 > 4'), ['5', '6'])
  t.deepEqual(majors('> 2 < 6 < 7'), ['3', '4', '5'])
  t.deepEqual(majors('> 2 <= 6 < 7'), ['3', '4', '5', '6'])
  t.end()
})

test('empty set', function (t) {
  t.deepEqual(majors('< 2 > 4'), [])
  t.end()
})
