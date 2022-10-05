package com.obss.intern.ae_application.controller;

import com.obss.intern.ae_application.data.dto.SprintDto;
import com.obss.intern.ae_application.data.dto.SprintWithTasksDto;
import com.obss.intern.ae_application.data.mapper.SprintMapper;
import com.obss.intern.ae_application.data.entity.StatusRoles;
import com.obss.intern.ae_application.data.entity.sql.Project;
import com.obss.intern.ae_application.data.entity.sql.Sprint;
import com.obss.intern.ae_application.data.dto.SprintCreateDto;
import com.obss.intern.ae_application.data.entity.sql.Task;
import com.obss.intern.ae_application.service.SprintService;
import com.obss.intern.ae_application.service.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import java.util.*;

@RestController
@RequestMapping("/api/project/sprint")
public class SprintController {

    private final TaskService taskService;

    private final SprintService sprintService;

    private final SprintMapper sprintMapper;

    public SprintController(TaskService taskService, SprintService sprintService, SprintMapper sprintMapper) {
        this.taskService = taskService;
        this.sprintService = sprintService;
        this.sprintMapper = sprintMapper;
    }

    @GetMapping("/sprints")
    public List<SprintWithTasksDto> getSprints(@RequestParam Long projectId) {
        List<Sprint> sprints = sprintService.findAllByProject(projectId);
        if (!sprints.isEmpty()) {
            return convertListOfSprintEntityToSprintWithTasksDto(sprints);
        }
        throw new ResponseStatusException(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/get")
    public SprintDto getSprint(@RequestParam Long sprintId) {
        Sprint sprint = sprintService.findById(sprintId);
        if (sprint != null) {
            return sprintMapper.sprintToSprintDto(sprint);
        }
        throw new ResponseStatusException(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/tasks")
    public SprintWithTasksDto getTasks(@RequestParam Long sprintId) {
        Sprint sprint = sprintService.findById(sprintId);
        if (sprint != null) {
            return sprintMapper.sprintToSprintWithTasksDto(sprint);
        }
        throw new ResponseStatusException(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/create")
    public ResponseEntity<Object> createSprint(@RequestParam Long projectId, @RequestBody @Valid SprintCreateDto sprint) {
        Sprint sprintEntity = sprintMapper.sprintCreateDtoToSprint(sprint);
        sprintEntity.setProject(new Project(projectId));
        sprintEntity.setStatus(StatusRoles.PASSIVE);
        sprintService.createSprint(sprintEntity);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/update")
    public void updateSprint(@RequestBody @Valid SprintDto sprint) {
        sprintService.updateSprint(sprintMapper.sprintDtoToSprint(sprint));
    }

    @DeleteMapping("/delete")
    public void deleteTask(@RequestParam Long sprintId) {
        sprintService.deleteSprint(sprintId);
    }

    @GetMapping("/burndown")
    public Map<Object, Object> burndownDate(@RequestParam Long sprintId) {
        List<Task> tasks = taskService.findAllBySprint(sprintId);
        HashMap<Object, Object> map = new HashMap<>();
        if (!tasks.isEmpty()) {
            List<Date> dates = new ArrayList<>();
            List<Integer> points = new ArrayList<>();
            int totalStoryP = 0;

            // Toplam story point'i bul
            for (Task task : tasks) {
                totalStoryP += task.getStoryPoint();
            }

            // Başlama tarihi en küçük olan task'ın tarini bul
            tasks.sort(Comparator.comparing(Task::getStartDate));
            dates.add(tasks.get(0).getStartDate());
            points.add(totalStoryP);

            // Tamamlanan taskların tarihlerini al
            List<Task> completed = new ArrayList<>();
            tasks.forEach(task -> {
                if (task.getStatus() != null && task.getStatus().compareTo(StatusRoles.DONE) == 0) {
                    completed.add(task);
                }
            });

            completed.sort(Comparator.comparing(Task::getCompletionDate));
            for (Task task : completed) {
                if (task.getStatus().compareTo(StatusRoles.DONE) == 0) {
                    dates.add(task.getCompletionDate());
                    totalStoryP -= task.getStoryPoint();
                    points.add(totalStoryP);
                }
            }

            // Taskları bitiş tarihine göre sırala ve bitişi tarihi en geç olanı bul
            // TODO güncelle
//            tasks.sort(Comparator.comparing(Task::getE));
//            dates.add(tasks.get(tasks.size() - 1).getEDate());
//            points.add(0);
//
//            map.put("data", points);
//            map.put("label", dates);
//            return map;
        }
        map.put("data", new ArrayList<>());
        map.put("label", new ArrayList<>());
        return null;
    }

    private List<SprintDto> convertListOfSprintEntityToDto(List<Sprint> sprints) {
        return sprints.stream().map(sprintMapper::sprintToSprintDto).toList();
    }

    private List<SprintWithTasksDto> convertListOfSprintEntityToSprintWithTasksDto(List<Sprint> sprints) {
        return sprints.stream().map(sprintMapper::sprintToSprintWithTasksDto).toList();
    }
}
