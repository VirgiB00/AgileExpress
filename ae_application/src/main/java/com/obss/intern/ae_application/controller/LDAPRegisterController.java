package com.obss.intern.ae_application.controller;

import com.obss.intern.ae_application.data.entity.ldap.LDAPUser;
import com.obss.intern.ae_application.service.LDIFFileManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import static com.obss.intern.ae_application.data.entity.UserRoles.*;
@Controller
public class LDAPRegisterController {

    @Autowired
    private LDIFFileManager manager;

    @GetMapping("/register")
    public String index(Model model) {
        model.addAttribute("ldapUser", new LDAPUser());
        model.addAttribute("roleKey", new String[]{P_MANAGER, TEAM_LEAD, TEAM_MEMBER});
        model.addAttribute("roleDesc", new String[]{"I'm a project Manager.", "I'm a team leader.", "I'm a team member."});
        return "register";
    }

    @PostMapping("/register")
    public String greetingSubmit(@ModelAttribute LDAPUser ldapUser, Model model) {
        model.addAttribute("ldapUser", ldapUser);
        System.out.println(ldapUser.toString());
        manager.registerUser(ldapUser);
        return "success";
    }
}
