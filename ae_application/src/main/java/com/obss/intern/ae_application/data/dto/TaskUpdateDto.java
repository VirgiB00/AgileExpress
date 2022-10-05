package com.obss.intern.ae_application.data.dto;

import com.obss.intern.ae_application.data.entity.EntityRoleValidator;
import org.hibernate.validator.constraints.Range;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.io.Serializable;

import static com.obss.intern.ae_application.data.entity.StatusRoles.*;

public record TaskUpdateDto(@NotNull Long id, @NotNull @NotBlank String name, @NotNull @NotBlank String description,
                            @NotNull @EntityRoleValidator(roles = {BACKLOG, PASSIVE, WIP, DONE}) String status,
                            @NotNull @Range(min = 1, max = 10) Long storyPoint,
                            @NotNull @Positive Long duration) implements Serializable {
}
