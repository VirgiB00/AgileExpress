package com.obss.intern.ae_application.controller;

import com.obss.intern.ae_application.service.mail.EmailDetails;
import com.obss.intern.ae_application.service.mail.EmailService;
import com.obss.intern.ae_application.service.mail.Reminder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/email")
public class EmailController {


    @Autowired
    Reminder reminder;

    @Autowired
    private EmailService emailService;

    // Sending a simple Email
    @PostMapping("/sendMail")
    public String sendMail(@RequestBody EmailDetails details) {
        return emailService.sendSimpleMail(details);
    }

    // Sending email with attachment
    @PostMapping("/sendMailWithAttachment")
    public String sendMailWithAttachment(@RequestBody EmailDetails details) {
        return emailService.sendMailWithAttachment(details);
    }

    @PostMapping("/sendReminder")
    public Map<Object, Object> sendReminderToUsers(@RequestParam Long hoursRemained) {
        return reminder.sendMails(hoursRemained);
    }
}