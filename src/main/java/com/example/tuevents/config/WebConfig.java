package com.example.tuevents.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final AnonCookieInterceptor anonCookieInterceptor;

    @Autowired
    public WebConfig(AnonCookieInterceptor anonCookieInterceptor) {
        this.anonCookieInterceptor = anonCookieInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(anonCookieInterceptor)
                .addPathPatterns("/**")
                .excludePathPatterns(
                        "/error",
                        "/css/**",
                        "/js/**",
                        "/images/**"
                );
    }
}