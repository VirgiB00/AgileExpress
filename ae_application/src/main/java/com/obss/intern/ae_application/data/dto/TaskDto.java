package com.obss.intern.ae_application.data.dto;

import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Date;

public record TaskDto(Long id, String name, String description, @NotNull String status, String storyPoint,
                      Date startDate, Date creationDate,
                      Date completionDate, Long duration) implements Serializable {
}
