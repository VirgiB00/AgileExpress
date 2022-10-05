package com.obss.intern.ae_application.data.dto;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

public record AssignedUserDto(@NotNull Long id,
                              @NotNull @NotBlank String firstName,
                              @NotNull @NotBlank String surname,
                              @NotNull @Email String mail) implements Serializable {
}
