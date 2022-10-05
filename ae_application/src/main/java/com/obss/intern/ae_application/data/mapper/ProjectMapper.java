package com.obss.intern.ae_application.data.mapper;

import com.obss.intern.ae_application.data.dto.*;
import com.obss.intern.ae_application.data.entity.sql.*;
import org.mapstruct.*;
import org.springframework.stereotype.Component;

@Component
@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = "spring")
public interface ProjectMapper {


    User assignedUserDtoToUser(AssignedUserDto assignedUserDto);

    AssignedUserDto userToAssignedUserDto(User user);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    User updateUserFromAssignedUserDto(AssignedUserDto assignedUserDto, @MappingTarget User user);

    Project projectDtoToProject(ProjectDto projectDto);

    ProjectDto projectToProjectDto(Project project);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Project updateProjectFromProjectDto(ProjectDto projectDto, @MappingTarget Project project);


    Assignment assignmentDtoToAssignment(AssignmentDto assignmentDto);

    AssignmentDto assignmentToAssignmentDto(Assignment assignment);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Assignment updateAssignmentFromAssignmentDto(AssignmentDto assignmentDto, @MappingTarget Assignment assignment);


    Project projectCreateDtoToProject(ProjectCreateDto projectCreateDto);

    ProjectCreateDto projectToProjectCreateDto(Project project);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Project updateProjectFromProjectCreateDto(ProjectCreateDto projectCreateDto, @MappingTarget Project project);

    Project projectUpdateDtoToProject(ProjectUpdateDto projectUpdateDto);

    ProjectUpdateDto projectToProjectUpdateDto(Project project);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Project updateProjectFromProjectUpdateDto(ProjectUpdateDto projectUpdateDto, @MappingTarget Project project);


    Assignment assignmentDefaultDtoToAssignment(AssignmentDefaultDto assignmentDefaultDto);

    AssignmentDefaultDto assignmentToAssignmentDefaultDto(Assignment assignment);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Assignment updateAssignmentFromAssignmentDefaultDto(AssignmentDefaultDto assignmentDefaultDto, @MappingTarget Assignment assignment);
}
