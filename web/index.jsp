<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page import="java.util.Collections"%>
<%@ page import="beans.PointsManager" %>
<%@page contentType="text/html" pageEncoding="UTF-8" language="java" %>
<%request.setCharacterEncoding("UTF-8");%>
<jsp:useBean id="pointsManager" class="beans.PointsManager" scope="session"/>
<%request.getSession().setAttribute("name", pointsManager);%>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Aidar Sinetov</title>
    <style type="text/css"><%@include file='css/main.css' %></style>
    <script type="text/javascript" src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
    <script type="text/javascript" id="js1" charset="UTF-8">
        $(document).ready(function () {
            $('#form').keydown(function (event) {
                if (event.keyCode == 13) {
                    event.preventDefault();
                    validate();
                    return false;
                }
            });
            drawCanwas('canvas',1);
            drawPoints("pointsData");
            $( "input:checkbox" ).on("change", function() {
                drawCanwas("canvas", getLastCheckedR());
                drawPoints("pointsData");
            });

        });
    </script>
</head>
<body>
<table class="table" id="mainTable" border="1">
    <tr id="tr1">
        <th colspan="2" align="left" width="60%">
            Вариант 213018
        </th>
        <th align="right">
            Синетов Айдар, P3213
        </th>
    </tr>
    <tr>
        <td>
            <canvas id="canvas"
                    style="background-color:#ffffff;" width="700" height="500" onclick="onclickCanvas('canvas')">
                Для того чтобы увидеть график откройте страницу в другом браузере
            </canvas>
        </td>
        <td style="line-height: 2;text-align: center;" width="150px">
            <form id="form" autocomplete="off" action="checkArea" onsubmit="return validate()" style="font-family:'Bell MT', sans-serif; font-size: 20px">
                <strong>X: </strong>
                <select id="selectX" form="form" required name="X">
                    <option value="-3">-3</option>
                    <option value="-2">-2</option>
                    <option value="-1">-1</option>
                    <option value="0" selected>0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select><br>
                <div><strong >R:</strong>
                    <label for="R_1"><input class="checkbox" type="checkbox" value="1" name="R"  id="R_1" checked>1</label>
                    <label for="R_2"><input class="checkbox" type="checkbox" value="2" name="R"  id="R_2">2</label>
                </div>
                <div><label for="R_3"><input class="checkbox" type="checkbox" value="3" name="R" id="R_3" >3</label>
                    <label for="R_4"><input class="checkbox" type="checkbox" value="4" name="R" id="R_4" >4</label>
                    <label for="R_5"><input class="checkbox" type="checkbox" value="5" name="R"  id="R_5">5</label>
                </div>
                <strong>Y: </strong>
                <input type="text" id="inputY" style="width:80%" placeholder="(-3...3)" name="Y"><br>
                <input type="submit" value="Проверить" >
            </form>
        </td>
        <td style=" display: block; overflow-y: auto; height: 500px" id="cellWithCheckTable">
            <table id="CheckTable" class="table"
                   style="background-color: brown; width: 100%; table-layout: fixed; word-break: break-all">
                <tr>
                    <th>X</th>
                    <th>Y</th>
                    <th>R</th>
                    <th>Check</th>
                </tr>
                    <c:forEach var="point" items="${pointsManager.pointsList}">
                        <tr align="center" class="pointsData" >
                            <td id="X"><c:out value="${point.x}"/></td>
                            <td id="Y"><c:out value="${point.y}"/></td>
                            <td id = "R"><c:out value="${point.r}"/></td>
                            <td id="check"><c:out value="${point.checkArea()}"/></td>
                        </tr>
                    </c:forEach>
            </table>
            <div align="center">
                <button  type="submit" formaction="" onclick="removePoints(); location.reload()">Очистить историю</button>
            </div>
            <%--todo сделать кнопку для очистки таблицы (истории запросов)--%>
        </td>
    </tr>
</table>
<script type="text/javascript" src="js/script.js" charset="UTF-8"></script>
</body>
</html>
