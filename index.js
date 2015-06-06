'use strict'

var semver = require('semver')
var isBounded = require('semver-bounded')
var dedupeRange = require('semver-conflicts')
var resolves = require('semver-resolves')
var unique = require('array-uniq')
var last = require('array-last')
var printf = require('pff')

module.exports = function majorVersions (range, maximum) {
  if (!range) throw new Error('range is required')
  if (maximum != null && !semver.valid(maximum)) {
    throw new Error('maximum must be a valid semver')
  }
  // deduping has a side effect of sorting
  range = dedupeRange(range)
  var versions = new semver.Range(range)
    .set
    .filter(resolves.comparators)
    .map(applyLowerBound)
    .map(ensureUpperBound(range, maximum))
    .map(getVersions)
    .reduce(function (allVersions, setVerions) {
      allVersions.push.apply(allVersions, setVerions)
      return allVersions
    }, [])
    .map(stripZeros)

  return unique(versions)
}

function applyLowerBound (comparators) {
  if (comparators[0].operator.charAt(0) === '<') {
    comparators.unshift(new semver.Comparator('>=0.0.0'))
  }
  return comparators
}

function ensureUpperBound (range, maximum) {
  return function applyUpperBound (comparators) {
    var hasUpperBound = isBounded.comparators(comparators)
    if (hasUpperBound) return comparators
    var msg = printf(
      'Cannot determine major versions: ' +
      '"%s" is unbounded and ',
      range
    )
    if (maximum == null) {
      throw new Error(msg + 'no maximum was provided')
    }
    var upper = last(comparators)
    if (!upper.test(maximum)) {
      var explanation = printf('"%s" does not satisfy "%s"', maximum, upper.toString())
      throw new Error(msg + explanation)
    }
    return comparators.concat(new semver.Comparator('<=' + maximum))
  }
}

function getVersions (comparators) {
  return comparators.reduce(function (versions, comparator, index) {
    var version = comparator.semver.version
    if (!index) versions.push(version)
    var next = comparators[index + 1]
    if (!next) return versions
    var bumped = semver.inc(version, 'major')
    while (next.test(bumped)) {
      versions.push(bumped)
      bumped = semver.inc(bumped, 'major')
    }
    return versions
  }, [])
}

function stripZeros (version) {
  version = new semver.SemVer(version)
  var formatted = version.major.toString()
  if (version.minor) formatted += '.' + version.minor
  if (version.patch) formatted += '.' + version.patch
  return formatted
}
