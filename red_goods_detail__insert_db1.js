/**
 * Created by B2LiNK on 2016-11-14.
 */


require( "d:/work/csj_nodejs_common_modules/initialize__redCrawling.js" );
var cheerio  = global.csj.STATIC.NPM_MODULE.cheerio;
var fs       = global.csj.STATIC.NPM_MODULE.fs;
var winston  = global.csj.STATIC.NPM_MODULE.winston;
var mongoose = global.csj.STATIC.NPM_MODULE.mongoose;
var fse      = global.csj.STATIC.NPM_MODULE.fse;
var MongoClient = global.csj.STATIC.NPM_MODULE.mongoDB.MongoClient;
var assert      = global.csj.STATIC.NPM_MODULE.assert


global._processStatus = {
    dataPath     : 'D:/work/project/redCrwData/saveCompleteData/goods_detail/20161121/'
    , filesCount : null
    , DataResult : []
    , idx        : 0
};

var url = 'mongodb://49.175.149.94:9001/redData';
global._processStatus.filesCount     = fs.readdirSync( global._processStatus.dataPath );

var readDate = function () {
    var t = global._processStatus;
    var r = t.DataResult;
    
    if ( t.idx < t.filesCount.length ) {
        try {
            dataMakeJson( t.idx + '.txt' )
        }
        catch ( exception ) {
            logger.log( 'error', exception );
        }
        
        if ( r.length == 100 ) {
            insertDBtoData( 1 );
        }
        else if ( t.idx == t.filesCount.length - 1 ) {
            insertDBtoData( 0 );
        }
        else {
            ++t.idx;
            readDate();
        }
    }
    
};

var insertDBtoData = function ( data ) {
    var t = global._processStatus
    var r = t.DataResult
    if ( data == 1 ) {
        var dataSelect = function ( db, callback ) {
        
            db.collection( 'redgoodsdetails' ).insertMany(r, function ( err, docs ) {
                assert.equal( err, null );
                //resolve(docs);
                callback( docs );
            } );
        };
    
        MongoClient.connect( url, function ( err, db ) {
            assert.equal( null, err );
            dataSelect( db, function ( cb ) {
                db.close()
                console.log("1");
                ++t.idx;
                global._processStatus.DataResult = [];
                readDate();
            } );
        } );
    }
    else {
        var dataSelect = function ( db, callback ) {
        
            db.collection( 'redgoodsdetails' ).insertMany(r, function ( err, docs ) {
                assert.equal( err, null );
                //resolve(docs);
                callback( docs );
            } );
        };
    
        MongoClient.connect( url, function ( err, db ) {
            assert.equal( null, err );
            dataSelect( db, function ( cb ) {
                db.close()
                console.log("2");
                db.close( function () {
                    console.log( "dbClose" )
                } );
            } );
        } );
        
    }
}

var date = {};
var dataMakeJson = function ( data ) {
    var t = _processStatus
    var r = t.DataResult
    var path = global._processStatus.dataPath
    var text = fs.readFileSync( path + data, 'utf-8' )
    
    var contents = {};
    
    
    
    var regex = /<script([^'"]|"(\\.|[^"\\])*"|'(\\.|[^'\\])*')f.*?<\/script>/ig
    var s = text.match(regex)
    
    var page_data_json__string = s[0].replace("<script>facade(\'app-item/detail-page.js\', ","")
    page_data_json__string = page_data_json__string.replace(");</script>","")
    var page_data_json__obj = JSON.parse(page_data_json__string);
    date = new Date();
    contents.data = page_data_json__obj.data
    contents.d_pub = {
        y : parseInt(date.getFullYear())
        , m : parseInt(date.getMonth())
        , d : parseInt(date.getDate())
        , ho : parseInt(date.getHours())
        , mi : parseInt(date.getMinutes())
        , se : parseInt(date.getSeconds())
    };
    
    
    r.push( page_data_json__obj );

    
};

var folderName = new Date().toFormat( 'YYYYMMDD' );
var fileName   = new Date().toFormat( 'YYYYMMDDHH24MISS' );
var fileType   = '.log';
var path       = './logs/';
var logType    = { info : 'info', err : 'err' };

var a = fs.existsSync( path + folderName );
console.log( path + folderName );
if ( a === false ) fs.mkdir( path + folderName, 0777 );
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
            , filename  : path + folderName + "/" + fileName + '_' + logType.info + fileType
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
            , filename  : path + folderName + "/" + fileName + '_' + logType.err + fileType
            , maxsize   : 1000000
            , maxFiles  : 100
            , timestamp : function () {
                return new Date().toFormat( 'YYYY-MM-DD HH24:MI:SS' );
            }
            , json      : false
        } )
    ]
} );

MongoClient.connect( url, function ( err, db ) {
    assert.equal( null, err );
    readDate();
} )