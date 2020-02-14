function validate() {
    let R = [];
    $("input.checkbox:checked").each(function () {
        R.push($(this).val())
    });
    if (R.length > 1) {
        fadedLine(400, "Можно выбрать только один радиус R");
        return false;
    } else if (R.length == 0) {
        fadedLine(400, "Выберите значение радиуса R");
        return false;
    }
    let Y = $('#inputY').val();
    Y = Y.replace(/\s/g, "");
    if (Y == "") {
        fadedLine(400, "Не введено значение Y");
        return false;
    }
    if (isNaN(Y) == true) {
        fadedLine(400, "Не правильный формат задания Y! Y может быть только числом в интервале от -3 до 3 : Y "
            + String.fromCharCode(1108) + " (-3;3).");
        return false;
    }
    if (!(Y.valueOf() < 3) || !(Y.valueOf() > -3)) {
        fadedLine(400, "Y должен находиться в интервале от -3 до 3 : Y " + String.fromCharCode(1108) + " (-3;3)");
        return false;
    }
    return true;
}

function fadedLine(timeout, innerText) {
    let table = document.getElementById("mainTable");
    let line = document.createElement("tr");
    let cell = document.createElement("td");
    line.setAttribute("style", "background-color: red; text-align: center");
    line.setAttribute("id", "alert");
    cell.setAttribute("colspan", "3");
    cell.innerText = innerText;
    line.appendChild(cell);
    table.appendChild(line);
    setTimeout(function () {
        $("#alert").fadeOut({
            duration: timeout,
            complete: function () {
                this.remove();
            }
        });
    }, 8000)
}

let i = 0;
let R = 0;
var coeff;
function drawCanwas(id, r) {
    let canvas = document.getElementById(id);
    var context = canvas.getContext("2d");
    let height = canvas.height;
    let width = canvas.width;

    //очистка
    context.clearRect(-width / 2, -height / 2, width, height);

    context.fillStyle = "blue";

    //перенос координат в центр области
    i++;
    if (i === 1) {
        context.translate(width / 2, height / 2);
        var k;
        width>=height?k=height:k=width;
        R = k/2*0.8;
        coeff = 5;
    }

    //отрисовка прямоугольника во второй части графика
    context.beginPath();
    context.fillRect(-R, -R, R, R);

    //отрисовка круга в 3-ей части графика
    context.strokeStyle = "blue";
    context.beginPath();
    context.arc(0, 0, R / 2, 1 / 2 * Math.PI, Math.PI);
    context.lineTo(0, 0);
    context.lineTo(0, R / 2);
    context.stroke();
    context.fill();

    //отрисовка треугольника
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(0, -R / 2);
    context.lineTo(R, 0);
    context.lineTo(0, 0);
    context.stroke();
    context.fill();

    // отрисовка осей
    context.beginPath();
    context.lineWidth = 3;
    context.moveTo(-width / 2, 0);
    context.lineTo(width / 2, 0);
    context.moveTo(0, -height / 2);
    context.lineTo(0, height / 2);
    //отрисовка стрелок осей
    context.moveTo(0, -height / 2);
    context.lineTo(6,-height / 2+10);
    context.moveTo(0, -height / 2);
    context.lineTo(-6,-height / 2+10);
    context.moveTo(width / 2, 0);
    context.lineTo(width / 2-10, 6);
    context.moveTo(width / 2, 0);
    context.lineTo(width / 2-10, -6);
    context.strokeStyle = "black";
    context.stroke();
    context.strokeStyle = "black";

    context.fillStyle = "black";
    context.lineWidth = 2;
    context.font = "bolder 14px Verdana";


    //Деления Х
    context.moveTo(-R, -5);
    context.lineTo(-R, 5);
    context.stroke();
    context.fillText(-r, -R - 10, 20);
    context.moveTo(-R / 2, -5);
    context.lineTo(-R / 2, 5);
    context.stroke();
    context.fillText(-r / 2, -R / 2 - 15, 20);
    context.moveTo(R / 2, -5);
    context.lineTo(R / 2, 5);
    context.stroke();
    context.fillText(r / 2, R / 2 - 10, 20);
    context.moveTo(R, -5);
    context.lineTo(R, 5);
    context.stroke();
    context.fillText(r, R - 5, 20);

    //Деления Y
    context.moveTo(-5, R);
    context.lineTo(5, R);
    context.stroke();
    context.fillText(-r, 10, R + 5);
    context.moveTo(-5, R / 2);
    context.lineTo(5, R / 2);
    context.stroke();
    context.fillText(-r / 2, 10, R / 2 + 5);
    context.moveTo(-5, -R / 2);
    context.lineTo(5, -R / 2);
    context.stroke();
    context.fillText(r / 2, 10, -R / 2 + 5);
    context.moveTo(-5, -R);
    context.lineTo(5, -R);
    context.stroke();
    context.fillText(r, 10, -R + 5);

    //название осей
    context.font = "italic bolder 20px Courier";
    context.fillText("X", width/2-15,30);
    context.fillText("Y",10, -height/2+15);

}

