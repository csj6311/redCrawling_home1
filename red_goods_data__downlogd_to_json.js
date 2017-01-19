//----------------------------------------------------------------------------------------------------;
//
//	REQUIRE;

//----------------------------------------------------------------------------------------------------;

require( "d:/work/csj_nodejs_common_modules/initialize__redCrawling.js" );

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

    var request = global.csj.STATIC.NPM_MODULE.request;
    var fs = global.csj.STATIC.NPM_MODULE.fs;
    var winston = global.csj.STATIC.NPM_MODULE.winston;
    var dateUtils = global.csj.STATIC.NPM_MODULE.dateUtils;
    var path = global.csj.STATIC.NPM_MODULE.path;
    var Logger  = global.csj.STATIC.NPM_MODULE.Logger;

    //--------------------------------------------------;

var logger = new Logger({ token:'54238e5e-fb23-486e-abe4-548cec7faec0' });

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
    var dirName = new Date().toFormat( 'YYYYMMDDHH24MISS' ).substring( 0, 10 );
    var _processStatus = {
        url: {
            post: 'http://m.xiaohongshu.com/api/snsweb/v1/get_related_discovery_by_keyword?keyword=%E9%9F%A9%E5%9B%BD&mode=tag_search&sort=general&page='
            ,
            goods: 'http://m.xiaohongshu.com/api/store/v1/goods/tag?tagName=%E9%9F%A9%E5%9B%BD&tagId=area.52cfdcbeb4c4d64f495e4753&sort=general&page='
            ,
            search: 'http://m.xiaohongshu.com/api/snsweb/v1/search?keyword=mamonde&mode=word_search'
        }
        , len: 400
        , idx: 1
        , nItemStart: 0
        , DataResult: []
        , reRequestCount: 0
        , fail_request_idx: []
        , save_dir_name: dirName
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
        logger.log( 'info', "-[S]-- evt_Complete__reqData" );
        var t = _processStatus;
        if ( err ) log.log( err );
        if ( result.statusCode === 200 ) {
            try {
                _this.reqData_processor( result );
            }
            catch ( exception ) {
                logger.log( 'error', "evt_Complete__logger.log", t.idx, exception );
                t.fail_request_idx.push( t.idx );
                _this.reqData_next();
            }
        }
        logger.log( 'info', "-[E]-- evt_Complete__logger.log" );
    };

    //----------------------------------------------------------------------------------------------------;

    //	FUNCTION;

    //----------------------------------------------------------------------------------------------------;

    /**
     * 해당 API에 데이터 요청
     * @function
     */
    _this.reqData = function () {
        logger.log( 'info', "-[S]-- reqData" );
        var t = _processStatus;
        try {
            if ( t.idx < t.len ) {
                try {
                    logger.log( 'info', "--[I]--reqData____request__URL : " + t.url.goods + t.idx );
                            request( t.url.goods + t.idx, _this.evt_Complete__reqData )
                }
                catch ( exception ) {
                    console.log( exception );
                }
            }
        }
        catch ( exception ) {
            logger.log( 'error', "--[I]--reqData____request__URL : " + t.url.goods + t.idx, exception );
        }
        logger.log( 'info', "-[E]-- reqData" );
    };

    /**
     * @function
     */
    _this.reqData_next = function () {
        logger.log( 'info', "-[S]-- reqData_next" );
        var t = _processStatus;
        ++t.idx;
        logger.log( 'info', "-[E]-- reqData_next" );
        _this.reqData();

    };

    /**
     * @function
     * @param {Object} result
     */
    _this.reqData_processor = function ( result ) {
        logger.log( 'info', "-[S]-- reqData_processor" );

        var j = JSON.parse( result.body );
        var t = _processStatus;
        var crwlingDate = new Date().toISOString();
        j.crwlingDate = crwlingDate;

        var dataCount = j.data.length;
        if ( dataCount > 0 ) {
            logger.log( 'info', "--[I]-- reqData_processor____reqData_write_json Run" );
            t.reRequestCount = 0;
            //_this.reqData_write_json( j );
            _this.stock_add( j )
        }

        else {
            _processStatus.len = _processStatus.idx;
        }
        logger.log( 'info', "-[E]-- reqData_processor" );
        logger.log( 'info', "-[E]-- start : ", new Date().toFormat( 'YYYYMMDDHH24MISS' ).substring( 0, 12 ) );
        logger.log( 'info', "==========================================================================================" );
    };

    /**
     * @function
     * @param {Object} data
     */


    _this.stock_add = function ( data ) {

        var idx = 0
        var len = data.data.length

        var c = 0


        var arr_1 = []
        var arr_2 = []
        var date1 = {};


        var date2 = {};
        var bbb = function () {

            if ( idx < len ) {


                var redGoods = {}
                redGoods.data = data.data[ idx ]
                console.log( redGoods.data.id )

                var options = {
                    url: 'http://m.xiaohongshu.com/goods/' + redGoods.data.id,
                    headers: {
                        'content-type': 'application/json'
                    },
                    timeout: 10000

                };
                try {
                    request.get(
                        options, function ( err, res ) {
                            //console.log(res)
                            if ( res ) {
                                try {
                                    var regex = /<script([^'"]|"(\\.|[^"\\])*"|'(\\.|[^'\\])*')f.*?<\/script>/ig
                                    var s = res.body.match( regex )

                                    var page_data_json__string = s[ 0 ].replace( "<script>facade(\'app-item/detail-page.js\', ", "" )
                                    page_data_json__string = page_data_json__string.replace( ");</script>", "" )
                                    var page_data_json__obj = JSON.parse( page_data_json__string );

                                    redGoods.stock = page_data_json__obj.data.stock
                                    redGoods.prd_id = page_data_json__obj.data.item.source_id
                                    redGoods.price = page_data_json__obj.data.item.price
                                    //redGoods.original_price = page_data_json__obj.data.item.source_id

                                    //console.log(redGoods)


                                    date2 = new Date();
                                    logger.log( 'info', "-[E]-- readData_process__3__crwlingDate : ", date2 );

                                    redGoods.d_scrapping = {
                                        y: parseInt( date2.getFullYear() )
                                        , m: parseInt( date2.getMonth() + 1 )
                                        , d: parseInt( date2.getDate() )
                                        , ho: parseInt( date2.getHours() )
                                        , mi: parseInt( date2.getMinutes() )
                                        , se: parseInt( date2.getSeconds() )
                                    };


                                    arr_1.push( redGoods )
                                    console.log( "idx=", idx, " / len=", len )
                                    if ( arr_1.length == 500 || idx == len - 1 ) {

                                        _this.reqData_write_json( arr_1 )
                                        arr_1 = []
                                        c = 0
                                    }
                                }
                                catch ( exception ) {
                                    logger.log( 'error', "evt_Complete__logger.log", t.idx, exception );
                                }


                            } else {
                                logger.log( 'info', "3__1 : " + c );
                                //sleep(300)
                                //bbb()
                            }
                            //console.log("arr_1",arr_1)
                            //console.log("arr_2",arr_2)
                            //console.log(c)
                            ++c
                            ++idx;
                            //sleep(300)
                            bbb()
                        }
                    )
                }
                catch ( exception ) {
                    logger.log( 'error', "evt_Complete__logger.log", t.idx, exception );
                }
            }
        }

        bbb();


        // logger.log('info', "-[E]-- readData_process__3");

    };


    _this.reqData_write_json = function ( data ) {
        logger.log( 'info', "-[S]-- reqData_write_json" );
        var t = _processStatus;
        var fileFullpath = '../redCrwData/saveCompleteData/goods/';

        var dirName = t.save_dir_name;
        var fileType = '.json';
        var filename = new Date().toFormat( 'YYYYMMDDHH24MISS' ).substring( 0, 12 ) + '_' + t.idx + fileType;

        var c = JSON.stringify( data );
        var fileResult = fileFullpath + dirName + "/" + filename;
        var a = fs.existsSync( fileFullpath + dirName );
        if ( a === false ) {
            fs.mkdir( fileFullpath + dirName, 0777 )
            sleep( 1000 );
        }
        fs.writeFileSync( fileResult, c, 'utf8' );

        logger.log( 'info', "--[I]-- reqData_write_json_result :  " + filename );
        logger.log( 'info', "-[E]-- reqData_write_json" );
        _this.reqData_next();
    };

    /**
     * 실행 함수
     * @function
     */
    _this.process_run = function () {
        logger.log( 'info', "==========================================================================================" );
        logger.log( 'info', "-[S]-- process_run : ", new Date().toFormat( 'YYYYMMDDHH24MISS' ).substring( 0, 12 ) );
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
    var sleep = function ( milliseconds ) {
        var start = new Date().getTime();
        for ( var i = 0; i < 1e7; i++ ) {
            if ( (new Date().getTime() - start) > milliseconds ) {
                break;
            }
        }
    }

    /*-----------------------------------------------------------------------------------------------------------*/
    /*-----------------------------------------------------------------------------------------------------------*/
    /*날짜관련 function*/
    /*-----------------------------------------------------------------------------------------------------------*/

    return this;
};

var redCrw = new global.csj.scrappingGoods.RedCrw();
redCrw.process_run();