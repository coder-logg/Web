package lab4.history;

import lab4.users.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistoryRepository extends JpaRepository<QueryEntity, Long> {

    List<QueryEntity> findByUser(UserEntity user);
}
