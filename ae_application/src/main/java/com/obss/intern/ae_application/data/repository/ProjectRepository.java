package com.obss.intern.ae_application.data.repository;

import com.obss.intern.ae_application.data.entity.sql.Project;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    Optional<Project> findByName(String name);

    List<Project> findAllByNameIsLike(String name, Pageable request);
}
