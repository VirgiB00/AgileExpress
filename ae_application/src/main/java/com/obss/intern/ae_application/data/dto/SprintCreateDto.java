package com.obss.intern.ae_application.data.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Date;

public record SprintCreateDto(@NotNull @NotBlank String name, @NotNull Date startDate,@NotNull Date endDate) implements Serializable {
}
