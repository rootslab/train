###Train
[![build status](https://travis-ci.org/rootslab/train.png?branch=master)](https://travis-ci.org/rootslab/train)
[![NPM version](https://badge.fury.io/js/train.png)](http://badge.fury.io/js/train)

[![NPM](https://nodei.co/npm/train.png?downloads=true&stars=true)](https://nodei.co/npm/train/)

[![NPM](https://nodei.co/npm-dl/train.png)](https://nodei.co/npm/train/)

> Train, an implementation of a ( FIFO ) Queue data structure.

> It uses 2 arrays, to simulate and perform fast shift and pop operations without using the Array#shift() method.

> __Note:__ the performance degradation of _Array#shift_ method is particularly consistent when the array is very long, on my laptop the Array#shift bottleneck occurs when I use approximately more than 2^17 items ( test by yourself changing the power values in the benchmarks! ); it implies that, for short lengths, it's still possible to use _Array#shift_ without particular performance degradation.

###Install

```bash
$ npm install train [-g]
```

> __require__:

```javascript
var Train  = require( 'train' );
```

###Run Tests

```bash
$ cd train/
$ npm test
```

###Run Benchmarks

```bash
$ cd train/
$ npm run-script bench
```

###Constructor

> Create an instance, optionally with an Array of elements. 

```javascript
Train( [ Array elements ] )
// or
new Train( [ Array elements ] )
```

###Properties

```javascript
/*
 * Property to get the queue length.
 *
 * NOTE: Accessors are very slow,
 * use size() method instead.
 */
Train.length : Number
```

###Methods

> Arguments within [ ] are optional.

```javascript
/*
 * Get an element at certain index.
 */
Train#get( [ Number index ] ) : Object

/*
 * Circular get.
 */
Train#cget( [ Number index ] ) : Object

/*
 * Evict head element.
 */
Train#shift() : Object

/* 
 * Evict multiple elements; if a number k was specified, it returns
 * an array of K elements, with K <= k. If k > size(), all elements
 * are returned.
 *
 * NOTE: #pop(k) elements is faster than execute #shift() * k times.
 */
Train#pop( [ Number k ] ) : Object

/*
 * Return current element through the circular iterator.
 */
Train#curr() : Object

/*
* Get the current element through a circular iterator, also
* incrementing the iterator counter/position by one; optionally,
* it is possible to specify with a number the next iterator
* position / index.
*/
Train#next( [ Number index ] ) : Object

/*
 * Push an object into the queue.
 * It returns the current number of items in the queue.
 */
Train#push( [ Object object ] ) : Number

/*
 * Concat an Array to the queue.
 * It returns the current Train instance.
 *
 * NOTE: first argument could also be a generic Object.
 */
Train#concat( [ Array array ] ) : Train

/*
 * Get the queue size.
 */
Train#size() : Number

/*
 * Empty the queue. It returns the number of elements evicted.
 */
Train#flush() : Number

/*
 * Apply a fn to every element of the queue, like Array#forEach;
 * fn will get 3 args: ( Object element, Number index, Number qsize ).
 *
 * NOTE: on iteration, the size is fixed to the current queue size,
 * then it is possible to push other elements to the tail, these
 * added elements are not affected by iteration.
 */
Train#forEach( Function fn [, Object scope ] ) : Train

/*
 * Apply a fn to every element of the queue;
 * fn will get 3 args: Object element, Number index, Function done.
 * After that every fn will have called done(), the callback will be launched
 * with an err argument ( if any has occurred ) and a number, representing
 * the total processed / iterated elements in the queue.
 *
 * Passing true as the last parameter, implies the eviction of the current 
 * item on every iteration, soon after that the fn has called done().
 *
 * NOTE: when queue size was 0, the callback will be immediately executed
 * with args: ( null, 0 ).
 *
 * NOTE: on iteration, the size is fixed to the current queue size,
 * then it is possible to push other elements to the tail, these
 * added elements are not affected by iteration.
 */
Train#iterate( Function fn [, Object scope, [, Function cback [, Boolean evict ] ] ] ) : Train

```

### MIT License

> Copyright (c) 2013 &lt; Guglielmo Ferri : 44gatti@gmail.com &gt;

> Permission is hereby granted, free of charge, to any person obtaining
> a copy of this software and associated documentation files (the
> 'Software'), to deal in the Software without restriction, including
> without limitation the rights to use, copy, modify, merge, publish,
> distribute, sublicense, and/or sell copies of the Software, and to
> permit persons to whom the Software is furnished to do so, subject to
> the following conditions:

> __The above copyright notice and this permission notice shall be
> included in all copies or substantial portions of the Software.__

> THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
> EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
> MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
> IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
> CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
> TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
> SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
