package com.obss.intern.ae_application.data.repository;

import com.obss.intern.ae_application.data.entity.sql.Assignment;
import com.obss.intern.ae_application.data.entity.sql.Project;
import com.obss.intern.ae_application.data.entity.sql.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {

    List<Assignment> findByAssignedUser(User user);

    List<Assignment> findByAssignedUserAndRole(User user, String role);

    List<Assignment> findAllByProject(Project project);

    void deleteByProjectAndAssignedUser(Project project, User user);

    Optional<Assignment> findByProjectAndAssignedUser(Project project, User user);

    @Modifying
    @Query("UPDATE Assignment u SET u.role = :role WHERE u.project = :project AND u.assignedUser = :user")
    void updateRole(Project project, User user, String role);

    List<Assignment> findAllByAssignedUserAndProjectNameIsLike(User user, String name, Pageable pageable);
}
