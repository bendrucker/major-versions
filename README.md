# major-versions [![Build Status](https://travis-ci.org/bendrucker/major-versions.svg?branch=master)](https://travis-ci.org/bendrucker/major-versions)

> Get all the major versions within a semver range

## Installing

```sh
$ npm install --save major-versions
```

## Usage

```js
var majors = require('major-versions')
majors('>=2 <5') // => ['2', '3', '4', '5']
majors('>=2 <5 || 10') // => ['2', '3', '4', '5', '10']
majors('<2 >5') // => []
```

## API

#### `majors(range, [maximum])` -> `array[string]`

##### range

*Required*  
Type: `string`

A semver range.

##### maximum

Type: `string`

A maximum to apply. An exception will be throw for an unbounded range (e.g. `'>5'`) if no maximum is provided. The maximum must lie within the range. Most times you'll query a package registry for a specific version (e.g. latest) and use it as the maximum.

```js
majors('>=2', '4.1.2', ['2', '3', '4'])
```
