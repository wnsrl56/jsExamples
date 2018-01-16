
function test(){
let i, len;
let el = document.createElement('div');

for(i = 0, len = 10; i < len ; i++ ){
    let childNode = document.createElement('div');
    childNode.id = i;
    el.appendChild(childNode);
}

const list = el.childNodes;

// forEach를 쓰게 되므로, 성능이 느리다. 불필요한 클로저 남발
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

}

test();