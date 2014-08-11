#!/usr/bin/env node
exports.test = function ( done ) {
    var log = console.log
        , assert = require( 'assert' )
        , Train = require( '../' )
        , arr = [ 
            'Cane Nero',
            'Lupus est agnum',
            'Otia et negotia',
            'Cave canem',
            'Omnes feriunt, ultima necat',
            'Mitto tibi navem sine poppa sine prora'
        ]
        , el = null
        , len = 0
        , size = 0
        , i = 0
        , t = new Train()
        , exit = typeof done === 'function' ? done : function () {}
        ;

    log( '- push 5 elements in the queue.' );

    t.push( arr[ 0 ] );
    t.push( arr[ 1 ] );
    t.push( arr[ 2 ] );
    t.push( arr[ 3 ] );
    t.push( arr[ 4 ] );

    log( '- pop/shift 3 elements from queue, check if elements match with original ones.' );
    el = t.shift();
    assert.equal( el, arr[ 0 ], '- Test failed! Elements don\'t match: ' + el + '!==' + arr[ 0 ] );
    el = t.shift();
    assert.equal( el, arr[ 1 ], '- Test failed! Elements don\'t match: ' + el + '!==' + arr[ 1 ] );
    el = t.shift();
    assert.equal( el, arr[ 2 ], '- Test failed! Elements don\'t match: ' + el + '!==' + arr[ 2 ] );

    log( '- test if the current queue length is 2.' );
    len = t.length;
    assert.equal( len, 2, '- Test failed! Returned queue length is wrong: 2 !== ' + len );
    log( '- test if the current queue.length is == queue.size().' );
    size = t.size();
    assert.equal( len, 2, '- Test failed! Returned queue size is different from length:' + size + '!== ' + len );


    log( '- test if get({index}) method returns correct elements.' );
    el = t.get( 0 );

    assert.equal( el, arr[ 3 ], '- Test failed! Elements don\'t match:' + el + '!== ' + arr[ 3 ] );

    el = t.get( 1 );
    assert.equal( el, arr[ 4 ], '- Test failed! Elements don\'t match:' + el + '!== ' + arr[ 4 ] );

    t.push( arr[ 5 ] );

    el = t.get( 2 );
    assert.equal( el, arr[ 5 ], '- Test failed! Elements don\'t match:' + el + '!== ' + arr[ 5 ] );

    log( '- flush the queue, then should be 0.' );
    t.flush();
    size = t.size();
    assert.equal( size, 0, '- Test failed! The queue should be empty, now its size is:' + size );

    log( '- queue.shift() should return an undefined value.' );
    el = t.shift();
    assert.equal( el, undefined, '- Test failed! The queue should be empty, shift should return an undefined value:' + el );

    log( '- push every element of an array into the queue.' );
    size = t.concat( arr ).size();
    log( '- ' + size + ' elements sliced and pushed.' );

    log( '- test if the size of array was %d.', arr.length  );
    assert.equal( size, arr.length, '- Test failed! The queue size should be ' + arr.length + ', now it is ' + size + '.' );

    log( '- pop 2 elements from queue and re-push array of result to queue.' );
    t.concat( t.pop( 2 ) );

    log( '- pop 6 (all) elements from the queue.' );
    el = t.pop( 6 );
    assert.deepEqual( el.length, arr.length );

    exit();
};