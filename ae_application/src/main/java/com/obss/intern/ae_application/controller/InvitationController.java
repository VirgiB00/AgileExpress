package com.obss.intern.ae_application.controller;

import com.obss.intern.ae_application.data.entity.UserRoles;
import com.obss.intern.ae_application.data.entity.sql.Invitation;
import com.obss.intern.ae_application.data.entity.sql.Project;
import com.obss.intern.ae_application.data.entity.sql.User;
import com.obss.intern.ae_application.data.repository.InvitationRepository;
import com.obss.intern.ae_application.service.ProjectService;
import com.obss.intern.ae_application.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/project/invitation")
public class InvitationController {

    @Autowired
    InvitationRepository invitationRepository;

    @Autowired
    UserService userService;

    @Autowired
    ProjectService projectService;

    // Kullanıcıya olan davetleri döndürür.
    @GetMapping("/get")
    public List<Invitation> getInvitations(@RequestParam Long userId) {
        try {
            User user = userService.findUserById(userId);
            List<Invitation> invitations = invitationRepository.findAllByInvitedUser(user);
            if (!invitations.isEmpty()) {
                return invitations;
            }
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, ex.getMessage());
        }
        throw new ResponseStatusException(HttpStatus.NO_CONTENT, "No invitations found for this user!");
    }

    // Proje davetini kabul eder.
    @Transactional
    @PostMapping("/accept")
    public ResponseEntity<Object> acceptInvite(@RequestParam Long projectId, @RequestParam Long userId) {
        try {
            invitationRepository.deleteByProjectAndInvitedUser(new Project(projectId), new User(userId));
            projectService.assignUserToProject(new User(userId), new Project(projectId), UserRoles.TEAM_MEMBER);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, ex.getMessage());
        }
    }

    // Proje davetini ret eder.
    @Transactional
    @DeleteMapping("/reject")
    public void rejectInvitation(@RequestParam Long projectId, @RequestParam Long userId) {
        try {
            invitationRepository.deleteByProjectAndInvitedUser(new Project(projectId), new User(userId));
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, ex.getMessage());
        }
    }
}
