package com.obss.intern.ae_application.data.dto;

import java.io.Serializable;

public record TaskSearchDto(Long id, String name, String description, ProjectDto project) implements Serializable {
}
