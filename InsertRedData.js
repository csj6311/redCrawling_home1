//----------------------------------------------------------------------------------------------------;

//	REQUIRE;

//----------------------------------------------------------------------------------------------------;

require( "../csj_nodejs_common_modules/initialize__redCrawling.js" );

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
    
    var fs       = global.csj.STATIC.NPM_MODULE.fs;
    var winston  = global.csj.STATIC.NPM_MODULE.winston;
    var mongoose = global.csj.STATIC.NPM_MODULE.mongoose;
    var fse      = global.csj.STATIC.NPM_MODULE.fse;
//----------------------------------------------------------------------------------------------------;
    
    var _this = this;

//----------------------------------------------------------------------------------------------------;

// MongoDB Setting;

//----------------------------------------------------------------------------------------------------;
    
    var db = mongoose.connection;
    db.on( 'error', console.error );
    
    //mongoose.connect( 'mongodb://49.175.149.94:9001/redData' );
    mongoose.connect( 'mongodb://localhost/redData' );
    var Schema = mongoose.Schema;
    
    var redGoodsSchema = new Schema( {
        price          : String,   //소비자가
        crawlingDate   : Date,     //크롤링Date
        discount_price : String,   //할인가
        discount       : String,   //할인률
        sold_out       : Boolean,  //품절여부
        total          : Number,   //판매갯수
        link           : String,   //상품링크
        id             : String,  //아이디
        desc           : String,  //설명(상품명)
        brand          : String,  //브랜드명
        goods_left     : Number,   //잔여재고수량
        title          : String,   //상품명(상품태그)
        image          : String,   //이미지_URL
        detailYN       : { type : String, default : 'N' },//포스팅상세저장여부 (페이지상세소스 저장시사용)
        published_date : { type : Date, default : Date.now } //데이터입력Date
    } );
    
    var RedGoods = mongoose.model( 'redGoods', redGoodsSchema );

//-----------------------------------------------------------------------------------------------------------;

//STATIC

//-----------------------------------------------------------------------------------------------------------;
    
    var _processStatus = {
        dataPath         : '../redCrwData/saveCompleteData/',
        type             : [ 'goods', 'post', 'search' ],
        dataDateDir      : [],
        dataDateDirfiles : [],
        dataDateDirNum   : 0
    };

//-----------------------------------------------------------------------------------------------------------;

//function

