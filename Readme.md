###Train
[![build status](https://travis-ci.org/rootslab/train.png?branch=master)](https://travis-ci.org/rootslab/train)
[![NPM version](https://badge.fury.io/js/train.png)](http://badge.fury.io/js/train)

[![NPM](https://nodei.co/npm/train.png?downloads=true&stars=true)](https://nodei.co/npm/train/)

[![NPM](https://nodei.co/npm-dl/train.png)](https://nodei.co/npm/train/)

> Train, an implementation of a ( FIFO ) Queue data structure.

> It uses 2 arrays, to simulate and perform a fast element shift/pop operation, without using the Array#shift() method. 

> __Note:__ the performance degradation of _Array#shift_ method is particularly consistent when the array is very long ( with at least ~2^17 items on my laptop); it implies that for short lenghts it is still possible to use _Array#shift_ without particular performance degradation.

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
// a property to get the queue size
// NOTE that accessors are very slow, use the size() method
Train.length : Number
```

###Methods

```javascript
// get an element at certain index
Train#get( [ Number index ] ) : Object

// circular get
Train#cget( [ Number index ] ) : Object

// evict head element from the queue
Train#shift() : Object

/* Evict multiple elements from queue; if a number k was specified,
 * it returns an array of K elements ( K <= k ).
 * If k > Train#size(), it flushes the queue and returns all the
 * elements.
 * NOTE: #pop(k) elements is faster than execute #shift() * k times.
 */
Train#pop( [ Number k ] ) : Object

// return current element through the circular iterator
Train#curr() : Object

/*
* Get the current element through a circular iterator,
* incrementing internal counter/position by one; optionally,
* it is possible to specify the next iterator position/index
* with a number.
*/
Train#next( [ Number index ] ) : Object

/*
 * push an element to the end of the queue;
 * NOTE: if the first argument was an array,
 * and concat flag was set to true, then
 * every array element will be pushed in the queue.
 * It returns the resulting queue length.
 */
Train#push( Object o [, Boolean concat ] ) : Number

// get the queue size
Train#size() : Number

/*
 * a method to empty the queue.
 * it returns the number of elements evicted.
 */
Train#flush() : Number

/*
 * apply a fn to every element of the queue, like Array#forEach
 * fn will get 3 args : ( Object element, Number index, Number qsize )
 * Note : on iteration, the size is fixed to the current queue size,
 * then it is possible to push other elements to the tail, these added elements
 * are not affected by iteration.
 */
Train#forEach( Function fn [, Object scope ] ) : Train

/*
 * apply a fn to every element of the queue,
 * fn will get 3 args : ( Object element, Number index, Function done ).
 * After that every fn will have called done(), the callback will be launched
 * with an err argument ( if any has occurred ) and a number representing
 * the total processed/iterated elements in the queue, equal to the queue size
 * if no error has occurred.
 * NOTE: when queue size was 0, the callback will be immediately executed
 * with args: ( null, 0 ).
 * NOTE : on iteration, the size is fixed to the current queue size, then
 * it is possible to push other elements to the queue tail, these elements
 * are not affected by iteration.
 */
Train#iterate( Function fn [, Object scope, [, Function callback ] ] ) : Train

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
