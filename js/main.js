var numberClass = document.getElementsByClassName("number");
var operatorClass = document.getElementsByClassName("operator");
var displayEl = document.getElementsByClassName("calculator__display")[0];
var equal = document.getElementsByClassName("equal")[0];

var dotFlag = true;
var resultFlag = false;
var equalFlag = true;
var operatorFlag = false;
var minusFlag = true;

var numbers = [];                             //array for 2 numbers at a time
var operator = [];                            //array for 2 recent operators
var numStr = "";                            //string representing sequence of numbers on the screen

addEventListenerToNumbers();
addEventListenerToOperators();
addEventListenerToEqual();
  
function addEventListenerToNumbers() {
  for(var i=0; i<numberClass.length ;i++){
    numberClass[i].addEventListener("click",function(){
      var num = this.innerText;
       
      if ( !operatorFlag ){
        minusFlag = true;
        operatorFlag = true;   //after inserting a number, allow to use operation() again
      } 
      if(num !='Del') numStr+=num;        //add num to string of numbers only when num≠C
      if(num == 'Del'){
          if( !equalFlag ){         //if equalFlag=false, pressing 'C' will reset everything
            numbers= [];
            operator=[];
            numStr = "";
          }
          if( numStr[numStr.length-1] == '.') dotFlag=true;      // if '.' erased, set dotFlag=true
          numStr=numStr.slice(0,numStr.length-1);  //'C' will erase the last digit of current number from the display
      }
      display(num);                     //show num on the screen
      if( equalFlag === false){         //reset arrays when '=' was pressed
          numbers= [];
          operator=[];
          equalFlag= true;              //
      }
    });
  }
}


function addEventListenerToOperators() {
  for (var i = 0; i < operatorClass.length; i++) {
    operatorClass[i].addEventListener("click", function () {
      if(minusFlag){
        numStr+='-';
        minusFlag=false;
      }
      if (operatorFlag) {
        operator.push(this.innerText);                //add recent operator to the array
        operation();
        operatorFlag = false;                       //set operatorFlag=false to prevent calling operation()
      }
    });
  }
}
  
function addEventListenerToEqual(){
  equal.addEventListener("click", function () {
    if (equalFlag) {
      operation();
      if(numStr !=''){                      //make sure not to insert empty string if it came back empty
        numStr=numbers.pop().toString();    //after pressing equal, take the answer and put in numStr
      }
      equalFlag = false;                  //set equal flag back to false prevent calling operation()
    }
  });
}


function operation() {
  if (numStr != "") numbers.push(parseFloat(numStr));
  if(numbers.includes(NaN)){
    numbers.pop();
  }
  // console.log(numbers);
  // console.log(operator);
  operatorFlag = true;
  equalFlag = true;
  dotFlag = true;                         //allow to use dot again
  minusFlag = true;
  numStr = "";                          //empty the string after operator was pressed on calaculator
  displayEl.innerText = 0;

  if (numbers.length == 2) {
    calc(numbers, operator.shift());
  }
}

