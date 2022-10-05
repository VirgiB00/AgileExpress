package com.obss.intern.ae_application.data.dto;

import com.obss.intern.ae_application.data.entity.EntityRoleValidator;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Date;

import static com.obss.intern.ae_application.data.entity.StatusRoles.*;

public record SprintDto(@NotNull Long id,
                        @NotNull @NotBlank String name,
                        @NotNull @EntityRoleValidator(roles = {PASSIVE, WIP, DONE}) String status,
                        @NotNull Date startDate,
                        @NotNull  Date endDate) implements Serializable {
}
