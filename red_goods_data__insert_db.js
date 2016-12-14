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
    var exec = require( 'child_process' ).exec;
    var fs = global.csj.STATIC.NPM_MODULE.fs;
    var winston = global.csj.STATIC.NPM_MODULE.winston;
    var request = global.csj.STATIC.NPM_MODULE.request;
    var fse = global.csj.STATIC.NPM_MODULE.fse;
    var MongoClient = global.csj.STATIC.NPM_MODULE.mongoDB.MongoClient;
    var assert = global.csj.STATIC.NPM_MODULE.assert
    var path = global.csj.STATIC.NPM_MODULE.path;
//----------------------------------------------------------------------------------------------------;

    var _this = this;

//----------------------------------------------------------------------------------------------------;

// MongoDB Setting;

//----------------------------------------------------------------------------------------------------;

//-----------------------------------------------------------------------------------------------------------;

//STATIC

//-----------------------------------------------------------------------------------------------------------;

    var _processStatus = {
        dataPath: '../redCrwData/saveCompleteData/',
        type: [ 'goods', 'post', 'search' ],
        dataDateDir: [],
        dataDateDirfiles: [],
        dataDateDirNum: 0,
        max_data_num: 0
    };

//-----------------------------------------------------------------------------------------------------------;

//function

//-----------------------------------------------------------------------------------------------------------//

    var url = 'mongodb://localhost/redData';

    this.readDir = function () {

        return new Promise(
            function ( resolve ) {
                logger.log( 'info', "-[S]-- readDir" );
                var t = _processStatus;
                var path_1 = t.dataPath + t.type[ 0 ] + '/';
                var result = fs.readdirSync( path_1 );
                logger.log( 'info', "-[E]-- readDir" );
                resolve( result );
            }
        )

    };

    this.readData_process__0 = function ( data ) {

        return new Promise(
            function ( resolve, reject ) {
                logger.log( 'info', "-[S]-- readData_process__0" );
                var dataSelect = function ( db, callback ) {

                    db.collection( 'redgoods2' ).find(
                        {}, { _id: 1 }, {
                            limit: 1,
                            sort: { _id: -1 }
                        }
                    ).toArray(
                        function ( err, docs ) {
                            assert.equal( err, null );
                            callback( docs );
                        }
                    );
                };

                MongoClient.connect(
                    url, function ( err, db ) {
                        assert.equal( null, err );
                        dataSelect(
                            db, function ( cb ) {
                                db.close()
                                //console.log( cb[ 0 ]._id );
                                _processStatus.max_data_num = cb[ 0 ]._id + 1;

                                logger.log( 'info', "-[S]-- readDir" );
                                var t = _processStatus;
                                var r = t.dataPath + t.type[ 0 ] + '/';
                                var arr = [];
                                for ( var i = 0; i < data.length; i++ ) {
                                    arr.push( r + data[ i ] + "/" );
                                    t.dataDateDir.push( data[ i ] );
                                }
                                logger.log( 'info', "-[E]-- readData_process__0" );
                                resolve( arr );


                            }
                        );
                    }
                );


            }
        )

    };

    this.readData_process__1 = function ( data ) {

        return new Promise(
            function ( resolve, reject ) {
                logger.log( 'info', "-[S]-- readData_process__1" );
                var c = data;
                var r = [];
                for ( var i = 0; i < c.length; ++i ) {
                    r.push( c[ i ] );
                }
                logger.log( 'info', "-[E]-- readData_process__1" );
                resolve( r );
            }
        )

    };

    this.readData_process__2 = function ( data ) {

        return new Promise(
            function ( resolve, reject ) {
                logger.log( 'info', "-[S]-- readData_process__2" );
                var arr = [];
                for ( var i = 0; i < data.length; i++ ) {
                    var r = fs.readdirSync( data[ i ] );
                    var o = {};
                    o.dirPath = data[ i ];
                    o.file = r;
                    arr.push( o );
                }
                logger.log( 'info', "-[E]-- readData_process__2" );
                resolve( arr );
            }
        )
    };

    this.readData_process__2__1 = function ( data ) {

        return new Promise(
            function ( resolve, reject ) {
                logger.log( 'info', "-[S]-- readData_process__2__1" );
                var arr = [];
                for ( var i = 0; i < data.length; i++ ) {

                    for ( var j = 0; j < data[ i ].file.length; j++ ) {

                        arr.push( data[ i ].dirPath + data[ i ].file[ j ] );

                    }

                }
                logger.log( 'info', "-[E]-- readData_process__2__1" );
                resolve( arr );
            }
        )

    };

    this.readData_process__3 = function ( data ) {
        return new Promise(
            function ( resolve, reject ) {
                logger.log( 'info', "-[S]-- readData_process__3" );
                var arr = [];
                var arr1 = [];
                var date1 = {};
                var date2 = {};
                var t = _processStatus;
                var c = t.max_data_num
                for ( var i = 0; i < data.length; ++i ) {
                    var d = fs.readFileSync( data[ i ] );
                    d = JSON.parse( d );
                    for ( var j = 0; j < d.length; j++ ) {
                        var r = d[ j ]

                        var redGoods = {}
                        //date1 = new Date(d.d_scrapping.y);
                        redGoods = r
                        date2 = new Date();
                        //logger.log('info', "-[E]-- readData_process__3__crwlingDate : ", date1);

                        redGoods._id = parseInt( c );

                        redGoods.d_pub = {
                            y: parseInt( date2.getFullYear() )
                            , m: parseInt( date2.getMonth() + 1 )
                            , d: parseInt( date2.getDate() )
                            , ho: parseInt( date2.getHours() )
                            , mi: parseInt( date2.getMinutes() )
                            , se: parseInt( date2.getSeconds() )
                        };


                        arr.push( redGoods );
                        ++c;
                        if ( arr.length == 500 || i == data.length && j == d.length ) {
                            arr1.push( arr );
                            arr = [];
                        }

                    }
                }

                logger.log( 'info', "-[E]-- readData_process__3" );
                resolve( arr1 );
            }
        )
    };


    this.readData_process__4 = function ( data ) {

        return new Promise(
            function ( resolve, reject ) {
                logger.log( 'info', "-[S]-- readData_process__4" );
                logger.log( 'info', "-[S]-- readData_process__4___data_count : ", data.length );
                var i = 0;
                var goodsSaveDB = function () {
                    if ( i < data.length ) {

                        var datainsert = function ( db, callback ) {

                            db.collection( 'redgoods2' ).insertMany(
                                data[ i ], function ( err, docs ) {
                                    assert.equal( err, null );
                                    if ( err ) {
                                        logger.log( 'error', "readData_process__4__datainsert__query", err )
                                    }
                                    if ( i < data.length ) {
                                        logger.log( 'info', "-[E]-- readData_process__4__datainsert_idx : ", i );

                                        ++i;
                                        goodsSaveDB();
                                    }
                                    callback( docs );
                                }
                            );
                        };

                        MongoClient.connect(
                            url, function ( err, db ) {
                                if ( err ) {
                                    logger.log( 'error', "readData_process__4__datainsert__run_query", err )
                                }
                                assert.equal( null, err );
                                datainsert(
                                    db, function () {
                                        db.close()
                                    }
                                );
                            }
                        );
                    }
                    else {
                        logger.log( 'info', "-[E]-- readData_process__4" );
                        logger.log( 'info', "-[E]-- readData_process__4__data_insert_complete" );
                        resolve();
                    }
                };
                goodsSaveDB();

                logger.log( 'info', "-[E]-- readData_process__4" );
            }
        )

    };


    this.copy_dir = function () {
        return new Promise(
            function ( resolve ) {
                var t = _processStatus;
                var data = t.dataDateDir[ 0 ];
                logger.log( 'info', "-[S]-- copy_dir" );
                var oldPath = "../redCrwData/saveCompleteData/goods/";
                var newPath = "../redCrwData/insertCompleteData/goods/";

                fse.copySync( oldPath + data, newPath + data );

                logger.log( 'info', "--[I]-- copy_dir____copy_complete" );
                logger.log( 'info', "-[E]-- copy_dir" );
                resolve()
            }
        )

    };

    this.remove_dir = function () {
        return new Promise(
            function ( resolve ) {
                logger.log( 'info', "-[S]-- remove_dir" );
                var t = _processStatus;
                var data = t.dataDateDir[ 0 ];
                var oldPath = "../redCrwData/saveCompleteData/goods/";

                fse.removeSync( oldPath + data );

                //for ( var i = 0 ; i < data.length ; i++ ) {
                //    console.log( "-[S]- remove_dir" + data[ i ] + "___" );
                //    fse.removeSync( oldPath + data[ i ] );
                //    console.log( "------------------directory_Delete_Complete------------------" );
                //    console.log( "-[E]- remove_dir" + data[ i ] + "___" );
                //}
                logger.log( 'info', "--[I]-- remove_dir____remove_files_Complete" );
                resolve( 'all_process_complete' );
                logger.log( 'info', "-[E]-- remove_dir" );
            }
        )
    };
    this.run = function () {
        MongoClient.connect(
            url, function ( err, db ) {
                logger.log( 'info', "==========================================================================================" );
                logger.log( 'info', "-[S]-- process_run : ", new Date().toFormat( 'YYYYMMDDHH24MISS' ).substring( 0, 12 ) );
                if ( err ) {
                    logger.log( 'error', "process_run", err )
                }

                _this.readDir()
                    .then( _this.readData_process__0 )
                    .catch(
                        function ( err ) {
                            logger.log( 'error', "readData_process__0", err );
                        }
                    )
                    .then( _this.readData_process__1 )
                    .catch(
                        function ( err ) {
                            logger.log( 'error', "readData_process__1", err );
                        }
                    )
                    .then( _this.readData_process__2 )
                    .catch(
                        function ( err ) {
                            logger.log( 'error', "readData_process__2", err );
                        }
                    )
                    .then( _this.readData_process__2__1 )
                    .catch(
                        function ( err ) {
                            logger.log( 'error', "readData_process__2__1", err );
                        }
                    )
                    .then( _this.readData_process__3 )
                    .catch(
                        function ( err ) {
                            logger.log( 'error', "readData_process__3", err );
                        }
                    )
                    .then( _this.readData_process__4 )
                    .catch(
                        function ( err ) {
                            logger.log( 'error', "readData_process__4", err );
                        }
                    )
                    .then(_this.copy_dir)
                    .catch(function (err) {
                        logger.log('error', "copy_dir", err);
                    })
                    .then(_this.remove_dir)
                    .catch(function (err) {
                        logger.log('error', "remove_dir", err);
                    })
                    .then(
                        function ( result ) {
                            db.close();
                            logger.log( 'info', "--[I]-- process_run : ", result );
                            logger.log( 'info', "-[E]-- process_run : ", new Date().toFormat( 'YYYYMMDDHH24MISS' ).substring( 0, 12 ) );
                            logger.log( 'info', "==========================================================================================" );
                        }
                    )
            }
        );
    }
    var folderName = new Date().toFormat( 'YYYYMMDD' );
    var fileName = new Date().toFormat( 'YYYYMMDDHH24MISS' );
    var fileType = '.log';
    var log_path_2 = '/red_goods_data__insert_db/';
    var log_path_1 = '/goods';
    var log_path_0 = '/logs';

    var full_path = path.join(__dirname + log_path_0 + log_path_1 + log_path_2)
    //var full_path = "d:/"

    var logType = { info: 'info', err: 'err' };

    var a = fs.existsSync( full_path + folderName );
    if ( a === false ) fs.mkdir( full_path + folderName, 0777 );
    //logData 생성시 폴더및 파일명 생성;

    var logger = new ( winston.Logger )(
        {
            transports: [
                new ( winston.transports.Console )(
                    {
                        name: 'consoleLog'
                        , colorize: false
                        , timestamp: function () {
                        return new Date().toFormat( 'YYYY-MM-DD HH24:MI:SS' );
                    }
                        , json: false
                    }
                )
                , new ( winston.transports.File )(
                    {
                        name: 'infoLog'
                        , level: 'info'
                        , filename: full_path + fileName + '_' + logType.info + fileType
                        , maxsize: 1000000
                        , maxFiles: 100
                        , timestamp: function () {
                        return new Date().toFormat( 'YYYY-MM-DD HH24:MI:SS' );
                    }
                        , json: false
                    }
                )
                , new ( winston.transports.File )(
                    {
                        name: 'errorLog'
                        , level: 'error'
                        , filename: full_path + fileName + '_' + logType.err + fileType
                        , maxsize: 1000000
                        , maxFiles: 100
                        , timestamp: function () {
                        return new Date().toFormat( 'YYYY-MM-DD HH24: MI : SS' );
                    }
                        , json: false
                    }
                )
            ]
        }
    );


//-----------------------------------------------------------------------------------------------------------;

//LOGIC;

//-----------------------------------------------------------------------------------------------------------;

}

var redCrw = new global.csj.insertRedGoods.RedCrw();
redCrw.run();