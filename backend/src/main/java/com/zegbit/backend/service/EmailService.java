package com.zegbit.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public void sendNotification(String to, String subject, String text) {
        if (mailSender == null) {
            log.info("[MOCK EMAIL] To: {} | Subject: {} | Message: {}", to, subject, text.replace("\n", " "));
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("hello@zegbit.com");
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
            log.info("Email notification successfully sent to {}", to);
        } catch (Exception e) {
            log.warn("Failed to send real email to {}: {}. Logged notification instead.", to, e.getMessage());
        }
    }
}
