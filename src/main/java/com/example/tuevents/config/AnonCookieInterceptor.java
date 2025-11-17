package com.example.tuevents.config;

import java.io.IOException;
import java.time.Duration;
import java.util.Arrays;
import java.util.Optional;
import java.util.UUID;

import com.example.tuevents.model.Account;
import com.example.tuevents.repo.AccountRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AnonCookieInterceptor implements HandlerInterceptor {

    private static final String COOKIE_NAME = "anon_id";
    private static final long ONE_YEAR_SECONDS = 365L * 24 * 60 * 60;

    private final AccountRepository accountRepository;

    public AnonCookieInterceptor(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) throws IOException {

        // 1) หา cookie ชื่อ anon_id
        Cookie[] cookies = request.getCookies();
        String anonIdFromCookie = null;

        if (cookies != null) {
            anonIdFromCookie = Arrays.stream(cookies)
                    .filter(c -> COOKIE_NAME.equals(c.getName()))
                    .map(Cookie::getValue)
                    .findFirst()
                    .orElse(null);
        }

        Account account;

        if (anonIdFromCookie == null || anonIdFromCookie.isBlank()) {
            // 2) ไม่มีก็สร้าง UUID ใหม่
            String newAnonId = UUID.randomUUID().toString();

            account = new Account();
            account.setAccountType("guest");
            account.setAnonId(newAnonId);
            // createdAt ให้ @PrePersist ใน Account จัดการก็ได้
            account = accountRepository.save(account);

            // 3) สร้าง Set-Cookie: HttpOnly, SameSite=Lax, Path=/, Max-Age=1 ปี, Secure สำหรับ HTTPS
            boolean secure = request.isSecure();   // ถ้า run HTTPS จะเป็น true

            ResponseCookie responseCookie = ResponseCookie.from(COOKIE_NAME, newAnonId)
                    .httpOnly(true)
                    .secure(secure)
                    .sameSite("Lax")
                    .path("/")
                    .maxAge(Duration.ofSeconds(ONE_YEAR_SECONDS))
                    .build();

            response.addHeader("Set-Cookie", responseCookie.toString());
        } else {
            // 4) มี anon_id แล้ว → หา Account
            Optional<Account> opt = accountRepository.findByAnonId(anonIdFromCookie);

            if (opt.isPresent()) {
                account = opt.get();
            } else {
                // anon_id ใน cookie แต่หาไม่เจอใน DB → สร้าง account ใหม่ผูกกับ anon_id เดิม
                account = new Account();
                account.setAccountType("guest");
                account.setAnonId(anonIdFromCookie);
                account = accountRepository.save(account);
            }
        }

        // 5) แปะ Account ไว้ใน request ให้ชั้น Controller/Service ใช้
        request.setAttribute("account", account);

        return true;
    }
}
