package com.obss.intern.ae_application.data.repository;

import com.obss.intern.ae_application.data.entity.sql.Project;
import com.obss.intern.ae_application.data.entity.sql.Sprint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SprintRepository extends JpaRepository<Sprint, Long> {

    List<Sprint> findAllByProject(Project project);

    List<Sprint> findAllByProjectAndStatus(Project project, String status);

    Optional<Sprint> findByProjectAndStatus(Project project, String status);
}
