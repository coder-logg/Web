package lab4.api.v1.areaCheck;

import lab4.api.v1.Query;
import lab4.areaCheck.AreaCheckService;
import lab4.history.HistoryService;
import lab4.history.QueryEntity;
import lab4.users.UsersService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.annotation.RequestScope;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.ConstraintViolationException;
import java.security.Principal;
import java.util.Date;

@RequestScope
@RestController
@Secured("ROLE_USER")
@RequestMapping("/api/v1/areaCheck")
public class AreaCheckController {

    private final UsersService usersService;
    private final HistoryService historyService;
    private final AreaCheckService service;

    private final long startTime;

    public AreaCheckController(UsersService usersService, HistoryService historyService, AreaCheckService service) {
        this.usersService = usersService;
        this.historyService = historyService;
        this.service = service;

        startTime = System.nanoTime();
    }

    @GetMapping("/r/{r}/x/{x}/y/{y}")
    public boolean get(
            @PathVariable double x,
            @PathVariable double y,
            @PathVariable double r
    ) {
        try {
            return service.check(x, y, r);
        } catch (ConstraintViolationException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getConstraintViolations().toString(), e);
        }
    }

    @PostMapping
    public Query post(
            @RequestParam double x,
            @RequestParam double y,
            @RequestParam double r,
            Principal principal
    ) {
        try {
            QueryEntity entity = new QueryEntity(usersService.findUser(principal.getName()), x, y, r,
                    service.check(x, y, r), new Date(), (System.nanoTime() - startTime) / 1e9);

            historyService.addQuery(entity);
            return new Query(x, y, r, entity.isResult(), entity.getCreated().getTime(), entity.getElapsed());
        } catch (ConstraintViolationException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getConstraintViolations().toString(), e);
        }
    }
}