//-----------------------------------------------------------------------------------------------------------//
    
    this.readDir = function () {
        
        return new Promise( function ( resolve, reject ) {
            console.log( "-[S]- readDir" );
            var t      = _processStatus;
            var path_1 = t.dataPath + t.type[ 0 ] + '/';
            var result = fs.readdirSync( path_1 );
            console.log( "-[E]- readDir" );
            resolve( result );
        } )
        
    };
    
    this.readData_process__0 = function ( data ) {
        
        return new Promise( function ( resolve, reject ) {
            console.log( "-[S]- readData_process__0" );
            var t   = _processStatus;
            var r   = t.dataPath + t.type[ 0 ] + '/';
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
                r.push( c[ i ] );
            }
            console.log( "-[E]- readData_process__1" );
            resolve( r );
        } )
        
    };
    
    this.readData_process__2 = function ( data ) {
        
        return new Promise( function ( resolve, reject ) {
            console.log( "-[S]- readData_process__2" );
            var arr = [];
            for ( var i = 0 ; i < data.length ; i++ ) {
                var r     = fs.readdirSync( data[ i ] );
                var o     = {};
                o.dirPath = data[ i ];
                o.file    = r;
                arr.push( o );
            }
            console.log( "-[E]- readData_process__2" );
            resolve( arr );
        } )
    };
    
    this.readData_process__2__1 = function ( data ) {
        
        return new Promise( function ( resolve, reject ) {
            console.log( "-[S]- readData_process__2__1" );
            var arr = [];
            for ( var i = 0 ; i < data.length ; i++ ) {
                
                for ( var j = 0 ; j < data[ i ].file.length ; j++ ) {
                    
                    arr.push( data[ i ].dirPath + data[ i ].file[ j ] );
                    
                }
                
            }
            console.log( "-[E]- readData_process__2__1" );
            resolve( arr );
        } )
        
    };
    
    this.readData_process__3 = function ( data ) {
        return new Promise( function ( resolve, reject ) {
            console.log( "-[S]- readData_process__3" );
            var arr  = [];
            var arr1 = []
            for ( var i = 0 ; i < data.length ; ++i ) {
                var d = fs.readFileSync( data[ i ] );
                d     = JSON.parse( d );
                //console.log(d)
                for ( var j = 0 ; j < d.data.length ; j++ ) {
                    var r             = d.data[ j ]
                    var redGoods      = new RedGoods( {
                        price:          r.price,
                        discount_price: r.discount_price,
                        discount:       r.discount,
                        sold_out:       r.sold_out,
                        link:           r.link,
                        total:          r.total,
                        id:             r.id,
                        desc:           r.desc,
                        goods_left:     r.goods_left,
                        title:          r.title,
                        image:          r.image,
                        crawlingDate:   d.crwlingDate
                    } );
                    arr.push( redGoods );
                    if ( arr.length == 500 ) {
                        arr1.push( arr );
                        arr = [];
                    }
                    if ( i == data.length && j == d.data.length ) {
                        arr1.push( arr );
                        arr = [];
                    }
                }
            }
            
            console.log( "-[E]- readData_process__3" );
            resolve( arr1 );
        } )
    };
    
    this.readData_process__4 = function ( data ) {
        
        return new Promise( function ( resolve, reject ) {
            console.log( "-[S]- readData_process__4" );
            
            var i = 0;
            
            var goodsSaveDB = function () {
                if ( i < data.length ) {
                    RedGoods.insertMany( data[ i ], function ( err ) {
                        
                        if ( err ) {
                            console.log( err )
                        }
                        
                        if ( i < data.length ) {
                            console.log( "dataInsertOK --- ", i )
                            ++i;
                            goodsSaveDB();
                        }
                        
                    } );
                }
                else {
                    console.log( "-------------------------------------------------------------" )
                    console.log( "db_insert_Complete" )
                    resolve();
                    console.log( "-------------------------------------------------------------" )
                }
            };
            goodsSaveDB();
            
            console.log( "-[E]- readData_process__4" );
        } )
        
    };
    
    this.readData_process__5 = function () {
        
        return new Promise( function ( resolve, reject ) {
            console.log( "-[S]- readData_process__5" );
            var t       = _processStatus
            var data    = t.dataDateDir;
            var oldPath = "../redCrwData/saveCompleteData/goods/";
            var newPath = "../redCrwData/insertCompleteData/goods/";
            for ( var i = 0 ; i < data.length ; i++ ) {
                console.log( "+---[S]- readData_process__5___" + data[ i ] + "___" );
                fse.copySync( oldPath + data[ i ], newPath + data[ i ] );
                console.log( "+---[E]- readData_process__5___" + data[ i ] + "___" );
            }
            console.log( "-[E]- readData_process__5" );
            console.log( "-------------------------------------------------------------" )
            console.log( "copy_files_Complete" )
            resolve();
            console.log( "-------------------------------------------------------------" )
        } )
        
    };
    
    this.readData_process__6 = function () {
        return new Promise( function ( resolve, reject ) {
            console.log( "-[S]- readData_process__6" );
            var t       = _processStatus
            var data    = t.dataDateDir;
            var oldPath = "../redCrwData/saveCompleteData/goods/";
            for ( var i = 0 ; i < data.length ; i++ ) {
                console.log( "+---[S]- readData_process__6___" + data[ i ] + "___" );
                fse.removeSync( oldPath + data[ i ] );
                console.log( "+---[E]- readData_process__6___" + data[ i ] + "___" );
            }
            console.log( "-[E]- readData_process__6" );
            console.log( "-------------------------------------------------------------" )
            console.log( "remove_files_Complete" )
            resolve( 'All_Done' );
            console.log( "-------------------------------------------------------------" )
        } )
    };
    
    this.run = function () {
        db.once( 'open', function () {
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
                 .then( _this.readData_process__5 )
                 .catch( function ( err ) {
                     console.log( err )
                 } )
                 .then( _this.readData_process__6 )
                 .catch( function ( err ) {
                     console.log( err )
                 } )
                 .then( function ( result ) {
                     console.log( "-[S]- mongoose.disconnect" );
                     mongoose.disconnect();
                     console.log( "-[E]- mongoose.disconnect" );
                     console.log( result )
                 } )
        } );
    }

//-----------------------------------------------------------------------------------------------------------;

//LOGIC;

//-----------------------------------------------------------------------------------------------------------;
    
}

var redCrw = new global.csj.insertRedGoods.RedCrw();
redCrw.run();