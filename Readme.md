###Train

[![NPM VERSION](http://img.shields.io/npm/v/train.svg?style=flat)](https://www.npmjs.org/package/train)
[![CODACY BADGE](https://img.shields.io/codacy/b18ed7d95b0a4707a0ff7b88b30d3def.svg?style=flat)](https://www.codacy.com/public/44gatti/train)
[![CODECLIMATE](http://img.shields.io/codeclimate/github/rootslab/train.svg?style=flat)](https://codeclimate.com/github/rootslab/train)
[![CODECLIMATE-TEST-COVERAGE](https://img.shields.io/codeclimate/coverage/github/rootslab/train.svg?style=flat)](https://codeclimate.com/github/rootslab/train)
[![LICENSE](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://github.com/rootslab/train#mit-license)

[![TRAVIS CI BUILD](http://img.shields.io/travis/rootslab/train.svg?style=flat)](http://travis-ci.org/rootslab/train)
[![BUILD STATUS](http://img.shields.io/david/rootslab/train.svg?style=flat)](https://david-dm.org/rootslab/train)
[![DEVDEPENDENCY STATUS](http://img.shields.io/david/dev/rootslab/train.svg?style=flat)](https://david-dm.org/rootslab/train#info=devDependencies)
[![NPM DOWNLOADS](http://img.shields.io/npm/dm/train.svg?style=flat)](http://npm-stat.com/charts.html?package=train)

[![NPM GRAPH1](https://nodei.co/npm-dl/train.png)](https://nodei.co/npm/train/)

[![NPM GRAPH2](https://nodei.co/npm/train.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/train/)

[![status](https://sourcegraph.com/api/repos/github.com/rootslab/train/.badges/status.png)](https://sourcegraph.com/github.com/rootslab/train)
[![views](https://sourcegraph.com/api/repos/github.com/rootslab/train/.counters/views.png)](https://sourcegraph.com/github.com/rootslab/train)
[![views 24h](https://sourcegraph.com/api/repos/github.com/rootslab/train/.counters/views-24h.png)](https://sourcegraph.com/github.com/rootslab/train)

> **_Train_**, a fast (FIFO) __queue__ with __rollback__ mechanism.

> Behind the scenes, it uses 2 arrays, to simulate and perform fast shifting and popping operations, without using the Array#shift() method.

> __Note:__  
>__*Array#shift*__ method shows an __high loss of performances when the array is very long__; for example, on my laptop the bottleneck occurs when I fill an array with more than 2^17 items. It implies that for shorter array lengths, is still possible to use _Array#shift_.

> _**Test** by yourself **[launching benchmarks](#run-benchmarks) or manually tuning**_ the power value p in this **_[bench file](bench/slow-shift-array-2^17-items-bench.js)_**.

> If you need a simple (LIFO) __Stack__, try __[Peela](https://github.com/rootslab/peela)__.

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
$ npm run bench
```

###Constructor

> Create an instance, argument within [ ] is optional.

```javascript
Train( [ Object opt ] )
// or
new Train( [ Object opt ] )
```
####Options

> Default options are listed.

```javascript
{
    // init queue with some elements
    head : []

    // max limit for 'xpush', 'xconcat', 'x..' methods
    , xlim : Infinity

    // max size for the rollback queue
    , rlim : Infinity
}
```

###Properties

> Don't mess with these properties!

```javascript
/*
 * Property to get the queue length.
 *
 * NOTE: Accessors are very slow,
 * use size() method instead.
 */
Train.length : Number

/*
 * Property to set the queue size limit.
 *
 * NOTE: Only #xpush(), #xconcat() are affected by this limit.
 */
Train.xlim : Number

/*
 * Property to set the size limit for the rollback queue.
 */
Train.rlim : Number

/*
 * Property to get current iterator position in the queue.
 *
 * NOTE: manually changing this value directly affects the
 * behaviour of iterator methods like #next() and #curr.
 */
Train.ipos : Number

/*
 * Property that indicates the current head element 
 * position/index in the queue.
 *
 * WARNING: private property, don't mess with it.
 */
Train.hpos : Number

/*
 * Property that indicates the current roll position/index
 * in the head queue.
 *
 * WARNING: private property, don't mess with it.
 */
Train.rpos : Number

/*
 * Property that indicates if the mechanism of rolling up
 * is enabled or not. It is set by #rollUp() and unset by
 * #rollBack() or #rollUp( false ).
 *
 * WARNING: private property, don't mess with it.
 */
Train.roll : Boolean

/*
 * An array that represents the current head of the queue.
 *
 * WARNING: private property, don't mess with it.
 */
Train.qhead : Array

/*
 * An array that represents the current tail of queue.
 *
 * NOTE: private property, don't mess with it.
 */
Train.qtail : Array

/*
 * An array for rollback mechanism.
 *
 * NOTE: private property, don't mess with it.
 */
Train.qroll : Array

```

###Methods

> Arguments within [ ] are optional.

```javascript
/*
 * Get an element at a certain index.
 */
Train#get( [ Number index ] ) : Object

/*
 * Circular get.
 */
Train#cget( [ Number index ] ) : Object

/*
 * Return the index of an element in the queue, optionally
 * starting the search from an offset index.
 * If element was not found, it returns -1.
 */
Train#indexOf( Object el [, Number offset ] ) : Object

/*
 * Evict the first (head) element from the queue.
 */
Train#shift() : Object

/* 
 * Evict one or multiple elements, if a number k was specified,
 * it returns an array of K elements, with K <= k.
 * If k > # size(), all elements are returned.
 *
 * NOTE: #pop(k) elements is faster than executing #shift() * k times.
 * NOTE: For popping all elements you could do Train#pop( Infinity )
 */
Train#pop( [ Number k ] ) : Array

/*
 * Slice a portion of train queue into a new array,
 * from begin to end index.
 *
 * NOTE: Usage is the same as Array#slice method; it
 * accepts negative indexes and numbers as strings.
 */
Train#slice( [ Number begin [, Number end ] ] ) : Array

/*
 * Start rolling up.
 * From now, all items evicted from the queue could be
 * restored, executing #rollBack().
 * Disable rollUp passing false.
 * It returns the current Train instance.
 *
 * NOTE: For now, there is no implemented mechanism, to
 * directly limit the roll queue size.
 */
Train#rollUp( [ Boolean on ] ) : Train

/*
 * Do rollback; previously evicted items are restored
 * to the head of queue. Optionally, it is possible to
 * re-enable rollUp mechanism after the rollback, passing
 * a true argument.
 * It returns the current Train instance.
 */
Train#rollBack( [ Boolean rollUp ] ) : Train

/*
 * Return current element through the circular iterator.
 */
Train#curr() : Object

/*
* Get the current element through a circular iterator, also
* incrementing the iterator counter/position by one; optionally,
* it is possible to specify a number as the next iterator
* position / index in the queue.
*/
Train#next( [ Number index ] ) : Object

/*
 * Push one or multiple objects into the queue. it uses
 * the same signature as Array#push.
 * It returns the current number of items.
 */
Train#push( [ Object obj1 [, Object obj2 .. ] ] ) : Number

/*
 * Push one or multiple objects into the queue,
 * Unlike #push, if the addition of elements exceeds the
 * xlim value, items aren't added but silently dropped.
 * It returns the current number of items in the queue,
 * or -1 if the current arguments/items were dropped.
 */
Train#xpush( [ Object obj1 [, Object obj2 .. ] ] ) : Number

/*
 * A slightly faster push, ~15% than #push.
 * It is still possible to increase speed ( bypassing function call )
 * pushing element(s) directly to the tail of the queue and to calculate
 * current size, using:
 *
 * var t = Train()
 *     , size = t.qtail.push( .. ) + t.qhead.length - me.hpos
 *     // or for multiple arguments
 *     , size = t.qtail.apply( t.qtail, [..] ) + t.qhead.length - me.hpos
 *     ;
 *
 * See Benchmarks.
 */
Train#fpush( [ Object obj ] ) : Number

/*
 * Concatenate an Array to the queue.
 * It returns the current Train instance.
 *
 * NOTE: It accepts a single argument, that could be also a generic element.
 */
Train#concat( [ Array array ] ) : Train

/*
 * Concatenate an Array to the queue.
 * Unlike #concat, if the addition of elements, contained in the array,
 * exceeds the xlim value, array is silently dropped.
 * It returns the current number of items in the queue,
 * or -1 if the current array was dropped.
 *
 * NOTE: It accepts a single argument, that could be also a generic element.
 */
Train#xconcat( [ Array array ] ) : Number

/*
 * Melt a list of Objects, preferably Train or Arrays to this queue;
 * all Train queues will be emptied, all Arrays will be concatenated.
 * Optionally, when boolean 'all' is true, it melts all items contained
 * in the tlist argument.
 * It returns the current queue size.
 *
 * NOTE: When 'all' is set to true, if an item in the tlist is not an
 * instance of Train or Array, it will be added to the queue as is, 
 * also null, NaN and undefined values.
 */
Train#melt( [ Array tlist [, Boolean all ] ] ) : Number

/*
 * Get the queue size.
 */
Train#size() : Number

/*
 * Empty the queue for default.
 * If bool is set to false, no action will be done.
 * It returns the number of elements evicted.
 */
Train#flush( [ Boolean bool ] ) : Number

/*
 * Apply a fn to every element of the queue, like Array#forEach;
 * fn will get 3 arguments: ( Object element, Number index, Number qsize ).
 *
 * NOTE: on iteration, the size is fixed to the current queue size,
 * then it is possible to push other elements to the tail, these
 * added elements are not affected by iteration.
 */
Train#forEach( Function fn [, Object scope ] ) : Train

/*
 * Apply a fn to every element of the queue;
 * fn will get 3 arguments: Object element, Number index, Function done.
 * After that every fn will have called done(), the callback will be launched
 * with an err argument ( if any has occurred ) and a number, representing
 * the total processed / iterated elements in the queue.
 *
 * If boolean "evict" was set to true, after the last fn call to done(),
 * the queue will be flushed.
 *
 * NOTE: when queue size is 0, the callback will be immediately executed
 * with arguments: ( null, 0 ).
 *
 * NOTE: on iteration, the size is fixed to the current queue size,
 * then it is possible to push other elements to the tail, these
 * added elements are not affected by iteration.
 */
Train#iterate( Function fn [, Object scope [, Function cback [, Boolean evict ] ] ] ) : Train

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