function onclickCanvas(id) {
    let r = [];
    $("input.checkbox:checked").each(function () {
        r.push($(this).val())
    });
    if (r.length > 1) {
        fadedLine(400, "Можно выбрать только один радиус R");
        return false;
    } else if (r.length === 0) {
        fadedLine(400, "Выберите значение радиуса R");
        return false;
    }
    r = r[0];
    let canvas = document.getElementById(id);
    var br = canvas.getBoundingClientRect();
    var left = br.left;
    var top = br.top;
    var event = window.event;
    var _x_ = event.clientX - left;
    var _y_ = event.clientY - top;
    var x = (((_x_ - canvas.width / 2) / R)*r).toFixed(2);
    var y = (-((_y_ - canvas.height / 2) / R)*r).toFixed(2);
    // alert("height="+br.height+"*****width="+br.width+"\nclientX="+event.clientX +"******clientY=" +
    //     event.clientY+"\nleft="+left+"******top="+top+"\n_x_="+_x_+"*****_y_="+_y_+"\ny="+y+"********x="+x);

    // let ajax=true;
    window.location.href = "checkArea?" + "X=" + x + "&Y=" + y + "&" + "R=" + r;
    // $.get("control",{X:x,Y:y,R:R, ajax:ajax},function (data,jqXHR ) {
    //     let isInArea = jqXHR.getResponseHeader("isInArea");
    // });

    // drawPoint(canvas, x, y, boolArea);

}

function getLastCheckedR() {
    let R = [];
    $("input.checkbox:checked").each(function () {
        R.push($(this).val())
    });
    if (R.length ===0){
        R.push(1);
    }
    return R[R.length-1];

}

function drawPoints(id) {
    // todo расположение точки должно меняться при изменение радиуса (если у точки не выбранный радиус) x*120/R
    var pointsData = document.getElementsByClassName(id);
    if (pointsData.length == null || pointsData.length === 0) {
        return false;
    }
    let r = parseInt(getLastCheckedR());
    Array.from(pointsData).forEach(function (item, i, arr) {
        let x = item.querySelector("#X").innerText;
        let y = item.querySelector("#Y").innerText;
        let radius = parseInt(item.querySelector("#R").innerText);
        let isInArea = item.querySelector("#check").innerText;

        if (r != radius) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "/control?X=" + x + "&Y=" + y + "&R=" + r);
            xhr.setRequestHeader("Asynchronous", "true");
            xhr.responseType="text";
            xhr.send();
            xhr.onload = function() {
                isInArea=this.responseText;
                    //fadedLine(600, "inArea"+i+"="+inArea+"*****isInArea"+i+"="+isInArea);
            }

        }
        setTimeout( ()=> {
            let canvas = document.getElementById("canvas");
            let context = canvas.getContext("2d");
            context.beginPath();
            if (isInArea === "false") {
                context.strokeStyle = "red";
                context.fillStyle = "red";
            } else {
                context.strokeStyle ="green";
                context.fillStyle = "green";
            }
            context.arc(x * R/r, -y * R/r, 2, 0, 2 * Math.PI);
            context.stroke();
            context.fill();
        },500)


    })

}
function removePoints() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/control?removePoints=true");
    xhr.setRequestHeader("Connection", "close");
    xhr.send();
    xhr.abort();
}


