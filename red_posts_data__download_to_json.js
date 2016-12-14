//----------------------------------------------------------------------------------------------------;

//	REQUIRE;

//----------------------------------------------------------------------------------------------------;

require( "d:/work/csj_nodejs_common_modules/initialize__redCrawling.js" );

//---------------------------------------------------------------------------------------------------;

//	PACKAGE;

//----------------------------------------------------------------------------------------------------;

global.csj.scrappingPost = global.csj.scrappingPost || {};

//----------------------------------------------------------------------------------------------------;

//	CLASS - global.csj.scrapping.RedCrw;

//----------------------------------------------------------------------------------------------------;

/**
 * RED 데이터를 Scrapping 하는 객체
 * @class
 * @param {Object} data
 * @author 최석준
 */
global.csj.scrappingPost = global.csj.scrappingPost || {};

//----------------------------------------------------------------------------------------------------;

//	CLASS - global.csj.scrapping.RedCrw;

//----------------------------------------------------------------------------------------------------;

/**
 * RED 데이터를 Scrapping 하는 객체
 * @class
 * @param {Object} data
 * @author 최석준
 */
global.csj.scrappingPost.RedCrw = function () {
    
    
    //--------------------------------------------------;
    
    var _this = this;
    
    //REQUIRE;
    var request     = global.csj.STATIC.NPM_MODULE.request;
    var fs          = global.csj.STATIC.NPM_MODULE.fs;
    var winston     = global.csj.STATIC.NPM_MODULE.winston;
    var dateUtils   = global.csj.STATIC.NPM_MODULE.dateUtils;
    var cheerio     = global.csj.STATIC.NPM_MODULE.cheerio;
    var mongoose    = global.csj.STATIC.NPM_MODULE.mongoose;
    var MongoClient = global.csj.STATIC.NPM_MODULE.mongoDB.MongoClient;
    var assert      = global.csj.STATIC.NPM_MODULE.assert
    //--------------------------------------------------;
    
    //----------------------------------------------------------------------------------------------------;
    
    //	STATIC;
    
    //----------------------------------------------------------------------------------------------------;
    
    //--------------------------------------------------;
    
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
            post   : 'http://m.xiaohongshu.com/api/snsweb/v1/get_related_discovery_by_keyword?keyword=%E9%9F%A9%E5%9B%BD&mode=tag_search&sort=time&page='
            ,
            goods  : 'http://m.xiaohongshu.com/api/store/v1/goods/tag?tagName=%E9%9F%A9%E5%9B%BD&tagId=area.52cfdcbeb4c4d64f495e4753&sort=general&page='
            ,
            search : 'http://m.xiaohongshu.com/api/snsweb/v1/search?keyword=mamonde&mode=word_search'
        }
        , len            : 500
        , idx            : 1
        , DataResult     : []
        , reRequestCount : 0
        , maxRegDate     : null
    };
    
    //var db = mongoose.connection;
    //db.on( 'error', console.error );
    //mongoose.connect( 'mongodb://49.175.149.94:9001/redData' );
    //var Schema          = mongoose.Schema;
    //var redPostssSchema = new Schema( {
    //    user               : {
    //        image            : String, //프로필이미지
    //        userid           : String, //아이디
    //        discoverys_total : Number, //게시물갯수
    //        likes            : { type : Number, default : 0 },//좋아요수
    //        nickname         : String,//별명
    //        id               : String,//아이디
    //        fans_total       : Number //팔로워수
    //    },
    //    title              : { type : String, default : null },//게시글제목
    //    image              : String,//게시글이미지
    //    related_goods_name : { type : String, default : null },//게시글관련상품
    //    likes              : Number,//좋아요수
    //    id                 : String,//게시글 아이디
    //    desc               : String,//게시글 짧은설명
    //    crawlingDate       : Date,//수집날짜
    //    regDate            : Date,//게시글 등록날짜
    //    detailYN           : { type : String, default : 'N' },//포스팅상세저장여부 (페이지상세소스 저장시사용)
    //    published_date     : { type : Date, default : Date.now } //데이터입력 Date
    //} );
    //var RedPosts        = mongoose.model( 'redposts', redPostssSchema );
    
    var url = 'mongodb://localhost/redData';
    
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
        //logger.log( 'info', "---[S]-- _this.evt_Complete__reqData" );
        if ( err ) console.log( err );
        //if ( result.statusCode === 200 ) {
        //logger.log( 'info', "-----[I]--result.statusCode : " + result.statusCode );
        try {
            _this.reqData_processor( result );
        }
        catch ( exception ) {
            //  logger.log( 'error', "_this.evt_Complete__logger.log", exception );
            _this.reqData_next();
        }
        //}
        //logger.log( 'info', "---[E]-- _this.evt_Complete__logger.log" );
    };
    
    //----------------------------------------------------------------------------------------------------;
    
    //	FUNCTION;
    
    //----------------------------------------------------------------------------------------------------;
    
    /**
     * 해당 API에 데이터 요청
     * @function
     */
    _this.reqData = function () {
        //logger.log( 'info', "-[S]-- _this.reqData" );
        var t = _processStatus;
        
        try {
            logger.log( 'info', '======================' + t.idx + '======================' )
            request( t.url.post + t.idx, _this.evt_Complete__reqData );
        }
        catch ( exception ) {
            logger.log( 'error', exception );
        }
        
        //logger.log( 'info', "-[E]-- _this.reqData" );
    };
    
    /**
     * @function
     */
    _this.reqData_next = function () {
        var t = _processStatus;
        ++t.idx;
        
        _this.reqData();
    };
    
    /**
     * @function
     * @param {Object} result
     */
    _this.reqData_processor = function ( result ) {
        
        var j         = JSON.parse( result.body );
        var dataCount = j.data.notes.length;
        if ( dataCount > 0 ) {
            _processStatus.reRequestCount = 0;
            _this.insertData( j );
        }
        else {
            
            _processStatus.len = _processStatus.idx;
            _this.reqData_write_json();
        }
        
    };
    
    /**
     * @function
     * @param {Object} data
     */
    _this.insertData = function ( data ) {
        
        var notes = data.data.notes;
        var j     = 0;
        for ( var i = 0 ; i < notes.length ; i++ ) {
            var notesId = notes[ i ].id;
            
            _this.publishedDateCheck( i, notesId, notes[ i ] )
            
        }
        
        var t = _processStatus;
        if ( t.idx < t.len ) {
            _this.reqData_next();
        }
        else {
            console.log( "END" )
            console.log( "-[S]- mongoose.disconnect" );
            MongoClient.connect( url, function ( err, db ) {
                assert.equal( null, err );
                db.close( function () {
                    console.log( "dbClose" )
                    _this.reqData_write_json();
                    
                } );
            } );
            console.log( "-[E]- mongoose.disconnect" );
            
        }
        
    };
    
    _this.publishedDateCheck = function ( i, data, data1 ) {
        var t           = _processStatus;
        var url         = 'http://m.xiaohongshu.com/discovery/item/';
        var note        = data1;
        var crwlingDate = new Date().toISOString();
        
        var dataExistCheck = function ( param, callback ) {
            var dataExistCheck_query = function ( db, callback ) {
                
                db.collection( 'redposts1' ).find( { post_id : param } ).toArray( function ( err, docs ) {
                    assert.equal( err, null );
                    callback( docs );
                } );
            };
            var url                  = 'mongodb://localhost/redData';
            MongoClient.connect( url, function ( err, db ) {
                assert.equal( null, err );
                dataExistCheck_query( db, function ( cb ) {
                    db.close( function () {
                        callback( cb.length )
                    } );
                    
                } );
            } );
            
        }
        request( url + data, function ( err, res, body ) {
            if ( body ) {
                var $     = cheerio.load( body );
                var title = $( 'title' ).text();
                var arr   = $( 'time' ).attr( 'datetime' )
                
                if ( title == '迷路了吧' ) {
                    //removeFileUndefind( path + id );
                    logger.log( 'error', "error => 404 : ", data )
                }
                else if ( arr == undefined ) {
                    logger.log( 'error', "new_posting_type : ", data )
                }
                else {
                    
                    var id = $( '#xhssharelinkurl' ).text().split( '/' )[ 5 ];
                    
                    // 데이터가 존재하는지 체크 함수
                    
                    //var regdatePostToDateType = function ( param ) {
                    //    if ( param ) {
                    //        var dateString = param;
                    //        var reggie     = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/;
                    //        var dateArray  = reggie.exec( dateString );
                    //        var dateObject = new Date(
                    //            (+dateArray[ 1 ]),
                    //            (+dateArray[ 2 ]) - 1, // Careful, month starts at 0!
                    //            (+dateArray[ 3 ]),
                    //            (+dateArray[ 4 ]),
                    //            (+dateArray[ 5 ]),
                    //            (+dateArray[ 6 ])
                    //        );
                    //        var datePaser  = Date.parse( dateObject );
                    //        return datePaser;
                    //    }
                    //};
                    //
                    //var maxPostRegdate = function ( param ) {
                    //    var newDate   = new Date( param );
                    //    var datePaser = Date.parse( newDate );
                    //    return datePaser;
                    //};
                    
                    dataExistCheck( id, function ( checkResult ) {
                        if ( checkResult == 0 ) {
                            if ( _processStatus.len > _processStatus.idx ) {
                                //    if ( true ) {
                                logger.log( 'info', arr, '=>' + data, arr.split( " " )[ 0 ] );
                                note.regDate     = arr
                                note.crwlingDate = crwlingDate;
                                
                                t.DataResult.push( data1 );
                                
                                if ( t.DataResult.length == 200 ) {
                                    _this.reqData_write_json();
                                }
                            }
                            else {
                                console.log( checkResult )
                                _processStatus.len = _processStatus.idx;
                                _this.reqData_write_json();
                                process.exit( 0 )
                            }
                        }
                        
                    } )
                }
            }
        } )
        
    };
    
    _this.reqData_write_json = function () {
        
        var t            = _processStatus;
        var fileFullpath = '../redCrwData/saveCompleteData/posts/';
        var data         = t.DataResult;
        var dirName      = new Date().toFormat( 'YYYYMMDDHH24MISS' ).substring( 0, 8 );
        var fileType     = '.json';
        var filename     = new Date().toFormat( 'YYYYMMDDHH24MISS' ) + '_' + t.idx + fileType;
        logger.log( "filename : " + filename );
        
        var c          = JSON.stringify( data );
        var fileResult = fileFullpath + dirName + "/" + filename;
        var a          = fs.existsSync( fileFullpath + dirName );
        if ( a === false ) {
            fs.mkdir( fileFullpath + dirName, 0777 )
            sleep(1000)
        }
        fs.writeFileSync( fileResult, c, 'utf8' );
        t.DataResult = [];
        
        if ( _processStatus.len == _processStatus.idx ) {
            process.exit( 0 )
        }
    };
    
    /**
     * 실행 함수
     * @function
     */
    _this.start = function () {
        var t = _processStatus;
        //var curDate = new Date().toFormat( 'YYYYMMDDHH24MISS' );
        //logger.log( 'info', 'StartTimr : ', curDate )
        //db.once( 'open', function () {
        //    // RedPosts.find({}, {regDate : 1,_id: 0}, {sort:{'redDate':-1}, skip:0, limit:1}, function(err, data) {
        //    RedPosts.find( {}, {
        //        _id     : 0,
        //        regDate : 1
        //    } ).sort( { regDate : -1 } ).limit( 1 ).exec( function ( err, data ) {
        //        console.log( data )
        //        t.maxRegDate = data[ 0 ].regDate;
        //        _this.reqData()
        //        console.log( t )
        //        //callback(err, categories);
        //    } );
        //} )
        
        //var dataExistCheck_query = function ( db, callback ) {
        //
        //    db.collection( 'redposts1' ).find( {prd_id : param }).toArray( function ( err, docs ) {
        //        assert.equal( err, null );
        //        callback( docs );
        //    } );
        //};
        //var id = '58103e9d14de4168eb245642'
        //
        //var a = function ( param, callback ) {
        //    var dataExistCheck_query = function ( db, callback ) {
        //
        //        db.collection( 'redposts1' ).find( { post_id : param } ).toArray( function ( err, docs ) {
        //            assert.equal( err, null );
        //            callback( docs );
        //        } );
        //    };
        //
        //    MongoClient.connect( url, function ( err, db ) {
        //        assert.equal( null, err );
        //        dataExistCheck_query( db, function ( cb ) {
        //            db.close( function () {
        //                console.log( "dbClose0" )
        //                console.log( cb.length )
        //                callback( cb.length )
        //            } );
        //
        //        } );
        //    } );
        //
        //}
        //
        //a( id, function ( aaa ) {
        //    console.log( aaa )
        //} )
        //
        MongoClient.connect( url, function ( err, db ) {
            assert.equal( null, err );
            
            db.close( function () {
                console.log( "dbClose0" )
                _this.reqData()
            } );
            
        } );
        
        console.log( "Connected to mongod server" );
        
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
    
    var sleep = function(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds){
                break;
            }
        }
    }
    
//logData 생성시 폴더및 파일명 생성
    var folderName = new Date().toFormat( 'YYYYMMDD' );
    var fileName   = new Date().toFormat( 'YYYYMMDDHH24MISS' );
    var fileType   = '.log';
    var path       = './logs/';
    var logType    = { info : 'info', err : 'err', miss : "miss" };
    
    var a = fs.existsSync( path + folderName );
    console.log( path + folderName );
    if ( a === false ) fs.mkdir( path + folderName, 0777 );
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
                
                , json : false
            } )
            , new ( winston.transports.File )( {
                name        : 'missLog'
                , level     : 'miss'
                , filename  : path + folderName + "/" + fileName + '_' + logType.miss + fileType
                , maxsize   : 1000000
                , maxFiles  : 100
                , timestamp : function () {
                    return new Date().toFormat( 'YYYY-MM-DD HH24:MI:SS' );
                }
                
                , json : false
            } )
        
        ]
    } );
    
    console.log( "---- [ E ] - global.csj.scrapping.RedCrw():{Object}----------" );
    
    return this;
}
;

var redCrw = new global.csj.scrappingPost.RedCrw()
redCrw.start();

