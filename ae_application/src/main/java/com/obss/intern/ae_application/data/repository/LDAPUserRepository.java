package com.obss.intern.ae_application.data.repository;

import com.obss.intern.ae_application.data.entity.ldap.LDAPUser;
import org.springframework.data.ldap.repository.LdapRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LDAPUserRepository extends LdapRepository<LDAPUser> {

    Optional<LDAPUser> findByUsername(String username);
    Optional<LDAPUser> findByUsernameAndPassword(String username, String password);
    Optional<LDAPUser> findByUsernameLikeIgnoreCase(String username);
}
