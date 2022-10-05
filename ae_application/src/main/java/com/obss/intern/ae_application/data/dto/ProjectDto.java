package com.obss.intern.ae_application.data.dto;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

public record ProjectDto(Long id, String name, String description, String status, Date creationDate, Date completionDate) implements Serializable {
}
