package beans;

import org.apache.commons.codec.digest.DigestUtils;

import javax.faces.bean.*;
import javax.faces.context.FacesContext;
import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

@ManagedBean
@RequestScoped
public class DAOBean {
//    private Properties props = new Properties();
    private Statement statement;
    private PreparedStatement preparedStatement;
    private Connection connection;
    private String ipHash;
    private final static String DRIVER="org.postgresql.Driver";
    private final static String TABLE_NAME="Points";
    private final static String USER="s264467";
    private final static String PASSWORD="jeg767";
    private final static String CONNECTION_URL="jdbc:postgresql://pg/studs";
    

    public DAOBean() {
        
// //           props.loadFromXML(new FileInputStream(new File("props.xml")));
//        } catch (IOException e) {
//            System.err.println("Ошибка загрузки конфигурационного файла.");e.printStackTrace();
//        }
        HttpServletRequest servletRequest = (HttpServletRequest) FacesContext.getCurrentInstance().getExternalContext().getRequest();
        ipHash= DigestUtils.sha1Hex(DigestUtils.sha1(servletRequest.getRemoteAddr()));
        connect();
        createTable();
    
    }

    public void connect(){
        try {
            Class.forName(DRIVER);
            connection= DriverManager.getConnection(CONNECTION_URL,
                    USER, PASSWORD);
            statement=connection.createStatement();
        } catch (SQLException e) {
            System.err.println("Connection exception.");
            e.printStackTrace();
        } catch(ClassNotFoundException e){
            System.err.println("Can't found driver's class.");
        }
    }

    public void createTable(){
        try {
            statement.execute(
                    "CREATE TABLE IF NOT EXISTS "+TABLE_NAME+" (" +
                            "ID serial NOT NULL , " +
                            "IP text NOT NULL,  " +
                            "X float NOT NULL, " +
                            "Y float NOT NULL," +
                            "RADIUS integer NOT NULL, " +
                            "CONSTRAINT PKEY PRIMARY KEY (ID,IP));");
        } catch (SQLException ignored) {
        } catch (NullPointerException npe){
            //todo
        }
    }

    public void addPoint(Point point) {
        try {
            preparedStatement = connection.prepareStatement("INSERT INTO "+TABLE_NAME+
                    " (IP, X, Y, RADIUS) VALUES (?, "+point.getX()+", "+point.getY()+", "+point.getR()+");");
            preparedStatement.setString(1,ipHash);
            preparedStatement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public List<Point> getPoints(){
        List<Point> pointsList =new ArrayList<>();
        try {
            preparedStatement = connection.prepareStatement("SELECT * FROM "+TABLE_NAME+" WHERE IP=?;");
            preparedStatement.setString(1,ipHash);
            ResultSet resultSet = preparedStatement.executeQuery();
            while (resultSet.next()){
                Double x = resultSet.getDouble("X");
                Double y = resultSet.getDouble("Y");
                Double r = resultSet.getDouble("RADIUS");
                Point point = new Point(x,y,r);
                point.checkArea();
                pointsList.add(point);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return pointsList;
    }

    public void removePoints() {
        try {
            preparedStatement = connection.prepareStatement("DELETE FROM "+TABLE_NAME+" WHERE IP=?;");
            preparedStatement.setString(1,ipHash);
            preparedStatement.executeUpdate();
        } catch (SQLException e) {
            System.err.println("Exception during removal points from table.");e.printStackTrace();
        }
    }
    public void changeRadius(){

    }



    public void ejbRemove() throws SQLException {
        removePoints();
        connection.close();
        statement.close();
    }

}
