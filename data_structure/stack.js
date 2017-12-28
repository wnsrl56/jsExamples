class Node{
    constructor(data){    
        let obj;
        let wrapper = (data)=>{
            let type = typeof data;
            let obj = {};                            

            if(data !== 'undefined' || data !== null){
                obj[type] = data;                
            }
        
            return obj;
        }

        if(typeof data !== 'object'){            
            data = wrapper(data);
        }

        obj = {
            data : data,
            next : null
        }   
        
        Object.assign(this, obj);
    }

    get(){
        return this;
    }

    set(data){
        this.data = data;
    }
}

class Stack extends Node{
    constructor(){ 
        super();
        this.size = 0;
        this.peek = null;
    }


    push(data){
        let tempNode;

        tempNode = new Node(data);        

        if(this.size == 0){            
            this.peek = tempNode;            
        }else{
            tempNode.next = this.peek;
            this.peek = tempNode;
        }

        this.size++;
    }

    pop(){
        let tempNode;

        if(this.size == 0){
            return null;
        }else{
            tempNode = this.peek;
            this.peek = tempNode.next;
            this.size --;
            
            return tempNode;
        }

    }

    getList(){
        let ix, ixLen;    
        let peek = this.peek;
        let tempNode;

        for(ix = 0, ixLen = this.size; ix < ixLen; ix++){                
            console.log('stack data : ' , peek.data);
            peek = peek.next;
        }    
    }
}

var main = function main(){
    var s = new Stack();

    // 여기까지는 데이터 인정
    s.push({
        3 : '3'
    });
    s.push(function test(){

    });
    s.push(3);
    s.push(true);
    s.push('aette');
    s.push(Symbol('a'));

    // null, undefined, no data 전부 예외 처리
    s.push(null);
    s.push(undefined);
    s.push();

    s.getList();
}

main();