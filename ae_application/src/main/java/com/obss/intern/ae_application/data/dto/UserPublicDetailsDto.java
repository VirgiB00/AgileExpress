package com.obss.intern.ae_application.data.dto;

import javax.validation.constraints.Email;
import java.io.Serializable;

public record UserPublicDetailsDto(Long id, String firstName, String surname,
                                   @Email String mail) implements Serializable {
}
