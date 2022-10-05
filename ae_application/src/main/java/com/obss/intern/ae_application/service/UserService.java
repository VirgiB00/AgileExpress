package com.obss.intern.ae_application.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.obss.intern.ae_application.data.entity.ldap.LDAPUser;
import com.obss.intern.ae_application.data.entity.sql.Task;
import com.obss.intern.ae_application.data.entity.sql.TaskAssignment;
import com.obss.intern.ae_application.data.entity.sql.User;
import com.obss.intern.ae_application.data.repository.TaskAssignmentRepository;
import com.obss.intern.ae_application.data.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.*;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskAssignmentRepository taskAssignmentRepository;
    private Logger logger = LoggerFactory.getLogger(UserService.class);

    public User checkIfGoogleBasedUserExist(String mail) {
        Optional<User> user = userRepository.findByMailAndSource(mail, "google");
        return user.orElse(null);
    }

    public User checkIfLDAPBasedUserExist(String mail) {
        Optional<User> user = userRepository.findByMailAndSource(mail, "ldap");
        return user.orElse(null);
    }

    public User createUserFromJwt(GoogleIdToken.Payload details) {
        Map<String, Object> unknownKeys = details.getUnknownKeys();
        User user = new User(
                UUID.randomUUID().toString(),
                unknownKeys.get("given_name").toString(),
                unknownKeys.get("family_name").toString(),
                details.getEmail(),
                "",
                "google");
        return userRepository.save(user);
    }

    public User createUserFromLDAP(LDAPUser user) {
        User newUser = new User();
        newUser.setUserName(user.getUsername());
        newUser.setMail(user.getMail());
        newUser.setFirstName(user.getFName());
        newUser.setSurname(user.getSName());
        newUser.setPassword(user.getPassword());
        newUser.setSource("ldap");
        return userRepository.save(newUser);
    }

    public User findUserById(Long id) throws SQLException {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            return user.get();
        } else {
            throw new SQLException("No user found by this id!");
        }
    }

    public User findUserByUsername(String username) {
        Optional<User> user = userRepository.findByUserName(username);
        return user.orElse(null);
    }

    public User findUserByMail(String mail) {
        Optional<User> user = userRepository.findByMail(mail);
        return user.orElse(null);
    }

    public List<User> findUsersByAssignedTask(Task task) {
        List<User> users = new ArrayList<>();
        List<TaskAssignment> assignments = taskAssignmentRepository.findAllByTask(task);
        assignments.forEach(taskAssignment -> users.add(taskAssignment.getUser()));
        return users;
    }

    public void updateUser(User user) throws SQLException {
        try {
            userRepository.save(user);
        } catch (Exception ex) {
            logger.error(ex.getMessage());
            throw new SQLException("An error occurred while updating user!");
        }
    }

    public List<User> searchUser(String email, Long page) {
        return userRepository.findAllByMailLike("%"+email+"%", PageRequest.of(page.intValue(), 10));
    }
}
