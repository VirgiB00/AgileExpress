package com.obss.intern.ae_application.data.entity.sql;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.obss.intern.ae_application.data.entity.EntityRoleValidator;
import com.obss.intern.ae_application.data.entity.StatusRoles;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Range;

import javax.persistence.*;
import javax.validation.constraints.NegativeOrZero;
import javax.validation.constraints.Positive;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "task")
@Getter
@Setter
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    @EntityRoleValidator(roles = {StatusRoles.DONE, StatusRoles.WIP, StatusRoles.PASSIVE, StatusRoles.BACKLOG})
    private String status;

    @Range(min = 1, max = 10)
    private Long storyPoint;

    private Date creationDate;

    private Date startDate;

    @Positive
    private Long duration;

    private Date completionDate;

    @JsonIgnore
    @OneToMany(mappedBy = "task")
    private List<TaskAssignment> assignments = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project")
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sprint")
    private Sprint sprint;

    public Task() {
    }

    public Task(Long id) {
        this.id = id;
    }
}
