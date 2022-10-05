package com.obss.intern.ae_application.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.ldap.repository.config.EnableLdapRepositories;

@Configuration
@EnableLdapRepositories(basePackages = "com/obss/intern/ae_application/data/repository/**")
@EnableJpaRepositories(basePackages = "com/obss/intern/ae_application/data/repository/**")
public class DatabaseConfig {
}
