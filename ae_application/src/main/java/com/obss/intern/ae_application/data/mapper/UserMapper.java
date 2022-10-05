package com.obss.intern.ae_application.data.mapper;

import com.obss.intern.ae_application.data.dto.UserPublicDetailsDto;
import com.obss.intern.ae_application.data.entity.sql.User;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = "spring")
public interface UserMapper {
    User userPublicDetailsDtoToUser(UserPublicDetailsDto userPublicDetailsDto);

    UserPublicDetailsDto userToUserPublicDetailsDto(User user);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    User updateUserFromUserPublicDetailsDto(UserPublicDetailsDto userPublicDetailsDto, @MappingTarget User user);
}
