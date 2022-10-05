package com.obss.intern.ae_application.service;

import com.obss.intern.ae_application.data.entity.StatusRoles;
import com.obss.intern.ae_application.data.entity.UserRoles;
import com.obss.intern.ae_application.data.entity.sql.*;
import com.obss.intern.ae_application.data.repository.AssignmentRepository;
import com.obss.intern.ae_application.data.repository.InvitationRepository;
import com.obss.intern.ae_application.data.repository.ProjectRepository;
import com.obss.intern.ae_application.data.repository.SprintRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.*;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    private final AssignmentRepository assignmentRepository;

    private final InvitationRepository invitationRepository;

    private final SprintRepository sprintRepository;

    private final SprintService sprintService;

    private final TaskService taskService;

    private final Logger logger = LoggerFactory.getLogger(ProjectService.class);

    public ProjectService(ProjectRepository projectRepository, AssignmentRepository assignmentRepository, InvitationRepository invitationRepository, SprintRepository sprintRepository, SprintService sprintService, TaskService taskService) {
        this.projectRepository = projectRepository;
        this.assignmentRepository = assignmentRepository;
        this.invitationRepository = invitationRepository;
        this.sprintRepository = sprintRepository;
        this.sprintService = sprintService;
        this.taskService = taskService;
    }

    // Verilenen kullanıcının atanmış olduğu tüm projeleri tarihe göre sıralayıp geri döndürür.
    public List<Project> getProjectsByAssignedUser(User user) {
        List<Assignment> assignments = assignmentRepository.findByAssignedUser(user);
        List<Project> projects = new ArrayList<>();
        assignments.forEach(assignment -> projects.add(assignment.getProject()));
        return projects;
    }

    // Projeyi tabloya ekler, update yapmasın diye id null'a setlenir.
    public Project createProject(Project project) {
        project.setId(null);
        project.setStatus(StatusRoles.WIP);
        project.setCreationDate(new Date());
        return projectRepository.save(project);
    }

    // Projeye atanmış kullanıcıları , rolleri ile döndürür.
    public List<Assignment> findAssignmentsByProject(Project project) {
        return assignmentRepository.findAllByProject(project);
    }

    // Bir kullanıcı bir projeye atamak için assigment tablosuna veri ekler.
    public void assignUserToProject(User user, Project project, String role) {
        Assignment assignment = new Assignment();
        assignment.setAssignedUser(user);
        assignment.setProject(project);
        assignment.setRole(role);
        assignmentRepository.save(assignment);
    }

    @Transactional
    public void unassignUser(Long projectId, Long userId) throws SQLException {
        try {
            assignmentRepository.deleteByProjectAndAssignedUser(new Project(projectId), new User(userId));
        } catch (Exception ex) {
            logger.error(ex.getMessage());
            throw new SQLException("An error occurred while unassignıng user!");
        }
    }

    // Assigment tablosunda rolü manager olan atanmaları arar ve gelen sonuçların projelerini döndürür.
    public List<Project> findCreatedProjects(User user) {
        List<Assignment> assignments = assignmentRepository.findByAssignedUserAndRole(user, UserRoles.P_MANAGER);
        List<Project> projects = new ArrayList<>();
        assignments.forEach(assignment -> projects.add(assignment.getProject()));
        return projects;
    }

    // Önce assigment tablosundan kullanıcı projelerini getirir, bu projeler arasından id'si uyuşan projeyi döndürür.
    public Project findCreatedProject(User user, Long projectId) {
        List<Project> createdProjects = findCreatedProjects(user);
        for (Project createdProject : createdProjects) {
            if (Objects.equals(createdProject.getId(), projectId)) {
                return createdProject;
            }
        }
        return null;
    }

    // Davet tablosuna veri ekler.
    public void inviteUserToProject(User user, Project project) {
        Invitation invitation = new Invitation();
        invitation.setInvitedUser(user);
        invitation.setProject(project);
        invitationRepository.save(invitation);
    }

    // Davet tablosuna veriler ekler.
    public void inviteUsersToProject(List<User> users, Project project) {
        List<Invitation> invitations = new ArrayList<>();
        users.forEach(user -> {
            Invitation invitation = new Invitation();
            invitation.setInvitedUser(user);
            invitation.setProject(project);
            invitations.add(invitation);
        });
        invitationRepository.saveAll(invitations);
    }

    public void updateProject(Project project) {
        Project savedProject = findById(project.getId());
        if (savedProject != null) {
            if (project.getName() != null) {
                savedProject.setName(project.getName());
            }
            if (project.getDescription() != null) {
                savedProject.setDescription(project.getDescription());
            }
            if (project.getStatus() != null) {
                savedProject.setStatus(project.getStatus());
                // Proje önceden başka bir statüye sahipken tamamlandı olarak güncellendiyse bitiş tarihi ver
                boolean projectIsCompletedNow = project.getStatus().compareTo(StatusRoles.DONE) == 0;
                boolean projectIsCompletedBefore = savedProject.getStatus().compareTo(StatusRoles.DONE) == 0;
                if (projectIsCompletedNow && !projectIsCompletedBefore) {
                    savedProject.setCompletionDate(new Date());
                } else if (!projectIsCompletedNow && projectIsCompletedBefore){
                    savedProject.setCompletionDate(null);
                }
            }
            projectRepository.save(savedProject);
        }
    }

    @Transactional
    public void updateUserRole(Long projectId, Long userId, String newRole) {
        assignmentRepository.updateRole(new Project(projectId), new User(userId), newRole);
    }

    // Kullanıcının atanmış olduğu projelerden verilen id'ye sahip olanı kullanıcının projedeki rolü ile döndürür.
    public Assignment findByProjectAndUser(Long projectId, Long userId) {
        Optional<Assignment> assignment = assignmentRepository.findByProjectAndAssignedUser(new Project(projectId), new User(userId));
        return assignment.orElse(null);
    }

    public List<Project> findAll() {
        return projectRepository.findAll();
    }

    public Project findById(Long projectId) {
        Optional<Project> project = projectRepository.findById(projectId);
        return project.orElse(null);
    }

    public List<Project> searchProjectsByName(String value, Long page) {
        return projectRepository.findAllByNameIsLike("%" + value + "%", PageRequest.of(page.intValue(), 10));
    }

    public List<Project> searchProjectByNameAndAssignedUser(User user, String value, Long page) {
        List<Assignment> assignments = assignmentRepository.findAllByAssignedUserAndProjectNameIsLike(user, "%" + value + "%", PageRequest.of(page.intValue(), 10));
        return assignments.stream().map(Assignment::getProject).toList();
    }

    @Transactional
    public void deleteById(Long projectId) throws SQLException {
        Project project = new Project(projectId);
        // Projedeki sprintleri bul ve sil
        List<Sprint> sprints = sprintRepository.findAllByProject(project);
        sprints.forEach(sprint -> sprintService.deleteSprint(sprint.getId()));
        // Projede kalan taskları sil
        List<Task> tasks = taskService.getTasksByProjectId(projectId);
        tasks.forEach(task -> taskService.deleteTask(task.getId()));
        // Projeye katılan üyeleri sil
        List<Assignment> assignments = findAssignmentsByProject(project);
        assignments.forEach(assignment -> assignmentRepository.deleteById(assignment.getId()));
        // Gönderilen davetleri sil
        invitationRepository.deleteAllByProject(new Project(projectId));
        projectRepository.deleteById(projectId);
    }
}
