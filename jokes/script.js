    //get a joke from the API
function getJoke() {
    //get the joke from the API
    fetch('https://icanhazdadjoke.com/', {
      headers: {
        Accept: 'application/json'
          }
        })
        //convert the response to json
        .then(response => response.json())
        //display the joke
        .then(data => {
          document.getElementById('joke').innerHTML = data.joke;
        })
        //catch any errors
        .catch(error => {
          console.log(error);
        });
      }
      //call the function when the page loads
      window.onload = getJoke;
      
    function getFreeVBucks() {
      //rickroll the user with a youtube video in another window
      window.open('https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1');
  
}
function readJoke() {
  var joke = document.getElementById('joke').innerHTML;
  var utterance = new SpeechSynthesisUtterance(joke);
  utterance.lang = 'en-US'; // specify the language code
  window.speechSynthesis.speak(utterance);
}
