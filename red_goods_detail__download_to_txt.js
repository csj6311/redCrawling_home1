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
	var _this       = this;
	//--------------------------------------------------REQUIRE;
	var request     = global.csj.STATIC.NPM_MODULE.request;
	var fs          = global.csj.STATIC.NPM_MODULE.fs;
	var winston     = global.csj.STATIC.NPM_MODULE.winston;
	var dateUtils   = global.csj.STATIC.NPM_MODULE.dateUtils;
	var MongoClient = global.csj.STATIC.NPM_MODULE.mongoDB.MongoClient;
	var assert      = global.csj.STATIC.NPM_MODULE.assert
	var path        = global.csj.STATIC.NPM_MODULE.path;
	//--------------------------------------------------;
	//----------------------------------------------------------------------------------------------------;
	//	STATIC;
	//----------------------------------------------------------------------------------------------------;
	//--------------------------------------------------;
	//--------------------------------------------------;
	var url = 'mongodb://localhost/redData';
	//var url = 'mongodb://49.175.149.94:9001/redData'
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
	
	_this.process_1 = function () {
		return new Promise( function ( resolve ) {
			logger.log( 'info', "-[S]-- process_1" );
			var dataSelect = function ( db, callback ) {
				db.collection( 'redgoodslist' ).find( { p_detail : 'N' }, {
					_id    : 0,
					prd_id : 1
				} ).toArray( function ( err, docs ) {
					if ( err ) {logger.log( 'error', "readData_process_1____query", err )}
					assert.equal( err, null );
					callback( docs );
				} );
			};
			MongoClient.connect( url, function ( err, db ) {
				if ( err ) {logger.log( 'error', "readData_process_1____run_query", err )}
				assert.equal( null, err );
				dataSelect( db, function ( cb ) {
					db.close();
					logger.log( 'info', "-[E]-- process_1" );
					resolve( cb );
				} );
			} );
		} )
	}
	_this.process_2  = function ( data ) {
		return new Promise( function ( resolve ) {
			logger.log( 'info', "-[S]-- process_2" );
			var t                   = _processStatus;
			t.len                   = data.length
			var reqHtmlRead         = function () {
				if ( t.idx == t.len ) {
					logger.log( 'info', "-[E]-- process_2" );
					resolve( 'All__Done!' )
				}
				else {
					try {
						logger.log( 'info', "-[S]-- process_2__reqHtmlRead" );
						request( t.url.goods + data[ t.idx ].prd_id, function ( err, res, body ) {
							if ( err ) {logger.log( 'err', "process_2__reqHtmlRead__request : ", err )}
							logger.log( 'info', "-[E]-- process_2__reqHtmlRead" );
							resHtmlWrite( body )
						} );
					}
					catch ( exception ) {
						logger.log( 'err', "process_2__reqHtmlRead : ", exception )
					}
				}
			};
			var detailYN__update__Y = function ( id ) {
				var updateId = id;
				logger.log( 'info', "-[S]-- process_2__detailYN__update__Y" );
				var data_update = function ( db, callback ) {
					db.collection( 'redgoodslist' ).update( { prd_id : updateId }, { $set : { p_detail : 'Y' } }, function ( err, docs ) {
						logger.log( 'err', "process_2__detailYN__update__Y : ", err )
						assert.equal( err, null );
						callback( docs );
					} );
				};
				MongoClient.connect( url, function ( err, db ) {
					assert.equal( null, err );
					data_update( db, function () {
						logger.log( 'info', "--[I]- process_2__detailYN__update__Y__result : update__Success" );
						db.close();
						++t.idx;
						logger.log( 'info', "-[E]-- process_2__detailYN__update__Y" );
						reqHtmlRead();
					} );
				} );
			}
			var resHtmlWrite = function ( html ) {
				logger.log( 'info', "-[S]-- process_2__resHtmlWrite" );
				var t             = _processStatus
				var filename      = t.idx;
				var fileFullpath  = '../redCrwData/saveCompleteData/goods_detail/';
				var dirName       = new Date().toFormat( 'YYYYMMDDHH' ).substring( 0, 10 );
				var fileType      = '.txt';
				var filename_type = filename + fileType;
				var c             = html;
				var fileResult    = fileFullpath + dirName + "/" + filename_type;
				var a             = fs.existsSync( fileFullpath + dirName );
				if ( a === false ) {
					console.log( fileFullpath + dirName )
					fs.mkdir( fileFullpath + dirName, 0777 )
				}
				var b = fs.existsSync( fileResult );
				fs.writeFile( fileResult, c, 'utf8', function ( err ) {
					if ( err ) {
						logger.log( 'err', "process_2__resHtmlWrite__fs.writeFile : ", err )
					}
					else {
						logger.log( 'info', "-[S]-- process_2__resHtmlWrite__prd_id : ", data[ t.idx ].prd_id );
						logger.log( 'info', "-[S]-- process_2__resHtmlWrite_t.idx", t.idx );
						detailYN__update__Y( data[ t.idx ].prd_id )
					}
				} );
				logger.log( 'info', "--[I]- process_2__resHtmlWrite__fs.writeFile_complete : ", filename + fileType )
			}
			if ( data.length > 0 ) {
				try {
					logger.log( 'info', "-[S]-- process_2__resHtmlWrite__idx : ", t.idx );
					reqHtmlRead()
				}
				catch ( exception ) {
					logger.log( 'err', "process_2__reqHtmlRead : ", exception )
				}
			}
			else {
				logger.log( 'info', "-[E]-- process_2__resHtmlWrite" );
				resolve( 'all_process_complete' )
			}
		} )
	}
	this.process_run = function () {
		logger.log( 'info', "==========================================================================================" );
		logger.log( 'info', "-[S]-- process_run : ", new Date().toFormat( 'YYYYMMDDHH24MISS' ).substring( 0, 12 ) );
		MongoClient.connect( url, function ( err, db ) {
			assert.equal( null, err );
			_this.process_1()
				.then( _this.process_2 )
				.catch( function ( err ) {
					logger.log( 'error', "readData_process__0", err );
				} )
				.then( function ( result ) {
					db.close()
					logger.log( 'info', "--[I]- process_run : ", result );
					logger.log( 'info', "-[E]-- process_run : ", new Date().toFormat( 'YYYYMMDDHH24MISS' ).substring( 0, 12 ) );
					logger.log( 'info', "==========================================================================================" );
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
	var folderName   = new Date().toFormat( 'YYYYMMDDHH24MISS' );
	var fileName     = new Date().toFormat( 'YYYYMMDDHH24MISS' );
	var fileType     = '.log';
	var log_path_2   = '/red_goods_detail__download_to_txt/';
	var log_path_1   = '/goods';
	var log_path_0   = '/logs';
	var full_path    = path.join( __dirname + log_path_0 + log_path_1 + log_path_2 )
	var logType      = { info : 'info', err : 'err' };
	var a            = fs.existsSync( path + folderName );
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
				, filename  : full_path + fileName + '_' + logType.info + fileType
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
	/*-----------------------------------------------------------------------------------------------------------*/
	/*-----------------------------------------------------------------------------------------------------------*/
	/*날짜관련 function*/
	/*-----------------------------------------------------------------------------------------------------------*/
	return this;
};
var redCrw1 = new global.csj.scrapping.RedCrw();
redCrw1.process_run()
