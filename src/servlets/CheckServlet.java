package servlets;

import beans.Point;
import beans.PointsManager;

import javax.ejb.EJB;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;

@WebServlet(name = "AreaCheckServlet", urlPatterns = "/checkArea")
public class CheckServlet extends HttpServlet {
    @EJB
    private PointsManager pointsManager;



    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        PrintWriter out = response.getWriter();
        out.println("<h1>IT'sMOre then UNIVERSITY</h1>");
        out.close();
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        pointsManager = (PointsManager) request.getSession().getAttribute("pointsManager");
        if(request.getParameter("removePoints")!=null){
            pointsManager.removeAllPoints();
            return;
        }
        String x = request.getParameter("X");
        String y = request.getParameter("Y");
        String r = request.getParameter("R");
        //String async = request.getParameter("Asynchronous");
        String async = request.getHeader("Asynchronous");
        Point point = new Point(Double.parseDouble(x),Double.parseDouble(y),Double.parseDouble(r));
        boolean isInArea = point.checkArea();
        if(async != null){
            response.setContentType("text/plain; charset=UTF-8");
            OutputStream outputStream = response.getOutputStream();
            outputStream.write(String.valueOf(isInArea).getBytes(StandardCharsets.UTF_8));
            outputStream.flush();
            outputStream.close();
            return;
        }
        response.setHeader("Content-Type", "text/html; charset=UTF-8");
        PrintWriter out = response.getWriter();
        pointsManager.addPoint(point);
        response.setContentType("text/html");
        out.println("<!DOCTYPE HTML>" +
                " <html> " +
                "<head>" +
                " <meta charset='UTF-8'>" +
                " <title>Point</title>" +
                "<link rel='stylesheet' type='text/css' href='css/main.css'>" +
                " </head>" +
                " <body>" +
                "<div style=' margin:10px auto;width:80%;text-align:center;'>" +
                "<table class='table' style='text-align:center;'>" +
                "<tr style='background-color: brown;font-size:20px;'>" +
                "<th>X coordinate</th>" +
                "<th>Y coordinate</th>" +
                "<th>Radius</th>" +
                "<th>Entrance</th>" +
                "</tr>"+
                "<tr>" +
                "<td>" + x +"</td>" +
                "<td>"+ y + "</td>"+
                "<td>" + r + "</td>" +
                "<td>"+ isInArea +"</td>"+
                "</tr>" +
                "</table> <br>" +
                "<a href='index.jsp'> <button style='bottom:auto; font-size:20px;position:relative'> Return to HOME </button> </a> " +
                "</div>"+
                "</body>" +
                "</html>"
        );
        out.close();
    }
}