//----------------------------------------------------------------------------------------------------;

//	REQUIRE;

//----------------------------------------------------------------------------------------------------;

require( "d:/work/csj_nodejs_common_modules/initialize__redCrawling.js" );

//---------------------------------------------------------------------------------------------------;

//	PACKAGE;

//----------------------------------------------------------------------------------------------------;

global.csj.insertRedGoods = global.csj.insertRedGoods || {};

//----------------------------------------------------------------------------------------------------;

//	CLASS - global.csj.insertRedGoods.RedCrw;

//----------------------------------------------------------------------------------------------------;

/**
 * RED 데이터를 Scrapping 하는 객체
 * @class
 * @param {Object} data
 * @author 최석준
 */
global.csj.insertRedGoods.RedCrw = function () {
    var fs          = global.csj.STATIC.NPM_MODULE.fs;
    var winston     = global.csj.STATIC.NPM_MODULE.winston;
    var path      = global.csj.STATIC.NPM_MODULE.path;
    var dateUtils = global.csj.STATIC.NPM_MODULE.dateUtils;
    var MongoClient = global.csj.STATIC.NPM_MODULE.mongoDB.MongoClient;
    var assert      = global.csj.STATIC.NPM_MODULE.assert
//----------------------------------------------------------------------------------------------------;
    
    var _this = this;

//----------------------------------------------------------------------------------------------------;

// MongoDB Setting;

//----------------------------------------------------------------------------------------------------;

//-----------------------------------------------------------------------------------------------------------;

//STATIC

//-----------------------------------------------------------------------------------------------------------;
    
    var _processStatus = {
        dataPath         : '../redCrwData/saveCompleteData/',
        type             : [ 'goods', 'post', 'search' ],
        data1            : [],
        data2            : [],
        dataDateDirfiles : [],
        dataDateDirNum   : 0,
        max_data_num     : 0,
        loop1_idx        : 0
    };

//-----------------------------------------------------------------------------------------------------------;

//function

//-----------------------------------------------------------------------------------------------------------//
    
    var url = 'mongodb://localhost/redData';
    //var url = 'mongodb://49.175.149.94:9001/redData'
    
    this.readData_process__0__1 = function () {
        var t = _processStatus;
        return new Promise( function ( resolve, reject ) {
            logger.log( 'info', "-[S]-- readData_process__0__1" );
            var dataSelect = function ( db, callback ) {
                
                db.collection( 'redgoodslist' ).find( {}, { _id : 1 }, {
                    limit : 1,
                    sort  : { _id : -1 }
                } ).toArray( function ( err, docs ) {
                    if(err){logger.log( 'error', "readData_process__0__1____query", err )}
                    assert.equal( err, null );

                    if(docs[ 0 ] != undefined){
                        t.max_data_num = docs[ 0 ]._id + 1;
                        logger.log( 'info', "--[I]-- readData_process__0__1____max_data_num : " ,t.max_data_num);
                        callback( docs )
                    }else{
                        logger.log( 'info', "-[E]-- readData_process__0__1" );
                        logger.log( 'info', "--[I]-- process_run : result_not_exist");
                        logger.log( 'info', "-[E]-- process_run : ", new Date().toFormat( 'YYYYMMDDHH24MISS' ).substring( 0, 12 ) );
                        logger.log( 'info', "==========================================================================================" );
                        process.exit(0)
                    }
                    
                } );
            };
            
            MongoClient.connect( url, function ( err, db ) {
                if(err){logger.log( 'error', "readData_process__0__1____run_query", err )}
                assert.equal( null, err );
                dataSelect( db, function ( cb ) {
                    db.close()
                    logger.log( 'info', "-[E]-- readData_process__0__1" );
                    resolve()
                } );
            } );
            
        } )
        
    };
    
    
    this.readData_process__0 = function () {
        return new Promise( function ( resolve, reject ) {
            logger.log( 'info', "-[E]-- readData_process__0" );
            var dataSelect = function ( db, callback ) {
                db.collection( 'redgoodslist' ).find( {}, { _id : 0, prd_id : 1 } ).toArray( function ( err, docs ) {
                    if(err){logger.log( 'error', "readData_process__0____query", err )}
                    assert.equal( err, null );
                    callback( docs )
                } );
            };
            
            MongoClient.connect( url, function ( err, db ) {
                if(err){logger.log( 'error', "readData_process__0____run_query", err )}
                assert.equal( null, err );
                dataSelect( db, function ( cb ) {
                    db.close()
                    logger.log( 'info', "-[E]-- readData_process__0" );
                    resolve( cb )
                } );
            } );
            
        } )
        
    };
    
    this.readData_process__1 = function ( data ) {
       // console.log(data)
        var t = _processStatus;
        return new Promise( function ( resolve, reject ) {
            logger.log( 'info', "-[S]-- readData_process__1" );
            for ( var i = 0; i < data.length; i++ ) {
                t.data1.push( data[ i ].prd_id )
            }
            logger.log( 'info', "-[E]-- readData_process__1" );
            resolve()
        } )
        
    };
    
    
    this.readData_process__2 = function ( data ) {
        var t = _processStatus;
        return new Promise( function ( resolve, reject ) {
            logger.log( 'info', "-[S]-- readData_process__2" );
            var data_group_select = function ( db, callback ) {
                db.collection( 'redgoods2' ).aggregate( [ { $group : { _id : "$prd_id" } } ], { allowDiskUse : true } ).toArray( function ( err, docs ) {
                    if(err){logger.log( 'error', "readData_process__2____run_query", err )}
                    assert.equal( err, null );
                    callback( docs )
                } );
                
                
            }
            
            MongoClient.connect( url, function ( err, db ) {
                if(err){logger.log( 'error', "readData_process__2____run_query", err )}
                assert.equal( null, err );
                data_group_select( db, function ( cb ) {
                    db.close()
                    resolve( cb )
                } );
            } );
            logger.log( 'info', "-[E]-- readData_process__2" );
        } )
    }
    
    this.readData_process__3 = function ( data ) {
        var t = _processStatus;
        return new Promise( function ( resolve, reject ) {
            logger.log( 'info', "-[S]-- readData_process__3" );
            for ( var i = 0; i < data.length; i++ ) {
                //console.log(data[ i ]._id )
                if ( t.data1.indexOf( data[ i ]._id ) == -1 ) {
                    console.log(t.data1.indexOf( data[ i ]._id ) )
                    console.log("target=>",data[ i ]._id )
                    t.data2.push( data[ i ]._id )
                }
            }
            logger.log( 'info', "-[E]-- readData_process__3" );
            resolve()
            
        } )
    }
    
    
    this.readData_process__4 = function () {
        
        
        return new Promise( function ( resolve, reject ) {
            logger.log( 'info', "-[E]-- readData_process__4" );
            var t = _processStatus;
            
            var logic_idx = t.loop1_idx;
            var logic_loop_length = t.data2.length;
            
            var data_select = function () {
                logger.log( 'info', "--[I][S]-- readData_process__4__data_select" );
                var dataSelect = function ( db, callback ) {
                    
                    db.collection( 'redgoods2' ).find( { prd_id : t.data2[ t.loop1_idx ] } ).toArray( function ( err, docs ) {
                        if(err){logger.log( 'error', "readData_process__4__data_select____query", err )}
                        logger.log( 'info', "--[I][E]-- readData_process__4__data_select____loop1_idx : ",t.loop1_idx );
                        callback(docs)
                    } );
                };
                
                MongoClient.connect( url, function ( err, db ) {
                    if(err){logger.log( 'error', "readData_process__4__data_select____run_query", err )}
                    assert.equal( null, err );
                    dataSelect( db, function ( cb ) {
                        assert.equal( null, err );
                        db.close()
                        
                        if ( t.loop1_idx == t.data2.length ) {
                            logger.log( 'info', "--[I][E]-- readData_process__4__data_select" );
                            resolve( 'alldone!' )
                        }
                        else if ( t.loop1_idx < t.data2.length ) {
                            logger.log( 'info', "--[I][E]-- readData_process__4__data_select" );
                            insert_data_make( cb )
                        }
                        
                    } );
                } );
            }
            
            
            var date             = {}
            var insert_data_make = function ( data ) {
                logger.log( 'info', "--[I][S]-- readData_process__4__insert_data_make" );
                
                var data1      = {}
                data1._id      = t.max_data_num
                data1.prd_id   = data[ 0 ].data.id
                data1.p_detail = 'N'
                date           = new Date();
                
                data1.d_reg = {
                    y    : parseInt( date.getFullYear() )
                    , m  : parseInt( date.getMonth()+1 )
                    , d  : parseInt( date.getDate() )
                    , ho : parseInt( date.getHours() )
                    , mi : parseInt( date.getMinutes() )
                    , se : parseInt( date.getSeconds() )
                };
                logger.log( 'info', "--[I][E]-- readData_process__4__insert_data_make" );
                made_data_insert( data1 )
                
            }
            
            var made_data_insert = function ( data ) {
                logger.log( 'info', "--[I][S]-- readData_process__4__made_data_insert" );

                console.log(data)
                var made_data_insert_query = function ( db, callback ) {
                    
                    db.collection( 'redgoodslist' ).insert( data, function ( err, docs ) {
                        if(err){logger.log( 'error', "readData_process__4__made_data_insert____query", err )}
                        ++t.loop1_idx;
                        ++t.max_data_num;
                        callback(docs)
                        data_select();
                    } );
                    
                };
                
                
                MongoClient.connect( url, function ( err, db ) {
                    if(err){logger.log( 'error', "readData_process__4__made_data_insert____run_query", err )}
                    assert.equal( null, err );
                    made_data_insert_query( db, function ( cb ) {
                        assert.equal( null, err );
                        db.close()
                        logger.log( 'info', "--[I][E]-- readData_process__4__made_data_insert" );
                    } );
                } );
            }

            
            if ( logic_idx == logic_loop_length ) {
                logger.log( 'info', "-[E]-- readData_process__4" );
                resolve( 'all_process_complete!' )
            }
            else if ( logic_idx < logic_loop_length ) {
                data_select()
            }
            
        } )
    }
    
    this.process_run = function () {
        logger.log( 'info', "==========================================================================================" );
        logger.log( 'info', "-[S]-- process_run : ", new Date().toFormat( 'YYYYMMDDHH24MISS' ).substring( 0, 12 ) );
        _this.readData_process__0__1()
             .then( _this.readData_process__0 )
             .catch( function ( err ) {
                 logger.log( 'error', "readData_process__4", err );
             } )
             .then( _this.readData_process__1 )
             .catch( function ( err ) {
                 logger.log( 'error', "readData_process__4", err );
             } )
             .then( _this.readData_process__2 )
             .catch( function ( err ) {
                 logger.log( 'error', "readData_process__4", err );
             } )
             .then( _this.readData_process__3 )
             .catch( function ( err ) {
                 logger.log( 'error', "readData_process__4", err );
             } )
             .then( _this.readData_process__4 )
             .catch( function ( err ) {
                 logger.log( 'error', "readData_process__4", err );
             } )
             .then( function ( result ) {
                 logger.log( 'info', "--[I]-- process_run : ",result );
                 logger.log( 'info', "-[E]-- process_run : ", new Date().toFormat( 'YYYYMMDDHH24MISS' ).substring( 0, 12 ) );
                 logger.log( 'info', "==========================================================================================" );
             } )
    }
    
    //logData 생성시 폴더및 파일명 생성
    
    var folderName = new Date().toFormat( 'YYYYMMDD' );
    var fileName   = new Date().toFormat( 'YYYYMMDDHH24MISS' );
    var fileType   = '.log';
    var log_path_2 = '/red_goods_data__insert_list_db/';
    var log_path_1 = '/goods';
    var log_path_0 = '/logs';
    
    var full_path = path.join(__dirname + log_path_0 + log_path_1 + log_path_2)
    var logType    = { info : 'info', err : 'err' };
    
    var a = fs.existsSync( full_path + folderName );
    if ( a === false ) fs.mkdir( full_path + folderName, 0777 );
    //logData 생성시 폴더및 파일명 생성;
    
    var logger = new ( winston.Logger )( {
        transports : [
            new ( winston.transports.Console )( {
                name        : 'consoleLog'
                , colorize  : false
                , timestamp : function () {
                    return new Date().toFormat( 'YYYY-MM-DD HH24:MI:SS' );
                }
                , json      : false
            } )
            , new ( winston.transports.File )( {
                name        : 'infoLog'
                , level     : 'info'
                , filename  :  full_path + fileName + '_' + logType.info + fileType
                , maxsize   : 1000000
                , maxFiles  : 100
                , timestamp : function () {
                    return new Date().toFormat( 'YYYY-MM-DD HH24:MI:SS' );
                }
                , json      : false
            } )
            , new ( winston.transports.File )( {
                name        : 'errorLog'
                , level     : 'error'
                , filename  : full_path + fileName + '_' + logType.err + fileType
                , maxsize   : 1000000
                , maxFiles  : 100
                , timestamp : function () {
                    return new Date().toFormat( 'YYYY-MM-DD HH24: MI : SS' );
                }
                , json      : false
            } )
        ]
    } );
    
    
//-----------------------------------------------------------------------------------------------------------;

//LOGIC;

//-----------------------------------------------------------------------------------------------------------;

}

var redCrw = new global.csj.insertRedGoods.RedCrw();
redCrw.process_run();