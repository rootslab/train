var log = console.log
    , assert = require( 'assert' )
    , Funny = require( 'funny' )
    , Train = require( '../' )
    , arr = [ 
        'Cane Nero',
        'Lupus est agnum',
        'Otia et negotia',
        [ 'Cave canem',
          'Omnes feriunt, ultima necat',
          'Mitto tibi navem sine poppa sine prora'
        ]
    ]
    , t = new Train()
    // shortcut useful to use an array as arguments for a function
    , push = Funny.mock( Train.prototype.push, true )
    ;

log( '- test #push with 0 arguments, no item should be added.' );
log( '- check if returned value is %d', 0 );
assert.equal( t.push(), 0, '#push return value is wrong!' );

log( '- test #push with multiple arguments: %d', arr.length );
// shortcut for: t.push.apply( t, arr )
push( t, arr );

log( '- check resulting queue length: %d', t.length );
assert.ok( t.length, arr.length, 'queue size value is wrong!' );