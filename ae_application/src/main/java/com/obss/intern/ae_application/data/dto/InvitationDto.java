package com.obss.intern.ae_application.data.dto;

import java.io.Serializable;

public record InvitationDto(Long id, ProjectDto project) implements Serializable {
}
