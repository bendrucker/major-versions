'use strict'

import assert from 'assert'
import {Range} from 'semver'
import truncate from 'semver-truncate'
import numberRange from 'range-function'
import last from 'array-last'

export default function majors (range) {
  const semvers = new Range(range).set
    .reduce((comparators, set) => {
      comparators.push.apply(comparators, set)
      return comparators
    }, [])
    .map((comparator) => {
      return {
        version: parseInt(comparator.semver.version),
        operator: comparator.operator
      }
    })
    .sort((a, b) => {
      return a.version < b.version ? -1 : 1
    })

  if (last(semvers).operator.charAt(0) === '>') {
    throw new Error(`Cannot determine major versions: "${range}" is unbounded`)
  }

  const [lower, upper] = semvers.map(semver => semver.version)

  return numberRange(lower, upper).map(n => n.toString())
}
