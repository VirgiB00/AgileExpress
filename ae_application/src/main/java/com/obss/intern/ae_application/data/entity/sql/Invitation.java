package com.obss.intern.ae_application.data.entity.sql;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "invitation", uniqueConstraints = {@UniqueConstraint(columnNames = {"invited_to_project", "invited_user"})})
@Getter
@Setter
public class Invitation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "invited_to_project")
    private Project project;

    @ManyToOne
    @JoinColumn(name = "invited_user")
    private User invitedUser;
}
