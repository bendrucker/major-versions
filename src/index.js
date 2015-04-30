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
    .map(comparator => comparator.semver.version)
    .map(version => truncate(version, 'major'))
    .map(version => parseInt(version))

  return numberRange(lower, upper)
}
