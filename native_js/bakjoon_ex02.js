
/**
 * Q. M x N 미로를 (1,1) -> (M, N) 으로 이동하는데, 방에 있는 사탕을 모두 찾는다고 할 때, 최대 사탕 갯수 출력하기
 * Node 버린다.
 */

var str = '4 3\n1 2 3\n6 5 4\n7 8 9\n12 11 10';
//var r = fs.trim().split('\n').map( value => value.split(' ').map( value => parseInt(value) ) ); for bakjoon
var r = str.trim().split('\n').map( function(value){return value.split(' ').map( function(value){return parseInt(value);} ) });
var mn = r.shift();
var ix,jx;
var maxValue = 0;
var result = 0;
var totalMap = [];

for(ix = 0; ix < 1000; ix++){
    tempArray = [];
    tempArray.length = 1000;
    tempArray.fill(0);
    totalMap.push(tempArray);
}

for(ix = 1; ix <= mn[0]; ix ++) {
    for(jx = 1; jx <= mn[1]; jx++) {
       totalMap[ix][jx]  = r[ix-1][jx-1];
    }
}

for(ix = 1; ix <= mn[0]; ix ++) {
    for(jx = 1; jx <= mn[1]; jx++) {
        maxValue = Math.max(totalMap[ix-1][jx], totalMap[ix][jx-1]);
        totalMap[ix][jx] = totalMap[ix][jx] + maxValue;
    }
}

console.log(totalMap[ix-1][jx-1]);