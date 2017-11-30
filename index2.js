//1

var a = 1, b = 1, c, d;
c = ++a; alert(c + " ++a - приводит к тому, что сначало происходит сложение, а потом передается значение"); // 2
d = b++; alert (d + " b++ - приводит к тому, что сначалa происходит передача значения, а потом происходит сложение"); // 1
c = (2+ ++a); alert(c + " a приняло значение 2 в строке 3, после чего происходит еще раз ++а, а потом происходит сложение с 2+"); // 5
d = (2+ b++); alert(d + " b приняло значение 2 в строке 4, а потом происходит сложение с 2+, после значение b увеличено на 1"); // 4
alert(a + " a+1 было на строке 3 и 5"); // 3
alert(b + " b+1 было на строке 4 и 6"); // 3

//2
var a = 2;
var x = 1 + (a *= 2);
alert( "x = 5 , "  +x);

//3
var a= 10;
var b = -8;

if(a>=0 && b>=0){
  alert(a - b);
}
else if(a < 0 && b < 0){
  alert(a*b)
}
else{
  alert(a + b)
}

//4
var a = 8;
switch(a){
  case 1 :alert("1-15"); break;
  case 2 :alert("2-15"); break;
  case 3 :alert("3-15"); break;
  case 4 :alert("4-15"); break;
  case 5 :alert("5-15"); break;
  case 6 :alert("6-15"); break;
  case 7 :alert("7-15"); break;
  case 8 :alert("8-15"); break;
  case 9 :alert("9-15"); break;
  case 10 :alert("10-15"); break;
  case 11 :alert("11-15"); break;
  case 12 :alert("12-15"); break;
  case 13 :alert("13-15"); break;
  case 14 :alert("14-15"); break;
  default : alert("15");
};

//5
var a =9,
  b = 4;
function sum(a,b) {
  return a + b;
}
function min(a, b) {
  return a -b;
}
function del(a, b) {
  return a / b;
}
function mult(a, b) {
  return a * b;
}

//6

function mathOperation(arg1, arg2, operation){
  switch(operation){
    case (arg1 >=0 && arg2 >=0): return arg1 - arg2; break;
    case (arg1 < 0 && arg2 < 0): return arg1 * arg2; break;
    default: return arg1 + arg2; break;
  }
}
alert(mathOperation(a, b, a >= 0 && b >= 0 ));
//7
alert(0 == null);
alert(0 === null);
alert("null - обозначает что данные не известны, а 0 - это четко определенное значение");

//8
var val = prompt("число");
var pow = prompt("степень");
var res;
function power(val, pow){

  res = val*val;
  if(pow > 2){
    res = res * power(val, pow - 1);
  }
  return res;
}


alert(power(val,pow));

