package lab4.api.v1;

public class Query {

    public final double x, y, r;
    public final boolean result;
    public final long created;
    public final double elapsed;

    public Query(double x, double y, double r, boolean result, long created, double elapsed) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.result = result;
        this.created = created;
        this.elapsed = elapsed;
    }
}
