var message = 'you have clicked on me this many times: ';
var button = document.querySelector('#clickMe');
var result = document.querySelector('.result');
var x = 2;

var square = function(n) {
  return n * n;
}

button.onclick = function() {
  x = x + 1;
  if (x >= 5) {
    button.onclick = null;
    button.style.display = 'none';
  }
  result.innerHTML = message + x;
};

