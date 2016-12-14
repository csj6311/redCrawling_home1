//----------------------------------------------------------------------------------------------------;

//	REQUIRE;

//----------------------------------------------------------------------------------------------------;

require( "../csj_nodejs_common_modules/initialize__redCrawling.js" );

//----------------------------------------------------------------------------------------------------;

//	PACKAGE;

//----------------------------------------------------------------------------------------------------;

global.csj.scrappingGoods = global.csj.scrappingGoods || {};

//----------------------------------------------------------------------------------------------------;

//	CLASS - global.csj.scrapping.RedCrw;

//----------------------------------------------------------------------------------------------------;

/**
 * RED 데이터를 Scrapping 하는 객체
 * @class
 * @param {Object} data
 * @author 최석준
 */
global.csj.scrappingGoods.RedCrw = function ( data ) {
    
    
    //--------------------------------------------------;
    
    var _this = this;
    
    //--------------------------------------------------REQUIRE;
    
    var request   = global.csj.STATIC.NPM_MODULE.request;
    var fs        = global.csj.STATIC.NPM_MODULE.fs;
    var winston   = global.csj.STATIC.NPM_MODULE.winston;
    var dateUtils = global.csj.STATIC.NPM_MODULE.dateUtils;
    
    //--------------------------------------------------;
    
    //----------------------------------------------------------------------------------------------------;
    
    //	STATIC;
    
    //----------------------------------------------------------------------------------------------------;
    
    //--------------------------------------------------;
    
    //--------------------------------------------------;
    
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
        url              : {
            post   : 'http://m.xiaohongshu.com/api/snsweb/v1/get_related_discovery_by_keyword?keyword=%E9%9F%A9%E5%9B%BD&mode=tag_search&sort=general&page='
            ,
            goods  : 'http://m.xiaohongshu.com/api/store/v1/goods/tag?tagName=%E9%9F%A9%E5%9B%BD&tagId=area.52cfdcbeb4c4d64f495e4753&sort=general&page='
            ,
            search : 'http://m.xiaohongshu.com/api/snsweb/v1/search?keyword=mamonde&mode=word_search'
        }
        , len            : 250
        , idx            : 1
        , nItemStart     : 0
        , DataResult     : []
        , reRequestCount : 0
    };
    
    //--------------------------------------------------;
    
    //--------------------------------------------------;
    
    //--------------------------------------------------;
    
    //----------------------------------------------------------------------------------------------------;
    
    //	EVENT;
    
    //----------------------------------------------------------------------------------------------------;
    
    /**
     * @function
     * @param {Object} err
     * @param {*} result
     */
    _this.evt_Complete__reqData = function ( err, result ) {
        logger.log( 'info', "---[S]-- _this.evt_Complete__reqData" );
        if ( err ) console.log( err );
        if ( result.statusCode === 200 ) {
            logger.log( 'info', "-----[I]--result.statusCode : " + result.statusCode );
            try {
                _this.reqData_processor( result );
            }
            catch ( exception ) {
                logger.log( 'error', "_this.evt_Complete__logger.log", exception );
                _this.reqData_next();
            }
        }
        logger.log( 'info', "---[E]-- _this.evt_Complete__logger.log" );
    };
    
    //----------------------------------------------------------------------------------------------------;
    
    //	FUNCTION;
    
    //----------------------------------------------------------------------------------------------------;
    
    /**
     * 해당 API에 데이터 요청
     * @function
     */
    _this.reqData = function () {
        var t = _processStatus;
        try {
            if ( t.idx < t.len ) {
                logger.log( 'info', "-[S]-- _this.reqData" );
                try {
                    logger.log( 'info', "---[I]-- request__URL : " + t.url.goods + t.idx );
                    request( t.url.goods + t.idx, _this.evt_Complete__reqData );
                }
                catch ( exception ) {
                    console.log( exception );
                }
                logger.log( 'info', "-[E]-- _this.reqData" );
            }
        }
        catch ( exception ) {
            logger.log( 'error', "---[I]-- request__URL : " + t.url.goods + t.idx, { etc : exception } );
        }
    };
    
    /**
     * @function
     */
    _this.reqData_next = function () {
        logger.log( 'info', "---------[S]-- __this.reqData_next" );
        var t = _processStatus;
        ++t.idx;
        _this.reqData();
  
    };
    
    /**
     * @function
     * @param {Object} result
     */
    _this.reqData_processor = function ( result ) {
        logger.log( 'info', "-----[S]-- _this.reqData_processor" );
        
        var j           = JSON.parse( result.body );
        var t           = _processStatus;
        var crwlingDate = new Date().toISOString();
        j.crwlingDate   = crwlingDate;
        
        var dataCount = j.data.length;
        if ( dataCount > 0 ) {
            logger.log( 'info', "-----[I]-- _this.reqData_processor ---> _this.reqData_write_json Run" );
            t.reRequestCount = 0;
            _this.reqData_write_json( j );
        }
        
        else {
            _processStatus.len = _processStatus.idx;
        }
        logger.log( 'info', "-----[E]-- _this.reqData_processor" );
    };
    
    /**
     * @function
     * @param {Object} data
     */
    _this.reqData_write_json = function ( data ) {
        var t            = _processStatus;
        var fileFullpath = '../redCrwData/saveCompleteData/goods/';
        
        var dirName = new Date().toFormat( 'YYYYMMDDHH24MISS' ).substring( 0, 10 );
        console.log( "dirName : " + dirName );
        var fileType = '.json';
        var filename = new Date().toFormat( 'YYYYMMDDHH24MISS' ).substring( 0, 12 ) + '_' + t.idx + fileType;
        console.log( "filename : " + filename );
        //return;
        
        var c          = JSON.stringify( data );
        var fileResult = fileFullpath + dirName + "/" + filename;
        logger.log( 'info', "-------[S]-- _this.reqData_write_json" );
        var a = fs.existsSync( fileFullpath + dirName );
        if ( a === false ) {
            fs.mkdir( fileFullpath + dirName, 0777 )
        }
        fs.writeFileSync( fileResult, c, 'utf8' );
        
        logger.log( 'info', "---------[I]-- _this.reqData_write_json ---> " + filename );
        logger.log( 'info', "-------[E]-- _this.reqData_write_json" );
        
        //SUtilCP.sExec( "call node InsertRedData.js" );
        
        _this.reqData_next();
    };
    
    /**
     * 실행 함수
     * @function
     */
    _this.start = function () {
        _this.reqData()
    };
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
                    return new Date().toFormat( 'YYYY-MM-DD HH24         : MI : SS' );
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

var redCrw = new global.csj.scrappingGoods.RedCrw();
redCrw.start();
