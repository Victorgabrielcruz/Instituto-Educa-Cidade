package com.educacidades.repositories;

import com.educacidades.models.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);

    List<User> findUsersByProfiles(Integer profileId);
}
