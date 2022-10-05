package com.obss.intern.ae_application.data.dto;

import java.io.Serializable;

public record AssignmentDefaultDto(Long id, ProjectDto project, AssignedUserDto assignedUser, String role) implements Serializable {
}
