package lab4.history;

import lab4.users.UserEntity;

import javax.persistence.*;
import java.util.Date;

@Entity(name = "history")
public class QueryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private UserEntity user;

    private double x, y, r;
    private boolean result;
    private Date created;
    private double elapsed;

    public QueryEntity() {}

    public QueryEntity(UserEntity user, double x, double y, double r, boolean result, Date created, double elapsed) {
        this.user = user;
        this.x = x;
        this.y = y;
        this.r = r;
        this.result = result;
        this.created = created;
        this.elapsed = elapsed;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public double getX() {
        return x;
    }

    public void setX(double x) {
        this.x = x;
    }

    public double getY() {
        return y;
    }

    public void setY(double y) {
        this.y = y;
    }

    public double getR() {
        return r;
    }

    public void setR(double r) {
        this.r = r;
    }

    public boolean isResult() {
        return result;
    }

    public void setResult(boolean result) {
        this.result = result;
    }

    public Date getCreated() {
        return created;
    }

    public void setCreated(Date created) {
        this.created = created;
    }

    public double getElapsed() {
        return elapsed;
    }

    public void setElapsed(double elapsed) {
        this.elapsed = elapsed;
    }
}
