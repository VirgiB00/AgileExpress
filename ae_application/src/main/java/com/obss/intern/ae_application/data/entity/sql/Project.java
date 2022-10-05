package com.obss.intern.ae_application.data.entity.sql;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.obss.intern.ae_application.data.entity.EntityRoleValidator;
import com.obss.intern.ae_application.data.entity.StatusRoles;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "project")
@Getter
@Setter
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    private Date creationDate;

    private Date completionDate;

    @EntityRoleValidator(roles = {StatusRoles.DONE, StatusRoles.WIP})
    private String status;

    @JsonIgnore
    @OneToMany(mappedBy = "project")
    private List<Assignment> assignedUsers = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "project")
    private List<Invitation> invitations = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "project")
    private List<Task> tasks = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "project")
    List<Sprint> sprints = new ArrayList<>();

    public Project() {
    }

    public Project(Long id) {
        this.id = id;
    }
}
