package beans;


public class Point {
    private double x;
    private double y;
    private double r;
    private boolean isInArea;

    public Point() {
    }

    public  Point(double x, double y, double r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }

    public boolean checkArea() {
        if (y >= 0 && r >= y && x >= -r && x <= 0) {
            isInArea=true;
            return true;
        }
        if (x >= 0 && y >= 0 && r / 2 - x / 2 >= y) {
            isInArea=true;
            return true;
        }
        if (x <= 0 && 0 >= y && x*x+y*y <= (r*r)/4) {
            isInArea=true;
            return true;
        }
        isInArea=false;
        return false;
    }


    public double getX() {
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public double getY() {
        return y;
    }

    public void setY(double y) {
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
    public double getR() {
        return r;
    }

    public void setR(int r) {
        this.r = r;
    }
}