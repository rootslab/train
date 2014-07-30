/*
 * Train, a fast ( FIFO ) Queue with rollback mechanism.
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
        , emptyFn = function () {}
        , isArray = Array.isArray
        , abs = Math.abs
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
            me.qhead = isArray( arr ) ? arr : [];
            me.qtail = [];

            // rollback array
            me.qroll = [];
            me.rpos = 0;
            me.roll = false;

            // current head index
            me.hpos = 0;
            // current index of iterator 
            me.ipos = 0;
            /*
             * Set a max capacity for the queue, when this limit
             * will be reached, items pushed with xpush() will
             * be not added to the queue, but silently ignored.
             */
            me.xlim = xlim && typeof xlim === 'number' ? abs( xlim ) : Infinity;
        }
        , tproto = Train.prototype
        ;

    tproto.indexOf = function ( el, from ) {
        var me = this
            , o = el
            , f = +from || 0
            , qhead = me.qhead
            , qtail = me.qtail
            , hpos = me.hpos
            , hlen = qhead.length - hpos
            , tlen = qtail.length
            , offset = f - hlen
            , r = -1
            ;

        if ( offset < 0 ) {
            r = qhead.indexOf( o, f + hpos );
            if ( ~ r ) {
                return r - hpos;
            }
            offset = 0;
        }
        r = qtail.indexOf( o, offset );
        return ( ~ r ) ? r + hlen : -1;
    };

    tproto.rollUp = function ( bool ) {
        var me = this
            ;
        // enable roll
        me.roll = bool === undefined ? true : bool;
        // reset roll queue
        me.qroll.length = 0;
        // set roll index to the current head position
        me.rpos = me.roll ? me.hpos : 0;
        return me;
    };

    tproto.rollBack = function ( bool ) {
        var me = this
            , qroll = me.qroll
            , qhead = me.qhead
            ;
        if ( ! me.roll ) return me;
        // disable or re-enable roll
        me.roll = bool === undefined ? false : bool;
        // concat roll with head array
        me.qhead = qroll.concat( qhead );
        // reset
        me.hpos = me.rpos = 0;
        me.qroll = [];
        // update iterator position
        me.ipos += qroll.length;
        return me;
    };

    tproto.shift = function () {
        var me = this
            , qhead = me.qhead
            ;
        // decrement iterator current  position
        if ( me.ipos > 0 ) {
            --me.ipos;
        }
        // head array is empty or it is last index position
        if ( me.hpos === qhead.length ) {
            if ( me.roll ) {
                if ( ! me.qroll.length ) {
                    me.qroll = qhead.slice( me.rpos );
                    me.hpos = me.rpos = 0;
                    me.qhead = me.qtail;
                    me.qtail = [];
                    return me.qhead.length ? me.qhead[ me.hpos++ ] : undefined;
                }
                // roll position rpos should be 0
                me.qroll.push.apply( me.qroll, qhead );
            }
            // flush qhead array and reset positions
            me.hpos = 0;
            // swap head and tail
            me.qhead = me.qtail;
            me.qtail = [];
            return me.qhead.length ? me.qhead[ me.hpos++ ] : undefined;
        }
        return me.qhead[ me.hpos++ ];
    };

    // evict multiple elements from queue
    tproto.pop = function ( k ) {
        var me = this
            , l = k ? Math.min( k, me.size() ) : 0
            , qhead = me.qhead
            , qtail = me.qtail
            , qroll = me.qroll
            , hpos = me.hpos
            , rpos = me.rpos
            , hlen = qhead.length - hpos
            , tlen =  qtail.length
            , result = null
            , i = 0
            ;

        if ( ! l ) {
            return me.shift();
        }
        // update the iterator position
        me.ipos = Math.max( 0, me.ipos - l );
        // pre-reset me.hpos
        me.hpos = 0;

        if ( hlen === 0 ) {
            // head array is empty or it is last index position
            result = qtail.splice( 0, l );
            // check roll
            if ( me.roll ) {
                if ( ! me.qroll.length ) {
                    me.qroll = qhead.slice( rpos ).concat( result );
                } else {
                    // roll position rpos should be 0
                    me.qroll = qroll.concat( qhead.concat( result ) );
                }
                me.rpos = 0;
            }
            me.qhead = me.qtail;
            me.qtail = [];
            return result;
        }
        // hlen > 0
        if ( l > hlen ) {
            // get items from both qhead and qtail
            result = qtail.splice( 0, l - hlen );
            // check roll
            if ( me.roll ) {
                if ( ! me.qroll.length ) {
                    me.qroll = qhead.slice( rpos ).concat( result );
                } else {
                    // roll position rpos should be 0
                    me.qroll = qroll.concat( qhead.concat( result ) );
                }
                me.rpos = 0;
            } else {
                result = qhead.slice( hpos ).concat( result );
            }
            me.qhead = me.qtail;
            me.qtail = [];
            return result;
        }
        // l <= hlen
        me.hpos = hpos + l;
        result = qhead.slice( hpos, me.hpos ); 
        return result;
    };

    tproto.slice = function ( begin, end ) {
        var me = this
            , qtail = me.qtail
            , qhead = me.qhead
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
            , alen = arguments.length
            , arr = isArray( o ) ? o : ( alen ? [ o ] : [] )
            , qtail = me.qtail
            , k = qtail.push.apply( qtail, arr )
            ;
        return me;
    };

    tproto.xconcat = function ( o ) {
        var me = this
            , alen = arguments.length
            , arr = isArray( o ) ? o : ( alen ? [ o ] : [] )
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
            , lt = isArray( tlist ) ? tlist : []
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
            } else if ( isArray( t ) ) {
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

    tproto.flush = function ( evict ) {
        var me = this
            , len = me.size()
            , ev = evict === undefined ? true : evict
            ;
        if ( ! ev ) {
            return 0;
        }
        me.qhead.length = me.qtail.length = me.qroll.length = 0;
        me.hpos = me.rpos = me.ipos = 0;
        // disable rollback
        me.roll = false;
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
            , done = typeof cback === 'function' ? cback : emptyFn
            , nope = typeof fn !== 'function'
            , emsg = 'Train#iterate: first arg should be a function!'
            ;
        if ( nope ) {
            done( new TypeError( emsg ) );
            return;
        }
        if ( size ) {
            me.forEach( function ( el, index, qsize ) {
                fn.call( scope, el, index, function ( err ) {
                    if ( err ) {
                        done( err, index );
                         // reset fn done()
                        done = emptyFn;
                        return;
                    }
                    if ( ++cnt === qsize ) {
                        me.flush( evict === undefined ? false : true );
                        done( null, qsize );
                    }
                } );
            }, scope );
        } else {
            done( null, 0 );
        }
        return me;
    };

    return Train;
} )();