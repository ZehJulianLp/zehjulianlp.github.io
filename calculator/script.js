function appendOperation(operation) {
  document.getElementById("result").innerHTML += operation;

}
function calcResult() {
  let container = document.getElementById("result");
  let erg = eval(container.innerHTML)
  container.innerHTML = erg;
  if (erg == 4761) {
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    erg = "Never gonna give you up";
    container.innerHTML = erg;
  }
}
function deleteLast() {
  let container = document.getElementById("result");
  if (container.innerHTML.endsWith(' ')) {
    container.innerHTML = container.innerHTML.slice(0, -3);

  }
  else {
    container.innerHTML = container.innerHTML.slice(0, -1);
  }
}
function getFreeVBucks() {
  window.open('https://youtu.be/dBv9BMSPaA8?t=24');
  }