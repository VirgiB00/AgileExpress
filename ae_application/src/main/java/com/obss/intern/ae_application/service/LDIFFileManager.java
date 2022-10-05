package com.obss.intern.ae_application.service;

import com.obss.intern.ae_application.data.entity.ldap.LDAPUser;
import com.obss.intern.ae_application.data.repository.LDAPUserRepository;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

@Service
public class LDIFFileManager {

    private final LDAPUserRepository repository;

    public LDIFFileManager(LDAPUserRepository repository) {
        this.repository = repository;
    }

    public void registerUser(LDAPUser user) {
        user.setIsNew(true);
        try {
            repository.save(user);
            writeNewUserEntry(createNewUserEntry(user));
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("error");
        }
    }

    // Creates new LDIF text entry for a user
    private String createNewUserEntry(LDAPUser user) {
        return String.format(
                """
                        dn: uid=%s,ou=%s,dc=springframework,dc=org
                        objectclass: top
                        objectclass: person
                        objectclass: organizationalPerson
                        objectclass: inetOrgPerson
                        cn: %s
                        sn: %s
                        uid: %s
                        mail: %s
                        userPassword: %s""",
                user.getUsername(), user.getGroup(), user.getFName(), user.getSName(),
                user.getUsername(), user.getMail(), user.getPassword());
    }

    // WIP // Writes an entry to ldif file
    private void writeNewUserEntry(String entry) throws IOException {
        System.out.println("write");
        File users = ResourceUtils.getFile("classpath:users.ldif");
        FileWriter fileWriter = new FileWriter(users, true);
        BufferedWriter writer = new BufferedWriter(fileWriter);
        writer.newLine();
        writer.append(entry);
        writer.close();
        fileWriter.close();
    }
}


