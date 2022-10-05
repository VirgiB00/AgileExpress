package com.obss.intern.ae_application.data.dto;

import org.hibernate.validator.constraints.Range;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.io.Serializable;

public record TaskCreateDto(@NotNull @NotBlank String name, @NotNull @NotBlank String description,
                            @NotNull @Range(min = 1, max = 10) Long storyPoint, @NotNull @Positive Long duration) implements Serializable {
}
