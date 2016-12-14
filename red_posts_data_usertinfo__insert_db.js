//----------------------------------------------------------------------------------------------------;

//	REQUIRE;

//----------------------------------------------------------------------------------------------------;

require( "d:/work/csj_nodejs_common_modules/initialize__redCrawling.js" );

//----------------------------------------------------------------------------------------------------;

//	PACKAGE;

//----------------------------------------------------------------------------------------------------;

global.csj.savePostHtmltoTXT = global.csj.savePostHtmltoTXT || {};

//----------------------------------------------------------------------------------------------------;

//	CLASS - global.csj.scrapping.RedCrw;

//----------------------------------------------------------------------------------------------------;

/**
 * RED 데이터를 Scrapping 하는 객체
 * @class
 * @param {Object} data
 * @author 최석준
 */
global.csj.savePostHtmltoTXT.RedCrw = function ( data ) {
    //----------------------------------------------------------------------------------------------------;
    
    var _this = this;
    
    //----------------------------------------------------------------------------------------------------;
    
    // REQUIRE;
    
    //----------------------------------------------------------------------------------------------------;
    
    var fs          = global.csj.STATIC.NPM_MODULE.fs;
    var winston     = global.csj.STATIC.NPM_MODULE.winston;
    var MongoClient = global.csj.STATIC.NPM_MODULE.mongoDB.MongoClient;
    var assert      = global.csj.STATIC.NPM_MODULE.assert
    var fse         = global.csj.STATIC.NPM_MODULE.fse;
    var dateUtils   = global.csj.STATIC.NPM_MODULE.dateUtils;
    var mongoose    = global.csj.STATIC.NPM_MODULE.mongoose;
    
    //----------------------------------------------------------------------------------------------------;
    
    // MongoDB Setting;
    
    //----------------------------------------------------------------------------------------------------;
    
    //----------------------------------------------------------------------------------------------------;
    
    // PACKAGE;
    
    //----------------------------------------------------------------------------------------------------;
    
    // var classes = {
    //     DataProcessorParent : null
    // };
    
    //----------------------------------------------------------------------------------------------------;
    
    // CLASS - DataProcessorParent;
    
    //----------------------------------------------------------------------------------------------------;
    
    // global.DataProcessorParent = function() {
    
    //var _parent = this;
    //-----------------------------------------------------------------------------------------------------------;
    
    //STATIC
    
    //-----------------------------------------------------------------------------------------------------------;
    
    var _processStatus = {
        dataPath          : '../redCrwData/saveCompleteData/'
        , type            : [ 'goods', 'posts', 'search' ]
        , dataDateDir     : []
        , idx             : 0
        , insert_loop_idx : 0
        , max_data_num    : 0
    };
    
    //var url1 = 'mongodb://localhost/redData';
    var url = 'mongodb://localhost/redData';
    
    //-----------------------------------------------------------------------------------------------------------;
    
    //function
    
    //-----------------------------------------------------------------------------------------------------------//
    
    this.readDir = function () {
        return new Promise( function ( resolve, reject ) {
            
            var dataSelect = function ( db, callback ) {
                
                db.collection( 'redpostuserinfo' ).find( {}, { _id : 1 }, {
                    limit : 1,
                    sort  : { _id : -1 }
                } ).toArray( function ( err, docs ) {
                    assert.equal( err, null );
                    callback( docs );
                } );
            };
            
            MongoClient.connect( url, function ( err, db ) {
                assert.equal( null, err );
                dataSelect( db, function ( cb ) {
                    db.close( function () {
                        console.log( "dbClose0" )
                    } );
                    console.log( cb[ 0 ]._id );
                    _processStatus.max_data_num = cb[ 0 ]._id + 1;
                    
                    console.log( "-[S]- readDir" );
                    var t      = _processStatus;
                    var path_1 = t.dataPath + t.type[ 1 ] + '/';
                    var result = fs.readdirSync( path_1 );
                    console.log( "-[E]- readDir" );
                    
                    resolve( result );
                    
                } );
            } );
            
        } )
    };
    
    this.readData_process__0 = function ( data ) {
        return new Promise( function ( resolve, reject ) {
            console.log( "-[S]- readData_process__0" );
            var t   = _processStatus;
            var r   = t.dataPath + t.type[ 1 ] + '/';
            var arr = [];
            for ( var i = 0 ; i < data.length ; i++ ) {
                arr.push( r + data[ i ] + "/" );
                t.dataDateDir.push( data[ i ] );
            }
            console.log( "-[E]- readData_process__0" );
            resolve( arr );
        } )
    };
    
    this.readData_process__1 = function ( data ) {
        return new Promise( function ( resolve, reject ) {
            
            console.log( "-[S]- readData_process__1" );
            var c = data;
            var r = [];
            for ( var i = 0 ; i < c.length ; ++i ) {
                r.push( c[ i ] )
            }
            console.log( "-[E]- readData_process__1" );
            console.log( r );
            resolve( r );
        } )
        
    };
    
    this.readData_process__2 = function ( data ) {
        return new Promise( function ( resolve, reject ) {
            console.log( "-[S]- readData_process__2" );
            var arr = [];
            for ( var i = 0 ; i < data.length ; i++ ) {
                var r     = fs.readdirSync( data[ i ] );
                var o     = {};
                o.dirPath = data[ i ];
                o.file    = r;
                arr.push( o )
            }
            console.log( "-[E]- readData_process__2" );
            resolve( arr );
            
        } )
        
    };
    
    this.readData_process__2__1 = function ( data ) {
        return new Promise( function ( resolve ) {
            console.log( "-[S]- readData_process__2__1" );
            var arr = [];
            for ( var i = 0 ; i < data.length ; i++ ) {
                for ( var j = 0 ; j < data[ i ].file.length ; j++ ) {
                    arr.push( data[ i ].dirPath + data[ i ].file[ j ] )
                }
            }
            console.log( "-[E]- readData_process__2__1" );
            resolve( arr );
        } )
        
    };
    
    this.readData_process__3 = function ( data ) {
        return new Promise( function ( resolve, reject ) {
            console.log( "-[S]- readData_process__3" );
            var arr = [];
            for ( var i = 0 ; i < data.length ; ++i ) {
                var r = fs.readFileSync( data[ i ] );
                arr.push( JSON.parse( r ) );
            }
            console.log( "-[E]- readData_process__3" );
            resolve( arr );
        } )
        
    };
    
    this.readData_process__4 = function ( data ) {
        return new Promise( function ( resolve, reject ) {
            console.log( data.length )
            var arr = []
            for ( var i = 0 ; i < data.length ; i++ ) {
                for ( var j = 0 ; j < data[ i ].length ; j++ ) {
                    arr.push( data[ i ][ j ] )
                }
            }
            
            resolve( arr )
            
        } )
        
    }
    
    this.readData_process__4___a = function ( data ) {
        return new Promise( function ( resolve, reject ) {
            var dataExistCheck = function ( param, callback ) {
                var data_exist_check = function ( db, callback ) {
                    db.collection( 'redpostuserinfo' ).find( { user_id : param } ).toArray( function ( err, docs ) {
                        assert.equal( err, null );
                        //console.log( docs )
                        callback( docs.length );
                    } );
                };
                MongoClient.connect( url, function ( err, db ) {
                    assert.equal( null, err );
                    data_exist_check( db, function ( cb ) {
                        assert.equal( err, null );
                        db.close( function () {
                            callback( cb )
                        } );
                    } )
                } );
            }
            
            var z     = 0
            var arr   = []
            var arr1  = []
            var date2 = {};
            
            var make_insert_data_chech = function () {
                
                if ( z < data.length ) {
                    //console.log( data[ z ].user.id )
                    dataExistCheck( data[ z ].user.id, function ( result ) {
                        
                        if ( result == 0 ) {
                            console.log( "not_exist_data", data[ z ].user.id, z, data.length )
                            
                            var d              = {};
                            //console.log( data[ z ].user )
                            d._id              = parseInt( _processStatus.max_data_num );
                            d.fans_total       = parseInt( data[ z ].user.fans_total );
                            d.user_id          = data[ z ].user.id;
                            d.nickname         = data[ z ].user.nickname;
                            d.discoverys_total = parseInt( data[ z ].user.discoverys_total );
                            d.image            = data[ z ].user.image;
                            d.likes            = parseInt( data[ z ].user.likes );
                            
                            date2 = new Date( Date.now() );
                            
                            d.d_reg = {
                                y    : parseInt( date2.getFullYear() )
                                , m  : parseInt( date2.getMonth() + 1 )
                                , d  : parseInt( date2.getDate() )
                                , ho : parseInt( date2.getHours() )
                                , mi : parseInt( date2.getMinutes() )
                                , se : parseInt( date2.getSeconds() )
                            };
                            
                            arr.push( d )
                            if ( arr.length == 500 ) {
                                arr1.push( arr )
                                arr = [];
                            }
                            
                            ++z;
                            ++_processStatus.max_data_num;
                            make_insert_data_chech()
                        }
                        else {
                            //console.log( "exist_data", data[ z ].user.id, z, data.length )
                            ++z;
                            make_insert_data_chech()
                        }
                    } )
                }
                else if ( z == data.length ) {
                    if ( arr.length > 0 ) {
                        arr1.push( arr )
                    }
                    resolve( arr1 )
                }
            };
            
            if ( z == data.length ) {
                resolve( arr1 )
            }
            else {
                make_insert_data_chech()
            }
            
        } )
        
    };
    //_processStatus.insert_loop_idx
    this.readData_process__4___1 = function ( data ) {
        
        return new Promise( function ( resolve, reject ) {
            
            var i           = 0;
            var insert_func = function () {
                if ( i < data.length && data[ i ].length > 0 ) {
                    
                    var datainsert = function ( db, callback ) {
                        
                        db.collection( 'redpostuserinfo' ).insertMany( data[ i ], function ( err, docs ) {
                            assert.equal( err, null );
                            console.log( "datainsertOK!" )
                            ++i;
                            callback( docs );
                            insert_func()
                        } );
                    };
                    
                    MongoClient.connect( url, function ( err, db ) {
                        //var dfd = new Deferred()
                        assert.equal( null, err );
                        datainsert( db, function ( cb ) {
                            db.close()
                        } );
                    } );
                    
                }
                else {
                    //var dfd = new Deferred()
                    console.log( "-------------------------------------------------------------" )
                    console.log( "db_insert_Complete" )
                    //dfd.resolve();
                    resolve( "complete" );
                    
                    console.log( "-------------------------------------------------------------" )
                }
                
            }
            insert_func()
        } )
        
    };
    
    this.readData_process__4___2 = function ( data ) {
        console.log( "===>", data );
        return new Promise( function ( resolve, reject ) {
            console.log( "-[S]- readData_process__4___2" );
            var t = _processStatus;
            t.len = data[ 0 ].length
            
            var detailYN__update__Y = function () {
                if ( t.idx == t.len ) {
                    resolve( data[ 1 ] )
                }
                else {
                    var datainsert = function ( db, callback ) {
                        
                        db.collection( 'redposts1' ).insertMany( data[ 0 ][ t.idx ], function ( err, docs ) {
                            assert.equal( err, null );
                            callback( docs );
                        } );
                    };
                    MongoClient.connect( url, function ( err, db ) {
                        assert.equal( null, err );
                        datainsert( db, function ( cb ) {
                            if ( err ) {
                                console.log( err )
                            }
                            if ( t.idx < t.len ) {
                                console.log( "dataInsertOK --- ", t.idx )
                                console.log( cb )
                                if ( err ) {
                                    console.log( err )
                                }
                                
                                ++t.idx;
                                detailYN__update__Y();
                                db.close( function () {
                                    console.log( "dbClose1" )
                                } );
                            }
                        } );
                    } );
                }
            };
            if ( data.length > 0 ) {
                try {
                    detailYN__update__Y()
                }
                catch ( exception ) {
                    console.log( exception );
                }
            }
            else {
                resolve( data[ 1 ] )
            }
            console.log( "-[E]- readData_process__4___2" )
        } )
    }
    
    this.readData_process__4___3 = function ( data ) {
        return new Promise( function ( resolve, reject ) {
            console.log( "-[S]- readData_process__4___3" );
            var t  = _processStatus;
            t.idx1 = 0;
            t.len1 = data.length;
            
            var detailYN__update__Y = function () {
                if ( t.idx1 == t.len1 ) {
                    resolve( 'All__Done!' )
                }
                else {
                    var datainsert1 = function ( db, callback ) {
                        db.collection( 'redpostuserinfo' ).update( { id : data[ t.idx1 ].id }, data[ t.idx1 ], { upsert : true }, function ( err, docs ) {
                            assert.equal( err, null );
                            callback( docs );
                        } );
                    };
                    MongoClient.connect( url, function ( err, db ) {
                        assert.equal( null, err );
                        datainsert1( db, function ( cb ) {
                            if ( err ) {
                                console.log( err )
                            }
                            if ( t.idx1 < t.len1 ) {
                                console.log( "dataInsertOK --- ", t.idx1 )
                                if ( err ) {
                                    console.log( err )
                                }
                                ++t.idx1;
                                console.log( t.idx1 );
                                detailYN__update__Y();
                                db.close( function () {
                                    console.log( "dbClose2" )
                                } );
                            }
                        } );
                    } );
                }
            }
            if ( data.length > 0 ) {
                try {
                    detailYN__update__Y()
                }
                catch ( exception ) {
                    console.log( exception );
                }
            }
            else {
                resolve( 'AllDone' )
            }
            console.log( "-[E]- readData_process__4___3" )
        } )
    }
    
    this.readData_process__5 = function () {
        return new Promise( function ( resolve, reject ) {
            var t    = _processStatus;
            var data = t.dataDateDir;
            console.log( "-[S]- readData_process__5" );
            var oldPath = "../redCrwData/saveCompleteData/posts/";
            var newPath = "../redCrwData/insertCompleteData/posts/";
            for ( var i = 0 ; i < data.length ; i++ ) {
                console.log( "-[S]- readData_process__5___" + data[ i ] + "___" );
                fse.copySync( oldPath + data[ i ], newPath + data[ i ] );
                console.log( "------------------Data_Move_Complete------------------" );
                console.log( "-[E]- readData_process__5___" + data[ i ] + "___" );
            }
            console.log( "-[E]- readData_process__5" );
            resolve()
        } )
        
    };
    
    this.readData_process__6 = function () {
        return new Promise( function ( resolve ) {
            console.log( "-[S]- readData_process__6" );
            var t       = _processStatus;
            var data    = t.dataDateDir;
            var oldPath = "../redCrwData/saveCompleteData/posts/";
            for ( var i = 0 ; i < data.length ; i++ ) {
                console.log( "-[S]- readData_process__6___" + data[ i ] + "___" );
                fse.removeSync( oldPath + data[ i ] );
                console.log( "------------------directory_Delete_Complete------------------" );
                console.log( "-[E]- readData_process__6___" + data[ i ] + "___" );
            }
            console.log( "-[E]- readData_process__6" );
            resolve( "------------------data_insertWork_Complete------------------" )
        } )
    };
    
    this.run = function () {
        MongoClient.connect( url, function ( err, db ) {
            assert.equal( null, err );
            console.log( "Connected to mongod server" );
            _this.readDir()
                 .then( _this.readData_process__0 )
                 .catch( function ( err ) {
                     console.log( err )
                 } )
                 .then( _this.readData_process__1 )
                 .catch( function ( err ) {
                     console.log( err )
                 } )
                 .then( _this.readData_process__2 )
                 .catch( function ( err ) {
                     console.log( err )
                 } )
                 .then( _this.readData_process__2__1 )
                 .catch( function ( err ) {
                     console.log( err )
                 } )
                 .then( _this.readData_process__3 )
                 .catch( function ( err ) {
                     console.log( err )
                 } )
                 .then( _this.readData_process__4 )
                 .catch( function ( err ) {
                     console.log( err )
                 } )
                 .then( _this.readData_process__4___a )
                 .catch( function ( err ) {
                     console.log( err )
                 } )
                 .then( _this.readData_process__4___1 )
                 .catch( function ( err ) {
                     console.log( err )
                 } )
                 //.then( _this.readData_process__4___2 )
                 //.catch( function ( err ) {
                 //    console.log( err )
                 //} )
                 //.then( _this.readData_process__4___3 )
                 //.catch( function ( err ) {
                 //    console.log( err )
                 //} )
                 .then( _this.readData_process__5 )
                 .catch( function ( err ) {
                     console.log( err )
                 } )
                 .then( _this.readData_process__6 )
                 .catch( function ( err ) {
                     console.log( err )
                 } )
                 .then( function ( result ) {
                     db.close( function () {
                         console.log( "dbClose" )
                     } );
                     console.log( result )
                 } )
        } );
    }
    //-----------------------------------------------------------------------------------------------------------;
    
    //LOGIC;
    
    //-----------------------------------------------------------------------------------------------------------;
}

var redCrw = new global.csj.savePostHtmltoTXT.RedCrw();
redCrw.run();
