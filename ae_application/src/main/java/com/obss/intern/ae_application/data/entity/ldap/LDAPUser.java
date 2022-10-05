package com.obss.intern.ae_application.data.entity.ldap;

import com.obss.intern.ae_application.data.entity.EntityRoleValidator;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.Persistable;
import org.springframework.ldap.odm.annotations.Attribute;
import org.springframework.ldap.odm.annotations.Entry;
import org.springframework.ldap.odm.annotations.Id;
import org.springframework.ldap.odm.annotations.Transient;
import org.springframework.ldap.support.LdapUtils;

import javax.naming.Name;
import javax.validation.constraints.Email;

import static com.obss.intern.ae_application.data.entity.UserRoles.*;
import static com.obss.intern.ae_application.data.entity.ldap.LDIFKeywords.*;

@Entry(base = OU + "=" + PEOPLE, objectClasses = {TOP, PERSON, O_PERSON, IO_PERSON})
@Getter
@Setter
public final class LDAPUser implements Persistable<Name>{
    @Id
    private Name id;

    @Attribute(name = UID)
    private String username;

    @Attribute(name = CN)
    private String fName= "";

    @Attribute(name = SN)
    private String sName = "";

    @Attribute(name = MAIL)
    @Email
    private String mail = "";
    @Attribute(name = PW)
    private String password = "";

    @Attribute(name = OU)
    private final String group = PEOPLE;

    @Attribute(name = TYPE)
    @EntityRoleValidator(roles = {P_MANAGER, TEAM_LEAD, TEAM_MEMBER})
    private String role = "";

    @Transient
    private Boolean isNew = false;

    public void setIsNew(Boolean bool) {
        isNew = bool;
    }

    @Override
    public boolean isNew() {
        return isNew;
    }

    public Name getId() {
        return id;
    }

    private void setId() {
        this.id = LdapUtils.newLdapName("uid="+ this.username+",ou="+ this.group);
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
        setId();
    }
}
