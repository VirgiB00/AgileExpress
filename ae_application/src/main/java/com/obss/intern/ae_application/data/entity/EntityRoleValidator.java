package com.obss.intern.ae_application.data.entity;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = RoleValidator.class)
@Target({ElementType.METHOD, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface EntityRoleValidator {
    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    String[] roles();

    String message() default "Invalid role!";
}