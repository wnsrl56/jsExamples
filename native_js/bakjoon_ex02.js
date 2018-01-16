
/**
 * Q. M x N 미로를 (1,1) -> (M, N) 으로 이동하는데, 방에 있는 사탕을 모두 찾는다고 할 때, 최대 사탕 갯수 출력하기
 */

var str = '4 3\n1 2 3\n6 5 4\n7 8 9\n12 11 10';

var n = str.trim().split('\n').map( value => value.split(' ').map( value => parseInt(value) ) );

console.log(n);