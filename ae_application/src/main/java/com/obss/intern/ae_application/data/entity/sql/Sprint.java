package com.obss.intern.ae_application.data.entity.sql;

import com.obss.intern.ae_application.data.entity.EntityRoleValidator;
import com.obss.intern.ae_application.data.entity.StatusRoles;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table
@Getter
@Setter
@NoArgsConstructor
public class Sprint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @EntityRoleValidator(roles = {StatusRoles.PASSIVE, StatusRoles.WIP, StatusRoles.DONE})
    private String status;

    private Date startDate;

    private Date endDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project")
    private Project project;

    @OneToMany(mappedBy = "sprint", fetch = FetchType.LAZY)
    List<Task> tasks = new ArrayList<>();

    public Sprint(Long id) {
        this.id = id;
    }
}
