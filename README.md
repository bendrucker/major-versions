# major-versions [![Build Status](https://travis-ci.org/bendrucker/major-versions.svg?branch=master)](https://travis-ci.org/bendrucker/major-versions)

Get all the major versions within a semver range

## Installing

```sh
$ npm install major-versions
```

## API

##### `majorVersions(range, maximum)` -> `Array(String)`

Given a valid [semver `range`](https://github.com/npm/node-semver#ranges), `majorVersions` determines all the major version numbers within the range. It returns an array of integer strings. 

If the `range` does not have an upper bound (e.g. `> 5`), you must specify a `maximum` version number. This must be a valid [semver version](https://github.com/npm/node-semver#versions) and not a range. The `maximum` must also satisfy the `range`.

The return value will be empty is the range does not resolve to any valid major version.
