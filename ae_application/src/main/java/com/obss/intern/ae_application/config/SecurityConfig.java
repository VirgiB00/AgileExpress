package com.obss.intern.ae_application.config;

import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import com.obss.intern.ae_application.data.entity.ldap.LDIFKeywords;
import com.obss.intern.ae_application.service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.ldap.core.support.BaseLdapPathContextSource;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.oauth2.server.resource.OAuth2ResourceServerConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.config.ldap.EmbeddedLdapServerContextSourceFactoryBean;
import org.springframework.security.config.ldap.LdapPasswordComparisonAuthenticationManagerFactory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.ldap.server.UnboundIdContainer;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.web.SecurityFilterChain;

import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;

@EnableWebSecurity
@EnableGlobalMethodSecurity(securedEnabled = true, jsr250Enabled = true)
public class SecurityConfig {

    private final UserService service;

    public SecurityConfig(UserService service) {
        this.service = service;
    }

    // api/** kaynaklarına sadece Bearer token ile erişim izni ver.
    @Bean
    @Order(1)
    public SecurityFilterChain JwtFilterChain(HttpSecurity http) throws Exception {
        http
                .antMatcher("/api/**")
                .authorizeHttpRequests(authorize -> authorize
                        .anyRequest().authenticated().and()
                        .authenticationProvider(new CustomJwtAuthenticationProvider(jwtDecoder(), service))
                )
                .oauth2ResourceServer(OAuth2ResourceServerConfigurer::jwt)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        return http.build();
    }

    // Token edinme endpoint'ine basic auth ile erişim izni ver.
    // TO-DO Endpoint Post olunca filtre çalışmıyor, get yapınca çalışıyor sonra araştır.
    @Bean
    @Order(2)
    public SecurityFilterChain HttpBasicFilterChain(HttpSecurity http) throws Exception {
        http
                .antMatcher("/auth/ldap/**")
                .authorizeHttpRequests(authorize  -> authorize
                        .anyRequest(). authenticated().and()
                )
                .csrf(csrf -> csrf.ignoringAntMatchers("/auth/ldap/**"))
                .httpBasic(Customizer.withDefaults())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // Yanlış credential girince browser'da login pop-up'ı açılmasın diye WWW header'ı içermeyen response gönder.
                .httpBasic().authenticationEntryPoint((request, response, authException) -> response.setStatus(HttpStatus.UNAUTHORIZED.value()));
        return http.build();
    }

    // Token edinme endpoint'ine google auth ile erişim izni ver.
    @Bean
    @Order(3)
    public SecurityFilterChain oAuthFilterChain(HttpSecurity http) throws Exception {
        http
                .antMatcher("/auth/oauth/**")
                .authorizeHttpRequests(authorize  -> authorize
                                .anyRequest(). authenticated().and()
                                .authenticationProvider(new GoogleJwtAuthenticationProvider())
                )
                .oauth2ResourceServer(OAuth2ResourceServerConfigurer::jwt)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        return http.build();
    }

    // Geri kalan kaynaklara olan istekleri reddet.
    @Bean
    @Order(4)
    public SecurityFilterChain denyRestOf(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(authorize  -> authorize
                        .anyRequest().denyAll()
                )
                .httpBasic().authenticationEntryPoint((request, response, authException) -> response.setStatus(HttpStatus.UNAUTHORIZED.value()))
                .and()
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }

    @Bean
    UnboundIdContainer ldapContainer() {
        return new UnboundIdContainer(LDIFKeywords.CONNECTION_DC, "classpath:users.ldif");
    }

    @Bean
    public EmbeddedLdapServerContextSourceFactoryBean contextSourceFactoryBean() {
        EmbeddedLdapServerContextSourceFactoryBean contextSourceFactoryBean = EmbeddedLdapServerContextSourceFactoryBean
                .fromEmbeddedLdapServer();
        contextSourceFactoryBean.setPort(0);
        return contextSourceFactoryBean;
    }

    @Bean
    AuthenticationManager authenticationManager(BaseLdapPathContextSource contextSource) {
        LdapPasswordComparisonAuthenticationManagerFactory factory = new LdapPasswordComparisonAuthenticationManagerFactory(
                contextSource, new BCryptPasswordEncoder(10));
        factory.setUserDnPatterns("uid={0},ou=people");
        return factory.createAuthenticationManager();
    }

    @Value("${jwt.public.key}")
    RSAPublicKey publicKey;

    @Value("${jwt.private.key}")
    RSAPrivateKey privateKey;

    @Bean
    JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder.withPublicKey(this.publicKey).build();
    }

    @Bean
    JwtEncoder jwtEncoder() {
        JWK jwk = new RSAKey.Builder(this.publicKey).privateKey(this.privateKey).build();
        JWKSource<SecurityContext> jwks = new ImmutableJWKSet<>(new JWKSet(jwk));
        return new NimbusJwtEncoder(jwks);
    }

    @Bean EndpointCheckFilter endpointCheckFilter() {
        return new EndpointCheckFilter(jwtDecoder(), "/api/**");
    }
}