function calc(arr, method) {

  switch (method) {
    case "+":
      num = fixedTo2(arr[0] + arr[1]);
      displayEl.innerText = thousands_separators(num);
      numbers = [];
      numbers.push(num);
      break;
    case "-":
      num = fixedTo2(arr[0] - arr[1]);
      displayEl.innerText = thousands_separators(num);
      numbers = [];
      numbers.push(num);
      break;
    case "×":
      num = fixedTo2(arr[0] * arr[1]);
      displayEl.innerText = thousands_separators(num);
      numbers = [];
      numbers.push(num);
      break;
    case "÷":
      if (Number.isFinite(arr[0] / arr[1])) {
        num = fixedTo2(arr[0] / arr[1]);
        displayEl.innerText = thousands_separators(num);
        numbers = [];
        numbers.push(num);
      } else {                                    //if result isnt a number, reset everything
        numbers = [];
        operator = [];                            
        numStr = "";
        displayEl.innerText = "Math Error"; 
      }
      break;
    case 'Sin': 
      num=fixedTo2(Math.sin(arr[0]* Math.PI / 180));
      displayEl.innerText = num.toString();
      numbers = [];
      numbers.push(num);
      break;
    case 'Cos': 
      num=fixedTo2(Math.cos(arr[0]* Math.PI / 180));
      displayEl.innerText = num.toString();
      numbers = [];
      numbers.push(num);
      break;
    case 'Tan': 
      if( Math.abs(arr[0]) !==90 ){
        num=fixedTo2(Math.tan(arr[0]* Math.PI / 180));
        displayEl.innerText = num.toString();
        numbers = [];
        numbers.push(num);
      } else{
        numbers = [];
        operator = [];                            
        numStr = "";
        displayEl.innerText = "Math Error";
      }
      break;
    case 'x^y': 
      num=fixedTo2(Math.pow(arr[0],arr[1]));
      displayEl.innerText = thousands_separators(num);
      numbers = [];
      numbers.push(num);
      break;
    default:
      return;
  }
  resultFlag = true;
  console.log(numbers);
  console.log(operator);
}

function fixedTo2(num) {
  num = num.toFixed(2);
  return Number.parseFloat(num);
}

function thousands_separators(num) {
  num = num.toString();
  var re = /\B(?=(\d{3})+(?!\d))/g;
  num = num.replace(re, ",");
  return num;
}


function display(currrentKey) {
  if (resultFlag) {               //prevent from adding number to Math Error on display
    displayEl.innerText = 0;
    resultFlag = false;
  }
  if (displayEl.innerText == 0) displayEl.innerText = "";        //remove initial zero

  if (currrentKey == "Del") {
    dotFlag = true;
    if (displayEl.innerText == 0 || displayEl.innerText == ".") {
      dotFlag=true;
      operatorFlag = false;                     //set operatorFlag=false if 'C' was pressed
      return (displayEl.innerText = 0);                       //clear display to 0, if display is 0 or '.'
    } 
    else {                                      //if the last num isnt 0 or '.', 
      dotFlag = false;
      var temp = displayEl.innerText;
      if (temp.length > 1) return (displayEl.innerText = temp.slice(0, temp.length - 1));
      //remove last digit from display
      else return (displayEl.innerText = 0);                      //set to 0 if temp.length=1
    }
  }
  if (currrentKey == "." && dotFlag) {          //when '.' first appeared, display it and set dotFlag=false 
    displayEl.innerText += currrentKey;
    dotFlag = false;
    return;
  }
  if (currrentKey == "." && !dotFlag) {       //if '.' was already introduced, just return;
    return;
  }
  displayEl.innerText += currrentKey;
}


//SCIENCE CALCULATOR
var calcRadios =  document.getElementsByClassName("radioBtn");
var keysGroup =   document.getElementsByClassName("calculator__keys")[0];
var previousMode;

//add event listener to any change of switching between radio buttons
for (var i = 0; i < calcRadios.length; i++) {
    calcRadios[i].addEventListener("change", calcSelector )     //send event to clacSelector function
}

