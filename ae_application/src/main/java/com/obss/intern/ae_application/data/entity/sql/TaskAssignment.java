package com.obss.intern.ae_application.data.entity.sql;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "task_assignment", uniqueConstraints = @UniqueConstraint(columnNames = {"task", "member"}))
@Getter
@Setter
public class TaskAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "task")
    private Task task;

    @ManyToOne
    @JoinColumn(name = "member")
    private User user;

    public TaskAssignment() {
    }

    public TaskAssignment(Task task, User user) {
        this.task = task;
        this.user = user;
    }
}
