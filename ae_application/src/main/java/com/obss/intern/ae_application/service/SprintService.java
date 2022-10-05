package com.obss.intern.ae_application.service;

import com.obss.intern.ae_application.data.entity.StatusRoles;
import com.obss.intern.ae_application.data.entity.sql.Project;
import com.obss.intern.ae_application.data.entity.sql.Sprint;
import com.obss.intern.ae_application.data.entity.sql.Task;
import com.obss.intern.ae_application.data.repository.SprintRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@Service
public class SprintService {

    private final SprintRepository sprintRepository;

    private final TaskService taskService;

    public SprintService(SprintRepository sprintRepository, TaskService taskService) {
        this.sprintRepository = sprintRepository;
        this.taskService = taskService;
    }

    public void deleteSprint(Long sprintId) {
        List<Task> tasks = taskService.findAllBySprint(sprintId);
        tasks.forEach(task -> {
            try {
                taskService.deleteTask(task.getId());
            } catch (Exception ex) {
                throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE);
            }
        });
        sprintRepository.deleteById(sprintId);
    }

    public void createSprint(Sprint sprint) {
        sprintRepository.save(sprint);
    }

    public void updateSprint(Sprint sprint) {
        Assert.notNull(sprint.getId(), "Id can not be null!");
        Optional<Sprint> entitySprint = sprintRepository.findById(sprint.getId());
        if (entitySprint.isPresent()) {
            var entity = entitySprint.get();

            // Sprint aktif olarak güncellenecekse projede var olan aktif sprinti pasif yapar.
            if (sprint.getStatus().compareTo(StatusRoles.WIP) == 0 && entity.getStatus().compareTo(StatusRoles.WIP) != 0) {
                Optional<Sprint> activeSprint = sprintRepository.findByProjectAndStatus(entity.getProject(), StatusRoles.WIP);
                if (activeSprint.isPresent()) {
                    var activeSprintEntity = activeSprint.get();
                    activeSprintEntity.setStatus(StatusRoles.PASSIVE);
                    sprintRepository.save(activeSprintEntity);
                }
            }

            entity.setName(sprint.getName());
            entity.setStartDate(sprint.getStartDate());
            entity.setEndDate(sprint.getEndDate());
            entity.setStatus(sprint.getStatus());

            sprintRepository.save(entity);
        }
    }

    public Sprint findById(Long id) {
        Optional<Sprint> sprint = sprintRepository.findById(id);
        return sprint.orElse(null);
    }

    public List<Sprint> findAllByProject(Long projectId) {
        return sprintRepository.findAllByProject(new Project(projectId));
    }

    public Collection<List<Task>> groupSprintTasks(List<Task> tasks) {
        var map = new HashMap<String, List<Task>>();
        tasks.forEach(task -> {
            if (map.containsKey(task.getStatus())) {
                map.get(task.getStatus()).add(task);
            } else {
                map.put(task.getStatus(), new ArrayList<>());
            }
        });
        return map.values();
    }
}
