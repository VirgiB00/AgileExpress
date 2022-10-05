package com.obss.intern.ae_application.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.obss.intern.ae_application.data.entity.ldap.LDAPUser;
import com.obss.intern.ae_application.data.entity.sql.User;
import com.obss.intern.ae_application.data.repository.LDAPUserRepository;
import com.obss.intern.ae_application.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.ldap.userdetails.LdapUserDetailsImpl;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
//@CrossOrigin(origins = "http://localhost:3000")
public class TokenController {

    @Autowired
    JwtEncoder encoder;

    @Autowired
    LDAPUserRepository ldapUserRepository;

    @Autowired
    UserService userService;

    @GetMapping("/ldap/token")
    public ResponseEntity<Object> jwtForLDAP(Authentication authentication) {
        var principal = authentication.getPrincipal();
        if (principal instanceof LdapUserDetailsImpl) {
            Optional<LDAPUser> user = ldapUserRepository.findByUsername(((LdapUserDetailsImpl) principal).getUsername());
            if (user.isPresent()) {
                // Kullanıcı veritabanında kayıtlı mı kontrol et.
                User databaseUser = userService.checkIfLDAPBasedUserExist(user.get().getMail());
                // Değilse kaydet
                if (databaseUser == null) {
                    databaseUser = userService.createUserFromLDAP(user.get());
                }
                return jwtResponseGenerator(databaseUser.getUserName());
            }
        }
        throw new RuntimeException("Invalid credentials!");
    }

    @GetMapping("/oauth/token")
    public ResponseEntity<Object> jwtForGoogle(Authentication authentication) {
        var details = (GoogleIdToken.Payload) authentication.getDetails();
        var user = userService.checkIfGoogleBasedUserExist(details.getEmail());
        if (user != null) {
            return jwtResponseGenerator(user.getUserName());
        } else {
            try {
                User userFromJwt = userService.createUserFromJwt(details);
                return jwtResponseGenerator(userFromJwt.getUserName());
            } catch (Exception ex) {
                throw new RuntimeException("Error on creating user!");
            }
        }
    }

    private ResponseEntity<Object> jwtResponseGenerator(String username) {
        Instant now = Instant.now();
        long expiry = 36000L;
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("agileexpress.com")
                .issuedAt(now)
                .expiresAt(now.plusSeconds(expiry))
                .subject(username)
                .build();
        String tokenValue = this.encoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
        return ResponseEntity.status(HttpStatus.OK).header(HttpHeaders.AUTHORIZATION, "Bearer "+tokenValue).body("");
    }

}
