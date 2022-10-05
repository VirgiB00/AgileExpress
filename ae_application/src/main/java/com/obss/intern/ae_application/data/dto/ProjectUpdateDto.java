package com.obss.intern.ae_application.data.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

public record ProjectUpdateDto(@NotNull Long id, @NotNull @NotBlank String name, @NotNull @NotBlank String description, @NotNull @NotBlank String status) implements Serializable {
}
