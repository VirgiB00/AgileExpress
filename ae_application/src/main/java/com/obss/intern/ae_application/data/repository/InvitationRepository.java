package com.obss.intern.ae_application.data.repository;

import com.obss.intern.ae_application.data.entity.sql.Invitation;
import com.obss.intern.ae_application.data.entity.sql.Project;
import com.obss.intern.ae_application.data.entity.sql.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvitationRepository extends JpaRepository<Invitation, Long> {

    List<Invitation> findAllByInvitedUser(User user);

    void deleteByProjectAndInvitedUser(Project project, User user);

    void deleteAllByProject(Project project);
}
