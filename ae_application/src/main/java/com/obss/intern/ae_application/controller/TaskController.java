package com.obss.intern.ae_application.controller;

import com.obss.intern.ae_application.data.dto.*;
import com.obss.intern.ae_application.data.entity.UserRoles;
import com.obss.intern.ae_application.data.entity.sql.Assignment;
import com.obss.intern.ae_application.data.entity.sql.Task;
import com.obss.intern.ae_application.data.entity.sql.User;
import com.obss.intern.ae_application.data.mapper.TaskMapper;
import com.obss.intern.ae_application.service.ProjectService;
import com.obss.intern.ae_application.service.TaskService;
import com.obss.intern.ae_application.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/project/task")
public class TaskController {

    private final ProjectService projectService;

    private final TaskService taskService;

    private final UserService userService;

    private final TaskMapper taskMapper;

    public TaskController(ProjectService projectService, TaskService taskService, UserService userService, TaskMapper taskMapper) {
        this.projectService = projectService;
        this.taskService = taskService;
        this.userService = userService;
        this.taskMapper = taskMapper;
    }

    @PostMapping("/create")
    public ResponseEntity<Object> createTask(@RequestParam Long projectId, @RequestBody @Valid TaskCreateDto task, Authentication authentication) {
        User user = (User) authentication.getDetails();

        // Böyle bir projede bu kullanıcı var mı kontrol et.
        Assignment assignment = projectService.findByProjectAndUser(projectId, user.getId());
        if (assignment == null) {
            throw new ResponseStatusException(HttpStatus.NO_CONTENT);
        }

        // Eğer kullanıcının projedeki rolü yönetici veya takım lideri mi kontrol et.
        if (assignment.getRole().compareTo(UserRoles.P_MANAGER) == 0 || assignment.getRole().compareTo(UserRoles.TEAM_LEAD) == 0) {
            Task entity = taskMapper.taskCreateDtoToTask(task);
            entity.setProject(assignment.getProject());
            taskService.createTask(entity);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        }
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You are not authorized for this action.");
    }

    @GetMapping("/getTasks")
    public List<TaskDto> getTasks(@RequestParam Long projectId) {
        List<Task> tasks = taskService.getTasksByProjectId(projectId);
        if (!tasks.isEmpty()) {
            return convertListOfTaskEntityToDto(tasks);
        }
        throw new ResponseStatusException(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/getBacklogTasks")
    public List<TaskPublicDetailsDto> getBacklogTasks(@RequestParam Long projectId) {
        List<Task> tasks = taskService.findBacklogTasks(projectId);
        if (!tasks.isEmpty()) {
            return convertListOfTaskEntityToPublicDetailsDto(tasks);
        }
        throw new ResponseStatusException(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/getSprintTasks")
    public List<TaskDto> getTasksForSprint(@RequestParam Long sprintId) {
        List<Task> tasks = taskService.findAllBySprint(sprintId);
        if (!tasks.isEmpty()) {
            return convertListOfTaskEntityToDto(tasks);
        }
        throw new ResponseStatusException(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/activeSprintTasks")
    public List<TaskDto> getActiveSprintTasks(@RequestParam Long projectId) {
        List<Task> tasks = taskService.findActiveSprintTasks(projectId);
        if (!tasks.isEmpty()) {
            return convertListOfTaskEntityToDto(tasks);
        }
        throw new ResponseStatusException(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/getTask")
    public TaskPublicDetailsDto getTask(@RequestParam Long taskId) {
        // TO-DO Yetkisi varsa döndür.
        Task task = taskService.findById(taskId);
        if (task != null) {
            return taskMapper.taskToTaskPublicDetailsDto(task);
        }
        throw new ResponseStatusException(HttpStatus.NO_CONTENT);
    }

    // Task'ı günceller
    @PutMapping("/update")
    public void updateTask(@RequestBody @Valid TaskUpdateDto task) {
        // TO-DO kullanıcının bunu yapmaya yetkisi var mı kontrol et.
        Task entityTask = taskService.updateTask(taskMapper.taskUpdateDtoToTask(task));
        if (entityTask == null) {
            throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE);
        }
    }

    @DeleteMapping("delete")
    public void deleteTask(@RequestParam Long taskId) {
        // TO-DO Kullanıcının yetkisi var mı kontrol et.
        try {
            taskService.deleteTask(taskId);
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, ex.getMessage());
        }
    }

    // Task'a atanmış olan kullanıcıları döndürür.
    @GetMapping("/assignedUsers")
    public List<User> getAssignedUsers(@RequestParam Long taskId) {
        //  TO-DO Kullanıcı yetkisi kontrol et.
        List<User> users = userService.findUsersByAssignedTask(new Task(taskId));
        if (users != null) {
            return users;
        } else {
            throw new ResponseStatusException(HttpStatus.NO_CONTENT, "There is no assigned user for this task!");
        }
    }

    @PutMapping("/assignUser")
    public void assignUser(@RequestParam Long taskId, @RequestParam Long userId) {
        try {
            taskService.assignUser(taskId, userId);
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, ex.getMessage());
        }
    }

    @PutMapping("/unassignUser")
    public void unassignUser(@RequestParam Long taskId, @RequestParam Long userId) {
        try {
            taskService.unassignUser(taskId, userId);
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, ex.getMessage());
        }
    }

    @GetMapping("/search")
    public List<TaskSearchDto> searchTaskValue(@RequestParam String value, @RequestParam Long page, Authentication authentication) {
        User user = (User) authentication.getDetails();
        List<Task> tasks;
        // Kullanıcı admin ise
        if (user.getUserName().compareTo(UserRoles.ADMIN) == 0) {
            tasks = taskService.searchAll(value, value, page);
        } else {
            tasks = taskService.searchAllByUser(value, value, page, user);
        }
        return tasks.stream().map(taskMapper::taskToTaskSearchDto).toList();
    }

    private List<TaskDto> convertListOfTaskEntityToDto(List<Task> tasks) {
        return tasks.stream().map(taskMapper::taskToTaskDto).toList();
    }

    private List<TaskPublicDetailsDto> convertListOfTaskEntityToPublicDetailsDto(List<Task> tasks) {
        return tasks.stream().map(taskMapper::taskToTaskPublicDetailsDto).toList();
    }
}
