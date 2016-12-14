
# 클러스터링 노드 실행 소스( 데이터가 많을경우 실행한다

var redCrw1 = new global.csj.scrapping.RedCrw();
var redCrw2 = new global.csj.scrapping.RedCrw();
var redCrw3 = new global.csj.scrapping.RedCrw();
var redCrw4 = new global.csj.scrapping.RedCrw();
require( "d:/work/csj_nodejs_common_modules/initialize__redCrawling.js" );
var cluster = global.csj.STATIC.NPM_MODULE.cluster;
var os      = global.csj.STATIC.NPM_MODULE.os;

var aaa     = function ( a, b ) {
    for ( var i = a ; i < b ; i++ ) {
        console.log( i )
    }
}
var numCPUs = os.cpus().length; // CPU 개수 가져오기
if ( cluster.isMaster ) { // 마스터 처리
    for ( var i = 0 ; i < numCPUs ; i++ ) {
        cluster.fork(); // CPU 개수만큼 fork
    }
    // 워커 종료시 다잉 메시지 출력
    cluster.on( 'exit', function ( worker, code, signal ) {
        console.log( 'worker ' + worker.process.pid + ' died' );

    } );
}
else {
    console.log( 'current worker pid is ' + process.pid );
    console.log( cluster.worker.id )
    var a = cluster.worker.id;
    if ( a == 1 ) {
        redCrw1.process_1( 0, 100000 )
    }
    else if ( a == 2 ) {
        redCrw1.process_1( 100000, 100000 )
    }
    else if ( a == 3 ) {
        redCrw1.process_1( 200000, 100000 )
    }
    else if ( a == 4 ) {
        redCrw1.process_1( 300000, 100000 )
    }

}