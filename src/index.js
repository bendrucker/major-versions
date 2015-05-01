'use strict'

import assert from 'assert'
import {Range} from 'semver'
import numberRange from 'range-function'
import last from 'array-last'
import uniqueConcat from 'unique-concat'
import sortOn from 'sort-on'

export default function majors (range, maximum) {
  return new Range(range).set
    .map((comparators) => {
      const semvers = sortOn(comparators.map((comparator) => {
        return {
          version: parseInt(comparator.semver.version),
          operator: comparator.operator
        }
      }), 'version')
      upperBound(semvers, range, maximum)
      lowerBound(semvers)
      const [lower, upper] = semvers.map(semver => semver.version)
      return numberRange(lower, upper)
    })
    .reduce((allMajors, majors) => {
      return uniqueConcat(allMajors, majors)
    })
    .sort()
    .map(n => n.toString())
}

function upperBound (semvers, range, maximum) {
  if (last(semvers).operator === '>=') {
    if (maximum == null) {
      throw new Error(`Cannot determine major versions: "${range}" is unbounded and no maximum was provided`)
    }
    semvers.push({
      version: parseInt(maximum) + 1,
      operator: '<'
    })
  }
}

function lowerBound (semvers) {
  if (semvers[0].operator === '<') {
    semvers.push({
      version: 0,
      operator: '>='
    })
  }
}
