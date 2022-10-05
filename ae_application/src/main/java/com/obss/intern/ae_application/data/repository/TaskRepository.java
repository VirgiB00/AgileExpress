package com.obss.intern.ae_application.data.repository;

import com.obss.intern.ae_application.data.entity.sql.Project;
import com.obss.intern.ae_application.data.entity.sql.Sprint;
import com.obss.intern.ae_application.data.entity.sql.Task;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findAllByProject(Project project);

    List<Task> findAllByNameIsLikeOrDescriptionIsLike(String name, String desc, Pageable pageable);

    List<Task> findAllBySprint(Sprint sprint);

    List<Task> findAllByProjectAndStatus(Project project, String status);

    List<Task> findAllByProjectAndStatusIsNotContaining(Project project, String status);

    List<Task> findAllByProjectAndSprintStatus(Project project, String status);
}
