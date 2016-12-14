//----------------------------------------------------------------------------------------------------;

//	REQUIRE;

//----------------------------------------------------------------------------------------------------;

require( "d:/work/csj_nodejs_common_modules/initialize__redCrawling.js" );

//---------------------------------------------------------------------------------------------------;

//	PACKAGE;

//----------------------------------------------------------------------------------------------------;

global.csj.scrapping = global.csj.scrapping || {};

//----------------------------------------------------------------------------------------------------;

//	CLASS - global.csj.scrapping.RedCrw;

//----------------------------------------------------------------------------------------------------;

/**
 * RED 데이터를 Scrapping 하는 객체
 * @class
 * @param {Object} data
 * @author 최석준
 */
global.csj.scrapping.RedCrw = function () {
    
    
    //--------------------------------------------------;
    
    var _this = this;
    
    //--------------------------------------------------REQUIRE;
    
    var request     = global.csj.STATIC.NPM_MODULE.request;
    var fs          = global.csj.STATIC.NPM_MODULE.fs;
    var winston     = global.csj.STATIC.NPM_MODULE.winston;
    var dateUtils   = global.csj.STATIC.NPM_MODULE.dateUtils;
    var MongoClient = global.csj.STATIC.NPM_MODULE.mongoDB.MongoClient;
    var assert      = global.csj.STATIC.NPM_MODULE.assert
    
    //--------------------------------------------------;
    
    //----------------------------------------------------------------------------------------------------;
    
    //	STATIC;
    
    //----------------------------------------------------------------------------------------------------;
    
    //--------------------------------------------------;
    
    //--------------------------------------------------;
    
    var url = 'mongodb://49.175.149.94:9001/redData';
    
    //--------------------------------------------------;
    
    //--------------------------------------------------;
    
    //--------------------------------------------------;
    
    /**
     * 게시글 호출 API URL
     * http://m.xiaohongshu.com/api/snsweb/v1/get_related_discovery_by_keyword?keyword=%E9%9F%A9%E5%9B%BD&mode=tag_search&page=1&sort=general
     *
     * 상품리스트 호출 API URL
     * http://m.xiaohongshu.com/api/store/v1/goods/tag?tagName=%E9%9F%A9%E5%9B%BD&tagId=area.52cfdcbeb4c4d64f495e4753&page=1&sort=general
     *
     * 검색시 상품,게시글 호풀 API URL
     * http://m.xiaohongshu.com/api/snsweb/v1/search?keyword=mamonde&mode=word_search
     
     * @property {Object}
     * <code>
     * {
	 *  //...
	 * }
     * </code>
     */
    var _processStatus = {
        url   : {
            post  : 'http://m.xiaohongshu.com/discovery/item/'
            ,
            goods : 'http://m.xiaohongshu.com/goods/'
        }
        , len : 10000
        , idx : 0
    }
    
    //--------------------------------------------------;
    
    //--------------------------------------------------;
    
    //--------------------------------------------------;
    
    //----------------------------------------------------------------------------------------------------;
    
    //	EVENT;
    
    //----------------------------------------------------------------------------------------------------;
    
    //----------------------------------------------------------------------------------------------------;
    
    //	FUNCTION;
    
    //----------------------------------------------------------------------------------------------------;
    
    /**
     * 해당 API에 데이터 요청
     * @function
     */
    asdfasdf



    
    _this.process_1 = function () {
        return new Promise( function ( resolve ) {
            var dataSelect = function ( db, callback ) {
                
                db.collection( 'redgoods' ).aggregate( [
                        {$group : {_id : "$id" } }
                    ],{ allowDiskUse : true }       // For faster processing if set is larger
                ).toArray( function ( err, docs ) {
                    assert.equal( err, null );
                    //resolve(docs);
                    callback( docs );
                } );
            };
            
            MongoClient.connect( url, function ( err, db ) {
                assert.equal( null, err );
                dataSelect( db, function ( cb ) {
                    db.close()
                    resolve( cb );
                    
                } );
            } );
        } )
    }
    
    _this.process_1__1 = function ( data ) {
        console.log(data)
        return new Promise( function ( resolve ) {
            
            var dataArr = [];
            for ( var i = 0 ; i < data.length ; i++ ) {
                var fileFullpath = '../redCrwData/saveCompleteData/goods_detail/';
                var dirName      = new Date().toFormat( 'YYYYMMDDHH24MISS' ).substring( 0, 8 );
                var fileType     = '.txt';
                var filename     = data[ i ]._id + fileType;
                var fileResult   = fileFullpath + dirName + "/" + filename;
                
                //if ( fs.existsSync( fileResult ) ) {
                //    //logger.log( 'info', filename + fileType, 'file__Exist' )
                //}
                //else {
                dataArr.push( data[ i ] )
                //logger.log( 'info', filename + fileType, 'file__not__Exist' )
                
                //}
            }
            logger.log( "info", dataArr.length );
            
            if ( dataArr.length === 0 ) {
                console.log( "data_not_exist" )
                resolve( dataArr )
            }
            else {
                //_this.process_2( dataArr );
                resolve( dataArr )
                //console.log("1==>",dataArr)
            }
            
        } )
    }
    
    _this.process_2 = function ( data ) {

        return new Promise( function ( resolve ) {
            var t = _processStatus;
            console.log(data[ t.idx ]._id);
            t.len           = data.length
            var reqHtmlRead = function () {
                console.log("reqHtmlRead")
                if ( t.idx == t.len ) {
                    resolve( 'All__Done!' )
                }
                else {
                    try {
                        
                        request( t.url.goods + data[ t.idx ]._id, function ( err, res, body ) {
                            if ( err ) {
                                logger.log( 'err', err )
                            }
                            
                            resHtmlWrite( data[ t.idx ]._id, body )
                            
                        } );
                        //}
                    }
                    catch ( exception ) {
                        logger.log( 'err', exception )
                    }
                }
            };
            
            var detailYN__update__Y = function ( id ) {
                console.log("detailYN__update__Y")
                var updateId   = id;
                var dataSelect = function ( db, callback ) {
                    db.collection( 'redgoods' ).update( { id : updateId }, { $set : { detailYN : 'Y' } }, {multi: true}, function ( err, docs ) {
                        assert.equal( err, null );
                        callback( docs );
                    } );
                };
                
                MongoClient.connect( url, function ( err, db ) {
                    assert.equal( null, err );
                    dataSelect( db, function () {
                        console.log( "update__Success" )
                        ++t.idx;
                        db.close();
                        reqHtmlRead();
                    } );
                    
                } );
                
            }
            
            var resHtmlWrite = function ( filename, data ) {
                console.log("resHtmlWrite")
                var fileFullpath  = '../redCrwData/saveCompleteData/goods_detail/';
                var dirName       = new Date().toFormat( 'YYYYMMDDHH24MISS' ).substring( 0, 8 );
                var fileType      = '.txt';
                var filename_type = filename + fileType;
                var c             = data;
                var fileResult    = fileFullpath + dirName + "/" + filename_type;
                var a             = fs.existsSync( fileFullpath + dirName );
                if ( a === false ) {
                    fs.mkdir( fileFullpath + dirName, 0777 )
                }
                
                var b = fs.existsSync( fileResult );
                
                fs.writeFile( fileResult, c, 'utf8', function ( err ) {
                    if ( err ) {
                        console.log( err )
                    }
                    else {
                        console.log( filename )
                        //detailYN__update__Y( filename )
                        ++t.idx;
                        reqHtmlRead();
                    }
                } );
                logger.log( 'info', filename + fileType, 'write__Complete' )
                
            }
            
            if ( data.length > 0 ) {
                try {
                    logger.log( 'info', t.idx )
                    reqHtmlRead()
                    //resolve( 'AllDone2' )
                }
                catch ( exception ) {
                    console.log( exception );
                }
            }
            else {
                resolve( 'AllDone' )
            }
            //resolve( 'AllDone' )
            
        } )
    }
    
    this.run = function () {
        
        MongoClient.connect( url, function ( err, db ) {
            assert.equal( null, err );
            _this.process_1()
                 .then( _this.process_1__1 )
                 .catch( function ( err ) {
                     console.log( err )
                 } )
                 .then( _this.process_2 )
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
    };
    
    /**
     * 실행 함수
     * @function
     */
        //_this.start = function () {
        //    _this.process_1()
        //};
        //----------------------------------------------------------------------------------------------------;
        
        //	GETTER / SETTER;
        
        //----------------------------------------------------------------------------------------------------;
        
        //--------------------------------------------------;
        
        //--------------------------------------------------;
        
        //--------------------------------------------------;
        
        //--------------------------------------------------;
        
        //--------------------------------------------------;
        
        //--------------------------------------------------;
        
        //--------------------------------------------------;
        
        //----------------------------------------------------------------------------------------------------;
        
        //	LOGIC;
        
        //----------------------------------------------------------------------------------------------------;
        
        //logData 생성시 폴더및 파일명 생성
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
    
    /*-----------------------------------------------------------------------------------------------------------*/
    /*-----------------------------------------------------------------------------------------------------------*/
    /*날짜관련 function*/
    /*-----------------------------------------------------------------------------------------------------------*/
    
    console.log( "---- [ E ] - global.csj.scrapping.RedCrw():{Object}----------" );
    
    return this;
};

var redCrw1 = new global.csj.scrapping.RedCrw();
redCrw1.run()
