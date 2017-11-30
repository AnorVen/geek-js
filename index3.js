/**
 * Created by Админ on 30.11.2017.
 */
//1

var i = 0;
while (i <= 100){
  for( var j = 0; j < i; j++){
    if(i % j != 0){
      console.log(i)
    }
  }
  i++
}

//2
var i = 0;
var n = 10;

do{
  if(i == 0){
        console.log(i + " – это ноль");
  } else if(i % 2 != 0){
    console.log(i + " – нечетное число");
  } else{
    console.log(i + " – четное число");
  }
  i++;
}while(i <= n);

//3
for(var i = 0; i < 10; console.log(i++)){
};

//4
var res = [];
for(var i = 0; i < 20; i++){

  res.push('x');
  console.log(res);
}