function calcSelector(e){
  enableAllNumberBtns();                  //bring 0-9 and '.' back to calculator
  console.log(this.id);
  dotFlag    = true;                       //reset everything
  resultFlag = false;
  equalFlag  = true;
  operatorFlag = false;
  minusFlag  = true;
  displayEl.innerText = 0;
  numbers    = [];
  operator   =[];
  numStr     = "";
  
  if (this.id === "basic"){
    removePrevious(previousMode);                         //remove previous mode 
  }

  if (this.id === "science"){
    removePrevious(previousMode);
    previousMode = 'science';                       //set previousMode to know to earse it on basic mode
    var scienceBtns = ['Sin','Cos','Tan','x^y'];
    addNewBtns(scienceBtns,'science');              //science Btns will have also class=undefined 
    var scienceClass = document.getElementsByClassName("science");
    for (var i = 0; i < scienceClass.length; i++) {                     //add EventListener to science buttons
      scienceClass[i].addEventListener("click", function () {
        if(this.innerText == 'x^y'){
          operator.push(this.innerText);
          operation();
          operatorFlag = false;
        }
        if(operatorFlag){
          operation();
          calc(numbers, this.innerText);
        }
      });
    }
  }
  
  if (this.id === "programming"){
    removePrevious(previousMode);
    previousMode = 'programming';
    var hexBtns  = ['A','B','C','D','E','F'];
    var radixBtns = ['Hex','Dec','Oct','Bin'];
    var bitBtns  = ['AND','OR','NOT','XOR'];
    addNewBtns(radixBtns,'programming','radix');                  //class=programming to know what Btns to remove
    addNewBtns(hexBtns,'programming','number');
    addNewBtns(bitBtns,'programming','bit');
    var radixClass = document.getElementsByClassName("radix");
    var hexClass   = document.getElementsByClassName("hex");
    var bitClass   = document.getElementsByClassName("bit");
    disableNumberBtns(['0','1','2','3','4','5','6','7','8','9','Del']);  //do this for Dec Mode at first
    //Begin with eventLisetner
    for (var i = 0; i < radixClass.length; i++) {
      radixClass[i].addEventListener("click", function () {           //disable others
        if(this.innerText == 'Bin' ){
          addActiveClass(this);
          disableNumberBtns(['0','1','Del']);
        }
        else if(this.innerText == 'Oct'){
          addActiveClass(this);
          enableAllNumberBtns();
          disableNumberBtns(['0','1','2','3','4','5','6','7','Del']);
        }
        else if(this.innerText == 'Dec'){
          addActiveClass(this);
          enableAllNumberBtns();
          disableNumberBtns(['0','1','2','3','4','5','6','7','8','9','Del']);
        }
        else if(this.innerText == 'Hex'){
          addActiveClass(this);
          enableAllNumberBtns();
          disableNumberBtns(['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','Del']);
          // numberClass = document.getElementsByClassName("number");
          // console.log(numberClass);
        }
      });
    }
  }
  console.log("calculator__keys: ", keysGroup); 
}

function addNewBtns(arr,className,gruopName){
  for (var i = 0; i < arr.length; i++) {      
    newButton = document.createElement("button");
    newButton.classList.add(className,gruopName,arr[i]);
    if( newButton.classList.contains("Dec")){
      newButton.classList.add("active");          //add class=active only for Dec at first
    } 
    newButton.innerText = arr[i];
    keysGroup.appendChild(newButton);
  }
}

function removePrevious(className){
  if(className === undefined) return;
  var BtnsToRemove = document.getElementsByClassName(className); //all the buttons with class=science
  BtnsToRemove = Array.from(BtnsToRemove);
  BtnsToRemove.forEach(element => {            //for every button with class=science
    element.parentNode.removeChild(element);    //remove <button class='science'></button> by calling the parent    element
    });
}

function disableNumberBtns(arrNumToRemove){
  for( var i=0; i<numberClass.length; i++ ){
    if( !arrNumToRemove.includes(numberClass[i].innerText) ){
      numberClass[i].setAttribute('disabled', '');
    }  
  }
}

function enableAllNumberBtns(){
  for( var i=0; i<numberClass.length; i++ ){
    numberClass[i].removeAttribute('disabled');
  } 
}

function addActiveClass(obj){
  //console.log(obj);
  var current = document.getElementsByClassName("active")[0];
  current.className = current.className.replace(" active", "");
  obj.classList.add("active");
}


// for (var i = 0; i < scienceBtns.length; i++) {      //create science buttons
    //   newButton = document.createElement("button");
    //   newButton.classList.add('science');
    //   newButton.innerText = scienceBtns[i];
    //   keysGroup.appendChild(newButton);
    // }


    


