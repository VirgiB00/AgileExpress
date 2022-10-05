package com.obss.intern.ae_application.data.dto;

import java.io.Serializable;

public record TaskAssignmentDto(Long id, UserPublicDetailsDto user) implements Serializable {
}
