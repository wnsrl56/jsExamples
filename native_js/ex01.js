(function main(){

    typeCheckExample();

})();

function checkValueType(valueList){
    let ix, ixLen;
    let value;
    for(ix = 0 , ixLen = valueList.length; ix < ixLen ; ix++){
        value = valueList[ix];
        console.log(value, 'type : ', typeof value);            
    }
}

function typeCheckExample(){
    // Number check
    var numberList = [
        1,
        1.0,
        -1,                
        Infinity,
        NaN
    ];

    // boolean
    var booleanList = [
        true,
        false          
    ];

    var typeList = [
        'string',                
        Symbol('abc'),
        new Date(),
        new Array(),    
        new Object(),
        class c{},        
        function f(){
            console.log('function');
        }
    ];

    var exceptList = [
        undefined,
        null
    ];
    
    checkValueType(numberList);
    checkValueType(booleanList);
    checkValueType(typeList);    
    checkValueType(exceptList);    
}


function revealCompare(){
    
}