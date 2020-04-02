package lab4.api.v1.history;

import lab4.api.v1.Query;
import lab4.history.HistoryService;
import lab4.history.QueryEntity;
import lab4.users.UsersService;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@Secured("ROLE_USER")
@RequestMapping("/api/v1/history")
public class HistoryController {

    private final UsersService usersService;
    private final HistoryService service;

    public HistoryController(UsersService usersService, HistoryService service) {
        this.usersService = usersService;
        this.service = service;
    }

    @GetMapping
    public List<Query> get(Principal principal) {
        return service.getQueries(usersService.findUser(principal.getName()).getId()).stream()
                .map(HistoryController::entityToDto).collect(Collectors.toList());
    }

    private static Query entityToDto(QueryEntity entity) {
        return new Query(entity.getX(), entity.getY(), entity.getR(), entity.isResult(),
                entity.getCreated().getTime(), entity.getElapsed());
    }
}
