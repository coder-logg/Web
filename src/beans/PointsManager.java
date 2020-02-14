package beans;


import javax.ejb.Stateful;
import java.util.ArrayList;
import java.util.List;

@Stateful(name = "PointsManager")
public class PointsManager {
    private List<Point> pointsList =new ArrayList<>();

    public PointsManager() {
    }

    public void addPoint(Point point){
        pointsList.add(point);
    }
    public void addPoint(double x, double y, double r){
        addPoint(new Point(x,y,r));
    }

    public List<Point> getPointsList() {
        return pointsList;
    }
    public void setPointsList(List<Point> pointsList) {
        this.pointsList = pointsList;
    }
    public void removeAllPoints(){
        pointsList.clear();
    }
}
