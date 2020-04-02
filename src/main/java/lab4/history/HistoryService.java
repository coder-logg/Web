package lab4.history;

import lab4.users.UsersRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class HistoryService {

    private final UsersRepository usersRepository;
    private final HistoryRepository repository;

    public HistoryService(UsersRepository usersRepository, HistoryRepository repository) {
        this.usersRepository = usersRepository;
        this.repository = repository;
    }

    public List<QueryEntity> getQueries(long userId) {
        return repository.findByUser(usersRepository.getOne(userId));
    }

    public void addQuery(QueryEntity query) {
        repository.save(query);
    }
}
