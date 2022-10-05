package com.obss.intern.ae_application.data.dto;

import com.obss.intern.ae_application.data.dto.ProjectDto;

import java.io.Serializable;

public record AssignmentDto(Long id, AssignedUserDto assignedUser, String role) implements Serializable {
}
