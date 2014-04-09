###Train
[![build status](https://travis-ci.org/rootslab/train.png?branch=master)](https://travis-ci.org/rootslab/train)
[![NPM version](https://badge.fury.io/js/train.png)](http://badge.fury.io/js/train)

[![NPM](https://nodei.co/npm/train.png?downloads=true&stars=true)](https://nodei.co/npm/train/)

[![NPM](https://nodei.co/npm-dl/train.png)](https://nodei.co/npm/train/)

> Train, an implementation of a ( FIFO ) Queue data structure.

> It uses 2 arrays, to simulate and perform a fast element shift/pop operation, without using the Array#shift() method. 

> __Note:__ the performance degradation of _Array#shift_ method is particularly consistent when the array is very long ( with at least ~2^17 items ); it implies that for short lenghts it is still possible to use _Array#shift_ without particular performance degradation.

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
$ npm bench
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
Train#get( Number index ) : Object

// get the head element from the queue
Train#shift() : Object

/*
 * The same as shift, if it was called without argument.
 * if a number k was specified, it returns an array of K elements ( K <= k )
 * If k > queue size, it returns all the elements until the end of queue.
 */
Train#pop( [ Number k ] ) : Object

/*
 * a method to ( circular ) get an element at the specified index,
 * or at current iterator position, starting from the head of queue; then
 * it automatically increments the current iterator position, without
 * evicting the element from the queue.
 */
Train#next( [ Number index ] ) : Object

/*
 * push an element to the end of the queue;
 * optionally if el was an array, and concat flag was true,
 * every element will be pushed in the queue;
 * then it returns the resulting queue length.
 */
Train#push( Object el [, Boolean concat ] ) : Number

// get the queue size/length
Train#size() : Number

/*
 * a method to empty the queue.
 * it returns the number of elements flushed.
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
 * Note: when queue size was 0, the callback will be immediately executed
 * with args: ( null, 0 ).
 * Note : on iteration, the size is fixed to the current queue size,
 * then it is possible to push other elements to the tail,  these added elements
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
