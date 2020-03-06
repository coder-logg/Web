package beans;

import org.primefaces.PrimeFaces;

import javax.faces.bean.ApplicationScoped;
import javax.faces.bean.ManagedBean;
import javax.faces.context.FacesContext;
import javax.inject.Inject;
import javax.inject.Named;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Named
@ManagedBean()
@ApplicationScoped
public class PointsManager implements Serializable {
    private Integer x = 0;
    private int y = 0;
    private int r = 1;

    @Inject
    private DAOBean daoBean;

    public PointsManager() {
    }

    public void addPoint(Point point) {
        daoBean.addPoint(point);
    }

    public void addPointByClick() {
        ArrayList<Number> arr = getParameters("X", "Y", "R");
        Point point = new Point(arr.get(0).doubleValue(), arr.get(1).doubleValue(), arr.get(2).doubleValue());
        addPoint(point);
    }

    public void addPoint(Double x, Double y, Double r) {
        daoBean.addPoint(new Point(x, y, r));
    }

    public void addThisPoint() {
        ArrayList<Number> arr = getParameters("input-x", "input-y", "input-r");
        Point point = new Point(arr.get(0).doubleValue(), arr.get(1).doubleValue(), arr.get(2).doubleValue());
        boolean inArea=point.checkArea();
        addPoint(point);

    }

    public List<Point> PointsList() {
        return daoBean.getPoints();
    }

    public void redraw() {
        ArrayList<Number> arr = getParameters("X", "Y", "R");
        Point point = new Point(arr.get(0).doubleValue(), arr.get(1).doubleValue(), arr.get(2).doubleValue());
        boolean inArea = point.checkArea();
        PrimeFaces reqCtx = PrimeFaces.current();
        reqCtx.ajax().addCallbackParam("inArea", inArea);
        reqCtx.ajax().addCallbackParam("x", arr.get(0).doubleValue());
        reqCtx.ajax().addCallbackParam("y", arr.get(1).doubleValue());
        reqCtx.ajax().addCallbackParam("r", arr.get(2).doubleValue());
    }

    public Integer getX() {
        return x;
    }

    public void setX(Integer x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }

    public int getR() {
        return r;
    }

    public void setR(int r) {
        this.r = r;
    }

    public void removeAllPoints() {
        daoBean.removePoints();
    }

    private synchronized ArrayList getParameters(String x, String y, String r) {
        Map<String, String> requestParameterMap = FacesContext.getCurrentInstance().getExternalContext().getRequestParameterMap();

        String[] strArr = new String[3];
        requestParameterMap.forEach((k,v)->{
            if(k.contains(x)) {strArr[0]=v;}
            if(k.contains(y)) {strArr[1]=v;}
            if(k.contains(r)) {strArr[2]=v;}}
            );

        double X = Double.parseDouble(strArr[0]);
        double Y = Double.parseDouble(strArr[1]);
        int Radius = Integer.parseInt(strArr[2]);
        ArrayList<Number> numbers= new ArrayList<Number>();
        numbers.add(X);
        numbers.add(Y);
        numbers.add(Radius);
        return numbers;
    }
}
