//----------------------------------------------------------------------------------------------------;

//	REQUIRE;

//----------------------------------------------------------------------------------------------------;
require("d:/work/csj_nodejs_common_modules/initialize__redCrawling.js");
//---------------------------------------------------------------------------------------------------;

//	PACKAGE;

//----------------------------------------------------------------------------------------------------;

global.csj.red_goods_detail__insert_db = global.csj.red_goods_detail__insert_db || {};

//----------------------------------------------------------------------------------------------------;

//	CLASS - global.csj.insertRedGoods.RedCrw;

//----------------------------------------------------------------------------------------------------;

/**
 * RED 데이터를 Scrapping 하는 객체
 * @class
 * @param {Object} data
 * @author 최석준
 */
global.csj.red_goods_detail__insert_db.RedCrw = function () {

    var cheerio = global.csj.STATIC.NPM_MODULE.cheerio;
    var fs = global.csj.STATIC.NPM_MODULE.fs;
    var winston = global.csj.STATIC.NPM_MODULE.winston;
    var fse = global.csj.STATIC.NPM_MODULE.fse;
    var MongoClient = global.csj.STATIC.NPM_MODULE.mongoDB.MongoClient;
    var assert = global.csj.STATIC.NPM_MODULE.assert
    var path = global.csj.STATIC.NPM_MODULE.path;
    var dateUtils = global.csj.STATIC.NPM_MODULE.dateUtils;

//----------------------------------------------------------------------------------------------------;

    var _this = this;

//----------------------------------------------------------------------------------------------------;

// MongoDB Setting;

//----------------------------------------------------------------------------------------------------;

//-----------------------------------------------------------------------------------------------------------;

//STATIC

//-----------------------------------------------------------------------------------------------------------;

    var _processStatus = {
        dataPath: '../redCrwData/saveCompleteData/goods_detail/'
        , dataPath_dir: ''
        , filesCount: null
        , DataResult: []
        , DataResult1: []
        , data_max_num: 0
        , idx: 0
    };

    var url = 'mongodb://localhost/redData';

    this.read_dir = function () {

        var t = _processStatus
        return new Promise(function (resolve, reject) {
            logger.log('info', "-[S]-- read_dir");

            var dataSelect = function ( db, callback ) {

                db.collection( 'redgoodsdetails' ).find( {}, { _id : 1 }, {
                    limit : 1,
                    sort  : { _id : -1 }
                } ).toArray( function ( err, docs ) {
                    assert.equal( err, null );
                    t.data_max_num = docs[ 0 ]._id + 1;
                    callback( docs )
                } );
            };

            MongoClient.connect( url, function ( err, db ) {
                assert.equal( null, err );
                dataSelect( db, function ( cb ) {
                    db.close()

                    var path_1 = t.dataPath;
                    var result = fs.readdirSync( path_1 );

                    if(result == 0){
                        logger.log( 'info', "--[I]-- process_run : ",result );
                        logger.log( 'info', "-[E]-- process_run : ", new Date().toFormat( 'YYYYMMDDHH24MISS' ).substring( 0, 12 ) );
                        logger.log( 'info', "==========================================================================================" );
                        process.exit(0)
                    }else{
                        logger.log( 'info', "--[I]-- read_dir__dataSelect_result : ", result[ 0 ] );
                        _processStatus.filesCount = fs.readdirSync( _processStatus.dataPath + result[ 0 ] + "/" )
                        logger.log( 'info', "--[I]-- read_dir__dataSelect_filesCount : ", _processStatus.filesCount );
                        _processStatus.dataPath_dir = result[ 0 ];
                        logger.log( 'info', "-[E]-- read_dir" );
                        resolve();
                    }
                } );
            } );

            // var path_1 = t.dataPath;
            // var result = fs.readdirSync(path_1);
            // logger.log('info', "--[I]-- read_dir__dataSelect_result : ", result[0]);
            // _processStatus.filesCount = fs.readdirSync(_processStatus.dataPath + result[0] + "/")
            // logger.log('info', "--[I]-- read_dir__dataSelect_filesCount : ", _processStatus.filesCount);
            // _processStatus.dataPath_dir = result[0];
            // logger.log('info', "-[E]-- read_dir");
            // resolve();
        });
    }

    var date = {};
    this.dataMakeJson = function (dir, data) {
        return new Promise(function (resolve, reject) {

            var t = _processStatus;

            var contents = {};

            //for ( var i = 0; i < t.filesCount.length; i++ ) {
            var t = _processStatus;

            var dir = _processStatus.dataPath_dir;
            var path = _processStatus.dataPath
            var dirname = dir
            var data = t.idx + '.txt'
            var path_full_name = path + dirname + "/" + data
            var text = fs.readFileSync(path_full_name, 'utf-8')
            var _id_c = 0
            var r = [];
            var r1 = [];
            var contents = {}
            var dataMakeJson_func = function () {


                if (t.idx < t.filesCount.length) {
                    logger.log('info', "-[S]-- dataMakeJson");


                    var regex = /<script([^'"]|"(\\.|[^"\\])*"|'(\\.|[^'\\])*')f.*?<\/script>/ig
                    var s = text.match(regex)

                    var page_data_json__string = s[0].replace("<script>facade(\'app-item/detail-page.js\', ", "")
                    page_data_json__string = page_data_json__string.replace(");</script>", "")
                    var page_data_json__obj = JSON.parse(page_data_json__string);
                    date = new Date();
                    contents = {}
                    contents._id = t.data_max_num
                    contents.data = page_data_json__obj.data
                    contents.d_pub = {
                        y: parseInt(date.getFullYear())
                        , m: parseInt(date.getMonth() + 1)
                        , d: parseInt(date.getDate())
                        , ho: parseInt(date.getHours())
                        , mi: parseInt(date.getMinutes())
                        , se: parseInt(date.getSeconds())
                    };


                    r.push(contents);
                    if (r.length == 500 || t.idx == t.filesCount.length - 1) {
                        r1.push(r);
                        t.DataResult = [];
                    }

                    logger.log('info', "--[I]-- dataMakeJson_idx : ", t.idx);
                    logger.log('info', "-[E]-- dataMakeJson");
                    ++t.data_max_num
                    ++t.idx
                    ++_id_c
                    dataMakeJson_func()
                }

            }
            dataMakeJson_func()
            resolve(r1)

        })
    };

    this.db_insert = function (data) {
console.log(data)
        logger.log('info', "-[S]-- db_insert");
        return new Promise(function (resolve, reject) {
            var t = _processStatus;
            var r = data;
            var i = 0;
            var insert_func = function () {

                if (i < r.length) {
                    logger.log('info', "-[S]-- db_insert__insert_func");
                    var dataSelect = function (db, callback) {

                        db.collection('redgoodsdetails').insertMany(r[i], function (err, docs) {
                            if (err) {
                                logger.log('error', "db_insert__insert_func__run_query", err)
                            }
                            assert.equal(err, null);
                            logger.log('info', "--[I]-- db_insert__insert_func__insert_complete");
                            ++i;
                            callback(docs);
                            insert_func()
                        });
                    };

                    MongoClient.connect(url, function (err, db) {
                        if (err) {
                            logger.log('error', "db_insert__insert_func__run_query", err)
                        }
                        assert.equal(null, err);
                        dataSelect(db, function (cb) {
                            db.close()
                            logger.log('info', "--[I]-- db_insert__insert_func_complete");
                            logger.log('info', "-[E]-- db_insert__insert_func");
                        });
                    });

                }
                else {
                    logger.log('info', "-[E]-- db_insert");
                    resolve();
                }

            }
            insert_func()
        })
    };

    this.copy_dir = function () {
        return new Promise(function (resolve, reject) {
            var t = _processStatus;
            var data = t.dataPath_dir;
            logger.log('info', "-[E]-- copy_dir");
            var oldPath = "../redCrwData/saveCompleteData/goods_detail/";
            var newPath = "../redCrwData/insertCompleteData/goods_detail/";

            fse.copySync(oldPath + data, newPath + data);

            //for ( var i = 0 ; i < data.length ; i++ ) {
            //    console.log( "-[S]- copy_dir" + data[ i ] + "___" );
            //    fse.copySync( oldPath + data[ i ], newPath + data[ i ] );
            //    console.log( "------------------Data_Move_Complete------------------" );
            //    console.log( "-[E]- copy_dir" + data[ i ] + "___" );
            //}

            logger.log('info', "--[I]-- copy_dir____copy_complete");
            logger.log('info', "-[E]-- copy_dir");
            resolve()
        })

    };

    this.remove_dir = function () {
        return new Promise(function (resolve) {
            logger.log('info', "-[E]-- remove_dir");
            var t = _processStatus;
            var data = t.dataPath_dir;
            var oldPath = "../redCrwData/saveCompleteData/goods_detail/";

            fse.removeSync(oldPath + data);

            //for ( var i = 0 ; i < data.length ; i++ ) {
            //    console.log( "-[S]- remove_dir" + data[ i ] + "___" );
            //    fse.removeSync( oldPath + data[ i ] );
            //    console.log( "------------------directory_Delete_Complete------------------" );
            //    console.log( "-[E]- remove_dir" + data[ i ] + "___" );
            //}
            logger.log('info', "--[I]-- remove_dir____remove_files_Complete");
            resolve('all_process_complete');
            logger.log('info', "-[E]-- remove_dir");
        })
    };

    this.process_run = function () {
        MongoClient.connect(url, function (err, db) {
            logger.log('info', "==========================================================================================");
            logger.log('info', "-[S]-- process_run : ", new Date().toFormat('YYYYMMDDHH24MISS').substring(0, 12));
            if (err) {
                logger.log('error', "process_run", err)
            }
            ;
            assert.equal(null, err);
            logger.log('info', "--[I]- process_run : Connected to mongod server");

            _this.read_dir()
                .then(_this.dataMakeJson)
                .catch(function (err) {
                    logger.log('error', "dataMakeJson", err);
                })
                .then(_this.db_insert)
                .catch(function (err) {
                    logger.log('error', "db_insert", err);
                })
                // .then( _this.copy_dir )
                // .catch( function ( err ) {
                //     logger.log( 'error', "copy_dir", err );
                // } )
                // .then( _this.remove_dir )
                // .catch( function ( err ) {
                //     logger.log( 'error', "remove_dir", err );
                // } )
                .then(function (result) {
                    db.close();
                    logger.log('info', "--[I]-- process_run : ", result);
                    logger.log('info', "-[E]-- process_run : ", new Date().toFormat('YYYYMMDDHH24MISS').substring(0, 12));
                    logger.log('info', "==========================================================================================");
                })
        });
    }

    var folderName = new Date().toFormat('YYYYMMDD');
    var fileName = new Date().toFormat('YYYYMMDDHH24MISS');
    var fileType = '.log';
    var log_path_2 = '/red_goods_detail__insert_db/';
    var log_path_1 = '/goods';
    var log_path_0 = '/logs';

    var full_path = path.join(__dirname + log_path_0 + log_path_1 + log_path_2)
    var logType = {info: 'info', err: 'err'};

    var a = fs.existsSync(full_path + folderName);
    if (a === false) fs.mkdir(full_path + folderName, 0777);
    //logData 생성시 폴더및 파일명 생성;

    var logger = new ( winston.Logger )({
        transports: [
            new ( winston.transports.Console )({
                name: 'consoleLog'
                , colorize: false
                , timestamp: function () {
                    return new Date().toFormat('YYYY-MM-DD HH24:MI:SS');
                }
                , json: false
            })
            , new ( winston.transports.File )({
                name: 'infoLog'
                , level: 'info'
                , filename: full_path + fileName + '_' + logType.info + fileType
                , maxsize: 1000000
                , maxFiles: 100
                , timestamp: function () {
                    return new Date().toFormat('YYYY-MM-DD HH24:MI:SS');
                }
                , json: false
            })
            , new ( winston.transports.File )({
                name: 'errorLog'
                , level: 'error'
                , filename: full_path + fileName + '_' + logType.err + fileType
                , maxsize: 1000000
                , maxFiles: 100
                , timestamp: function () {
                    return new Date().toFormat('YYYY-MM-DD HH24: MI : SS');
                }
                , json: false
            })
        ]
    });
}
var redCrw = new global.csj.red_goods_detail__insert_db.RedCrw();
redCrw.process_run();

