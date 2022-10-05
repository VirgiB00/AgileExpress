package com.obss.intern.ae_application.data.entity.sql;

import com.obss.intern.ae_application.data.entity.EntityRoleValidator;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

import static com.obss.intern.ae_application.data.entity.UserRoles.*;

@Entity
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"project", "assigned_user"}))
@Getter
@Setter
public class Assignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "project")
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_user")
    private User assignedUser;

    @EntityRoleValidator(roles = {P_MANAGER, TEAM_LEAD, TEAM_MEMBER})
    private String role;
}
