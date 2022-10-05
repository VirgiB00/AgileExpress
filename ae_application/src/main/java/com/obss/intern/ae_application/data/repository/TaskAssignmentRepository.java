package com.obss.intern.ae_application.data.repository;

import com.obss.intern.ae_application.data.entity.sql.Task;
import com.obss.intern.ae_application.data.entity.sql.TaskAssignment;
import com.obss.intern.ae_application.data.entity.sql.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskAssignmentRepository extends JpaRepository<TaskAssignment, Long> {

    List<TaskAssignment> findAllByTask(Task task);

    List<TaskAssignment> findAllByUser(User user);

    void deleteByTaskAndUser(Task task, User user);

    void deleteAllByTask(Task task);

    List<TaskAssignment> findAllByUserAndTaskNameIsLikeOrTaskDescriptionIsLike(User user, String name, String desc, Pageable pageable);
}
