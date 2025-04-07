package kr.co.fithub.util;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

@Component
public class EmailSender {
    @Autowired
    private JavaMailSender sender;

    public void sendMail(String emailTitle, String receiver, String emailContent) {
        MimeMessage message = sender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setSentDate(new Date());
            helper.setFrom(new InternetAddress("h4rusome", "fithub Support"));
            helper.setTo(receiver);
            helper.setSubject(emailTitle);
            helper.setText(emailContent, true);
            ClassPathResource imageResource = new ClassPathResource("static/image/Fithub_logo.png");
            helper.addInline("fithub-logo", imageResource.getFile());

            sender.send(message);
        } catch (MessagingException | UnsupportedEncodingException e) {
            e.printStackTrace();
        } catch (Exception e) {
            System.err.println("이미지 첨부 실패: " + e.getMessage());
        }
    }
}