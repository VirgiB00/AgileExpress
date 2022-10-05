package com.obss.intern.ae_application.data.entity.sql;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.obss.intern.ae_application.data.entity.EntityRoleValidator;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.Email;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "member", uniqueConstraints = { @UniqueConstraint(columnNames = { "mail", "source" }) })
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private String userName;
    private String firstName;
    private String surname;
    @Email
    private String mail;
    @JsonIgnore
    private String password;
    @EntityRoleValidator(roles = {"google", "ldap"})
    private String source;

    @JsonIgnore
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<TaskAssignment> assignedTasks = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "assignedUser", fetch = FetchType.LAZY)
    private List<Assignment> assignedProjects = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "invitedUser", fetch = FetchType.LAZY)
    private List<Invitation> invitations = new ArrayList<>();

    public User() {
    }

    public User(Long id) {
        this.id = id;
    }

    public User(String userName, String firstName, String surname, String mail, String password, String source) {
        this.userName = userName;
        this.firstName = firstName;
        this.surname = surname;
        this.mail = mail;
        this.password = password;
        this.source = source;
    }

    public User(Long id, String userName) {
        this.id = id;
        this.userName = userName;
    }
}
