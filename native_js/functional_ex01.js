/**
 * currying 활용하기
 * @param {*} age 
 */

/// currying을 활용한 방법
var underAge = function (age){
    return  function (item, index, arr){        
            if(item.age <= age){
                return item;
            }
        }
}

// 더 나은 방법 predicate 
function filter(list, predicate) {
    var newList = [];
    var i, len;

    for (i = 0, len = list.length; i < len; i++){
        if(predicate(list[i])){
            newList.push(list[i]);
        }
    }

    return newList;
}
