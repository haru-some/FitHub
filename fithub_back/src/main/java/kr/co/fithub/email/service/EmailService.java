package kr.co.fithub.email.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import kr.co.fithub.util.EmailSender;

@Service
public class EmailService {

	@Autowired
    private EmailSender emailSender;

    public void sendAuthCodeEmail(String to, String authCode) {
        String subject = "[FITHUB] 이메일 인증번호 안내";

        String content =
            "<div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; max-width: 480px;'>"
          + "<div style='text-align: center; margin-bottom: 20px;'>"
          +   "<img src='cid:fithub-logo' alt='Fithub Logo' style='width: 80px; height: auto;' />"
          + "</div>"
          + "<h2 style='color: #2f3e2f; text-align: center;'>[FITHUB] 이메일 인증번호 안내</h2>"
          + "<p style='text-align: center;'>아래 인증번호를 복사해 입력해 주세요.</p>"
          + "<div style='margin: 20px 0; padding: 14px; font-size: 24px; font-weight: bold; text-align: center; background-color: #f4f4f4; border-radius: 4px; color: #2f3e2f;'>"
          + authCode
          + "</div>"
          + "<p style='font-size: 14px; color: #666; text-align: center;'>본 인증번호는 발송 시점으로부터 3분간 유효합니다. 타인에게 공유하지 마세요.</p>"
          + "<hr style='margin: 24px 0;' />"
          + "<p style='font-size: 12px; color: #999; text-align: center;'>본 메일은 FITHUB 인증 시스템에서 자동 발송되었습니다. 문의: support@fithub.co.kr</p>"
          + "</div>";

        emailSender.sendMail(subject, to, content);
    }

    public void sendTempPasswordEmail(String to, String tempPassword) {
        String subject = "[FITHUB] 임시 비밀번호 안내";

        String content =
            "<div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; max-width: 480px;'>"
          + "<div style='text-align: center; margin-bottom: 20px;'>"
          +   "<img src='cid:fithub-logo' alt='Fithub Logo' style='width: 80px; height: auto;' />"
          + "</div>"
          + "<h2 style='color: #2f3e2f; text-align: center;'>[FITHUB] 임시 비밀번호 안내</h2>"
          + "<p style='text-align: center;'>아래 임시 비밀번호를 사용하여 로그인한 뒤 반드시 비밀번호를 변경해 주세요.</p>"
          + "<div style='margin: 20px 0; padding: 14px; font-size: 24px; font-weight: bold; text-align: center; background-color: #f4f4f4; border-radius: 4px; color: #2f3e2f;'>"
          + tempPassword
          + "</div>"
          + "<p style='font-size: 14px; color: #666; text-align: center;'>보안을 위해 해당 비밀번호는 반드시 변경해 주세요.</p>"
          + "<hr style='margin: 24px 0;' />"
          + "<p style='font-size: 12px; color: #999; text-align: center;'>본 메일은 FITHUB 시스템에서 자동 발송되었습니다. 문의: support@fithub.co.kr</p>"
          + "</div>";

        emailSender.sendMail(subject, to, content);
    }
}