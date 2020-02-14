package servlets;

import beans.PointsManager;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;

public class ControllerServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.getServletContext().getRequestDispatcher("index.jsp").forward(request, response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String strX = request.getParameter("X");
        String strY = request.getParameter("Y");
        String strR = request.getParameter("R");

        if (strX == null || strY == null || strR == null) {
            if(request.getParameter("removePoints")!=null){
                request.getServletContext().getRequestDispatcher("/checkArea").forward(request, response);
            } else {request.getServletContext().getRequestDispatcher("/index.jsp").forward(request, response);}

        } else {
            request.getServletContext().getRequestDispatcher("/checkArea").forward(request, response);
        }
    }

    @Override
    public void init() throws ServletException {
        PointsManager pointsManager = new PointsManager();
        pointsManager.setPointsList(Collections.emptyList());
 //       getServletContext().setAttribute("PointsManager",pointsManager);
        super.init();
    }
}
