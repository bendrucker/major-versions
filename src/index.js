'use strict'

import assert from 'assert'
import {Range} from 'semver'
import numberRange from 'range-function'
import last from 'array-last'
import uniqueConcat from 'unique-concat'

export default function majors (range, maximum) {
  return new Range(range).set
    .map((comparators) => {
      const semvers = comparators.map((comparator) => {
        return {
          version: parseInt(comparator.semver.version),
          operator: comparator.operator
        }
      })
      .sort((a, b) => {
        return a.version < b.version ? -1 : 1
      })
      if (last(semvers).operator.charAt(0) === '>') {
        if (maximum == null) {
          throw new Error(`Cannot determine major versions: "${range}" is unbounded and no maximum was provided`)
        }
        semvers.push({
          version: parseInt(maximum) + 1,
          operator: '<'
        })
      }
      if (semvers[0].operator.charAt(0) === '<') {
        semvers.push({
          version: 0,
          operator: '>='
        })
      }
      const [lower, upper] = semvers.map(semver => semver.version)
      return numberRange(lower, upper)
    })
    .reduce((allMajors, majors) => {
      return uniqueConcat(allMajors, majors)
    })
    .sort()
    .map(n => n.toString())
}
