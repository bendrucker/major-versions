'use strict'

import assert from 'assert'
import {Range} from 'semver'
import truncate from 'semver-truncate'
import numberRange from 'range-function'

export default function majors (range) {
  const [lower, upper] = new Range(range).set
    .reduce((comparators, set) => {
      comparators.push.apply(comparators, set)
      return comparators
    }, [])
    .map((comparator) => {
      return {
        version: parseInt(comparator.semver.version),
        operator: comparator.semver.operator
      }
    })
    .sort((a, b) => {
      return a.version < b.version ? -1 : 1
    })
    .map(semver => semver.version)

  return numberRange(lower, upper).map(n => n.toString())
}
