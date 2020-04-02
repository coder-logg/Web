package lab4.users;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Collections;

@Service
@Validated
@Transactional
public class UsersService implements UserDetailsService {

    private final UsersRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UsersService(UsersRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserEntity findUser(String username) {
        return repository.findByUsername(username);
    }

    public boolean addUser(@NotBlank @Size(min = 2) String username, @NotBlank String password) {
        if (repository.findByUsername(username) != null) {
            return false;
        }

        repository.saveAndFlush(new UserEntity(username, passwordEncoder.encode(password)));
        return true;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserEntity userEntity = repository.findByUsername(username);

        if (userEntity == null) {
            throw new UsernameNotFoundException("username not found");
        }

        return new User(userEntity.getUsername(), userEntity.getPassword(), Collections
                .singleton(new SimpleGrantedAuthority("ROLE_USER")));
    }
}
