package com.obss.intern.ae_application.controller;

import com.obss.intern.ae_application.data.dto.*;
import com.obss.intern.ae_application.data.entity.UserRoles;
import com.obss.intern.ae_application.data.entity.sql.Assignment;
import com.obss.intern.ae_application.data.entity.sql.Project;
import com.obss.intern.ae_application.data.entity.sql.User;
import com.obss.intern.ae_application.data.mapper.ProjectMapper;
import com.obss.intern.ae_application.service.ProjectService;
import com.obss.intern.ae_application.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("/api/project/")
public class ProjectController {

    private final UserService userService;

    private final ProjectService projectService;

    private final ProjectMapper projectMapper;

    public ProjectController(UserService userService, ProjectService projectService, ProjectMapper projectMapper) {
        this.userService = userService;
        this.projectService = projectService;
        this.projectMapper = projectMapper;
    }

    // Kullanıcın atanmış olduğu projeleri tarihe göre sıralanmış olarak döndürür.
    @GetMapping("/assigned")
    public List<ProjectDto> getAssignedProjects(Authentication authentication) {
        User user = (User) authentication.getDetails();
        List<Project> projects = projectService.getProjectsByAssignedUser(user);
        if (!projects.isEmpty()) {
            return convertListOfProjectEntityToDto(projects);
        }
        throw new ResponseStatusException(HttpStatus.NO_CONTENT, "No assigned project found for this user.");
    }

    // Projeye atanmış kullanıcıları göndürür.
    @GetMapping("/assignedUsers")
    public List<AssignmentDto> getAssignedUsersWithRole(@RequestParam Long projectId) {
        // TODO Bu projedeki kullanıcıları döndürmeye yetkisi var mı kontrol et.
        List<Assignment> assignments = projectService.findAssignmentsByProject(new Project(projectId));
        if (!assignments.isEmpty()) {
            return convertListOfAssigmentEntityToDto(assignments);
        }
        throw new ResponseStatusException(HttpStatus.NO_CONTENT, "There is no assigned users for this project!");
    }


    // Kullanıcı için yeni bir proje oluşturur ve kendisini projeye yönetici olarak atar.
    @PostMapping("/create")
    public ResponseEntity<Object> createProject(@RequestBody @Valid ProjectCreateDto project, Authentication authentication) {
        Project savedProject = projectService.createProject(projectMapper.projectCreateDtoToProject(project));
        projectService.assignUserToProject(((User) authentication.getDetails()), savedProject, UserRoles.P_MANAGER);
        return ResponseEntity.status(HttpStatus.CREATED).body(projectMapper.projectToProjectDto(savedProject));
    }

    // Projeye kullanıcıları davet eder.
    @PostMapping("/inviteUsers")
    public ResponseEntity<Object> inviteUsers(@RequestParam Long projectId, @RequestBody @Valid List<AssignedUserDto> users) {
        projectService.inviteUsersToProject(convertListOfAssignedUserDtoToEntity(users), new Project(projectId));
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // Bir projeye tek bir kullanıcıyı dahil eder.
    @PutMapping("/assignUser")
    public void assignUser(@RequestParam Long projectId, @RequestParam String email) {
        try {
            User user = userService.findUserByMail(email);
            projectService.assignUserToProject(user, new Project(projectId), UserRoles.TEAM_MEMBER);
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, ex.getMessage());
        }
    }

    // Projeden kullanıcı çıkarır.
    @PutMapping("/unassignUser")
    public void unassignUser(@RequestParam Long projectId, @RequestParam Long userId) {
        try {
            projectService.unassignUser(projectId, userId);
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, ex.getMessage());
        }
    }

    // Kullanıcı rolünü günceller.
    @PutMapping("/updateUserRole")
    public void updateUserRole(@RequestParam Long projectId, @RequestBody @Valid UpdateUserRoleDto dto) {
        projectService.updateUserRole(projectId, dto.userId(), dto.role());
    }

    // Bir projenin yeni ismi, açıklaması veya statüsü verilirse günceller.
    @PutMapping("/update")
    public void updateProject(@RequestBody @Valid ProjectUpdateDto project, Authentication authentication) {
        User user = (User) authentication.getDetails();
        // Kullanıcı bu projeyi güncelleyebilir mi kontrol et
        Project createdProject;
        if (user.getUserName().compareTo("admin") == 0) {
            createdProject = projectService.findById(project.id());
        } else {
            createdProject = projectService.findCreatedProject(user, project.id());
        }
        // Yetkisi varsa güncelle
        if (createdProject == null) {
            throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE);
        }
        projectService.updateProject(projectMapper.projectUpdateDtoToProject(project));
    }

    // Kullanıcının atanmış olduğu projeyi ve atama türünü içeren bilgiyi döndürür.
    @GetMapping("/getProjectAndUserRole")
    public AssignmentDefaultDto getProjectAndUserRole(@RequestParam Long projectId, Authentication authentication) {
        User user = (User) authentication.getDetails();
        Assignment assignment = projectService.findByProjectAndUser(projectId, user.getId());
        if (assignment != null) {
            return projectMapper.assignmentToAssignmentDefaultDto(assignment);
        }
        throw new ResponseStatusException(HttpStatus.NO_CONTENT);
    }

    // Tüm projeleri getir
    @GetMapping("/all")
    public List<ProjectDto> getAllProjects(Authentication authentication) {
        // Kullanıcı admin değilse 401 döndür
        if (((User) authentication.getDetails()).getUserName().compareTo("admin") != 0) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        List<Project> projects = projectService.findAll();
        if (!projects.isEmpty()) {
            return this.convertListOfProjectEntityToDto(projects);
        }
        throw new ResponseStatusException(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/get")
    public ProjectDto getProject(@RequestParam Long projectId) {
        // TODO Bu projeyi görebilme yetkisi var mı kontrol et
        Project project = projectService.findById(projectId);
        if (project != null) {
            return projectMapper.projectToProjectDto(project);
        }
        throw new ResponseStatusException(HttpStatus.NO_CONTENT, "There is no assigned project by this id!");
    }

    @GetMapping("/search")
    public List<ProjectDto> searchProjectValue(@RequestParam String value, @RequestParam Long page, Authentication authentication) {
        User user = (User) authentication.getDetails();
        List<Project> projects;
        // Kullanıcı admin ise
        if (user.getUserName().compareTo("admin") == 0) {
            projects = projectService.searchProjectsByName(value, page);
        } else {
            projects = projectService.searchProjectByNameAndAssignedUser(user, value, page);
        }
        return this.convertListOfProjectEntityToDto(projects);
    }

    @DeleteMapping("/delete")
    public void delete(@RequestParam Long projectId) {
        try {
            projectService.deleteById(projectId);
        } catch (SQLException e) {
            throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE);
        }
    }

    // Entity listesini DTO listesine çevirir.
    private List<ProjectDto> convertListOfProjectEntityToDto(List<Project> projects) {
        return projects.stream().map(projectMapper::projectToProjectDto).toList();
    }

    private List<AssignmentDto> convertListOfAssigmentEntityToDto(List<Assignment> assignments) {
        return assignments.stream().map(projectMapper::assignmentToAssignmentDto).toList();
    }

    private List<User> convertListOfAssignedUserDtoToEntity(List<AssignedUserDto> assignedUserDtos) {
        return assignedUserDtos.stream().map(projectMapper::assignedUserDtoToUser).toList();
    }
}
