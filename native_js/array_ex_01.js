//main

(function run(){
    comparePseudoArray();
    createArray();
    sliceProblem();
    useArrayFrom();
})();

// array call 하는 방법에 대해서 고민해보자.
function createArray(){
    // es5 version
    // init
    var arr1 = [];
    var arr2 = new Array();
    var arr3 = Array.prototype.slice.call(''); // anything
    var arr4 = Array.prototype.slice.call({length : 1, 0 : 256});
    var arr5 = Array.from({length : 1, 0 : 10});
    
    console.log(arr4, arr5);
    
    console.log(typeof arr1, Array.prototype.constructor === arr1.constructor);
    console.log(typeof arr2, Array.prototype.constructor === arr2.constructor);
    console.log(typeof arr3, Array.prototype.constructor === arr3.constructor);
    console.log(typeof arr4, Array.prototype.constructor === arr4.constructor);
    console.log(typeof arr5, Array.prototype.constructor === arr5.constructor);

    // Array constructor는 대체 무슨놈일까?
    console.log(Array.prototype.constructor === Array.constructor);
    console.dir(Array.prototype.constructor);
    console.dir(Array.constructor);

    // Scope chain에 대한 이야기
    console.dir(Array.constructor === Object.constructor);
};

function sliceProblem(){
    // slice 고려해볼 사항
    // 참조의 문제
    let tempArr = [{
        name : 'je',
        number : 24,
        age : 10
    },{
        name : 'je',
        number : 25,
        age : 10
    },[
        10,
        20,
        30
    ]];

    filteredList = Array.prototype.slice.call(tempArr);
    filteredList[1].age = 1005;

    console.log(`filteredList`, filteredList);
    console.log(`tempArr`, tempArr);

    filteredList2 = JSON.parse(JSON.stringify(tempArr));
    filteredList2[1].age = 35;

    console.log(`filteredList2`, filteredList2);
    console.log(`tempArr`, tempArr);

    filteredList3 = deepCopy(tempArr);
    filteredList3[1].age = 11499;

    console.log(`filteredList3`, filteredList3);
    console.log(`tempArr`, tempArr);
};

function deepCopy(target) {
    if(!Array.isArray(target)){
      return JSON.parse(JSON.stringify(target));
    }

    return target.map( (item) => ( Array.isArray(item) ? JSON.parse(JSON.stringify(item)) : deepCopy(item) ) );
};

function comparePseudoArray() {
    let i, len;
    let el = document.createElement('div');

    for(i = 0, len = 10; i < len ; i++ ){
        let childNode = document.createElement('div');
        childNode.id = i;
        el.appendChild(childNode);
    }

    const list = el.childNodes;
    
    // 유사배열에 대해서, filtering을 한다고 했을 때, forEach를 쓰게 되므로, 성능이 느리다. 불필요한 클로저 남발
    let targetList = [];

    list.forEach((item)=>{
        if(Number(item.id) % 2 === 0){
            targetList.push(item);
        }
    });

    console.log(targetList);

    // Array의 filter를 쓰면 해결될거 같은데, Arrray-like Object에는 없다.
    // Array의 from을 쓰면 조금 더 깔끔하게 정리가 된다.
    let targetList2 = Array.from(list).filter((item)=>{
        if(Number(item.id) % 2 === 0){
            return item;
        }
    });

    console.log(targetList2);        
};

function useArrayFrom() {
    
    
    let arrayLike = {
        length : 6,
        1 : 1,
        2 : 3,
        5 : 5,
    };
    //array from 은 hole을 undefined 아이템으로 채워준다.
    let arr = Array.from(arrayLike);

    //해당 인덱스만 값을 넣어두게 되어있다.
    let arr2 = Array.prototype.slice.call(arrayLike);

    console.log(arr);
    console.log(arr2);

    //map에 관련 되어서
    let arrayLike2 = ((index) => {
        let i = 0;
        let len = index;
        let obj = {};

        for(; i < len ; i++){
            obj[i] = Math.floor(Math.random() * 4563 % 5123);   
        }
        
        obj.length = len;

        return obj;
    })(30);

    //둘 다 같은 형식으로 사용 할 수 있다. from이 생김으로써, 조금 더 깔끔하게 코딩을 진행 할 수 있다.
    let arr3 = Array.from( arrayLike2, (item) => (item % 2 ? item : 0));
    let arr4 = Array.prototype.slice.call(arrayLike2).map(
        (item) => {
            return item % 2 ? item : 0;
        }
    ); 
    
    console.log(arr3);
    console.log(arr4);

}