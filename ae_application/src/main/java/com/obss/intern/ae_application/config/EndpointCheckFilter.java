package com.obss.intern.ae_application.config;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.util.Assert;
import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

public class EndpointCheckFilter extends GenericFilterBean {

    private final JwtDecoder decoder;
    private final RequestMatcher customFilterUrl;

    public EndpointCheckFilter(JwtDecoder decoder, String matcher) {
        Assert.notNull(decoder, "Decoder can't be null!");
        Assert.notNull(matcher, "Matcher can't be null!");
        this.decoder = decoder;
        this.customFilterUrl = new AntPathRequestMatcher("matcher");
    }

    // İstek atılan endpointler Jwt içinde yer alan subject'e uyuyor mu kontrol eder
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        var req = (HttpServletRequest) request;
        if (customFilterUrl.matches(req)) {
            String header = req.getHeader(HttpHeaders.AUTHORIZATION);
            String token = header.split(" ")[1];
            Map<String, Object> claims = decoder.decode(token).getClaims();
            String requestURI = req.getRequestURI();
            List<String> path = new ArrayList<>(Arrays.asList(requestURI.split("\\\\")));
            // Eğer URI **/username/{username}/** şablonuna sahip mi, sahipse {username} subject ile aynı mı kontrol eder
            if (path.contains("username")) {
                if (path.get(path.indexOf("username")+1).compareTo((String) claims.get("sub")) == 0) {
                    chain.doFilter(request, response);
                }
            } else {
                ((HttpServletResponse) response).setStatus(HttpStatus.UNAUTHORIZED.value());
            }
        }
        chain.doFilter(request, response);
    }
}
