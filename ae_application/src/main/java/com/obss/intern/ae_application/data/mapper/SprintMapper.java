package com.obss.intern.ae_application.data.mapper;

import com.obss.intern.ae_application.data.dto.SprintCreateDto;
import com.obss.intern.ae_application.data.dto.SprintDto;
import com.obss.intern.ae_application.data.dto.SprintWithTasksDto;
import com.obss.intern.ae_application.data.entity.sql.Sprint;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = "spring")
public interface SprintMapper {
    Sprint sprintCreateDtoToSprint(SprintCreateDto sprintCreateDto);

    SprintCreateDto sprintToSprintCreateDto(Sprint sprint);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Sprint updateSprintFromSprintCreateDto(SprintCreateDto sprintCreateDto, @MappingTarget Sprint sprint);


    Sprint sprintDtoToSprint(SprintDto sprintDto);

    SprintDto sprintToSprintDto(Sprint sprint);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Sprint updateSprintFromSprintDto(SprintDto sprintDto, @MappingTarget Sprint sprint);

    Sprint sprintWithTasksDtoToSprint(SprintWithTasksDto sprintWithTasksDto);

    SprintWithTasksDto sprintToSprintWithTasksDto(Sprint sprint);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Sprint updateSprintFromSprintWithTasksDto(SprintWithTasksDto sprintWithTasksDto, @MappingTarget Sprint sprint);
}
