'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = majors;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _semver = require('semver');

var _rangeFunction = require('range-function');

var _rangeFunction2 = _interopRequireDefault(_rangeFunction);

var _arrayLast = require('array-last');

var _arrayLast2 = _interopRequireDefault(_arrayLast);

var _uniqueConcat = require('unique-concat');

var _uniqueConcat2 = _interopRequireDefault(_uniqueConcat);

var _sortOn = require('sort-on');

var _sortOn2 = _interopRequireDefault(_sortOn);

'use strict';

var operators = {
  gt: '>=',
  lt: '<'
};

function majors(range, maximum) {
  var versions = new _semver.Range(range).set.map(function (comparators) {
    var semvers = _sortOn2['default'](comparators.map(function (comparator) {
      return {
        version: parseInt(comparator.semver.version),
        operator: comparator.operator
      };
    }), 'version').reduce(conflicts, []);

    if (!resolves(semvers)) return [];

    upperBound(semvers, range, maximum);
    lowerBound(semvers);

    var _semvers$map = semvers.map(function (semver) {
      return semver.version;
    });

    var _semvers$map2 = _slicedToArray(_semvers$map, 2);

    var lower = _semvers$map2[0];
    var upper = _semvers$map2[1];

    return _rangeFunction2['default'](lower, upper);
  }).reduce(function (allMajors, majors) {
    return _uniqueConcat2['default'](allMajors, majors);
  });

  return _sortOn2['default'](versions).map(function (n) {
    return n.toString();
  });
}

function conflicts(semvers, semver) {
  var previous = _arrayLast2['default'](semvers);
  if (previous && previous.operator === semver.operator) {
    if (semver.operator === operators.gt) {
      semvers.pop();
      semvers.push(semver);
    }
    return semvers;
  }
  return semvers.concat(semver);
}

function resolves(semvers) {
  for (var i = 0; i < semvers.length; i++) {
    var _map = [i, i - 1].map(function (i) {
      return semvers[i];
    });

    var _map2 = _slicedToArray(_map, 2);

    var current = _map2[0];
    var previous = _map2[1];

    if (previous && previous.operator === operators.lt) {
      if (current.operator === operators.gt) {
        return false;
      }
    }
  }
  return true;
}

function upperBound(semvers, range, maximum) {
  var final = _arrayLast2['default'](semvers);
  if (final.operator === operators.gt) {
    var err = 'Cannot determine major versions: "' + range + '" is unbounded and ';
    if (maximum == null) {
      throw new Error(err + 'no maximum was provided');
    }
    maximum = parseInt(maximum);
    if (maximum < final.version) {
      throw new Error(err + 'the maximum is not in range');
    }
    semvers.push({
      version: maximum + 1,
      operator: operators.lt
    });
  }
}

function lowerBound(semvers) {
  if (semvers[0].operator === operators.lt) {
    semvers.push({
      version: 0,
      operator: operators.gt
    });
  }
}
module.exports = exports['default'];