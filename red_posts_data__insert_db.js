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
        dataPath        : '../redCrwData/saveCompleteData/'
        , type          : [ 'goods', 'posts', 'search' ]
        , dataDateDir   : []
        , idx           : 0
        , max_data_num  : 0
        , max_data_num1 : 0
    };
    
    //var url1 = 'mongodb://localhost/redData';
    var url = 'mongodb://localhost/redData';
    
    //-----------------------------------------------------------------------------------------------------------;
    
    //function
    
    //-----------------------------------------------------------------------------------------------------------//
    
    this.readDir = function () {
        return new Promise( function ( resolve, reject ) {
            
            var dataSelect = function ( db, callback ) {
                
                db.collection( 'redposts1' ).find( {}, { _id : 1 }, {
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
            console.log( data )
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
            console.log( data );
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
            console.log( "-[S]- readData_process__4" );
            var arr   = [];
            var date1 = {};
            var date2 = {};
            var date3 = {};
            var c     = _processStatus.max_data_num;
            for ( var i = 0 ; i < data.length ; i++ ) {
                for ( var z = 0 ; z < data[ i ].length ; z++ ) {
                    
                    var r = data[ i ][ z ];
                    try {
                        var redPosts = {};
                        
                        date1 = new Date( r.crwlingDate );
                        date2 = new Date();
                        date3 = new Date( r.regDate );
                        
                        console.log( r.crwlingDate )
                        
                        redPosts._id         = parseInt( c );
                        redPosts.d_scrapping = {
                            y    : parseInt( date1.getFullYear() )
                            , m  : parseInt( date1.getMonth() + 1 )
                            , d  : parseInt( date1.getDate() )
                            , ho : parseInt( date1.getHours() )
                            , mi : parseInt( date1.getMinutes() )
                            , se : parseInt( date1.getSeconds() )
                        };
                        redPosts.d_pub       = {
                            y    : parseInt( date2.getFullYear() )
                            , m  : parseInt( date2.getMonth() + 1 )
                            , d  : parseInt( date2.getDate() )
                            , ho : parseInt( date2.getHours() )
                            , mi : parseInt( date2.getMinutes() )
                            , se : parseInt( date2.getSeconds() )
                        };
                        redPosts.d_reg       = {
                            y    : parseInt( date3.getFullYear() )
                            , m  : parseInt( date3.getMonth() + 1 )
                            , d  : parseInt( date3.getDate() )
                            , ho : parseInt( date3.getHours() )
                            , mi : parseInt( date3.getMinutes() )
                            , se : parseInt( date3.getSeconds() )
                        };
                        
                        redPosts.desc     = r.desc;
                        redPosts.post_id  = r.id;
                        redPosts.user_id  = r.user.id;
                        redPosts.p_detail = 'N';
                        
                        console.log( "-[S]- dataInsert___" );
                        arr.push( redPosts );
                        
                        console.log( c );
                        ++c;
                        console.log( "-[E]- dataInsert___" );
                    }
                    catch ( exeption ) {
                        console.log( exeption )
                    }
                    
                }
            }
            
            console.log( "-[E]- readData_process__4" )
            resolve( arr )
        } )
        
    }
    
    this.readData_process__4___1 = function ( data ) {
        console.log( "Insert__Data__Count : " + data.length )
        return new Promise( function ( resolve, reject ) {
            console.log( "-[S]- readData_process__4___1" );
            var arr  = [];
            var arr1 = [];
            for ( var z = 0 ; z < data.length ; z++ ) {
                
                arr.push( data[ z ] );
                
                if ( arr.length == 900 || z == data.length - 1 ) {
                    arr1.push( arr );
                    arr = [];
                }
            }
            console.log( "-[E]- readData_process__4___1" );
            resolve( arr1 );
        } )
        
    };
    
    this.readData_process__4___2 = function ( data ) {
        console.log( "===>", data.length );
        return new Promise( function ( resolve, reject ) {
            console.log( "-[S]- readData_process__4___2" );
            var t = _processStatus;
            t.len = data.length
            
            var detailYN__update__Y = function () {
                if ( t.idx < t.len ) {
                    if ( data.length == t.idx ) {
                        resolve( "all_done" )
                    }
                    var datainsert = function ( db, callback ) {
                        
                        db.collection( 'redposts1' ).insertMany( data[ t.idx ], function ( err, docs ) {
                            assert.equal( err, null );
                            console.log( "dataInsertOK --- ", t.idx )
                            ++t.idx;
                            detailYN__update__Y();
                            callback( docs );
                        } );
                    };
                    MongoClient.connect( url, function ( err, db ) {
                        assert.equal( null, err );
                        datainsert( db, function ( cb ) {
                            if ( err ) {
                                console.log( err )
                            }
                            db.close( function () {
                                console.log( "dbClose1" )
                            } );
                        } );
                    } );
                }
                else {
                    resolve( "data_insert_ok" )
                }
            }
            //
            detailYN__update__Y()
            
            console.log( "-[E]- readData_process__4___2" )
        } )
    }

    
    
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
                 .then( _this.readData_process__4___1 )
                 .catch( function ( err ) {
                     console.log( err )
                 } )
                 .then( _this.readData_process__4___2 )
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
