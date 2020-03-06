function ShowTime() {
    document.getElementById("clock").innerHTML=new Date().toLocaleString();

}

$(document).ready(function () {
    setInterval(() => {ShowTime()}, 12000);
    ShowTime();
});

