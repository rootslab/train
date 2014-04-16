/*
 * Train, an implementation of a ( FIFO ) Queue data structure.
 * Behind the scenes, it uses 2 arrays, to simulate and perform 
 * fast shifting and popping operations, without using the Array
 * #shift() method.
 *
 * Copyright(c) 2013 Guglielmo Ferri <44gatti@gmail.com>
 * MIT Licensed
 */

exports.version = require( '../package' ).version;
exports.Train = ( function () {
    var log = console.log
        , isArray = Array.isArray
        // Funny helpers
        , Funny = require( 'funny' )
        , emptyFn = Funny.emptyFn
        , checkArr = Funny.checkArr
        , checkNum = Funny.checkNum
        // Train
        , Train = function ( arr, xlim ) {
            var me = this;
            if ( ! ( me instanceof Train ) ) {
                return new Train( arr, xlim );
            }

            /*
             * Private properties used to simulate a single queue are:
             * 2 arrays qhead and qtail, an index hpos that points to
             * the current head element.
             */
            me.qhead = Funny.checkArr( arr );
            me.qtail = [];
            me.hpos = 0;
            // current index of iterator 
            me.ipos = 0;
            /*
             * Set a max capacity for the queue, when this limit
             * will be reached, items pushed with xpush() will
             * be not added to the queue, but silently ignored.
             */
            me.xlim = checkNum( xlim, Infinity );
        }
        , tproto = Train.prototype
        ;

    tproto.shift = function () {
        var me = this
            , qhead = me.qhead
            ;
        // decrement the current iterator position,
        if ( me.ipos > 0 ) {
            --me.ipos;
        }
        // head array is empty or it is last index position 
        if ( me.hpos === qhead.length ) {
            // flush qhead array and reset positions
            me.qhead.length = me.hpos = 0;
            me.qhead = me.qtail;
            me.qtail = qhead;
            return ( me.qhead.length ) ? me.qhead[ me.hpos++ ] : undefined;
        }
        return me.qhead[ me.hpos++ ];
    };

    // evict multiple elements from queue
    tproto.pop = function ( k ) {
        var me = this
            , l = ( k ) ? Math.min( k, me.size() ) : 0
            , qhead = me.qhead
            , qtail = me.qtail
            , pos = me.hpos
            , hlen = qhead.length - pos
            , tlen =  qtail.length
            , result = null
            , i = 0
            ;

        if ( ! l ) {
            return me.shift();
        }
        // update the iterator position
        me.ipos = Math.max( 0, me.ipos - l );

        if ( hlen === 0 ) {
             me.qhead.length = me.hpos = 0;
             return qtail.splice( 0, l );
        } else {
            // hlen > 0
            if ( hlen >= l ) {
                me.hpos = 0;
                // cut head from start, then slice out old elements
                return qhead.splice( 0, pos + l ).slice( pos );
            } else {
                // hlen < l, get items from qhead and qtail
                me.qhead = [];
                me.hpos = 0;
                return qhead.splice( pos ).concat( qtail.splice( 0, l - hlen ) );
            }
        }
    };

    tproto.slice = function ( begin, end ) {
           var me = this
                , qtail = me.qtail
                , qhead = me.qhead
                , qtail = me.qtail
                , size = me.size()
                , pos = me.hpos
                , hlen = qhead.length - pos
                , tlen =  qtail.length
                , b = Number( begin )
                , e = Number( end )
                , offb = 0
                , offe = 0
                ;

        if ( isNaN( b ) ) {
            b = 0;
        } else if( b < 0 ) {
            b = Math.max( 0, size + b );
        }
        if ( isNaN( e ) ) {
            e = size;
        } else if ( e < 0 ) {
            e = Math.max( 0, size + e );
        }
        if ( b > e ) {
            return [];
        }
        offb = b - hlen;
        offe = e - hlen;
        if ( offb > 0 ) {
            // use only qtail
            return qtail.slice( offb, offe );
        } else {
            if ( offe > 0 ) {
                // both queues
                return qhead.slice( b ).concat( qtail.slice( 0, offe ) );
            } else {
                // use only qhead
                return qhead.slice( b, e );
            }
        }
    };

    // NOTE: accessors are very slow, use the size() method
    Object.defineProperty( tproto, 'length', {
        get : function () {
            var me = this;
            return me.qhead.length - me.hpos + me.qtail.length;
        }
    } );

    tproto.size = function () {
        var me = this;
        return me.qhead.length - me.hpos + me.qtail.length;
    };

    tproto.concat = function ( o ) {
        var me = this
            , arr = isArray( o ) ? o : [ o ]
            , qtail = me.qtail
            , k = qtail.push.apply( qtail, arr )
            ;
        return me;
    };

    tproto.xconcat = function ( o ) {
        var me = this
            , arr = isArray( o ) ? o : [ o ]
            , alen = arr.length
            , xsize = me.size() + alen
            , qtail = me.qtail
            ;

        return ( xsize <= me.xlim ) ? qtail.push.apply( qtail, o ) : -1;
    };

    tproto.push = function () {
        var me = this
            , qtail = me.qtail
            , k = qtail.push.apply( qtail, arguments )
            ;
        return k + me.qhead.length - me.hpos;
    };

    tproto.melt = function ( tlist, all ) {
        var me = this
            , lt = Funny.checkArr( tlist )
            , llen = tlist.length
            , qtail = me.qtail
            , i = 0
            , t = lt[ 0 ]
            , a = null
            ;

        for ( ; i < llen; t = lt[ ++i ] ) {
            if ( t instanceof Train ) {
                a = t.pop( Infinity );
                if ( a ) {
                    me.concat( a );
                }
            } else if ( Array.isArray( t ) ) {
                me.concat( t );
            } else if ( all ) {
                me.push( t );
            }
        };
        return me.size();
    };

    // faster push of a single element, not using apply.
    tproto.fpush = function ( o ) {
        var me = this;
        return me.qtail.push( o ) + me.qhead.length - me.hpos;
    };

    tproto.xpush = function () {
        var me = this
            , args = arguments
            , size = me.size()
            , xsize = args.length + size
            , qtail = me.qtail
            ;
        return ( xsize <= me.xlim ) ?
               ( qtail.push.apply( qtail, args ) + me.qhead.length - me.hpos ) :
               -1
               ;
    };

    tproto.flush = function () {
        var me = this
            , len = me.length
            ;
        me.qhead.length = me.qtail.length = me.hpos = me.ipos = 0;
        return len;
    };

    tproto.get = function ( index ) {
        var me = this
            , hlen = me.qhead.length
            , i = index || 0
            , j = me.hpos + i
            , offset = j - hlen
            ;

        if ( me.hpos === hlen ) {
            // flush qhead array and reset positions
            return me.qtail[ i ];
        }
        if ( offset >= 0 ) {
            return me.qtail[ offset ];
        }
        return me.qhead[ j ];
    };

    // circular get 
    tproto.cget = function ( i ) {
        var me = this;
        return me.get( i % me.size() );
    };

     /*
     * Get the current element through a circular iterator,
     * incrementing internal counter/position by one; optionally,
     * it is possible to specify the next iterator position/index
     * with a number.
     */
    tproto.next = function ( j ) {
        var me = this
            , cpos = me.ipos
            ;
        // set or increment iterator position
        me.ipos = ( ( j >= 0 ) ? j : ( cpos + 1 ) ) % me.size();
        return me.get( cpos );
    };

    // return current element through the circular iterator
    tproto.curr = function () {
         var me = this;
        return me.get( me.ipos );
    };

    tproto.forEach = function ( fn, scope ) {
        var me = this
            /*
             * Note : size is fixed to the current queue size,
             * then it is possible to push other elements to the queue,
             * these added elements are not affected by iteration.
             */
            , qsize = me.size()
            , cnt = 0
            , scope = scope || me
            , nope = ( typeof fn !== 'function' )
            , emsg = 'Train#forEach: first arg should be a function!'
            ;

        if ( nope ) {
            throw new TypeError( emsg );
            return me;
        }
        if ( ! qsize ) {
            return me;
        }
        while ( cnt < qsize ) {
            // fn gets 3 args: Object element, Number index, Number qsize 
            fn.call( scope, me.get( cnt ), cnt, qsize );
            ++cnt;
        };
        return me;
    };

    tproto.iterate = function ( fn, scope, cback, evict ) {
        var me = this
            , cnt = 0
            , scope = scope || me
            , size = me.size()
            , done = Funny.checkFn( cback )
            , nope = typeof fn !== 'function'
            , emsg = 'Train#iterate: first arg should be a function!'
            ;

        if ( nope ) {
            done( new TypeError( emsg ) );
            return;
        }
        if ( size ) {
            me.forEach( function ( el, index, qsize ) {
                fn.call( me, el, index, function ( err ) {
                    if ( err ) {
                        done( err, index );
                         // reset fn done()
                        done = emptyFn;
                        // no more shift()s
                        return;
                    }
                    if ( ++cnt === qsize ) {
                        done( null, qsize );
                    }
                    if ( evict ) {
                        me.shift();
                    }
                } );
            }, me );
        } else {
            done( null, 0 );
        }
        return me;
    };

    return Train;
} )();