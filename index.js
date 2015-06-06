'use strict'

var semver = require('semver')
var isBounded = require('semver-bounded')
var dedupeRange = require('semver-conflicts')
var resolves = require('semver-resolves')
var unique = require('array-uniq')
var last = require('array-last')
var merge = require('accumulate-values')
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
    // filter out comparators that don't resolve
    .filter(resolves.comparators)
    // ensure there's a lower bound to the range
    // bound w/ 0 if needed
    .map(applyLowerBound)
    // enforce an upper bound
    .map(ensureUpperBound(range, maximum))
    // get a list of major versions
    .map(getVersions)
    // merge to a single array
    .reduce(merge(), [])
    // remove extra zeros
    .map(stripZeros)

  return unique(versions)
}

/*
Check if there's a lower bound on the comparator list. If there isn't,
use >=0.0.0.
*/
function applyLowerBound (comparators) {
  if (comparators[0].operator.charAt(0) === '<') {
    comparators.unshift(new semver.Comparator('>=0.0.0'))
  }
  return comparators
}

/*
Range must have an upper bound. Check if the last comparator is >/>=.
If so, a maximum must be provided.
*/
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
    // add the first version
    if (!index) versions.push(version)
    var next = comparators[index + 1]
    // if we're on the last item, we're already done
    if (!next) return versions
    // bump the version by one major version
    var bumped = semver.inc(version, 'major')
    // keep bumping until the next comparator is no longer satisfied
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
  // strip 0s (e.g. 2.0.0) but keep other digits (e.g. 2.3.4)
  if (version.minor) formatted += '.' + version.minor
  if (version.patch) formatted += '.' + version.patch
  return formatted
}
