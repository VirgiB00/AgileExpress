package com.obss.intern.ae_application.data.repository;

import com.obss.intern.ae_application.data.entity.sql.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUserName(String username);

    Optional<User> findByMailAndSource(String mail, String source);

    Optional<User> findByMail(String mail);

    List<User> findAllByMailLike(String mail, Pageable pageable);
}
