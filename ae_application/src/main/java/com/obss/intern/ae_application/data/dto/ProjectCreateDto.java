package com.obss.intern.ae_application.data.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

public record ProjectCreateDto (@NotNull @NotBlank String name, @NotNull @NotBlank String description) implements Serializable {
}
