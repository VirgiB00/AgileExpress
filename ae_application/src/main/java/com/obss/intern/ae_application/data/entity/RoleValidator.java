package com.obss.intern.ae_application.data.entity;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.Arrays;

/*
    Checks, if given string is available in array
 */
public class RoleValidator implements ConstraintValidator<EntityRoleValidator, String> {

    private String[] roles;

    @Override
    public void initialize(EntityRoleValidator constraintAnnotation) {
        roles = constraintAnnotation.roles();
    }

    @Override
    public boolean isValid(String s, ConstraintValidatorContext constraintValidatorContext) {
        return Arrays.asList(roles).contains(s);
    }
}
