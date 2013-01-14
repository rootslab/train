###Train 
[![build status](https://travis-ci.org/rootslab/train.png?branch=master)](https://travis-ci.org/rootslab/train)
> The Train module is an implementation of a ( FIFO ) Queue data structure.

> It uses 2 arrays, to simulate and perform a fast element shift/pop operation, without using the Array#shift() method.

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
// NOTE that accessors are very slow, use the size method
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
 * fn will get 2 args : ( Object element, Number index )
 */
Train#forEach( Function fn [, Object scope ] ) : null

/*
 * apply a fn to every element of the queue, like Array#forEach
 * fn will get 3 args : ( Object element, Number index, Function done )
 * after that every fn will have called done(), the function callback will be
 * executed ( with an err argument if any has occurred ).
 */
Train#iterate( Function fn [, Object scope, [, Function callback ] ] ) : null

```
