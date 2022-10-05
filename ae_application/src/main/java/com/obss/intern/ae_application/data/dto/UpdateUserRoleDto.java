package com.obss.intern.ae_application.data.dto;

import com.obss.intern.ae_application.data.entity.EntityRoleValidator;

import javax.validation.constraints.NotNull;

import java.io.Serializable;

import static com.obss.intern.ae_application.data.entity.UserRoles.*;

public record UpdateUserRoleDto(@NotNull Long userId,
                                @NotNull @EntityRoleValidator(roles = {P_MANAGER, TEAM_LEAD, TEAM_MEMBER}) String role) implements Serializable {
}
