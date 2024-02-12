function calculateAge(birthday) {
    var today = new Date();
    var birthDate = new Date(birthday);
    var age = today.getFullYear() - birthDate.getFullYear();
    if(today.getMonth() < birthDate.getMonth() || (today.getMonth() == birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

var birthday = '2003-09-16';
var age = calculateAge(birthday);

var age1 = document.getElementById('age');
age1.textContent = "Welcome to the webpage of Julian (he/they, "+ age + ").";