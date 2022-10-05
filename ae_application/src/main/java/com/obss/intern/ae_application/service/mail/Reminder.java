package com.obss.intern.ae_application.service.mail;

import com.obss.intern.ae_application.data.entity.UserRoles;
import com.obss.intern.ae_application.data.entity.sql.Assignment;
import com.obss.intern.ae_application.data.entity.sql.Sprint;
import com.obss.intern.ae_application.data.repository.SprintRepository;
import com.obss.intern.ae_application.service.ProjectService;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class Reminder {

    public static final Long MILLISECONDS_IN_AN_HOUR = 3600000L;

    private final SprintRepository sprintRepository;

    private final EmailService emailService;

    private final ProjectService projectService;

    public Reminder(SprintRepository sprintRepository, EmailService emailService, ProjectService projectService) {
        Timer timer = new Timer();
        TimerTask task = new TimerTask() {
            @Override
            public void run() {
                sendMails(24L);
            }
        };
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.HOUR, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.DAY_OF_MONTH,calendar.get(Calendar.DAY_OF_MONTH)+1);
        Date date = calendar.getTime();
        timer.scheduleAtFixedRate(task, date, MILLISECONDS_IN_AN_HOUR*24);
        this.sprintRepository = sprintRepository;
        this.emailService = emailService;
        this.projectService = projectService;
    }

    public Map<Object, Object> sendMails(Long hoursRemained) {
        List<Sprint> sprints = sprintRepository.findAll();
        Date date = new Date();
        EmailDetails emailDetails = new EmailDetails();
        emailDetails.setMsgBody("Hello, we would like to remind you 1 day left to end your active sprint.");
        emailDetails.setSubject("Reminder: Agile Express");
        // Tüm sprintler için tarih kontrolü yap
        Map<Object, Object> map = new HashMap<>();
        sprints.forEach(sprint -> {
            long difference = sprint.getEndDate().getTime() - date.getTime();
            // Eğer sprint bitişine verilen saatten az süre kaldıysa
            if (difference > 0 && difference < MILLISECONDS_IN_AN_HOUR*hoursRemained) {
                // Bu sprintin bulunduğu projedeki tüm üyelerin rolünü ara
                List<Assignment> assignments = projectService.findAssignmentsByProject(sprint.getProject());
                assignments.forEach(assignment -> {
                    // Yönetici veya lead olanlara mail gönder.
                    if (assignment.getRole().compareTo(UserRoles.P_MANAGER) == 0 || assignment.getRole().compareTo(UserRoles.TEAM_LEAD) == 0) {
                        emailDetails.setRecipient(assignment.getAssignedUser().getMail());
                        String status = emailService.sendSimpleMail(emailDetails);
                        map.put(assignment.getAssignedUser().getMail(), status);
                    }
                });
            }
        });
        return map;
    }
}
