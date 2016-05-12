var rockButton = document.querySelector('#rock');
var paperButton = document.querySelector('#paper');
var scissorsButton = document.querySelector('#scissors');
var form = document.querySelector('#form');
var move = document.querySelector('#move');

var onClick = function() {
  move.value = this.id;
  form.submit();
};


rockButton.onclick = onClick;
paperButton.onclick = onClick;
scissorsButton.onclick = onClick;
