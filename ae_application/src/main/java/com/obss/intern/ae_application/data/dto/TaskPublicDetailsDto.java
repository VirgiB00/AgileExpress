package com.obss.intern.ae_application.data.dto;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

public record TaskPublicDetailsDto(Long id, String name, String description, String status, String storyPoint, Date startDate,
                                   Date endDate, Date creationDate, Long duration, List<TaskAssignmentDto> assignments) implements Serializable {
}
