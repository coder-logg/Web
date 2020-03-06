package beans;


public class Point {
    private Double x;
    private Double y;
    private Double r;
    private boolean isInArea;

    public Point() {
    }

    public  Point(Double x, Double y, Double r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }

    public boolean checkArea() {
        //todo правильное попадание
        if (y <= 0 && y>=-0.5*x-r/2 && x <= 0) {
            isInArea=true;
            return true;
        }
        if (x <= r/2 && x >= 0 && y>=0 && r >= y) {
            isInArea=true;
            return true;
        }
        if (y <= 0 && x >= 0 && x*x+y*y <= (r*r)) {
            isInArea=true;
            return true;
        }
        isInArea=false;
        return false;
    }


    public Double getX() {
        return x;
    }

    public void setX(Double x) {
        this.x = x;
    }

    public Double getY() {
        return y;
    }

    public void setY(Double y) {
        this.y = y;
    }

    public boolean getIsInArea() {
        return isInArea;
    }

//    public String isInAreaStr(){
//        return isInArea==false?"false":"true";
//    }

    public void setInArea(boolean inArea) {
        isInArea = inArea;
    }
    public Double getR() {
        return r;
    }

    public void setR(Double r) {
        this.r = r;
    }
}