package com.obss.intern.ae_application.data.dto;

import java.io.Serializable;
import java.util.Collection;
import java.util.Date;
import java.util.List;

public record SprintWithTasksDto(Long id, String name, String status, Date startDate, Date endDate,
                                 List<TaskDto> tasks) implements Serializable {
}
