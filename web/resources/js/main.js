function validate() {
    let R = setR();
    let Y = $('#input-y').val();
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
let checkedRadius = 1;
function drawCanwas(id, r) {
    let canvas = document.getElementById(id);
    var context = canvas.getContext("2d");
    let height = canvas.height;
    let width = canvas.width;
    checkedRadius = r;
    //очистка
    context.clearRect(-width / 2, -height / 2, width, height);

    context.fillStyle = "blue";

    //перенос координат в центр области
    i++;
    if (i === 1) {
        context.translate(width / 2, height / 2);
        var k;
        width >= height ? k=height : k=width;
        R = k/2*0.8;
    }

    //отрисовка прямоугольника
    context.beginPath();
    context.fillRect(0, -R, R / 2, R);

    //отрисовка круга
    context.strokeStyle = "blue";
    context.beginPath();
    context.arc(0, 0, R, 0, 1 / 2 * Math.PI);
    context.lineTo(0, 0);
    context.lineTo(R, 0);
    context.stroke();
    context.fill();

    //отрисовка треугольника
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(0, R / 2);
    context.lineTo(-R, 0);
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

    //points
    drawPoints('pointsData_data');

}

function onclickCanvas(id) {
    // let r = [];
    // $("input.checkbox:checked").each(function () {
    //     r.push($(this).val())
    // });
    // if (r.length > 1) {
    //     fadedLine(400, "Можно выбрать только один радиус R");
    //     return false;
    // } else if (r.length === 0) {
    //     fadedLine(400, "Выберите значение радиуса R");
    //     return false;
    // }
    // r = r[0];
    let canvas = document.getElementById(id);
    var br = canvas.getBoundingClientRect();
    var left = br.left;
    var top = br.top;
    var event = window.event;
    var _x_ = event.clientX - left;
    var _y_ = event.clientY - top;
    var x = (((_x_ - canvas.width / 2) / R) * checkedRadius).toFixed(2);
    var y = (-((_y_ - canvas.height / 2) / R) * checkedRadius).toFixed(2);
    sendClick([{name: 'X', value: x}, {name: 'Y', value: y}, {name: 'R', value: checkedRadius}]);
 //   setTimeout( drawCanwas,500,'canvas',checkedRadius);


}

function setR(r) {
document.getElementById("forma:input-r").setAttribute('value',r.toString())
}

function drawPoints(id) {
    var pointsData = document.getElementById(id);
 //   if (pointsData.rows[0].cells.length!=5){}
    for(var i=0;i<pointsData.rows.length;i++){
        let x = pointsData.rows[i].cells[1].innerText;
        let y = pointsData.rows[i].cells[2].innerText;
        let radius = parseInt(pointsData.rows[i].cells[3].innerText);
        var isInArea = pointsData.rows[i].cells[4].innerText;

        if (checkedRadius == radius) {
            drawPoint(x, y, isInArea, checkedRadius);
        } else {
            sendToRedraw([{name: 'X', value: x}, {name: 'Y', value: y}, {name: 'R', value: checkedRadius}]);
        }
    }
}


function redrawPoint(xhr, status, args) {
    drawPoint(args.x, args.y, args.inArea, checkedRadius);
}

function drawPoint(x,y,inArea,r) {
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");
    context.beginPath();
    if (inArea == "false" || inArea ==false) {
        context.strokeStyle = "red";
        context.fillStyle = "red";
    } else {
        context.strokeStyle = "green";
        context.fillStyle = "green";
    }
    if (x >= 5 || x <= -5 || y <= -3 || y >= 3) {
        context.strokeStyle = '#5B728A';
        context.fillStyle = '#5B728A';
    }
    context.arc(x * R / r, -y * R / r, 2, 0, 2 * Math.PI);
    context.stroke();
    context.fill();
}

function drawLastAddedPoint(id,r) {
    var pointsData = document.getElementById(id);
    let x = pointsData.rows[pointsData.rows.length-1].cells[1].innerText;
    let y = pointsData.rows[pointsData.rows.length-1].cells[2].innerText;
    let radius = parseInt(pointsData.rows[pointsData.rows.length-1].cells[3].innerText);
    var isInArea = pointsData.rows[pointsData.rows.length-1].cells[4].innerText;
    drawPoint(x,y,isInArea,r);
}

