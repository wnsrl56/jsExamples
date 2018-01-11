
/**
 * Q. 1,2,3 으로 숫자 n을 표현 하는 가짓 수 찾기
 */

var str = '6\n1\n2\n3\n4\n5\n10';
var n = str.trim().split('\n').map(function(value) { return parseInt(value); });
var value;
var i, len;
var j, jLen;
var index = [0, 1, 2, 4];

for(j = 1, jLen = n[0]; j <= jLen; j++){
    value = n[j];
    for(i = 4, len = value; i <= len ; i++){    
        if(!index[i]){
            index[i] = index[i-1] + index[i-2] + index[i-3];    
        }               
    }
    console.log(index[value]);
}