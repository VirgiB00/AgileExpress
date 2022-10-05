package com.obss.intern.ae_application.service;

import com.obss.intern.ae_application.data.entity.sql.*;
import com.obss.intern.ae_application.data.repository.SprintRepository;
import com.obss.intern.ae_application.data.repository.TaskAssignmentRepository;
import com.obss.intern.ae_application.data.repository.TaskRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static com.obss.intern.ae_application.data.entity.StatusRoles.*;

@Repository
public class TaskService {

    private final TaskRepository taskRepository;

    private final TaskAssignmentRepository taskAssignmentRepository;

    private final SprintRepository sprintRepository;

    private final Logger logger = LoggerFactory.getLogger(TaskService.class);

    public TaskService(TaskRepository taskRepository, TaskAssignmentRepository taskAssignmentRepository, SprintRepository sprintRepository) {
        this.taskRepository = taskRepository;
        this.taskAssignmentRepository = taskAssignmentRepository;
        this.sprintRepository = sprintRepository;
    }

    public void createTask(Task task) {
        task.setId(null);
        task.setStatus(BACKLOG);
        task.setCreationDate(new Date());
        taskRepository.save(task);
    }

    public List<Task> getTasksByProjectId(Long id){
        return taskRepository.findAllByProject(new Project(id));
    }

    public Task findById(Long id) {
        Optional<Task> task = taskRepository.findById(id);
        return task.orElse(null);
    }

    public Task updateTask(Task task){
        Optional<Task> entity = taskRepository.findById(task.getId());
        if (entity.isPresent()) {
            var entityTask = entity.get();

            // Eğer task backlog'a çekildiyse sprintten çıkarır.
            if (entityTask.getStatus().compareTo(BACKLOG) != 0 && task.getStatus().compareTo(BACKLOG) == 0) {
                entityTask.setSprint(null);
            }
            // Backlog'dan başka bir statüye geçtiyse projedeki aktif sprinte atar.
            else if (entityTask.getStatus().compareTo(BACKLOG) == 0 && task.getStatus().compareTo(BACKLOG) != 0) {
                var sprint = findActiveSprint(entityTask.getProject().getId());
                if (sprint == null) {
                    return null;
                }
                entityTask.setSprint(sprint);
            }

            // Eğer task tamamlandı işaretlendiyse tamamlanma tarihini oluşturur.
            if (entityTask.getStatus().compareTo(DONE) != 0 && task.getStatus().compareTo(DONE) == 0) {
                entityTask.setCompletionDate(new Date());
            } else if (entityTask.getStatus().compareTo(DONE) == 0 && task.getStatus().compareTo(DONE) != 0) {
                entityTask.setCompletionDate(null);
            }

            // Task önceden backlog veya passive statüye sahipken in-progress veya done statüsüne sahipse
            // Task'ın başlama tarihini oluşturur.
            if ((entityTask.getStatus().compareTo(BACKLOG) == 0 || entityTask.getStatus().compareTo(PASSIVE) == 0)
                    && (task.getStatus().compareTo(WIP) == 0 || task.getStatus().compareTo(DONE) == 0)) {
                entityTask.setStartDate(new Date());
            }
            // Tam tersi durumda başlama tarihi siler.
            else if ((entityTask.getStatus().compareTo(WIP) == 0 || entityTask.getStatus().compareTo(DONE) == 0)
                    && (task.getStatus().compareTo(BACKLOG) == 0 || task.getStatus().compareTo(PASSIVE) == 0)) {
                entityTask.setStartDate(null);
            }

            entityTask.setName(task.getName());
            entityTask.setDescription(task.getDescription());
            entityTask.setStatus(task.getStatus());
            entityTask.setStoryPoint(task.getStoryPoint());
            entityTask.setDuration(task.getDuration());
            return taskRepository.save(entityTask);
        }
        return null;
    }

    @Transactional
    public void deleteTask(Long id) {
        taskAssignmentRepository.deleteAllByTask(new Task(id));
        taskRepository.deleteById(id);
    }

    public void assignUser(Long taskId, Long userId) throws SQLException {
        try {
            TaskAssignment taskAssignment = new TaskAssignment(new Task(taskId), new User(userId));
            taskAssignmentRepository.save(taskAssignment);
        } catch (Exception ex) {
            logger.error(ex.getMessage());
            throw new SQLException("An error occurred while assigning user!");
        }
    }

    @Transactional
    public void unassignUser(Long taskId, Long userId) throws SQLException {
        try {
            taskAssignmentRepository.deleteByTaskAndUser(new Task(taskId), new User(userId));
        } catch (Exception ex) {
            logger.error(ex.getMessage());
            throw new SQLException("An error occurred while assigning user!");
        }
    }

    public List<Task> searchAll(String name, String desc, Long page) {
        return taskRepository.findAllByNameIsLikeOrDescriptionIsLike("%" + name + "%", "%" + desc + "%", PageRequest.of(page.intValue(), 10));
    }

    public List<Task> searchAllByUser(String name, String desc, Long page, User user) {
        List<TaskAssignment> assignments = taskAssignmentRepository.findAllByUserAndTaskNameIsLikeOrTaskDescriptionIsLike(user, "%"+name+"%", "%"+desc+"%", PageRequest.of(page.intValue(), 10));
        List<Task> tasks = new ArrayList<>();
        assignments.forEach(taskAssignment -> tasks.add(taskAssignment.getTask()));
        return tasks;
    }

    public List<Task> findAllBySprint(Long sprintId) {
        return taskRepository.findAllBySprint(new Sprint(sprintId));
    }

    public List<Task> findBacklogTasks(Long projectId) {
        return taskRepository.findAllByProjectAndStatus(new Project(projectId), BACKLOG);
    }

    public List<Sprint> findActiveSprints(Long projectId) {
        return sprintRepository.findAllByProjectAndStatus(new Project(projectId), WIP);
    }

    public Sprint findActiveSprint(long projectId) {
        return sprintRepository.findByProjectAndStatus(new Project(projectId), WIP).orElse(null);
    }

    public List<Task> findActiveSprintTasks(Long projectId) {
        return taskRepository.findAllByProjectAndSprintStatus(new Project(projectId), WIP);
    }
}
