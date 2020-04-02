package lab4.areaCheck;

import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import javax.validation.constraints.DecimalMax;
import javax.validation.constraints.DecimalMin;

@Service
@Validated
public class AreaCheckService {

    public boolean check(
            @DecimalMin(value = "-3", inclusive = false) @DecimalMax(value = "3", inclusive = false) double x,
            @DecimalMin(value = "-3", inclusive = false) @DecimalMax(value = "3", inclusive = false) double y,
            @DecimalMin(value = "-3", inclusive = false) @DecimalMax(value = "3", inclusive = false) double r
    ) {
        if (r < 0) {
            return doCheck(-x, -y, -r);
        }

        return doCheck(x, y, r);
    }

    private boolean doCheck(double x, double y, double r) {
        return ((x >= 0 && y >= 0 && x * x + y * y < r * r) ||
                (x >= 0 && y <= 0 && y > x - r / 2) ||
                (x <= 0 && y >= 0 && x >= -r && y <= r));
    }
}
