###Train 
[![build status](https://travis-ci.org/rootslab/train.png)](https://travis-ci.org/rootslab/train)
> The Train module is an implementation of a Queue data structure.
> It uses 2 arrays, to simulate and perform a fast element shift operation on its head, without using the Array#shift() method.

###Install
```bash
$ npm install train [-g]
```
###Run Tests

```javascript
$cd train/
$npm test
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
Train#get( index ) : Object
// pop the head element from queue
Train#pop : Object
Train#shift : Object
// push an element to the queue head
Train#push( el ) : Number
// get the queue size/length
Train#size() : Number
// reset queue
Train#flush( index ) : Number
```
