package com.obss.intern.ae_application.data.mapper;

import com.obss.intern.ae_application.data.dto.*;
import com.obss.intern.ae_application.data.entity.sql.Task;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = "spring")
public interface TaskMapper {

    // TODO Date field'ları maplayamıyor neden araştır
    // Date field'ları manuel map yaptır
//    @Mappings({
//            @Mapping(source = "startDate", target = "SDate"),
//            @Mapping(source = "eDate", target = "EDate")
//    })
    Task taskPublicDetailsDtoToTask(TaskPublicDetailsDto taskPublicDetailsDto);

    //    @Mappings({
//            @Mapping(source = "SDate", target = "sDate"),
//            @Mapping(source = "EDate", target = "eDate")
//    })
    TaskPublicDetailsDto taskToTaskPublicDetailsDto(Task task);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Task updateTaskFromTaskPublicDetailsDto(TaskPublicDetailsDto taskPublicDetailsDto, @MappingTarget Task task);


    Task taskDtoToTask(TaskDto taskDto);

    TaskDto taskToTaskDto(Task task);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Task updateTaskFromTaskDto(TaskDto taskDto, @MappingTarget Task task);

    Task taskCreateDtoToTask(TaskCreateDto taskCreateDto);

    TaskCreateDto taskToTaskCreateDto(Task task);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Task updateTaskFromTaskCreateDto(TaskCreateDto taskCreateDto, @MappingTarget Task task);


    Task taskUpdateDtoToTask(TaskUpdateDto taskUpdateDto);

    TaskUpdateDto taskToTaskUpdateDto(Task task);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Task updateTaskFromTaskUpdateDto(TaskUpdateDto taskUpdateDto, @MappingTarget Task task);


    Task taskSearchDtoToTask(TaskSearchDto taskSearchDto);

    TaskSearchDto taskToTaskSearchDto(Task task);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Task updateTaskFromTaskSearchDto(TaskSearchDto taskSearchDto, @MappingTarget Task task);
}
